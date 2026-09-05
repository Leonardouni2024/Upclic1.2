const fs = require('fs');
let content = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

const target = `{/* Promo Code Section */}`;
const replacement = `{/* Dynamic Coupon Banner */}
          {(() => {
            try {
              const dyn = localStorage.getItem('upclic_dynamic_coupon');
              if (dyn && !isCouponApplied && totalQuantity < 2) {
                const parsed = JSON.parse(dyn);
                if (parsed.expiresAt > Date.now()) {
                  const mins = Math.ceil((parsed.expiresAt - Date.now()) / 60000);
                  return (
                    <div className="mx-6 mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-blue-800">Tienes un cupón de {parsed.discountPercent}% OFF</p>
                        <p className="text-[10px] text-blue-600">Código: <span className="font-bold">{parsed.code}</span> (Expira en {mins} min)</p>
                      </div>
                      <button 
                        onClick={() => applyCoupon(parsed.code)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  );
                }
              }
            } catch(e) {}
            return null;
          })()}

          {/* Promo Code Section */}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CartDrawer.tsx', content);
console.log("Cart fixed");
