import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import {
  MERCADO_PAGO_URL,
  getWhatsAppConfirmationUrl,
  buildWhatsAppMessage,
  PROMO_COUPON_CODE
} from '../products.ts';
import {
  CreditCard,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ShoppingBag,
  Clock,
  Tag,
  AlertCircle,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    totalQuantity,
    subtotal,
    hasDiscount,
    discountRate,
    discountAmount,
    total,
    discountReason,
    isMultiItemDiscount,
    isCouponApplied,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponFeedback,
    removeItem,
    updateQuantity,
    setQuantity,
    navigateToHome
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleMercadoPago = async () => {
    if (items.length === 0) return;
    setPaymentError(null);
    
    try {
      setIsCreatingPreference(true);
      const response = await fetch('/api/create_preference', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items,
          discountAmount,
          discountReason,
          total
        })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('El servidor no devolvió una respuesta JSON válida.');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar con Mercado Pago');
      }
      
      if (data.init_point) {
        const newWindow = window.open(data.init_point, '_blank');
        if (!newWindow) {
          window.location.href = data.init_point;
        }
      } else {
        throw new Error('No se obtuvo la URL de pago de Mercado Pago.');
      }
    } catch (error: any) {
      console.error("Error Mercado Pago:", error);
      setPaymentError(error.message || 'Error al iniciar pago seguro con Mercado Pago. Verifica que MERCADOPAGO_ACCESS_TOKEN esté configurado.');
    } finally {
      setIsCreatingPreference(false);
    }
  };


  useEffect(() => {
    document.title = 'Checkout y Pago | UpClic';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
    setInputCoupon('');
  };

  const whatsAppUrl = getWhatsAppConfirmationUrl(items, appliedCoupon);
  const rawMessage = buildWhatsAppMessage(items, appliedCoupon);

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">No tienes productos en el carrito</h2>
        <p className="text-sm text-slate-500 mt-2 mb-8">
          Selecciona una o más licencias Microsoft para proceder con el pago seguro.
        </p>
        <button
          onClick={navigateToHome}
          className="px-6 py-3 rounded-xl bg-[#0066FF] text-white font-bold text-sm shadow-md hover:bg-[#0052cc] transition-colors cursor-pointer"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="py-10 sm:py-14 bg-slate-50/70 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8">
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0066FF] hover:border-blue-200 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda</span>
          </button>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] bg-blue-50/90 border border-blue-100 px-3 py-1 rounded-full shadow-2xs">
            Pasarela Oficial UpClic
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight mt-2.5">
            Finalizar Compra y Pago
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Procesa tu pedido con Mercado Pago y confirma la activación inmediata
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Instrucciones de Pago "¿Cómo comprar?" (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
              <h2 className="text-xl font-black text-[#0f172a] mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <span>¿Cómo comprar?</span>
              </h2>

              <div className="space-y-3.5">
                {/* Paso 1 */}
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-[#0066FF] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0066FF]">PASO 1: Link de pago y monto</h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      Haz clic en "Pagar con Mercado Pago" para ir al link de pago seguro.
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Digita el monto exacto de tu compra y haz clic en <strong className="text-slate-800 font-bold">"Continuar"</strong>:
                    </p>
                    <div className="mt-2 inline-block px-3 py-1.5 rounded-xl bg-white border border-sky-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 mr-2">MONTO EXACTO A DIGITAR:</span>
                      <span className="text-lg font-black text-[#0066FF] tabular-nums">
                        S/ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-indigo-700">PASO 2: Opciones de pago</h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      Se abrirán las opciones de pago de tu preferencia:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-900 shadow-2xs">
                        💳 Tarjeta de crédito o débito
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-900 shadow-2xs">
                        🏦 Banca o agentes
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-900 shadow-2xs">
                        🧾 PagoEfectivo
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-900 shadow-2xs">
                        📱 Yape
                      </span>
                    </div>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-700">PASO 3: Redirección a WhatsApp y Captura</h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      Al completar el pago, serás redireccionado automáticamente al chat de WhatsApp del proveedor.
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Envía la captura de tu comprobante de pago por el chat como confirmación.
                    </p>
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="p-4 rounded-2xl bg-green-50/60 border border-green-100 flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-green-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-green-700">PASO 4: Confirmación y Entrega</h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      Espera la respuesta con tu clave digital oficial y guía de instalación.
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-green-800 bg-green-100/80 border border-green-200 px-2.5 py-1 rounded-lg w-fit">
                      <Clock className="w-3.5 h-3.5 text-green-700 shrink-0" />
                      <span>Tiempo estimado de atención: 10 a 20 minutos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Resumen de Compra & Payment Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 sticky top-24">
              <h2 className="text-base font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>RESUMEN DE COMPRA</span>
                <span className="text-xs font-bold text-slate-400">
                  {totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}
                </span>
              </h2>

              {/* Products list */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mb-4 pr-1">
                {items.map(item => {
                  const itemUnitPrice = item.unitPrice ?? item.product.price;
                  const itemKey = item.id || (item.selectedVariant ? `${item.product.id}-${item.selectedVariant}` : item.product.id);
                  const displayVariantName = item.variantName || (
                    item.selectedVariant === 'oem' ? 'Clave tipo OEM' :
                    item.selectedVariant === 'retail' ? 'Clave Retail' : undefined
                  );
                  return (
                    <div key={itemKey} className="py-3 flex flex-col gap-2 text-xs">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-50/80 p-1 border border-slate-200/80 shrink-0 flex items-center justify-center">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              onError={(e) => {
                                e.currentTarget.src = item.product.fallbackImage;
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 truncate" title={item.product.name}>
                              {item.product.name}
                            </div>
                            {displayVariantName && (
                              <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#0066FF] border border-blue-200">
                                {displayVariantName}
                              </span>
                            )}
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Unitario: S/ {itemUnitPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(itemKey)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Eliminar producto"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity Stepper & Subtotal row */}
                      <div className="flex items-center justify-between pl-12">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemKey, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-bold"
                            aria-label="Disminuir cantidad"
                            title={item.quantity === 1 ? 'Eliminar del carrito' : 'Disminuir'}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) {
                                setQuantity(itemKey, val);
                              }
                            }}
                            className="w-8 text-center text-xs font-bold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0066FF] rounded py-0.5 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Editar cantidad"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemKey, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-bold"
                            aria-label="Aumentar cantidad"
                            title="Aumentar"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="font-black text-slate-900 shrink-0 tabular-nums text-sm">
                          S/ {(itemUnitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon input on Checkout */}
              <div className="py-3 border-y border-slate-100 mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0066FF]" />
                    Código promocional
                  </span>
                  {!appliedCoupon && (
                    <button
                      type="button"
                      onClick={() => applyCoupon(PROMO_COUPON_CODE)}
                      className="text-[10px] font-bold text-[#0066FF] hover:underline cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      Usar {PROMO_COUPON_CODE} (-10%)
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono font-bold text-xs text-emerald-900">
                        {appliedCoupon}
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        {isMultiItemDiscount ? '(10% aplicado por 2+ items)' : '(10% cupón)'}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-slate-400 hover:text-red-600 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={e => setInputCoupon(e.target.value)}
                      placeholder="Ingresa código (ej: PRIMUPCLIC)"
                      className="flex-1 px-3 py-1.5 text-xs uppercase font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <div
                    className={`mt-2 text-[11px] p-2 rounded-lg flex items-start gap-1.5 ${
                      couponFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : couponFeedback.type === 'info'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {couponFeedback.type === 'error' ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{couponFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* Subtotal & Discount breakdown */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800 tabular-nums">S/ {subtotal.toFixed(2)}</span>
                </div>

                {hasDiscount ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Descuento {Math.round(discountRate * 100)}%:
                      </span>
                      <span className="tabular-nums">-S/ {discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 italic text-right">
                      {discountReason} • <span className="font-semibold">Descuentos no combinables</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic">
                    (Lleva 2 o más productos para 10% de descuento, o ingresa PRIMUPCLIC para 10% en productos desde S/ 49.90)
                  </div>
                )}

                <div className="flex justify-between items-baseline text-base font-black text-slate-950 pt-3 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span className="text-[#0066FF] text-2xl font-black tabular-nums">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action 1: Pagar con Mercado Pago */}
              <div className="mt-6 space-y-3">
                {paymentError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Error al procesar el pago:</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed">{paymentError}</p>
                      <p className="mt-1 text-[10px] text-red-600 font-medium">
                        Si el problema persiste, puedes usar el botón de WhatsApp abajo para coordinar tu pago directamente.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  id="mercado-pago-pay-btn"
                  onClick={handleMercadoPago}
                  disabled={isCreatingPreference}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-sm shadow-xs hover:shadow-md hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-sky-400/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>{isCreatingPreference ? 'Procesando...' : 'Pagar con Mercado Pago'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </button>

                {/* Action 2: Confirmar compra por WhatsApp */}
                <a
                  id="whatsapp-confirm-btn"
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xs hover:shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-green-500/20"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span>Confirmar compra por WhatsApp</span>
                </a>
              </div>

              {/* Security guarantee footnote */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Transacción 100% encriptada y protegida</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Atención inmediata y entrega rápida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
