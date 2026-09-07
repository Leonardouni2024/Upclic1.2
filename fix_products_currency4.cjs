const fs = require('fs');
let content = fs.readFileSync('src/products.ts', 'utf8');

content = content.replace("  return currency === 'USD' ? '\nexport const WHATSAPP_DISPLAY = \"+51 983 204 384\";", "  return currency === 'USD' ? '$' : 'S/';\n}\n\nexport const WHATSAPP_NUMBER = \"51983204384\";\nexport const WHATSAPP_DISPLAY = \"+51 983 204 384\";");

fs.writeFileSync('src/products.ts', content);
