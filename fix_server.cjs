const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// 1. Remove import
content = content.replace("WHATSAPP_DISPLAY, PROMO_COUPON_CODE }", "WHATSAPP_DISPLAY }");

// 2. Remove from system prompt
content = content.replace(/  \* Cupón "\$\{PROMO_COUPON_CODE\}": 10% de descuento en compras desde S\/ 40\.00\.\n/g, "");

// 3. Remove from simple matching
const promoMatch = `        reply = \`🎉 ¡Tenemos excelentes promociones para usted!\\n\\n1. 🎁 **Cupón especial:** Aplique el código **\\\`\${PROMO_COUPON_CODE}\\\`** en el carrito y obtenga **10% de descuento** en compras de productos desde S/ 40.00.\\n2. 🔥 **Descuento por volumen:** Al llevar 2 o más productos, el carrito le aplica un **10% de descuento automático**.\\n\\n¿Desea que le recomiende alguna combinación en combo con super ahorro?\`;`;
const promoReplacement = `        reply = \`🎉 ¡Tenemos excelentes promociones para usted!\\n\\n🔥 **Descuento por volumen automático:** Al llevar 2 o más licencias, el carrito le aplicará un **10% de descuento automático**.\\n🎁 **Cupones Flash sorpresa:** Navegue por nuestra tienda o agregue un producto al carrito, y podría recibir un cupón aleatorio con un descuento especial.\\n\\n¿Desea que le recomiende alguna combinación de licencias?\`;`;
content = content.replace(promoMatch, promoReplacement);

fs.writeFileSync('server.ts', content);
console.log("server.ts fixed");
