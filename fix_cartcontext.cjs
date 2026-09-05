const fs = require('fs');
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

// 1. Add DynamicCoupon import
content = content.replace(
  "import { calculateCartTotals, PROMO_COUPON_CODE",
  "import { calculateCartTotals, PROMO_COUPON_CODE, DynamicCoupon"
);

// 2. Add dynamicCoupon state
const stateReplacement = `const [appliedCoupon, setAppliedCoupon] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [dynamicCoupon, setDynamicCoupon] = useState<DynamicCoupon | null>(() => {
    try {
      const saved = localStorage.getItem('upclic_dynamic_coupon');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem('upclic_dynamic_coupon');
        }
      }
    } catch(e) {}
    return null;
  });

  // Dynamic Coupon generation logic
  useEffect(() => {
    if (items.length > 0 && !dynamicCoupon) {
      const timer = setTimeout(() => {
        // Only if they haven't applied a better multi-item discount
        const qty = items.reduce((sum, item) => sum + item.quantity, 0);
        if (qty < 2) {
          const discountPercent = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, or 6
          const code = \`FLASH\${Math.floor(Math.random() * 1000)}X\`;
          const expiresAt = Date.now() + 30 * 60 * 1000;
          const newCoupon = { code, discountPercent, expiresAt };
          
          setDynamicCoupon(newCoupon);
          localStorage.setItem('upclic_dynamic_coupon', JSON.stringify(newCoupon));
          
          addToast({
            type: 'discount',
            title: '🎁 Cupón Especial Activo',
            message: \`¡Usa el código \${code} en tu carrito y obtén \${discountPercent}% extra! Válido por 30 min.\`
          });
        }
      }, 20000); // 20 seconds after having an item in cart
      
      return () => clearTimeout(timer);
    }
  }, [items, dynamicCoupon]);`;

content = content.replace(/const \[appliedCoupon, setAppliedCoupon\] = useState<string>\([\s\S]*?\n  \}\);\n/m, stateReplacement);

// 3. Update validate logic in applyCoupon
const applyLogic = `const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    
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
    
    // Fallback to PROMO_COUPON_CODE`;

content = content.replace("const applyCoupon = (code: string) => {\n    const clean = code.trim().toUpperCase();", applyLogic);

// 4. Update totals call
content = content.replace(
  "const totals: CartTotals = calculateCartTotals(items, appliedCoupon);",
  "const totals: CartTotals = calculateCartTotals(items, appliedCoupon, dynamicCoupon);"
);

fs.writeFileSync('src/context/CartContext.tsx', content);
console.log("CartContext fixed");
