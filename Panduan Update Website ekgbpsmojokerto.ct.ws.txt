# 🔄 Panduan Update Website ekgbpsmojokerto.ct.ws

## ✅ Status Website
- **Domain**: https://ekgbpsmojokerto.ct.ws
- **Status**: Sudah Online
- **Account**: if0_38803693

## 📝 File yang Sudah Diupdate
✅ **sitemap.xml** - Domain sudah diupdate ke `ekgbpsmojokerto.ct.ws`
✅ **robots.txt** - Sitemap URL sudah diupdate
✅ **Build files** - Aplikasi sudah di-build ulang
✅ **Deployment package** - File siap upload di folder `deployment/`

## 🚀 Langkah Update Website

### 1. Login ke InfinityFree
- **URL**: https://dash.infinityfree.com/accounts/if0_38803693
- **Username**: if0_38803693
- **Password**: N9tW0qCP9nDyg6c

### 2. Upload File Baru
1. Buka **File Manager** di control panel
2. Upload **SEMUA** file dari folder `deployment/` ke `public_html/`
3. **PENTING**: Pastikan file `.htaccess` terupload di root directory
4. **PENTING**: Pastikan folder `assets/` dan `static/` terupload lengkap

### 3. File yang Perlu Diupload
```
public_html/
├── .htaccess (PENTING: untuk React Router)
├── index.html
├── favicon.ico
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt (SUDAH DIUPDATE)
├── sitemap.xml (SUDAH DIUPDATE)
├── static/ (folder CSS dan JS)
└── assets/ (folder gambar)
```

### 4. Test Website Setelah Update
- Homepage: https://ekgbpsmojokerto.ct.ws/
- KGB: https://ekgbpsmojokerto.ct.ws/kgb
- Data Berkala PNS: https://ekgbpsmojokerto.ct.ws/data-berkala-pns
- Sitemap: https://ekgbpsmojokerto.ct.ws/sitemap.xml
- Robots: https://ekgbpsmojokerto.ct.ws/robots.txt

## 🔧 Troubleshooting

### ❌ Jika React Router Error (404)
- Pastikan `.htaccess` terupload di root directory
- Cek apakah server mendukung mod_rewrite

### ❌ Jika Gambar Tidak Muncul
- Cek folder `assets/` terupload dengan file `bpskota.png` dan `bps-logo.png`
- Verifikasi path relatif di kode aplikasi

### ❌ Jika CSS/JS Error
- Cek folder `static/` terupload lengkap
- Refresh browser dengan Ctrl+F5 (hard refresh)

## 📊 SEO Improvements
Setelah update, website Anda akan memiliki:
- ✅ Sitemap yang benar dengan domain `ekgbpsmojokerto.ct.ws`
- ✅ Robots.txt yang mengarah ke sitemap yang benar
- ✅ Meta tags yang optimal
- ✅ Structured data untuk search engines

## 🔄 Untuk Update Selanjutnya
Jika ada perubahan kode di masa depan:
1. Edit kode aplikasi
2. Jalankan: `npm run build`
3. Jalankan: `.\deploy.bat`
4. Upload ulang file dari folder `deployment/`

## 📞 Support
- InfinityFree Support: https://infinityfree.net/support/
- Error Logs: Control Panel > Error Logs
- Browser Debug: F12 > Console

---
**Note**: Backup file lama sebelum upload untuk keamanan. 