const fs = require('fs');

// 1. CheckoutPage.tsx
let checkout = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');
checkout = checkout.replace(/<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">[\s\S]*?<\/div>/g, ""); 
checkout = checkout.replace(/<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">[\s\S]*?<\/div>/g, "");
// Hard replace the block if regex fails
let startIdx = checkout.indexOf('<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">');
if(startIdx !== -1) {
  let endIdx = checkout.indexOf('</div>', startIdx) + 6;
  checkout = checkout.substring(0, startIdx) + checkout.substring(endIdx);
}
fs.writeFileSync('src/components/CheckoutPage.tsx', checkout);

// 2. CartDrawer.tsx
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
let startIdx2 = cartDrawer.indexOf('<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">');
if(startIdx2 !== -1) {
  let endIdx2 = cartDrawer.indexOf('</div>', startIdx2) + 6;
  cartDrawer = cartDrawer.substring(0, startIdx2) + cartDrawer.substring(endIdx2);
}
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

// 3. aiChatClient.ts
let aiChat = fs.readFileSync('src/utils/aiChatClient.ts', 'utf8');
aiChat = aiChat.replace(/🎁 \*\*Cupón especial de apertura:\*\* Aplica el código \*\*\`\$\{PROMO_COUPON_CODE\}\`\*\* en tu carrito de compras y obtén un \*\*10% de descuento\*\* en compras a partir de S\/ 40\.00\.\\n/g, "");
fs.writeFileSync('src/utils/aiChatClient.ts', aiChat);


console.log("PROMO_COUPON_CODE fixed");
