# PiVault NAS - Troubleshooting & Known Architecture Limitations

This document lists potential edge-cases, system failures, and limitations that you might encounter as PiVault scales over time, along with their native solutions.

### 1. NGINX "413 Request Entity Too Large" (Upload Blocks)
* **Problem**: Even with `multer` streaming efficiently, Nginx drops any HTTP payload larger than its configuration bounds. Uploading a 5GB 4K video will instantly fail. 
* **Solution**: You must tell Nginx to allow infinite payload sizes. Edit `/etc/nginx/sites-available/pivault` and add `client_max_body_size 0;` inside the `server` block. Then run `sudo systemctl restart nginx`.

### 2. Samba Windows Uploads Bypassing Quotas
* **Problem**: The new Node `checkStorageQuota` limits uploads beautifully out of the web dashboard. However, if `user1` maps their drive natively resolving to `\\PIVAULT\user1` over Windows SMB, they interact directly with Linux, entirely bypassing Node.js. Thus, they can completely ignore the 5GB quota and fill the hard drive directly.
* **Solution**: The Node backend cannot throttle native native SMB connections. To enforce real Pi limits across Samba, you must configure **Ext4 OS User Quotas**. Run `sudo quotaon -v /mnt/PiVaultStorage` and use `sudo edquota -u user1` to lay down a physical megabyte hard-cap.

### 3. File System Corruption on Power Loss
* **Problem**: PiVault tracks configuration mappings inside `pivault-backend/data/users.json`. If the Raspberry Pi loses power or is unplugged *exactly* at the microsecond the Node server writes to this file, it will corrupt the JSON tree, destroying all tracking data.
* **Solution**: Run a simple cronjob to independently back up the `data` directory, or if the project scales massively, swap `fs.writeFile` to an ACID-compliant database like SQLite3.

### 4. Drive Unmounts Hijacking the SD Card
* **Problem**: The NAS data is mapped to `/mnt/PiVaultStorage`. If the USB Hard Drive unplugs or the power fluctuates during boot, Linux will still spin up but won't mount the drive. PiVault will blindly assume `/mnt/PiVaultStorage` is active and start writing multi-gigabyte files directly to the tiny internal MicroSD card. This will crash the entire operating system in minutes.
* **Solution**: Ensure your `/etc/fstab` mapping includes `nofail` but also prevents root writing. Run `sudo chattr +i /mnt/PiVaultStorage` while the drive is unplugged. This permanently locks the empty mount folder so Linux natively rejects data unless a real external mount masks it.

### 5. Deep Windows File Ownership (Root Lockout)
* **Problem**: Sometimes users moving folders directly from Windows into the Unix SMB mount will drag deeply nested proprietary Windows Access Control Lists (ACLs) onto Linux. `smbd` will write these files as `root:root` with rigid locks, triggering `EACCES` on the web Dashboard when users try to delete the files they just uploaded.
* **Solution**: Our `app.js` runs a global `chown` patch every time PM2 restarts. To rapidly resolve a locked folder, open the Pi vault terminal and type `pm2 restart pivault-backend` to force the Node daemon to execute its global unlocking sequence across the hard drive. 

### 6. Local Network DHCP IP Thrashing
* **Problem**: Your Pi might currently exist on `192.168.1.150`. If you restart your whole house's router, it might lease `192.168.1.151` to the Pi instead. Suddenly, nobody can connect to the dashboard locally.
* **Solution**: Log into your local Router settings (e.g., 192.168.1.1), find the "DHCP Reservations" or "Static IP Assigments" tab, and lock the Raspberry Pi's MAC address to a permanent specific local IP. (Remote access over Tailscale is immune to this issue).
