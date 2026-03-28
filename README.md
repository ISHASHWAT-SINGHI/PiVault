# 🔐 PiVault — Your Own Private Cloud, At Home

> A self-hosted NAS (Network Attached Storage) system built on a Raspberry Pi, giving you full control of your files without monthly cloud subscriptions.

---

## 📌 Problem Statement

Cloud storage services like Google Drive, iCloud, and OneDrive charge recurring monthly/yearly fees that compound over time. For families or individuals storing large amounts of data — photos, videos, documents — these costs become significant. Worse, your data sits on servers you don't own or control.

There's no open, affordable, and user-friendly alternative for the average household.

---

## 💡 Solution

**PiVault** turns a Raspberry Pi and an external hard drive into a fully functional private cloud server. It provides:

- A web-based dashboard accessible from any device on your home network (and remotely via Tailscale).
- Secure, multi-user file storage with per-user quotas.
- Admin controls, hardware monitoring, and file management — all in a browser.

No subscription. No third-party access. Your files, your hardware, your rules.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login with hashed passwords (bcryptjs) and JSON Web Tokens |
| 📁 **File Manager** | Upload, download, rename, delete, and browse files/folders in your personal storage |
| 📂 **Directory Uploads** | Upload entire folders with preserved directory structure |
| ⭐ **Favourite Folders** | Bookmark and directly navigate to frequently used directories |
| 📊 **Dashboard** | Live storage usage, system status, recent files, and quick actions |
| 💻 **Hardware Monitor** | Real-time CPU temperature, RAM usage, and disk health from the Pi |
| 🛡️ **Admin Panel** | Manage users, set storage quotas, view all users' activity |
| 🔗 **SMB / Samba Access** | Mount your PiVault as a network drive in Windows Explorer natively |
| 🌐 **Remote Access** | Access PiVault from anywhere via Tailscale VPN — no port forwarding needed |
| 💾 **Backup Routes** | Dedicated backup API for critical data management |
| ⚙️ **Settings Page** | Personal settings, password change, display preferences |
| 🆘 **Help & Support** | Built-in help page with guides and system information |

---

## 🎯 Use Cases

- **Families**: Share a central drive for photos, videos, and school documents — without paying per member.
- **Freelancers / Creators**: Store large video/photo projects without worrying about cloud storage caps.
- **Privacy-Conscious Users**: Keep sensitive documents off third-party servers entirely.
- **Home Labs**: Use as a lightweight NAS alongside other self-hosted services.
- **Students**: Final-year project demonstrating full-stack development, Linux system administration, and networking concepts.

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     CLIENT DEVICES                        │
│          (Browser, Windows File Explorer via SMB)         │
└──────────────────────────┬────────────────────────────────┘
                           │ HTTP / Tailscale VPN
┌──────────────────────────▼────────────────────────────────┐
│                  RASPBERRY PI SERVER                      │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │               NGINX Reverse Proxy                   │  │
│  │  (SSL termination, port 80/443 → localhost:5000)    │  │
│  └───────────────────────┬─────────────────────────────┘  │
│                          │                                │
│  ┌───────────────────────▼─────────────────────────────┐  │
│  │       Node.js / Express Backend (Port 5000)         │  │
│  │                                                     │  │
│  │  Routes:                                            │  │
│  │  • /api/auth      — Login, Register                 │  │
│  │  • /api/storage   — Files, Folders, Upload          │  │
│  │  • /api/dashboard — Stats, Recent Files             │  │
│  │  • /api/admin     — User Management                 │  │
│  │  • /api/backup    — Backup Operations               │  │
│  │                                                     │  │
│  │  Middleware: JWT Auth, Multer (file streaming)      │  │
│  └───────────────────────┬─────────────────────────────┘  │
│                          │                                │
│  ┌───────────────────────▼─────────────────────────────┐  │
│  │          Storage Layer                              │  │
│  │                                                     │  │
│  │  /mnt/PiVaultStorage/users/<username>/              │  │
│  │  pivault-backend/data/users.json (User DB)          │  │
│  └──────────────────────────────────────────────────── ┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Samba (SMB) Server — Windows Drive Mapping         │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘

Frontend: React (TypeScript) + Vite + TailwindCSS
Deployed separately or served via NGINX
```

**Tech Stack:**

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS |
| Backend | Node.js, Express 5 |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |
| File Handling | Multer (streaming multipart uploads) |
| Process Manager | PM2 |
| Reverse Proxy | NGINX |
| Remote Access | Tailscale |
| File Sharing | Samba (SMB) |
| Storage | Ext4 filesystem on USB HDD (`/mnt/PiVaultStorage`) |

---

## 🛠️ Setup Guide

### Prerequisites

- Raspberry Pi 4 (2GB+ RAM recommended) running Raspberry Pi OS (64-bit)
- USB External Hard Drive (formatted as Ext4)
- Node.js 18+ installed on the Pi
- PM2 installed globally: `npm install -g pm2`
- NGINX installed: `sudo apt install nginx`

---

### Step 1 — Mount the External Drive

```bash
# Find your drive
lsblk

# Format as Ext4 (WARNING: erases the drive)
sudo mkfs.ext4 /dev/sda1

# Create the mount point
sudo mkdir -p /mnt/PiVaultStorage

# Mount it
sudo mount /dev/sda1 /mnt/PiVaultStorage

# Make it persist across reboots — add to /etc/fstab:
# UUID=<your-uuid>  /mnt/PiVaultStorage  ext4  defaults,nofail  0  2
```

---

### Step 2 — Clone the Repository

```bash
git clone https://github.com/<your-username>/PiVault.git
cd PiVault
```

---

### Step 3 — Configure the Backend

```bash
cd pivault-backend
npm install

