const fs = require('fs');
let detail = fs.readFileSync('src/components/ProductDetailPage.tsx', 'utf8');

const targetStr = `                  </div>

                  {/* Botón Guía de instalación`;

const replacementStr = `                  </div>

                  {/* Scarcity & Trust Indicators */}
                  <div className="flex flex-col gap-3 my-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                      ¡Date prisa! Quedan solo 3 licencias a este precio.
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span>Garantía de Activación</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span>Entrega Inmediata al Email</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span>Soporte Remoto Gratuito</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                        <span>Pago Seguro y Encriptado</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón Guía de instalación`;

detail = detail.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/ProductDetailPage.tsx', detail);
console.log("Detail page updated with trust badges");
