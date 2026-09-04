import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext.tsx';
import {
  MERCADO_PAGO_URL,
  PROMO_COUPON_CODE,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY
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
  Minus,
  Loader2,
  Mail,
  User,
  Phone,
  RefreshCw
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
    clearCart,
    navigateToHome
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Customer contact state for digital delivery and notification
  const [customerEmail, setCustomerEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('upclic_customer_email') || '';
    } catch {
      return '';
    }
  });

  const [customerName, setCustomerName] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('upclic_customer_name') || '';
    } catch {
      return '';
    }
  });

  const [customerPhone, setCustomerPhone] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('upclic_customer_phone') || '';
    } catch {
      return '';
    }
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleEmailChange = (val: string) => {
    setCustomerEmail(val);
    try {
      localStorage.setItem('upclic_customer_email', val);
    } catch {}
    if (emailTouched) {
      if (!val.trim()) {
        setEmailError('El correo electrónico es obligatorio para enviarte tu licencia.');
      } else if (!isValidEmail(val)) {
        setEmailError('Ingresa un formato de correo válido (ej: cliente@gmail.com).');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    try {
      localStorage.setItem('upclic_customer_name', val);
    } catch {}
  };

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    try {
      localStorage.setItem('upclic_customer_phone', val);
    } catch {}
  };

  // Check URL params for Mercado Pago return (success, approved, payment_id)
  const [paymentResult, setPaymentResult] = useState<{
    isSuccess: boolean;
    paymentId?: string | null;
    status?: string | null;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash || '';
      const hashParams = hash.includes('?') ? new URLSearchParams(hash.substring(hash.indexOf('?'))) : null;

      const status = searchParams.get('status') || searchParams.get('collection_status') || hashParams?.get('status') || hashParams?.get('collection_status');
      const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id') || hashParams?.get('payment_id') || hashParams?.get('collection_id');

      if (status === 'success' || status === 'approved' || searchParams.get('collection_status') === 'approved') {
        return { isSuccess: true, paymentId, status };
      }
    } catch (e) {
      console.error('Error parsing payment status:', e);
    }
    return null;
  });

  const hasConfirmedPaymentRef = useRef(false);

  // Retrieve last order details saved before redirecting to Mercado Pago
  const lastOrderSnapshot = (() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('upclic_last_order');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();

  const paidOrderItems = (lastOrderSnapshot?.items && lastOrderSnapshot.items.length > 0)
    ? lastOrderSnapshot.items
    : items;
  const paidCoupon = lastOrderSnapshot?.appliedCoupon || appliedCoupon;
  const paidTotal = lastOrderSnapshot?.total ?? total;
  const paidCustomerEmail = lastOrderSnapshot?.customerEmail || customerEmail;
  const paidCustomerName = lastOrderSnapshot?.customerName || customerName;
  const paidCustomerPhone = lastOrderSnapshot?.customerPhone || customerPhone;

  // On payment success: clear cart and dispatch confirmation email with 10-30 min delivery message
  useEffect(() => {
    if (!paymentResult?.isSuccess || hasConfirmedPaymentRef.current) return;
    hasConfirmedPaymentRef.current = true;

    // Clear cart
    clearCart();

    const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
      (typeof window !== 'undefined' && (window.location.hostname === 'upclic.store' || window.location.hostname.endsWith('github.io'))
        ? 'https://upclic12-rypnq.sevalla.app'
        : '');

    // Notify backend to record payment and send purchase confirmation email to customer & admin
    fetch(`${apiBase}/api/confirm_payment_success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: lastOrderSnapshot?.orderId,
        paymentId: paymentResult?.paymentId,
        customerEmail: paidCustomerEmail,
        customerName: paidCustomerName,
        customerPhone: paidCustomerPhone,
        items: paidOrderItems,
        total: paidTotal,
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Confirmación de compra procesada y correo despachado:', data);
      })
      .catch(err => {
        console.error('Error al registrar confirmación de pago:', err);
      });
  }, [paymentResult?.isSuccess, paidCustomerEmail, paidCustomerName, paidCustomerPhone, paidOrderItems, paidTotal, lastOrderSnapshot?.orderId, paymentResult?.paymentId, clearCart]);

  const handleMercadoPago = async () => {
    if (items.length === 0) return;
    setEmailTouched(true);
    setPaymentError(null);

    const trimmedEmail = customerEmail.trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setEmailError('Por favor ingresa tu correo electrónico para que podamos enviarte tu licencia y registrar tu pedido.');
      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailInputRef.current?.focus();
      return;
    }
    
    try {
      setIsCreatingPreference(true);

      // Save order snapshot in localStorage so when the user returns after paying, we have full details
      try {
        localStorage.setItem('upclic_last_order', JSON.stringify({
          items: items.map(it => ({
            product: it.product,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            variantName: it.variantName
          })),
          appliedCoupon,
          total,
          discountAmount,
          discountReason,
          customerEmail: trimmedEmail,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Error saving last order to localStorage', e);
      }

      const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
        (typeof window !== 'undefined' && (window.location.hostname === 'upclic.store' || window.location.hostname.endsWith('github.io'))
          ? 'https://upclic12-rypnq.sevalla.app'
          : '');

      const response = await fetch(`${apiBase}/api/create_preference`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items,
          discountAmount,
          discountReason,
          total,
          customerEmail: trimmedEmail,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim()
        })
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (text.toLowerCase().includes('502 bad gateway') || response.status === 502) {
          throw new Error('El servidor de Sevalla está temporalmente apagado (502 Bad Gateway). Por favor revisa los Logs en Sevalla o coordina tu compra por WhatsApp.');
        }
        if (text.toLowerCase().includes('<!html') || text.toLowerCase().includes('<html')) {
          throw new Error('El servidor devolvió una página HTML en lugar de JSON. Por favor revisa los Logs en Sevalla o coordina tu compra directamente por WhatsApp.');
        }
        throw new Error('El servidor devolvió una respuesta no válida al crear la preferencia de pago.');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar con Mercado Pago');
      }
      
      if (data.init_point) {
        if (data.orderId) {
          try {
            const rawStored = localStorage.getItem('upclic_last_order');
            const stored = rawStored ? JSON.parse(rawStored) : {};
            stored.orderId = data.orderId;
            stored.paymentUrl = data.init_point;
            localStorage.setItem('upclic_last_order', JSON.stringify(stored));
          } catch (e) {
            console.error('Error actualizando orderId en localStorage', e);
          }
        }
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

  if (paymentResult?.isSuccess) {
    const contactWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20mi%20pago%20fue%20aprobado%20para%20el%20pedido%20${encodeURIComponent(lastOrderSnapshot?.orderId || paymentResult.paymentId || 'UpClic')}.%20Deseo%20soporte%20con%20mi%20compra.`;

    return (
      <div id="checkout-success-view" className="py-12 sm:py-16 bg-slate-50/80 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-emerald-100 shadow-xl p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Top decorative gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100/80 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pago Aprobado con Mercado Pago
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ¡Pago Realizado con Éxito!
          </h1>

          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
            Hemos verificado tu transacción con Mercado Pago. Te enviamos la confirmación oficial de tu compra a tu correo electrónico{paidCustomerEmail ? `: ` : '.'}
            {paidCustomerEmail && <strong className="text-slate-900 break-all">{paidCustomerEmail}</strong>}
          </p>

          {/* License delivery notice within 10 to 30 minutes */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-left flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">Entrega de tu licencia digital:</h4>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                <strong>Tu licencia será enviada a tu correo dentro de 10 a 30 minutos.</strong> Nuestro equipo técnico está validando tu clave de producto y preparando tu comprobante y enlaces oficiales de descarga de Microsoft.
              </p>
            </div>
          </div>

          {/* Order summary box */}
          <div className="mt-6 text-left rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
              <span>ESTADO DEL PEDIDO</span>
              <span className="font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] tracking-wide">
                PAGADO Y CONFIRMADO
              </span>
            </div>

            {lastOrderSnapshot?.orderId && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>N° DE PEDIDO</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {lastOrderSnapshot.orderId}
                </span>
              </div>
            )}

            {paidCustomerEmail && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>CORREO DE ENTREGA</span>
                <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 break-all text-[11px]">
                  {paidCustomerEmail}
                </span>
              </div>
            )}

            {paidCustomerName && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>TITULAR</span>
                <span className="font-bold text-slate-800 text-xs">
                  {paidCustomerName}
                </span>
              </div>
            )}

            {paymentResult.paymentId && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>N° DE TRANSACCIÓN MP</span>
                <span className="font-mono font-bold text-slate-700">
                  #{paymentResult.paymentId}
                </span>
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Productos comprados:</span>
              {paidOrderItems.map((item: any, idx: number) => {
                const name = item.product?.name || item.name || 'Licencia Microsoft';
                const price = Number(item.unitPrice ?? item.product?.price ?? item.price ?? 0);
                const qty = Number(item.quantity) || 1;
                return (
                  <div key={idx} className="flex justify-between items-center text-xs text-slate-700 font-medium">
                    <span className="truncate pr-2">• {name} {item.variantName ? `(${item.variantName})` : ''} x{qty}</span>
                    <span className="shrink-0 font-bold">S/ {(price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Pagado:</span>
              <span className="text-emerald-700 font-black text-base">S/ {paidTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Direct action buttons */}
          <div className="mt-6 space-y-3">
            <a
              href={contactWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Contactar soporte</span>
            </a>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.search = '';
                  window.history.replaceState({}, '', url.pathname);
                }
                navigateToHome();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la tienda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Col 1: Detalle de Productos en el Carrito (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h2 className="text-lg font-black text-[#0f172a] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <span>Productos en tu Pedido</span>
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  {totalQuantity} {totalQuantity === 1 ? 'licencia' : 'licencias'}
                </span>
              </div>

              {/* Products list */}
              <div className="divide-y divide-slate-100 mb-6 pr-1">
                {items.map(item => {
                  const itemUnitPrice = item.unitPrice ?? item.product.price;
                  const itemKey = item.id || (item.selectedVariant ? `${item.product.id}-${item.selectedVariant}` : item.product.id);
                  const displayVariantName = item.variantName || (
                    item.selectedVariant === 'oem' ? 'Clave tipo OEM' :
                    item.selectedVariant === 'retail' ? 'Clave Retail' : undefined
                  );
                  return (
                    <div key={itemKey} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-slate-50/90 p-1.5 border border-slate-200/80 shrink-0 flex items-center justify-center shadow-2xs">
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
                          <div className="font-bold text-slate-900 text-sm truncate" title={item.product.name}>
                            {item.product.name}
                          </div>
                          {displayVariantName && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] border border-blue-200">
                              {displayVariantName}
                            </span>
                          )}
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Precio unitario: <strong className="text-slate-800">S/ {itemUnitPrice.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemKey, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-bold"
                            aria-label="Disminuir cantidad"
                            title={item.quantity === 1 ? 'Eliminar del carrito' : 'Disminuir'}
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
                            className="w-9 text-center text-xs font-bold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0066FF] rounded py-0.5 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Editar cantidad"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemKey, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-bold"
                            aria-label="Aumentar cantidad"
                            title="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-black text-slate-900 shrink-0 tabular-nums text-sm min-w-[75px] text-right">
                          S/ {(itemUnitPrice * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(itemKey)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Eliminar producto"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon input on Checkout */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0066FF]" />
                    ¿Tienes un cupón de descuento?
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
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono font-bold text-xs text-emerald-900">
                        {appliedCoupon}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {isMultiItemDiscount ? '(10% aplicado por 2+ productos)' : '(10% de descuento aplicado)'}
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
                      className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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
            </div>

            {/* 2. Datos del Cliente para la Entrega Digital */}
            <div id="customer-delivery-card" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 border border-blue-100/80">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>DATOS DE ENTREGA DIGITAL</span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 tracking-wider">
                        Requerido
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ingresa tu correo para enviarte de inmediato tu clave de activación oficial, comprobante y guía.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email field (Mandatory) */}
              <div className="space-y-1.5">
                <label htmlFor="customer-email-input" className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0066FF]" />
                    Correo electrónico del cliente <span className="text-red-500 font-black">*</span>
                  </span>
                  {customerEmail && isValidEmail(customerEmail) && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correo verificado para entrega
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    id="customer-email-input"
                    type="email"
                    autoComplete="email"
                    value={customerEmail}
                    onChange={e => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setEmailTouched(true);
                      if (!customerEmail.trim()) {
                        setEmailError('El correo electrónico es obligatorio para recibir tu licencia digital.');
                      } else if (!isValidEmail(customerEmail)) {
                        setEmailError('Por favor ingresa un correo válido (ej: nombre@gmail.com).');
                      } else {
                        setEmailError(null);
                      }
                    }}
                    placeholder="ejemplo: tu-correo@gmail.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border font-medium transition-all focus:outline-none ${
                      emailError
                        ? 'border-red-300 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400 focus:border-red-400'
                        : customerEmail && isValidEmail(customerEmail)
                        ? 'border-emerald-300 bg-emerald-50/20 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400'
                        : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                {emailError ? (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-normal">
                    ⚡ <strong>Entrega digital inmediata:</strong> A este correo te enviaremos la clave oficial original de 25 caracteres y el enlace oficial de Microsoft.
                  </p>
                )}
              </div>

              {/* Optional Name and Phone in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label htmlFor="customer-name-input" className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Nombre o Razón Social <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-name-input"
                      type="text"
                      autoComplete="name"
                      value={customerName}
                      onChange={e => handleNameChange(e.target.value)}
                      placeholder="ej: Juan Pérez o Empresa SAC"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">Para personalizar tu comprobante de compra</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="customer-phone-input" className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Teléfono / WhatsApp <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-phone-input"
                      type="tel"
                      autoComplete="tel"
                      value={customerPhone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="ej: 987 654 321"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">Para darte soporte directo en la activación</p>
                </div>
              </div>

              {/* Flow notice on Mercado Pago registration */}
              <div className="pt-3 border-t border-slate-100 flex items-start sm:items-center gap-2.5 text-xs text-slate-500">
                <Mail className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">
                  Al hacer clic en <strong>Pagar con Mercado Pago</strong>, tu pedido se registrará y recibirás un correo con el botón para concluir tu pago en cualquier momento.
                </span>
              </div>

              {/* Privacy note */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  <strong>Privacidad y entrega garantizada:</strong> Tus datos están protegidos y se usan exclusivamente para asignarte tus licencias de software y emitir tu comprobante.
                </span>
              </div>
            </div>

            {/* Garantías de UpClic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Licencias 100% Originales</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Activación permanente garantizada</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Entrega Inmediata</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Envío digital con guía paso a paso</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Soporte Técnico</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Asistencia remota personalizada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Resumen de Compra & Payment Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 sticky top-24">
              <h2 className="text-base font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>RESUMEN DE PAGO</span>
                <span className="text-xs font-bold text-slate-400">
                  Total a pagar
                </span>
              </h2>

              {/* Subtotal & Discount breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
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
                    (Lleva 2 o más productos para 10% de descuento automático)
                  </div>
                )}

                <div className="flex justify-between items-baseline text-base font-black text-slate-950 pt-3 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span className="text-[#0066FF] text-2xl font-black tabular-nums">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Email status card */}
              <div className="mt-5">
                {customerEmail && isValidEmail(customerEmail) ? (
                  <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                          Entrega digital para:
                        </span>
                        <span className="font-bold text-xs truncate block text-emerald-950 font-mono">
                          {customerEmail}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        emailInputRef.current?.focus();
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 ml-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      Editar
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      emailInputRef.current?.focus();
                    }}
                    className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-950 cursor-pointer hover:bg-blue-100/70 transition-colors shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-blue-950">
                        Ingresa tu correo para continuar
                      </span>
                      <span className="block text-[11px] text-blue-700 leading-tight">
                        Necesario para enviarte tus licencias y comprobante
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action 1: Pagar con Mercado Pago */}
              <div className="mt-4 space-y-3">
                {emailError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Dato obligatorio requerido:</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed">{emailError}</p>
                    </div>
                  </div>
                )}

                {paymentError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Error al procesar el pago:</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed">{paymentError}</p>
                      <p className="mt-1 text-[10px] text-red-600 font-medium">
                        Si el problema persiste, puedes comunicarte con nuestro equipo de soporte.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  id="mercado-pago-pay-btn"
                  onClick={handleMercadoPago}
                  disabled={isCreatingPreference}
                  className="w-full py-4 px-4 rounded-2xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-sky-400/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>{isCreatingPreference ? 'Conectando con Mercado Pago...' : 'Pagar con Mercado Pago'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </button>
              </div>

              {/* Delivery info clarification */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Entrega digital y garantía oficial:</span>
                </p>
                <p className="leading-relaxed">
                  • <strong>Mercado Pago:</strong> Procesa tu pago seguro con tarjeta (crédito/débito), Yape o efectivo. Se emite tu comprobante de inmediato.
                </p>
                <p className="leading-relaxed">
                  • <strong>Entrega a tu correo:</strong> Tu licencia de software y guía de activación se enviarán a tu correo dentro de 10 a 30 minutos.
                </p>
              </div>

              {/* Security guarantee footnote */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pasarela 100% segura (Tarjetas, Yape, PagoEfectivo)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Entrega de tu licencia a tu correo en 10 a 30 minutos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
