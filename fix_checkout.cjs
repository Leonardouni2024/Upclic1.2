const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');

// Add import
content = content.replace("import { CreditCard, ", "import { DynamicCouponBanner } from './DynamicCouponBanner.tsx';\nimport { CreditCard, ");

// Replace banner
const target = /{ \/\* Dynamic Coupon Banner Checkout \*\/ }[\s\S]*?{ \/\* Promo Code Input \*\/ }/;
const replacement = `<DynamicCouponBanner 
                    onApply={(code) => {
                      applyCoupon(code);
                      setInputCoupon('');
                    }} 
                    isCouponApplied={isCouponApplied} 
                    totalQuantity={totalQuantity} 
                  />

                  {/* Promo Code Input */}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/CheckoutPage.tsx', content);
console.log("Checkout updated");