# Create the environment file
cp .env.example .env
nano .env
```

Set the following in `.env`:

```env
PORT=5000
JWT_SECRET=your_very_secret_key
STORAGE_ROOT=/mnt/PiVaultStorage/users
```

---

### Step 4 — Set Up Storage Directories

```bash
sudo mkdir -p /mnt/PiVaultStorage/users
sudo chown -R $USER:$USER /mnt/PiVaultStorage/users
sudo chmod -R 775 /mnt/PiVaultStorage/users
```

---

### Step 5 — Start the Backend with PM2

```bash
cd pivault-backend
pm2 start server.js --name pivault-backend
pm2 save
pm2 startup   # Follow the printed command to enable autostart
```

---

### Step 6 — Configure NGINX

```bash
sudo nano /etc/nginx/sites-available/pivault
```

Paste the following:

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 0;   # Allow large file uploads

    location /api/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/pivault;
        try_files $uri /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/pivault /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Step 7 — Build and Deploy the Frontend

```bash
cd pivault-frontend
npm install

# Set the backend API URL
echo "VITE_API_URL=http://<your-pi-ip>" > .env

npm run build

# Copy the dist output to where NGINX serves from
sudo mkdir -p /var/www/pivault
sudo cp -r dist/* /var/www/pivault/
```

---

### Step 8 — Set Up Samba (Optional — for Windows Drive Mapping)

```bash
sudo apt install samba
sudo nano /etc/samba/smb.conf
```

Add a share block per user:

```ini
[user1]
   path = /mnt/PiVaultStorage/users/user1
   valid users = user1
   read only = no
   browsable = yes
```

```bash
sudo smbpasswd -a user1
sudo systemctl restart smbd
```

---

### Step 9 — Set Up Remote Access via Tailscale (Optional)

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Note the Tailscale IP shown (`100.x.x.x`) and access PiVault from anywhere using `http://100.x.x.x`.

---

## 🌐 Access

| Method | URL / Address |
|---|---|
| Local Network (Browser) | `http://<pi-local-ip>` (e.g., `http://192.168.1.150`) |
| Windows Network Drive | `\\PIVAULT\<username>` or `\\<pi-ip>\<username>` |
| Remote (Tailscale) | `http://<tailscale-ip>` (e.g., `http://100.x.x.x`) |
| Backend API Health Check | `http://<pi-ip>/api/` |

**Default Admin:** Set up via the first registered user or directly in `data/users.json`.

---

## 💰 Cost Comparison

Cloud storage requires recurring payments, while PiVault is a one-time setup.

| Storage | Cloud — Google One (3 years) | PiVault (one-time) |
|---|---|---|
| 1 TB | ₹23,400 | ~₹15,000 |
| 2 TB | ₹46,800 | ~₹17,500 |
| 4 TB | ₹93,600 | ~₹20,000 |

> **PiVault becomes more cost-effective after ~1.5–2 years**, and the hardware continues to serve you indefinitely. Especially beneficial for families sharing a single large storage pool.

---

## ⚠️ Known Limitations

1. **Single Point of Failure** — If the Raspberry Pi hardware fails, data access is lost until the drive is recovered. No built-in RAID or redundancy.
2. **No HTTPS Out of the Box** — NGINX is configured for HTTP only. HTTPS requires a domain name and a free Let's Encrypt certificate (`certbot`).
3. **File-Based User DB** — User accounts are stored in a flat `users.json` file, not a proper database. Concurrent writes during power failure can corrupt it.
4. **SMB Quota Bypass** — Samba/Windows drive mapping bypasses Node.js storage quotas. OS-level Ext4 quotas must be configured separately for full enforcement.
5. **No Versioning / Trash** — Deleted files are permanently removed. There is no recycle bin or file versioning.
6. **Local-Only by Default** — Remote access requires Tailscale setup. Port-forwarding directly to the internet is not recommended without proper firewall rules and HTTPS.
7. **Performance Ceiling** — The Pi's USB 3.0 + 100/1000 Mbps Ethernet caps large file transfer speeds. Not suitable for high-concurrency enterprise workloads.
8. **No Mobile App** — Access is browser-based only. No native iOS/Android app.

---

## 🔮 Future Improvements

- [ ] **SQLite / PostgreSQL** — Migrate user and file metadata from `users.json` to a proper database.
- [ ] **File Versioning & Recycle Bin** — Restore accidentally deleted files.
- [ ] **HTTPS Auto-Setup** — Automate TLS certificate generation via Let's Encrypt / Certbot.
- [ ] **RAID / Drive Mirroring** — Add a second drive for data redundancy.
- [ ] **Mobile App** — Native iOS and Android clients for on-the-go access.
- [ ] **Shared Folders** — Allow specific folders to be shared between multiple users.
- [ ] **Media Streaming** — Stream video/audio directly in the browser without downloading.
- [ ] **Scheduled Backups** — Automated incremental backups to a second drive or cloud cold storage.
- [ ] **Two-Factor Authentication** — TOTP-based 2FA for account security.
- [ ] **Docker Packaging** — Bundle the entire stack into a `docker-compose.yml` for one-command deployment.
- [ ] **Progressive Web App (PWA)** — Install PiVault as an offline-capable app on any device.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository on GitHub.
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m "feat: describe your change"`
4. **Push to your fork**: `git push origin feature/your-feature-name`
5. **Open a Pull Request** against the `main` branch.

Please ensure:
- Code is properly formatted and commented.
- New API routes have corresponding error handling.
- No secrets (`.env` values, tokens) are committed to the repository.

---

## 📄 License

This project is built as a Final Year Project for academic purposes. Contact the repository owner for licensing details before commercial use.

---

*Built with ❤️ on a Raspberry Pi.*
