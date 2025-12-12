# 🚀 Quick Deployment Guide - InfinityFree

## Langkah Cepat (5 Menit)

### 1. Update Domain (Jika diperlukan)
```bash
node update-sitemap.js yourdomain.infinityfreeapp.com
```

### 2. Build & Prepare
```bash
npm run build
.\deploy.bat
```

### 3. Upload ke InfinityFree
1. Login ke [InfinityFree Control Panel](https://app.infinityfree.net/)
2. Buka **File Manager**
3. Upload **SEMUA** file dari folder `deployment/` ke `public_html/`
4. Pastikan file `.htaccess` ada di root directory

### 4. Test Website
- Homepage: `https://yourdomain.infinityfreeapp.com/`
- KGB: `https://yourdomain.infinityfreeapp.com/kgb`
- Data Berkala: `https://yourdomain.infinityfreeapp.com/data-berkala-pns`

## ⚡ Troubleshooting Cepat

### ❌ React Router Error (404)
- Pastikan `.htaccess` terupload di root
- Cek File Manager InfinityFree

### ❌ Gambar Tidak Muncul
- Cek folder `assets/` terupload
- Verifikasi file `bpskota.png` dan `bps-logo.png`

### ❌ CSS/JS Error
- Cek folder `static/` terupload lengkap
- Refresh browser dengan Ctrl+F5

## 📞 Support
- InfinityFree: https://infinityfree.net/support/
- File logs: Control Panel > Error Logs
- Browser: F12 > Console

## 🔄 Update Website
Untuk update website:
1. Edit kode aplikasi
2. Jalankan `npm run build`
3. Jalankan `.\deploy.bat`
4. Upload ulang file dari folder `deployment/`

---
**Note**: InfinityFree memiliki batasan bandwidth. Monitor penggunaan di control panel. 