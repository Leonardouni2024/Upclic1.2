const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const successPage = `
    if (currentPath === '/checkout/success') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">¡Pago Exitoso!</h2>
          <p className="text-slate-600 mb-6 max-w-md">Tu pedido ha sido procesado correctamente. Recibirás tu licencia y las instrucciones por correo y WhatsApp en unos instantes.</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#0066FF] text-white rounded-xl font-bold hover:bg-[#0052cc] transition-colors">
            Volver a la tienda
          </button>
        </div>
      );
    }
`;

code = code.replace(/if \(currentPath === '\/checkout'\) \{/, successPage + '\n    if (currentPath === \'/checkout\') {');

fs.writeFileSync('src/App.tsx', code);
