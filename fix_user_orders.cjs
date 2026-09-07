const fs = require('fs');

let file = 'src/components/UserOrdersModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("formatPrice(order.total?, currency)", "formatPrice(order.total ?? 0, currency)");
// Also make sure we have the imports properly
if (!content.includes("formatPrice, getCurrencySymbol")) {
  content = content.replace("import { products } from '../products.ts';", "import { products, formatPrice, getCurrencySymbol } from '../products.ts';");
}
fs.writeFileSync(file, content);

console.log("UserOrdersModal fixed");
