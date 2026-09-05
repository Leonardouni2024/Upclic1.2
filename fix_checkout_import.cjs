const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');

content = content.replace("  MIN_PRICE_FOR_COUPON,\n", "");
fs.writeFileSync('src/components/CheckoutPage.tsx', content);

let context = fs.readFileSync('src/context/CartContext.tsx', 'utf8');
context = context.replace("MIN_PRICE_FOR_COUPON", "");
fs.writeFileSync('src/context/CartContext.tsx', context);

console.log("Imports fixed");
