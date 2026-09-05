const fs = require('fs');
let content = fs.readFileSync('src/products.ts', 'utf8');

// Remove PRIMUPCLIC constants
content = content.replace("export const PROMO_COUPON_CODE = \"PRIMUPCLIC\";\n", "");
content = content.replace("export const PROMO_COUPON_DISCOUNT = 0.10;\n", "");
content = content.replace("export const PROMO_COUPON_EXPIRATION_DAYS = 30;\n", "");
content = content.replace("export const MIN_PRICE_FOR_COUPON = 40.00;\n", "");
content = content.replace("export const MIN_PRICE_FOR_30_COUPON = 40.00; // Alias para compatibilidad\n", "");

// Rewrite calculateCartTotals
const totalsFunction = `export function calculateCartTotals(
  items: { product: Product; quantity: number; unitPrice?: number; variantName?: string }[],
  appliedCoupon?: string,
  dynamicCoupon?: DynamicCoupon | null
): CartTotals {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity, 0);

  const cleanCoupon = appliedCoupon ? appliedCoupon.trim().toUpperCase() : '';
  const isDynamicCouponValid = dynamicCoupon && cleanCoupon === dynamicCoupon.code.toUpperCase() && dynamicCoupon.expiresAt > Date.now();
  
  const isMultiItem = totalQuantity >= 2;

  let discountRate = 0;
  let hasDiscount = false;
  let discountReason = '';
  let isMultiItemDiscount = false;
  let isCouponApplied = false;
  let discountAmount = 0;

  if (isMultiItem) {
    // 2 o más productos: 10% de descuento
    hasDiscount = true;
    discountRate = MULTI_ITEM_DISCOUNT; // 0.10
    isMultiItemDiscount = true;
    discountAmount = Number((subtotal * discountRate).toFixed(2));
    if (isDynamicCouponValid) {
      isCouponApplied = true;
      discountReason = \`10% de descuento por llevar 2 o más productos (Cupón \${dynamicCoupon.code} activo - descuentos no acumulables)\`;
    } else {
      discountReason = '10% de descuento por llevar 2 o más productos';
    }
  } else if (isDynamicCouponValid) {
    hasDiscount = true;
    discountRate = dynamicCoupon.discountPercent / 100;
    isCouponApplied = true;
    discountAmount = Number((subtotal * discountRate).toFixed(2));
    discountReason = \`Cupón \${dynamicCoupon.code}: \${dynamicCoupon.discountPercent}% de descuento especial\`;
  }

  const total = Number(Math.max(0, subtotal - discountAmount).toFixed(2));

  return {
    totalQuantity,
    subtotal: Number(subtotal.toFixed(2)),
    hasDiscount,
    discountRate,
    discountAmount,
    total,
    discountReason,
    isMultiItemDiscount,
    isCouponApplied
  };
}`;

content = content.replace(/export function calculateCartTotals\([\s\S]*?\}\n/m, totalsFunction + '\n');

fs.writeFileSync('src/products.ts', content);
console.log("products.ts updated");
