const fs = require('fs');
let content = fs.readFileSync('src/products.ts', 'utf8');

// Helper to replace price
function setPrice(id, newPrice) {
  const regex = new RegExp(`(id:\\s*'${id}',(?:[\\s\\S]*?))price:\\s*[0-9.]+`, 'g');
  content = content.replace(regex, `$1price: ${newPrice.toFixed(2)}`);
}

// 1. Windows 10 Home (price 26, variants)
setPrice('prod-win10-home', 26.00);
content = content.replace(/(id:\s*'prod-win10-home',[\s\S]*?features:\s*\[[^\]]+\])/, `$1,\n    variants: [\n      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 26.00 },\n      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 30.00 }\n    ]`);

// 2. Windows 10 Enterprise (price 36)
setPrice('prod-win10-enterprise', 36.00);

// 3. Windows 11 Enterprise (price 42)
setPrice('prod-win11-enterprise', 42.00);

// 4. Windows 11 Pro (price 27, update variants)
setPrice('prod-win11-pro', 27.00);
const oemRegex11Pro = /(id:\s*'prod-win11-pro',[\s\S]*?id:\s*'oem',\s*name:\s*'[^']+',\s*type:\s*'OEM',\s*)price:\s*[0-9.]+/;
content = content.replace(oemRegex11Pro, `$1price: 27.00`);
const retailRegex11Pro = /(id:\s*'prod-win11-pro',[\s\S]*?id:\s*'retail',\s*name:\s*'[^']+',\s*type:\s*'Retail',\s*)price:\s*[0-9.]+/;
content = content.replace(retailRegex11Pro, `$1price: 31.00`);

// 5. Windows 8.1 Pro (price 55)
setPrice('prod-win81-pro', 55.00);

// 6. Windows 11 Home (price 30, variants)
setPrice('prod-win11-home', 30.00);
content = content.replace(/(id:\s*'prod-win11-home',[\s\S]*?features:\s*\[[^\]]+\])/, `$1,\n    variants: [\n      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 30.00 },\n      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 34.00 }\n    ]`);

// Windows 10 Pro (keep price 21.90, add variants)
content = content.replace(/(id:\s*'prod-win10-pro',[\s\S]*?features:\s*\[[^\]]+\])/, `$1,\n    variants: [\n      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 21.90 },\n      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 25.90 }\n    ]`);

// 7 & 8. Windows 7 Pro & Ultimate
setPrice('prod-win7-pro', 30.00);
content = content.replace(/name:\s*'Windows 7 Professional \/ Ultimate Key'/, "name: 'Windows 7 Professional Key'");

// Add Windows 7 Ultimate
const win7Ultimate = `  {
    id: 'prod-win7-ultimate',
    slug: 'windows-7-ultimate-key',
    name: 'Windows 7 Ultimate Key',
    description: 'La edición más completa de Windows 7.',
    price: 32.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-7-pro.webp',
    fallbackImage: '/products/windows-7-pro.png',
    rating: 4.88,
    reviews: 64,
    features: ['BitLocker, Aero Glass y soporte multilenguaje completo'],
    compatibility: 'Windows 7 (32/64 Bit)',
    downloadUrl: 'https://www.microsoft.com',
    installationSteps: ['Activar en el menú Inicio > Propiedades del equipo.']
  },`;
content = content.replace(/(id:\s*'prod-win7-pro',[\s\S]*?^\s*\},)/m, `$1\n${win7Ultimate}`);

// 9. Combo win10-office2021 (price 46.50)
setPrice('prod-combo-win10-office2021', 46.50);

// 10. Microsoft 365 (rename and price 49)
setPrice('prod-microsoft-365', 49.00);
content = content.replace(/name:\s*'Microsoft 365 Personal \/ Familia \(Suscripción\)'/, "name: 'Microsoft 365 Personal (Suscripción)'");

// 11. Project Pro (set 2024, 2021, 2019, 2016 to 28)
setPrice('prod-project-2024', 28.00);
setPrice('prod-project-2021', 28.00);
setPrice('prod-project-2019', 28.00);
setPrice('prod-project-2016', 28.00);

// 12. Visio 2013 (price 35)
setPrice('prod-visio-2013', 35.00);

// 13. Visio 2016 (price 29)
setPrice('prod-visio-2016', 29.00);

// 14. Office 2010 (price 50)
setPrice('prod-office-2010', 50.00);

// 15. Office 2013 (price 29)
setPrice('prod-office-2013', 29.00);

// 16. Office 2016 (price 20)
setPrice('prod-office-2016', 20.00);

fs.writeFileSync('src/products.ts', content);
