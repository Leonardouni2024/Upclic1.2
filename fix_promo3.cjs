const fs = require('fs');

// 1. CheckoutPage.tsx
let checkout = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');
const search1 = `                  {isEligibleForCoupon && (
                    <button
                      type="button"
                      onClick={() => applyCoupon(PROMO_COUPON_CODE)}
                      className="text-[10px] font-bold text-[#0066FF] hover:underline cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      Usar {PROMO_COUPON_CODE} (-10%)
                    </button>
                  )}`;
checkout = checkout.replace(search1, "");
fs.writeFileSync('src/components/CheckoutPage.tsx', checkout);

// 2. CartDrawer.tsx
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
const search2 = `                  {isEligibleForCoupon && (
                    <button
                      type="button"
                      onClick={() => applyCoupon(PROMO_COUPON_CODE)}
                      className="text-[10px] font-bold text-[#0066FF] hover:underline cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      Usar {PROMO_COUPON_CODE} (-10%)
                    </button>
                  )}`;
cartDrawer = cartDrawer.replace(search2, "");
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

console.log("PROMO_COUPON_CODE fixed 3");
