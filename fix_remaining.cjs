const fs = require('fs');

// 1. CheckoutPage.tsx
let checkout = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');
checkout = checkout.replace("  PROMO_COUPON_CODE,", "");
checkout = checkout.replace(/<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">[\s\S]*?<\/div>/g, ""); // Remove the suggestion box completely
fs.writeFileSync('src/components/CheckoutPage.tsx', checkout);

// 2. CartDrawer.tsx
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
cartDrawer = cartDrawer.replace("import { PROMO_COUPON_CODE, MIN_PRICE_FOR_COUPON } from '../products.ts';", "");
cartDrawer = cartDrawer.replace(/<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">[\s\S]*?<\/div>/g, "");
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

// 3. aiChatClient.ts
let aiChat = fs.readFileSync('src/utils/aiChatClient.ts', 'utf8');
aiChat = aiChat.replace(", PROMO_COUPON_CODE", "");
aiChat = aiChat.replace(/🎁 \*\*Cupón especial de apertura:\*\* Aplica el código \*\*\`\$\{PROMO_COUPON_CODE\}\`\*\* en tu carrito de compras y obtén un \*\*10% de descuento\*\* en compras a partir de S\/ 40\.00\.\\n/g, "");
fs.writeFileSync('src/utils/aiChatClient.ts', aiChat);

// 4. Products.ts (make sure no PROMO constants exist)
let prod = fs.readFileSync('src/products.ts', 'utf8');
prod = prod.replace(/export const PROMO_COUPON.*?\n/g, "");
fs.writeFileSync('src/products.ts', prod);

console.log("Remaining fixed");
