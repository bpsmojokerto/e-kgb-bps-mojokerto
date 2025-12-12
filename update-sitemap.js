const fs = require('fs');
const path = require('path');

// Fungsi untuk mengupdate sitemap dengan domain yang benar
function updateSitemap(domain) {
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${domain}/kgb</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${domain}/data-berkala-pns</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`✅ Sitemap berhasil diupdate dengan domain: ${domain}`);
}

// Fungsi untuk mengupdate robots.txt
function updateRobots(domain) {
    const robotsPath = path.join(__dirname, 'public', 'robots.txt');
    
    const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://${domain}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/`;

    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`✅ Robots.txt berhasil diupdate dengan domain: ${domain}`);
}

// Main function
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('❌ Mohon masukkan domain Anda!');
        console.log('Contoh: node update-sitemap.js yourdomain.infinityfreeapp.com');
        process.exit(1);
    }
    
    const domain = args[0];
    
    try {
        updateSitemap(domain);
        updateRobots(domain);
        
        console.log('\n🎉 Update selesai!');
        console.log('Langkah selanjutnya:');
        console.log('1. Jalankan: npm run build');
        console.log('2. Jalankan: .\\deploy.bat');
        console.log('3. Upload file dari folder deployment ke InfinityFree');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main(); 