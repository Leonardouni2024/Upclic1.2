const fs = require('fs');

function removePromoBlock(content) {
  const match = '<div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">';
  let startIdx = content.indexOf(match);
  while(startIdx !== -1) {
    let openDivs = 1;
    let endIdx = startIdx + match.length;
    
    // Simple tag counting to find matching closing div
    while (openDivs > 0 && endIdx < content.length) {
      if (content.substr(endIdx, 4) === '<div') openDivs++;
      if (content.substr(endIdx, 6) === '</div') openDivs--;
      endIdx++;
    }
    
    // endIdx is right after the < of </div, so we need to add back the >
    if (content.substr(endIdx, 1) === '>') endIdx++;
    
    content = content.substring(0, startIdx) + content.substring(endIdx);
    startIdx = content.indexOf(match);
  }
  return content;
}


// 1. CheckoutPage.tsx
let checkout = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');
checkout = removePromoBlock(checkout);
fs.writeFileSync('src/components/CheckoutPage.tsx', checkout);

// 2. CartDrawer.tsx
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
cartDrawer = removePromoBlock(cartDrawer);
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

// 3. aiChatClient.ts
let aiChat = fs.readFileSync('src/utils/aiChatClient.ts', 'utf8');
const searchString = "🎁 **Cupón especial de apertura:** Aplica el código **\\`${PROMO_COUPON_CODE}\\`** en tu carrito de compras y obtén un **10% de descuento** en compras a partir de S/ 40.00.\\n";
aiChat = aiChat.replace(searchString, "");
fs.writeFileSync('src/utils/aiChatClient.ts', aiChat);

console.log("PROMO_COUPON_CODE fixed 2");
