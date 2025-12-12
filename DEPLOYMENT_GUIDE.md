# Panduan Deployment ke InfinityFree

## Langkah-langkah Deployment

### 1. Persiapan Akun InfinityFree
1. Kunjungi https://infinityfree.net/
2. Daftar akun baru atau login
3. Buat hosting baru dengan subdomain atau domain custom

### 2. Upload File ke InfinityFree

#### Opsi A: Menggunakan File Manager InfinityFree
1. Login ke control panel InfinityFree
2. Buka File Manager
3. Upload semua file dari folder `build/` ke root directory (public_html)
4. Upload file `.htaccess` ke root directory

#### Opsi B: Menggunakan FTP
1. Dapatkan kredensial FTP dari control panel InfinityFree
2. Gunakan FTP client (FileZilla, WinSCP, dll)
3. Upload semua file dari folder `build/` ke public_html
4. Upload file `.htaccess` ke root directory

### 3. File yang Perlu Diupload
```
public_html/
├── .htaccess
├── index.html
├── favicon.ico
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
├── sitemap.xml
├── static/
│   ├── css/
│   └── js/
└── assets/
    ├── bps-logo.png
    └── bpskota.png
```

### 4. Konfigurasi Domain
1. Setelah upload selesai, akses website Anda
2. Pastikan React Router berfungsi dengan mengakses:
   - `https://yourdomain.infinityfreeapp.com/`
   - `https://yourdomain.infinityfreeapp.com/kgb`
   - `https://yourdomain.infinityfreeapp.com/data-berkala-pns`

### 5. Update Konfigurasi Aplikasi

#### Update sitemap.xml
Ganti `yourdomain.infinityfreeapp.com` dengan domain Anda yang sebenarnya.

#### Update API Endpoints (jika diperlukan)
Jika backend API Anda dihosting terpisah, update URL API di aplikasi.

### 6. Testing
1. Test semua fitur aplikasi
2. Test responsivitas di berbagai device
3. Test loading time dan performa
4. Test SEO dengan Google Search Console

### 7. Troubleshooting

#### Jika React Router tidak berfungsi:
- Pastikan file `.htaccess` sudah terupload dengan benar
- Cek apakah server mendukung mod_rewrite

#### Jika gambar tidak muncul:
- Pastikan semua file di folder `assets/` terupload
- Cek path relatif di kode aplikasi

#### Jika ada error 404:
- Pastikan semua file static terupload
- Cek konfigurasi `.htaccess`

### 8. Maintenance
- Backup file secara berkala
- Monitor performa website
- Update aplikasi secara regular
- Monitor error logs

## Catatan Penting
- InfinityFree memiliki batasan bandwidth dan storage
- Backup database secara berkala jika menggunakan database
- Monitor penggunaan resource untuk menghindari suspend
- Gunakan CDN untuk optimasi loading jika diperlukan 