const fs = require('fs');

// CheckoutPage
let checkout = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');
checkout = checkout.replace(
  "    items.some(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);",
  "    true;"
);
fs.writeFileSync('src/components/CheckoutPage.tsx', checkout);

// CartDrawer
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
cartDrawer = cartDrawer.replace(
  "    items.some(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);",
  "    true;"
);
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

console.log("MIN_PRICE_FOR_COUPON fixed again");
