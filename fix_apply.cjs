const fs = require('fs');
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

// Find the start and end of applyCoupon function
const startIdx = content.indexOf('const applyCoupon = (code: string): { success: boolean; message: string } => {');
const nextFnIdx = content.indexOf('const removeCoupon = () => {');

const newApplyCoupon = `const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      const msg = 'Por favor ingresa un código promocional.';
      setCouponFeedback({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
    
    // Check if it's the dynamic coupon
    if (dynamicCoupon && clean === dynamicCoupon.code.toUpperCase()) {
      if (dynamicCoupon.expiresAt > Date.now()) {
        setAppliedCoupon(clean);
        try {
          localStorage.setItem(COUPON_STORAGE_KEY, clean);
        } catch {}
        
        const msg = \`¡Cupón de \${dynamicCoupon.discountPercent}% aplicado correctamente!\`;
        setCouponFeedback({ type: 'success', message: msg });
        addToast({ type: 'discount', title: '🎉 ¡Cupón aplicado!', message: msg });
        return { success: true, message: msg };
      } else {
        const msg = 'El cupón especial ha expirado.';
        setCouponFeedback({ type: 'error', message: msg });
        return { success: false, message: msg };
      }
    }
    
    const msg = \`El código "\${code}" no es válido o ha expirado.\`;
    setCouponFeedback({ type: 'error', message: msg });
    return { success: false, message: msg };
  };

  `;

content = content.substring(0, startIdx) + newApplyCoupon + content.substring(nextFnIdx);

fs.writeFileSync('src/context/CartContext.tsx', content);
console.log("CartContext applyCoupon fixed");
