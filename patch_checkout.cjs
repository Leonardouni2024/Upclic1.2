const fs = require('fs');
let code = fs.readFileSync('src/components/CheckoutPage.tsx', 'utf8');

const mpLogic = `
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);

  const handleMercadoPago = async () => {
    if (items.length === 0) return;
    
    try {
      setIsCreatingPreference(true);
      const response = await fetch('/api/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          discountAmount,
          discountReason,
          total
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar con Mercado Pago');
      }
      
      if (data.init_point) {
        // Redirect to Mercado Pago checkout
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error al iniciar pago seguro con Mercado Pago. Verifica que MERCADOPAGO_ACCESS_TOKEN esté configurado.');
    } finally {
      setIsCreatingPreference(false);
    }
  };
`;

code = code.replace(/const \[inputCoupon, setInputCoupon\] = useState\(''\);/, `const [inputCoupon, setInputCoupon] = useState('');${mpLogic}`);

const oldBtn = `<a
                  id="mercado-pago-pay-btn"
                  href={MERCADO_PAGO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-sm shadow-xs hover:shadow-md hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-sky-400/20"
                >
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>Pagar con Mercado Pago</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </a>`;

const newBtn = `<button
                  id="mercado-pago-pay-btn"
                  onClick={handleMercadoPago}
                  disabled={isCreatingPreference}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-sm shadow-xs hover:shadow-md hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-sky-400/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>{isCreatingPreference ? 'Procesando...' : 'Pagar con Mercado Pago'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </button>`;

code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/components/CheckoutPage.tsx', code);
