const fs = require('fs');
let content = fs.readFileSync('src/products.ts', 'utf8');

const updates = {
  'prod-office-2010': 14.90,
  'prod-win81-pro': 14.90,
};

for (const [id, price] of Object.entries(updates)) {
  const regex = new RegExp(`(id:\\s*'${id}',(?:[\\s\\S]*?))price:\\s*[0-9.]+`, 'g');
  content = content.replace(regex, `$1price: ${price.toFixed(2)}`);
}

fs.writeFileSync('src/products.ts', content);
