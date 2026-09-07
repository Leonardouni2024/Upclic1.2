const fs = require('fs');

let content = fs.readFileSync('src/products.ts', 'utf8');

// The bottom seems to have some broken syntax ` : 'S/';\n}`
content = content.replace(" : 'S/';\n}\n\nexport const WHATSAPP_NUMBER", "");

fs.writeFileSync('src/products.ts', content);
