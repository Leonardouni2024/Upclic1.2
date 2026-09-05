const fs = require('fs');

// CheckoutPage
let checkout = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');
checkout = checkout.replace(
  "  const hasEligibleItemForCoupon = totalQuantity > 0 &&\n    items.some(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);",
  "  const hasEligibleItemForCoupon = totalQuantity > 0;"
);
fs.writeFileSync('src/components/CheckoutPage.tsx', checkout);

// CartDrawer
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
cartDrawer = cartDrawer.replace(
  "  const hasEligibleItemForCoupon = totalQuantity > 0 &&\n    items.some(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);",
  "  const hasEligibleItemForCoupon = totalQuantity > 0;"
);
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

console.log("MIN_PRICE_FOR_COUPON fixed");
