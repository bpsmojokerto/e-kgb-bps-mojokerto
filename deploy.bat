@echo off
echo ========================================
echo Persiapan Deployment ke InfinityFree
echo ========================================

echo.
echo 1. Building aplikasi React...
call npm run build

echo.
echo 2. Menyalin file .htaccess ke build folder...
copy .htaccess build\.htaccess

echo.
echo 3. Menyalin sitemap.xml ke build folder...
copy public\sitemap.xml build\sitemap.xml

echo.
echo 4. Membuat folder deployment...
if not exist "deployment" mkdir deployment
xcopy build\* deployment\ /E /I /Y

echo.
echo ========================================
echo Deployment siap!
echo ========================================
echo.
echo File siap diupload ke InfinityFree ada di folder 'deployment'
echo.
echo Langkah selanjutnya:
echo 1. Login ke InfinityFree control panel
echo 2. Buka File Manager
echo 3. Upload semua file dari folder 'deployment' ke public_html
echo 4. Pastikan file .htaccess terupload di root directory
echo.
pause 