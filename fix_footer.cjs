const fs = require('fs');

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// The block to remove:
// <span className="text-slate-700">•</span>
// <button
//   onClick={onOpenAdminOrders}
//   className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
// >
//   <span>📋 Panel de Pedidos & Notificaciones</span>
// </button>

const search = `<span className="text-slate-700">•</span>
                <button
                  onClick={onOpenAdminOrders}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  <span>📋 Panel de Pedidos & Notificaciones</span>
                </button>`;

footer = footer.replace(search, "");

fs.writeFileSync('src/components/Footer.tsx', footer);
console.log("Footer fixed");
