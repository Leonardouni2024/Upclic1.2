import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { PROMO_COUPON_CODE, MIN_PRICE_FOR_COUPON } from '../products.ts';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    setQuantity,
    clearCart,
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
    navigateToCheckout
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  // Only recommend coupon if the cart meets the requirements:
  // Not already applied, no multi-item 10% discount already active, and has at least 1 product >= S/ 40.00
  const isEligibleForCoupon =
    !appliedCoupon &&
    !isMultiItemDiscount &&
    items.some(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);

  if (!isCartOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
    setInputCoupon('');
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200/80">
          {/* Drawer Header */}
          <div className="px-5 py-4 sm:px-6 bg-white border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Mi Pedido <span className="text-slate-400 font-semibold text-sm">({totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'})</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-red-50"
                  title="Vaciar todos los productos"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                aria-label="Cerrar panel de pedido"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Promotion / Discount Status Banner */}
          {items.length > 0 && (
            <div
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b ${
                hasDiscount
                  ? isMultiItemDiscount
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50/70 text-[#0066FF] border-blue-100'
              }`}
            >
              {hasDiscount ? (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[12px] leading-tight">
                      {isMultiItemDiscount
                        ? '¡10% de descuento aplicado por llevar 2 o más productos!'
                        : '¡10% de descuento aplicado con cupón PRIMUPCLIC!'}
                    </div>
                    <div className="text-[10px] font-normal text-slate-600 mt-0.5">
                      {discountReason} • <span className="font-semibold">Descuentos no combinables</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-[11px] leading-tight">
                    <span className="font-extrabold">Lleva 2 o más productos para 10% OFF</span>
                    <span className="block text-[10px] text-slate-500 font-normal">O cupón para 10% OFF (en productos desde S/ 40.00)</span>
                  </div>
                  <span className="font-black text-[10px] bg-white px-2 py-0.5 rounded-full border border-blue-200 text-[#0066FF] uppercase shrink-0">
                    Hasta 10% OFF
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Explora nuestro catálogo de licencias Microsoft Office, Windows, Project, Visio y Combos con entrega inmediata.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052cc] shadow-xs hover:shadow-md transition-all cursor-pointer border border-blue-500/20"
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              items.map(item => {
                const itemUnitPrice = item.unitPrice ?? item.product.price;
                const itemSubtotal = itemUnitPrice * item.quantity;
                const itemKey = item.id || (item.selectedVariant ? `${item.product.id}-${item.selectedVariant}` : item.product.id);
                const displayVariantName = item.variantName || (
                  item.selectedVariant === 'oem' ? 'Clave tipo OEM' :
                  item.selectedVariant === 'retail' ? 'Clave Retail' : undefined
                );
                return (
                  <div key={itemKey} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-start">
                    {/* 1:1 Image */}
                    <div className="w-16 h-16 rounded-xl bg-slate-50/80 border border-slate-200/80 p-1.5 shrink-0 flex items-center justify-center mt-0.5">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        onError={(e) => {
                          e.currentTarget.src = item.product.fallbackImage;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          {displayVariantName && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0066FF] border border-blue-200">
                              {displayVariantName}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(itemKey)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Eliminar producto"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Unitario: S/ {itemUnitPrice.toFixed(2)} · {item.product.duration}
                      </div>

                      {/* Quantity & Price Row */}
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        {/* Editable Stepper */}
                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemKey, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-bold active:scale-95"
                            aria-label="Disminuir cantidad"
                            title={item.quantity === 1 ? 'Eliminar del carrito' : 'Disminuir cantidad'}
                          >
                            <Minus className="w-3 h-3" />
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
                            className="w-10 text-center text-xs font-bold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0066FF] rounded py-0.5 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Editar cantidad"
                            title="Haz clic para escribir o editar la cantidad"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemKey, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-bold active:scale-95"
                            aria-label="Aumentar cantidad"
                            title="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-normal leading-none mb-0.5">Subtotal</span>
                          <span className="font-black text-sm text-slate-900 tabular-nums">
                            S/ {itemSubtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action footer for item */}
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-slate-400">
                          (Clic para editar cantidad)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.variantId)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Promo Code, Totals and Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200/80">
              {/* Dynamic Coupon Banner */}
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

          {/* Promo Code Section */}
              <div className="mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0066FF]" />
                    ¿Tienes un cupón promocional?
                  </span>
                  {isEligibleForCoupon && (
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
                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-mono font-black text-xs text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                          {appliedCoupon}
                        </span>
                        <span className="text-[11px] text-emerald-700 ml-1.5 font-medium">
                          {isMultiItemDiscount ? 'Activo (Aplica 10% por 2+ items)' : '10% descuento cupón'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-slate-400 hover:text-red-600 font-bold p-1 cursor-pointer"
                      title="Quitar cupón"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      id="promo-code-input-drawer"
                      type="text"
                      value={inputCoupon}
                      onChange={e => setInputCoupon(e.target.value)}
                      placeholder="Ingresa tu cupón"
                      className="flex-1 px-3 py-1.5 text-xs uppercase font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {/* Feedback message */}
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

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs font-medium text-slate-600 mb-4">
                <div className="flex justify-between items-baseline py-0.5">
                  <span className="font-semibold text-slate-600">Subtotal:</span>
                  <span className="font-bold text-slate-800 tabular-nums text-sm">S/ {subtotal.toFixed(2)}</span>
                </div>

                {hasDiscount && (
                  <div className="space-y-1 my-1">
                    <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
                      <span className="flex items-center gap-1 text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        Descuento {Math.round(discountRate * 100)}%:
                      </span>
                      <span className="tabular-nums font-black text-sm">-S/ {discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 italic text-right">
                      * Descuentos no combinables
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-baseline text-base font-black text-slate-950 pt-2.5 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span className="text-[#0066FF] text-xl tabular-nums font-black">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-go-to-checkout-btn"
                onClick={navigateToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-blue-500/20"
              >
                <span>Proceder al pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <button
                  onClick={clearCart}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Vaciar carrito
                </button>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Garantía oficial por 1 año
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
