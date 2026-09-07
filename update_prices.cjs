const fs = require('fs');
let content = fs.readFileSync('src/products.ts', 'utf8');

const updates = {
  'prod-office-2024': 42.90,
  'prod-office-2021': 34.90,
  'prod-office-2019': 24.90,
  'prod-office-2016': 19.90,
  'prod-microsoft-365': 28.90,
  'prod-win11-pro': 26.90,
  'prod-win11-home': 24.90,
  'prod-win11-enterprise': 29.90,
  'prod-win10-pro': 21.90,
  'prod-win10-home': 18.90,
  'prod-win10-enterprise': 24.90,
  'prod-combo-win11-office2024': 56.90,
  'prod-combo-win10-office2021': 42.90,
  'prod-project-2024': 34.90,
  'prod-visio-2024': 34.90,
  'prod-project-2021': 29.90,
  'prod-project-2019': 24.90,
  'prod-visio-2021': 29.90,
};

for (const [id, price] of Object.entries(updates)) {
  const regex = new RegExp(`(id:\\s*'${id}',(?:[\\s\\S]*?))price:\\s*[0-9.]+`, 'g');
  content = content.replace(regex, `$1price: ${price.toFixed(2)}`);
}

// Special case for 'oem' inside win11-pro variants
const oemRegex = /(id:\s*'prod-win11-pro',[\s\S]*?id:\s*'oem',\s*name:\s*'[^']+',\s*)price:\s*[0-9.]+/;
content = content.replace(oemRegex, `$1price: 26.90`);

fs.writeFileSync('src/products.ts', content);
