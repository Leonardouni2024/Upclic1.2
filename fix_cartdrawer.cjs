const fs = require('fs');
let content = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

// Add import
content = content.replace("import { Package,", "import { DynamicCouponBanner } from './DynamicCouponBanner.tsx';\nimport { Package,");

// Replace banner
const target = /{ \/\* Dynamic Coupon Banner \*\/ }[\s\S]*?{ \/\* Promo Code Section \*\/ }/;
const replacement = `<div className="mt-[-8px]">
            <DynamicCouponBanner 
              onApply={(code) => {
                applyCoupon(code);
                setInputCoupon('');
              }} 
              isCouponApplied={isCouponApplied} 
              totalQuantity={totalQuantity} 
            />
          </div>

          {/* Promo Code Section */}`;
          
content = content.replace(target, replacement);

// Remove PRIMUPCLIC text in CartDrawer if any:
content = content.replace(
  "discountReason || '¡10% de descuento aplicado con cupón PRIMUPCLIC!'",
  "discountReason"
);
content = content.replace(
  ": '¡10% de descuento aplicado con cupón PRIMUPCLIC!'",
  ": 'Descuento aplicado'"
);

fs.writeFileSync('src/components/CartDrawer.tsx', content);
console.log("CartDrawer updated");
