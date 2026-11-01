import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../products';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotals,
    goToCheckout,
    couponCode,
    applyCoupon,
    removeCoupon,
    formatPrice
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    setCouponFeedback({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const whatsappCartMessage = () => {
    const lines = items.map(
      (i) =>
        `• ${i.quantity}x ${i.product.name}${i.variantName ? ` (${i.variantName})` : ''} - ${formatPrice(
          (i.unitPrice ?? i.product.price) * i.quantity
        )}`
    );
    return `Hola UPCLIC, tengo una consulta sobre mi carrito de compras:\n\n${lines.join(
      '\n'
    )}\n\n*Total estimado: ${formatPrice(cartTotals.total)}*`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 bg-[#0B1F3A] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1668E3] flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base leading-tight">Tu Carrito de Compras</h2>
                <p className="text-xs text-slate-300">
                  {cartTotals.totalQuantity}{' '}
                  {cartTotals.totalQuantity === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#0B1F3A] mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                  Explora nuestro catálogo de Microsoft Office, Windows, Diseño, IA y Streaming para agregar productos.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1668E3] hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemKey = item.id || item.product.id;
                const unitPrice = item.unitPrice ?? item.product.price;
                return (
                  <div key={itemKey} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (item.product.fallbackImage && target.src !== item.product.fallbackImage) {
                            target.src = item.product.fallbackImage;
                          }
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0B1F3A] leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(itemKey)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer shrink-0"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variantName && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#1668E3] bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.variantName}
                        </span>
                      )}

                      <p className="text-[11px] text-slate-500 mt-0.5">{item.product.duration}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="p-1.5 text-slate-600 hover:text-[#0B1F3A] cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#0B1F3A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="p-1.5 text-slate-600 hover:text-[#0B1F3A] cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#0B1F3A]">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Totals & Actions */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              {/* Coupon Box */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cupón {couponCode} activo</span>
                    </div>
                    <button
                      onClick={() => {
                        removeCoupon();
                        setCouponFeedback(null);
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Código de cupón (opcional)"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Subtotals & Total */}
              <div className="space-y-1.5 text-xs border-t border-slate-200/80 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(cartTotals.subtotal)}</span>
                </div>
                {cartTotals.hasDiscount && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Descuento ({cartTotals.discountReason}):</span>
                    <span>- {formatPrice(cartTotals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-extrabold text-[#0B1F3A] pt-1">
                  <span>Total a pagar:</span>
                  <span className="text-xl">{formatPrice(cartTotals.total)}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-2">
                <button
                  onClick={goToCheckout}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continuar al Pago Seguro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1668E3] shrink-0" />
                <span>Pagos con Mercado Pago (Yape, Tarjeta y PagoEfectivo)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
