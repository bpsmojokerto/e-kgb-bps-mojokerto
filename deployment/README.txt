========================================
E-KGB BPS Mojokerto - Deployment Package
========================================

File ini siap untuk diupload ke InfinityFree hosting.

LANGKAH UPLOAD:
1. Login ke InfinityFree control panel
2. Buka File Manager
3. Upload SEMUA file dari folder ini ke public_html
4. Pastikan file .htaccess terupload di root directory

STRUKTUR FILE YANG DIUPLOAD:
├── .htaccess (PENTING: untuk React Router)
├── index.html
├── favicon.ico
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
├── sitemap.xml
├── static/ (folder CSS dan JS)
└── assets/ (folder gambar)

SETELAH UPLOAD:
1. Akses website Anda
2. Test semua halaman:
   - Homepage: /
   - KGB: /kgb
   - Data Berkala PNS: /data-berkala-pns

TROUBLESHOOTING:
- Jika React Router error: Pastikan .htaccess terupload
- Jika gambar tidak muncul: Cek folder assets/
- Jika 404 error: Cek semua file static terupload

SUPPORT:
Untuk bantuan lebih lanjut, lihat file DEPLOYMENT_GUIDE.md di root project.

======================================== 