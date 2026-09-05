const fs = require('fs');

// 1. Hero.tsx
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');
hero = hero.replace("🔥 10% OFF llevando 2 o más • Cupón 10% (desde S/ 40.00): PRIMUPCLIC", "🔥 10% OFF automático llevando 2 o más productos");
fs.writeFileSync('src/components/Hero.tsx', hero);

// 2. ProductDetailPage.tsx
let pdp = fs.readFileSync('src/components/ProductDetailPage.tsx', 'utf8');
pdp = pdp.replace(`¡Lleva 2 o más productos y obtén <span className="text-emerald-700 underline font-black">10% de descuento</span>! O usa el cupón <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-[#0066FF] font-mono">PRIMUPCLIC</code> para 10% de descuento (en productos desde S/ 40.00).`, `¡Lleva 2 o más productos y obtén <span className="text-emerald-700 underline font-black">10% de descuento</span> automáticamente en todo tu carrito!`);
fs.writeFileSync('src/components/ProductDetailPage.tsx', pdp);

// 3. HelpModal.tsx
let help = fs.readFileSync('src/components/HelpModal.tsx', 'utf8');
help = help.replace(`<p>• <strong className="text-[#0066FF]">Cupón PRIMUPCLIC:</strong> 10% de descuento en productos con precio desde S/ 40.00.</p>`, ``);
fs.writeFileSync('src/components/HelpModal.tsx', help);

// 4. LiveNotifications.tsx
let livenotif = fs.readFileSync('src/components/LiveNotifications.tsx', 'utf8');
livenotif = livenotif.replace("message: `Lleva ${product.name} con 10% adicional usando el cupón PRIMUPCLIC.`", "message: `Lleva ${product.name} con un 10% de descuento al agregar otro producto a tu carrito.`");
fs.writeFileSync('src/components/LiveNotifications.tsx', livenotif);

console.log("Components updated");
