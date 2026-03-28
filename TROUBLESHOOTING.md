# 🔧 PiVault NAS — Troubleshooting Guide

This document covers known issues, edge cases, system failures, and architectural limitations you may encounter when running PiVault. Each entry includes the root cause and a concrete fix.

---

## Table of Contents

1. [NGINX "413 Request Entity Too Large" — Upload Blocked](#1-nginx-413-request-entity-too-large--upload-blocked)
2. [Samba Windows Uploads Bypassing Quotas](#2-samba-windows-uploads-bypassing-quotas)
3. [File System Corruption on Power Loss](#3-file-system-corruption-on-power-loss)
4. [Drive Unmounts Hijacking the SD Card](#4-drive-unmounts-hijacking-the-sd-card)
5. [Deep Windows File Ownership — Root Lockout](#5-deep-windows-file-ownership--root-lockout)
6. [Local Network DHCP IP Thrashing](#6-local-network-dhcp-ip-thrashing)
7. [PM2 Process Not Surviving Reboot](#7-pm2-process-not-surviving-reboot)
8. [CORS Errors from the Frontend](#8-cors-errors-from-the-frontend)
9. [JWT Token Expired — Instant Logout](#9-jwt-token-expired--instant-logout)
10. [CPU / RAM Metrics Reporting Incorrectly on Pi](#10-cpu--ram-metrics-reporting-incorrectly-on-pi)

---

### 1. NGINX "413 Request Entity Too Large" — Upload Blocked

**Symptom:** Large file uploads (e.g., videos over a few MB) fail instantly with a `413` HTTP error.

**Root Cause:** Even with Multer streaming efficiently in Node.js, NGINX drops any HTTP payload larger than its configured body size limit (default is often 1 MB).

**Fix:** Edit the NGINX configuration to allow unlimited body size:

```bash
sudo nano /etc/nginx/sites-available/pivault
```

Inside the `server { }` block, add:

```nginx
client_max_body_size 0;
```

Then restart NGINX:

```bash
sudo nginx -t && sudo systemctl restart nginx
```

---

### 2. Samba Windows Uploads Bypassing Quotas

**Symptom:** A user mapped their drive natively via Windows (`\\PIVAULT\username`) fills the hard drive beyond their assigned quota.

**Root Cause:** The Node.js `checkStorageQuota` middleware only applies to uploads made through the web dashboard. A native SMB/Samba connection writes directly to the Linux filesystem, completely bypassing Node.js.

**Fix:** Enforce OS-level Ext4 disk quotas:

```bash
# Enable quota tracking on the storage partition
sudo quotaon -v /mnt/PiVaultStorage

# Set a hard cap for a specific user (interactive editor opens)
sudo edquota -u <username>
```

Set the **hard limit** in blocks (1 block = 1 KB) to match your desired quota. This enforces a physical limit the OS respects regardless of how files are written.

---

### 3. File System Corruption on Power Loss

**Symptom:** After an unexpected shutdown, the dashboard fails to load user data or shows an error like `Unexpected token in JSON`.

**Root Cause:** User data is stored in `pivault-backend/data/users.json`. If the Raspberry Pi loses power at the exact moment Node.js is writing to this file, the JSON becomes partially written and corrupted.

**Fix (immediate):** Manually inspect and repair the file:

```bash
cat pivault-backend/data/users.json
# Identify and remove the truncated/malformed entry, then save
```

**Fix (long-term):** Set up an automatic backup cron job:

```bash
crontab -e
```

Add:

```
*/30 * * * * cp /home/pi/PiVault/pivault-backend/data/users.json /mnt/PiVaultStorage/backups/users_backup_$(date +\%H\%M).json
```

For large-scale use, migrate `users.json` to SQLite3 — it uses atomic, ACID-compliant writes that cannot be partially corrupted.

---

### 4. Drive Unmounts Hijacking the SD Card

**Symptom:** After a power cut or USB disconnect, the Pi boots but large files start writing to the internal MicroSD card, which rapidly fills and crashes the OS.

**Root Cause:** If the USB hard drive is not mounted, `/mnt/PiVaultStorage` is just a normal empty folder on the SD card. PiVault does not detect this and blindly writes there.

**Fix (Step 1):** Ensure `/etc/fstab` includes `nofail` so the Pi still boots if the drive is missing:

```
UUID=<your-uuid>  /mnt/PiVaultStorage  ext4  defaults,nofail  0  2
```

**Fix (Step 2):** Lock the empty mount folder so Linux refuses to write to it unless the real drive is mounted:

```bash
# With the drive UNPLUGGED, run:
sudo chattr +i /mnt/PiVaultStorage
```

Now, if the drive is missing at boot, any write attempt to `/mnt/PiVaultStorage` will return `Operation not permitted` instead of silently using the SD card.

---

### 5. Deep Windows File Ownership — Root Lockout

**Symptom:** A user drags files from Windows into the Samba share. Later, they cannot delete those files from the web dashboard. The server logs show `EACCES: permission denied`.

**Root Cause:** Windows sometimes drags proprietary ACL (Access Control List) entries onto Linux files via SMB. The file gets written as `root:root` with restrictive permissions that the Node.js process cannot override.

**Fix (quick):** Restart the backend — `app.js` runs a global `chown` patch on every PM2 startup:

```bash
pm2 restart pivault-backend
```

This executes:

```bash
sudo chown -R root:pi3s /mnt/PiVaultStorage/users && sudo chmod -R 775 /mnt/PiVaultStorage/users
```

**Fix (manual, for a specific folder):**

```bash
sudo chown -R pi:pi3s /mnt/PiVaultStorage/users/<username>
sudo chmod -R 775 /mnt/PiVaultStorage/users/<username>
```

---

### 6. Local Network DHCP IP Thrashing

**Symptom:** PiVault was accessible at `192.168.1.150` but is suddenly unreachable. Nobody changed anything.

**Root Cause:** Your home router re-assigned a different IP address to the Raspberry Pi's MAC address via DHCP lease renewal.

**Fix:** Log into your router admin panel (usually `http://192.168.1.1` or `http://192.168.0.1`), find the section labelled **"DHCP Reservations"**, **"Static IP Assignments"**, or **"Address Reservation"**, and permanently bind your Pi's MAC address to a fixed LAN IP.

> **Note:** If you're using Tailscale for remote access, this issue does not affect it — Tailscale IPs are stable and independent of your home network's DHCP.

---

### 7. PM2 Process Not Surviving Reboot

**Symptom:** PiVault works normally but stops responding after the Raspberry Pi reboots.

**Root Cause:** PM2 was not configured to run at system startup.

**Fix:**

```bash
# Save the current PM2 process list
pm2 save

# Generate and install the startup script
pm2 startup
# Copy and run the command it prints — it looks like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
```

Verify:

```bash
pm2 list   # Should show pivault-backend as "online"
```

---

### 8. CORS Errors from the Frontend

**Symptom:** The browser console shows errors like `Access to fetch at 'http://...' from origin '...' has been blocked by CORS policy`.

**Root Cause:** The frontend is being served from a different origin (port or domain) than the backend.

**Fix (development):** Ensure `VITE_API_URL` in your frontend `.env` points to the correct backend URL:

```env
VITE_API_URL=http://192.168.1.150
```

**Fix (production):** Serve the frontend build from the same NGINX server that proxies the backend. The `location /api/` block in NGINX handles API calls; static frontend files are served from `location /`. Because both come from the same origin, CORS does not apply.

---

### 9. JWT Token Expired — Instant Logout

**Symptom:** Users are logged out unexpectedly, or API calls return `401 Unauthorized` with `jwt expired`.

**Root Cause:** JWTs have a built-in expiry. If the token lifetime in the backend is very short (e.g., `1h`), users active longer than that are signed out.

**Fix:** Adjust the token expiry in the backend's auth controller when signing the token:

```js
jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
```

For a smoother experience, implement a **refresh token** flow so sessions renew automatically without re-login.

---

### 10. CPU / RAM Metrics Reporting Incorrectly on Pi

**Symptom:** The dashboard's hardware monitor shows 0% CPU usage or static/incorrect RAM values.

**Root Cause:** The metrics endpoint reads from Linux system files (`/proc/stat`, `/proc/meminfo`). On Raspberry Pi OS, the paths or format may differ slightly from desktop Linux, especially after OS updates. The `exec()` calls for `vcgencmd` (GPU/CPU temp) may also fail if the binary is not in the PATH for the PM2 process user.

**Fix:**

```bash
# Verify the commands work manually as the Pi user
vcgencmd measure_temp
cat /proc/meminfo | grep MemAvailable
```

If `vcgencmd` is not found:

```bash
# Add the VideoCore binary path to PM2's environment
pm2 restart pivault-backend --update-env
# Or add to /etc/environment:
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/vc/bin"
```

---

## General Tips

| Situation | Command |
|---|---|
| View live backend logs | `pm2 logs pivault-backend` |
| Restart the backend | `pm2 restart pivault-backend` |
| View disk usage | `df -h /mnt/PiVaultStorage` |
| Check NGINX errors | `sudo journalctl -u nginx -n 50` |
| Check Pi CPU temperature | `vcgencmd measure_temp` |
| Check active users/processes | `pm2 list` |
| Check Tailscale connection | `tailscale status` |

---

*For issues not listed here, check the PM2 logs first (`pm2 logs pivault-backend`) and the NGINX error log (`/var/log/nginx/error.log`).*
