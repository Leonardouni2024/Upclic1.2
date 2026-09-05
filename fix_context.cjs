const fs = require('fs');
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

// Update applyCoupon to only handle dynamic coupons
const applyCouponLogic = `const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      const msg = 'Por favor ingresa un código promocional.';
      setCouponFeedback({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
    
    // Check if it's the dynamic coupon first
    if (dynamicCoupon && clean === dynamicCoupon.code.toUpperCase()) {
      if (dynamicCoupon.expiresAt > Date.now()) {
        setAppliedCoupon(clean);
        try {
          localStorage.setItem(COUPON_STORAGE_KEY, clean);
        } catch {}
        setCouponFeedback({ type: 'success', message: \`¡Cupón de \${dynamicCoupon.discountPercent}% aplicado correctamente!\` });
        return { success: true, message: \`¡Cupón de \${dynamicCoupon.discountPercent}% aplicado correctamente!\` };
      } else {
        setCouponFeedback({ type: 'error', message: 'El cupón especial ha expirado.' });
        return { success: false, message: 'El cupón especial ha expirado.' };
      }
    }
    
    const msg = \`El código "\${code}" no es válido o ha expirado.\`;
    setCouponFeedback({ type: 'error', message: msg });
    return { success: false, message: msg };
  };`;

content = content.replace(/const applyCoupon = \(code: string\)[\s\S]*?return \{ success: false, message: msg \};\n  \};/m, applyCouponLogic);

content = content.replace("import { calculateCartTotals, PROMO_COUPON_CODE, DynamicCoupon, PROMO_COUPON_EXPIRATION_DAYS, MIN_PRICE_FOR_COUPON } from '../products.ts';", "import { calculateCartTotals, DynamicCoupon } from '../products.ts';");
content = content.replace("import { calculateCartTotals, PROMO_COUPON_CODE, DynamicCoupon } from '../products.ts';", "import { calculateCartTotals, DynamicCoupon } from '../products.ts';");


fs.writeFileSync('src/context/CartContext.tsx', content);
console.log("CartContext updated");
