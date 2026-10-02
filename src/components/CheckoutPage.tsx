import { formatPrice } from '../products.ts';
import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext.tsx';
import {
  MERCADO_PAGO_URL,

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
  RefreshCw,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  Tv,
  Key,
  Zap
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
    addItem,
    clearCart,
    navigateToHome,
    navigateToPayPal,
    t,
    language,
    getProductName,
    exchangeRate
 } = useCart();

  const isEn = language === 'EN';
  const penRate = exchangeRate || 3.75;
  const totalUSD = (total / penRate).toFixed(2);

  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'mercadopago' | 'paypal'>('mercadopago');
  const [inputCoupon, setInputCoupon] = useState('');

  // Check if any product in cart strictly requires Mercado Pago (Crunchyroll and Amazon Prime Video)
  const hasOnlyMercadoPagoItem = items.some(it => {
    const slug = (it.product?.slug || it.product?.id || (it as any).slug || (it as any).id || '').toLowerCase();
    const name = (it.product?.name || (it as any).name || '').toLowerCase();
    return (
      slug.includes('prime') ||
      slug.includes('crunchy') ||
      name.includes('prime') ||
      name.includes('crunchy') ||
      Boolean(it.product?.acceptedPaymentGateways && !it.product.acceptedPaymentGateways.includes('paypal'))
    );
  });

  useEffect(() => {
    if (hasOnlyMercadoPagoItem && selectedPaymentGateway !== 'mercadopago') {
      setSelectedPaymentGateway('mercadopago');
    }
  }, [hasOnlyMercadoPagoItem, selectedPaymentGateway]);

  // Delivered immediate credentials state (from server confirmation or stored order)
  const [deliveredCredentials, setDeliveredCredentials] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('upclic_last_credentials');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, fieldId: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (e) {
      console.error('Error copying text:', e);
    }
  };

  const toggleShowPassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Only recommend coupon if the cart meets the requirements:
  // Not already applied, no multi-item 10% discount already active, and has at least 1 product >= S/ 40.00
  const isEligibleForCoupon =
    !appliedCoupon &&
    !isMultiItemDiscount &&
    true;

  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Check if PayPal is allowed for current cart
  const isPayPalAllowed = !hasOnlyMercadoPagoItem && items.length > 0;

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

      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

      if (status === 'success' || status === 'approved' || searchParams.get('collection_status') === 'approved' || pathname.includes('/checkout/success')) {
        return { isSuccess: true, paymentId, status: status || 'approved' };
      }
    } catch (e) {
      console.error('Error parsing payment status:', e);
    }
    return null;
  });

  const [returnNotice, setReturnNotice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash || '';
      const hashParams = hash.includes('?') ? new URLSearchParams(hash.substring(hash.indexOf('?'))) : null;
      const status = searchParams.get('status') || searchParams.get('collection_status') || hashParams?.get('status');

      if (status === 'return' || status === 'failure' || status === 'null' || searchParams.get('cart') === 'open') {
        return true;
      }
    } catch {}
    return false;
  });

  const hasConfirmedPaymentRef = useRef(false);
  const isCreatingPreferenceRef = useRef(false);

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
        if (data?.deliveredCredentials && Array.isArray(data.deliveredCredentials) && data.deliveredCredentials.length > 0) {
          setDeliveredCredentials(data.deliveredCredentials);
          try {
            localStorage.setItem('upclic_last_credentials', JSON.stringify(data.deliveredCredentials));
          } catch {}
        }
      })
      .catch(err => {
        console.error('Error al registrar confirmación de pago:', err);
      });
  }, [paymentResult?.isSuccess, paidCustomerEmail, paidCustomerName, paidCustomerPhone, paidOrderItems, paidTotal, lastOrderSnapshot?.orderId, paymentResult?.paymentId, clearCart]);

  // Lookup order credentials if not already loaded and payment is successful
  useEffect(() => {
    if (!paymentResult?.isSuccess || deliveredCredentials.length > 0) return;
    const orderId = lastOrderSnapshot?.orderId || paymentResult.paymentId;
    if (!orderId) return;

    const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
      (typeof window !== 'undefined' && (window.location.hostname === 'upclic.store' || window.location.hostname.endsWith('github.io'))
        ? 'https://upclic12-rypnq.sevalla.app'
        : '');

    const timer = setTimeout(() => {
      fetch(`${apiBase}/api/orders/lookup?id=${encodeURIComponent(orderId)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.success && data.orders?.[0]?.deliveredCredentials?.length > 0) {
            setDeliveredCredentials(data.orders[0].deliveredCredentials);
            try {
              localStorage.setItem('upclic_last_credentials', JSON.stringify(data.orders[0].deliveredCredentials));
            } catch {}
          }
        })
        .catch(() => {});
    }, 1200);

    return () => clearTimeout(timer);
  }, [paymentResult?.isSuccess, deliveredCredentials.length, lastOrderSnapshot?.orderId, paymentResult?.paymentId]);

  const handleMercadoPago = async () => {
    if (items.length === 0 || isCreatingPreferenceRef.current) return;
    setEmailTouched(true);
    setPaymentError(null);

    const trimmedEmail = customerEmail.trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setEmailError('Por favor ingresa tu correo electrónico para que podamos enviarte tu licencia y registrar tu pedido.');
      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailInputRef.current?.focus();
      return;
    }

    // Pre-open window synchronously in direct click handler to prevent browser popup blockers
    let popupWindow: Window | null = null;
    const isStandalone = typeof window !== 'undefined' && window.top === window;

    if (!isStandalone) {
      try {
        popupWindow = window.open('about:blank', '_blank');
      } catch {}
    }
    
    try {
      isCreatingPreferenceRef.current = true;
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
          origin: typeof window !== 'undefined' && window.location.origin.startsWith('https://') ? window.location.origin : 'https://upclic.store',
          returnUrl: typeof window !== 'undefined' && window.location.origin.startsWith('https://') ? `${window.location.origin}/checkout?status=return&cart=open` : 'https://upclic.store/checkout?status=return&cart=open',
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

        // Standalone window (production store on desktop / mobile): redirect directly to Mercado Pago
        if (isStandalone) {
          window.location.href = data.init_point;
          return;
        }

        let windowOpened = false;

        // 1. Inside iframe / preview: navigate pre-opened popup window
        if (popupWindow && !popupWindow.closed) {
          try {
            popupWindow.location.href = data.init_point;
            popupWindow.focus();
            windowOpened = true;
          } catch (e) {
            console.warn('Could not redirect pre-opened popup:', e);
          }
        }

        // 2. Fallback: try window.open
        if (!windowOpened) {
          try {
            const openedWin = window.open(data.init_point, '_blank', 'noopener,noreferrer');
            if (openedWin) {
              openedWin.focus();
              windowOpened = true;
            }
          } catch (e) {
            console.warn('Could not window.open:', e);
          }
        }

        // 3. Fallback: simulate synthetic anchor click
        if (!windowOpened) {
          try {
            const anchor = document.createElement('a');
            anchor.href = data.init_point;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            windowOpened = true;
          } catch (e) {
            console.warn('Could not click anchor:', e);
          }
        }
      } else {
        throw new Error('No se obtuvo la URL de pago de Mercado Pago.');
      }
    } catch (error: any) {
      if (popupWindow && !popupWindow.closed) {
        try {
          popupWindow.close();
        } catch {}
      }
      console.error("Error Mercado Pago:", error);
      setPaymentError(error.message || 'Error al iniciar pago seguro con Mercado Pago. Verifica que MERCADOPAGO_ACCESS_TOKEN esté configurado.');
    } finally {
      isCreatingPreferenceRef.current = false;
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
        <div className="max-w-xl w-full bg-white rounded-lg border border-emerald-100 shadow-md p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Top decorative gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100/80 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'ES' ? 'Pago Aprobado con Mercado Pago' : 'Payment Approved with Mercado Pago'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'ES' ? '¡Se Completó su Compra!' : 'Purchase Completed!'}
          </h1>

          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
            {language === 'ES'
              ? 'Hemos verificado tu transacción con Mercado Pago. Tu pago ha sido aprobado con éxito y te enviamos la confirmación oficial a tu correo electrónico'
              : 'We have verified your transaction with Mercado Pago. Your payment has been successfully approved and official confirmation has been sent to your email'}{paidCustomerEmail ? `: ` : '.'}
            {paidCustomerEmail && <strong className="text-slate-900 break-all">{paidCustomerEmail}</strong>}
          </p>

          {/* Immediate Credentials Delivery Box */}
          {deliveredCredentials.length > 0 && (
            <div className="mt-6 text-left rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-2 border-emerald-400 p-5 sm:p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  Entrega Inmediata Automatizada
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  Sin Esperas ⚡
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-emerald-950 mb-1">
                Tus Credenciales de Acceso Oficiales:
              </h3>
              <p className="text-xs text-emerald-800 mb-4 leading-relaxed font-medium">
                Tus credenciales han sido asignadas automáticamente desde el inventario. Inicia sesión directamente en la plataforma o presiona el botón de acceso abajo.
              </p>

              <div className="space-y-4">
                {deliveredCredentials.map((cred: any, idx: number) => {
                  const isPrime = cred.productSlug?.includes('prime') || cred.serviceName?.toLowerCase().includes('prime');
                  const targetUrl = cred.loginUrl || (isPrime ? 'https://www.primevideo.com/' : 'https://www.crunchyroll.com/');
                  const passFieldId = `pass-${cred.id || idx}`;
                  const userFieldId = `user-${cred.id || idx}`;
                  const pinFieldId = `pin-${cred.id || idx}`;
                  const isPassVisible = Boolean(showPassword[passFieldId]);

                  return (
                    <div key={cred.id || idx} className="bg-white rounded-xl border border-emerald-300 p-4 sm:p-5 shadow-xs space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${isPrime ? 'bg-[#00A8E1]' : 'bg-[#F47521]'}`}>
                            <Tv className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-none">
                              {cred.serviceName || (isPrime ? 'Amazon Prime Video' : 'Crunchyroll Premium')}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                              1 Perfil (1 dispositivo) • {cred.months || 1} {(cred.months || 1) === 1 ? 'Mes' : 'Meses'} • Garantía según lo alquilado
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {cred.id || 'Activa'}
                        </span>
                      </div>

                      {/* Obligatory Single Device Notice */}
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-900">
                            ⚠️ REGLA OBLIGATORIA: Inicia sesión únicamente en el 1 dispositivo que vas a usar.
                          </p>
                          <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                            Tu suscripción incluye 1 perfil para 1 solo dispositivo y garantía según lo alquilado ({cred.months || 1} {(cred.months || 1) === 1 ? 'Mes' : 'Meses'}). No abras la cuenta en múltiples pantallas en simultáneo para mantener tu garantía activa.
                          </p>
                        </div>
                      </div>

                      {/* Credentials Table / Rows */}
                      <div className="space-y-2 text-xs">
                        {/* Usuario / Email */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Usuario / Correo:</span>
                            <span className="font-mono font-bold text-slate-900 break-all select-all text-xs sm:text-sm">
                              {cred.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(cred.email, userFieldId)}
                            className="shrink-0 p-2 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                            title="Copiar usuario"
                          >
                            {copiedField === userFieldId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Contraseña */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contraseña:</span>
                            <span className="font-mono font-bold text-slate-900 break-all select-all text-xs sm:text-sm">
                              {isPassVisible ? cred.password : '••••••••••••'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleShowPassword(passFieldId)}
                              className="p-2 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-600 transition-colors cursor-pointer"
                              title={isPassVisible ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cred.password, passFieldId)}
                              className="shrink-0 p-2 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                              title="Copiar contraseña"
                            >
                              {copiedField === passFieldId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Perfil / PIN si aplica */}
                        {cred.profilePin && (
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Perfil Asignado:</span>
                              <span className="font-mono font-bold text-emerald-900 text-xs sm:text-sm">
                                {cred.profilePin}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cred.profilePin, pinFieldId)}
                              className="shrink-0 p-2 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                            >
                              {copiedField === pinFieldId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Reglas de Garantía y Dispositivo */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                          <div className="p-2 rounded bg-slate-100 border border-slate-200">
                            <span className="font-bold text-slate-600 block">Dispositivo:</span>
                            <span className="font-bold text-slate-900">1 Dispositivo</span>
                          </div>
                          <div className="p-2 rounded bg-slate-100 border border-slate-200">
                            <span className="font-bold text-slate-600 block">Garantía:</span>
                            <span className="font-bold text-emerald-700">
                              {cred.months || 1} {(cred.months || 1) === 1 ? 'Mes' : 'Meses'} (según lo alquilado)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Direct Launch Button for this Product */}
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3.5 px-4 rounded-xl text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                          isPrime
                            ? 'bg-[#00A8E1] hover:bg-[#0092c4] shadow-blue-500/20'
                            : 'bg-[#F47521] hover:bg-[#e06412] shadow-orange-500/20'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>
                          {isPrime ? '🚀 Abrir e Iniciar Sesión en Amazon Prime Video' : '🚀 Abrir e Iniciar Sesión en Crunchyroll'}
                        </span>
                      </a>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Respaldo enviado a tu correo ({paidCustomerEmail})</span>
                </p>
                <p className="text-[11px] text-emerald-800">
                  Consejo: Haz clic en el botón de lanzamiento para abrir la web oficial, inicia sesión con tu usuario y clave, y elige tu perfil asignado.
                </p>
              </div>
            </div>
          )}

          {/* If customer acquired Prime Video or Crunchyroll (immediate delivery profile) but stock was exhausted (deliveredCredentials is empty) */}
          {deliveredCredentials.length === 0 && (paidOrderItems || []).some((it: any) => {
            const slug = (it.slug || it.id || it.product?.slug || it.product?.id || it.name || '').toLowerCase();
            return Boolean(it.product?.isImmediateDelivery) || slug.includes('prime-video') || slug.includes('crunchyroll') || slug.includes('prime video') || slug.includes('crunchy');
          }) && (
            <div className="mt-6 text-left rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-400 p-5 sm:p-6 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-600 text-white shadow-xs">
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  Entrega de Perfil por WhatsApp
                </span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md border border-amber-300">
                  Pago Aprobado ⚡
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-amber-950 mb-1">
                Solicita tu Perfil Adquirido al Administrador
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium mb-4">
                Hemos verificado y recibido tu pago exitosamente. Debido a la alta demanda, los perfiles de entrega automática inmediata de este lote ya fueron asignados. Por favor presiona el botón de WhatsApp a continuación para que el Administrador te entregue directamente tu perfil para 1 dispositivo con tu garantía correspondiente según lo alquilado.
              </p>

              {(() => {
                const immediateItem = (paidOrderItems || []).find((it: any) => {
                  const slug = (it.slug || it.id || it.product?.slug || it.product?.id || it.name || '').toLowerCase();
                  return Boolean(it.product?.isImmediateDelivery) || slug.includes('prime-video') || slug.includes('crunchyroll') || slug.includes('prime video') || slug.includes('crunchy');
                });
                const prodName = immediateItem?.product?.name || immediateItem?.name || 'Suscripción Streaming';
                const variantText = immediateItem?.variantName ? ` (${immediateItem.variantName})` : '';
                const orderCode = lastOrderSnapshot?.orderId || paymentResult.paymentId || 'UpClic';
                const waStockUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hola Administrador de UpClic, realicé mi pago con éxito para el pedido #${orderCode}. Adquirí ${prodName}${variantText}. Solicito por favor que me entregue el perfil para 1 dispositivo que adquirí.`
                )}`;

                return (
                  <a
                    href={waStockUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Hablar con el Administrador y Solicitar mi Perfil</span>
                  </a>
                );
              })()}
            </div>
          )}

          {/* License delivery notice within 10 to 30 minutes only for orders with standard licenses and NO immediate delivery */}
          {!(paidOrderItems || []).some((it: any) => {
            const slug = (it.slug || it.id || it.product?.slug || it.product?.id || it.name || '').toLowerCase();
            return Boolean(it.product?.isImmediateDelivery) || slug.includes('prime-video') || slug.includes('crunchyroll') || slug.includes('prime video') || slug.includes('crunchy');
          }) && (
            <div className="mt-6 p-4 sm:p-5 rounded-lg bg-emerald-50/90 border border-emerald-200 text-left flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  {language === 'ES' ? 'Entrega de tu licencia digital:' : 'Digital license delivery:'}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                  <strong>{language === 'ES' ? 'Tu licencia será enviada a tu correo dentro de 10 a 30 minutos.' : 'Your license will be sent to your email within 10 to 30 minutes.'}</strong> {language === 'ES' ? 'Nuestro equipo técnico está validando tu clave de producto y preparando tu comprobante e instrucciones de activación.' : 'Our technical team is validating your product key and preparing your receipt and activation instructions.'}
                </p>
              </div>
            </div>
          )}

          {/* Order summary box */}
          <div className="mt-6 text-left rounded-lg bg-slate-50 border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
              <span>{t('orderStatusLabel')}</span>
              <span className="font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] tracking-wide">
                {t('paidConfirmedStatus')}
              </span>
            </div>

            {lastOrderSnapshot?.orderId && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>{t('orderNumberLabel')}</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {lastOrderSnapshot.orderId}
                </span>
              </div>
            )}

            {paidCustomerEmail && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>{t('deliveryEmailLabel')}</span>
                <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 break-all text-[11px]">
                  {paidCustomerEmail}
                </span>
              </div>
            )}

            {paidCustomerName && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>{t('cardHolderLabel')}</span>
                <span className="font-bold text-slate-800 text-xs">
                  {paidCustomerName}
                </span>
              </div>
            )}

            {paymentResult.paymentId && (
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>{t('mpTxLabel')}</span>
                <span className="font-mono font-bold text-slate-700">
                  #{paymentResult.paymentId}
                </span>
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('purchasedProductsLabel')}</span>
              {paidOrderItems.map((item: any, idx: number) => {
                const name = item.product?.name || item.name || 'Licencia Microsoft';
                const price = Number(item.unitPrice ?? item.product?.price ?? item.price ?? 0);
                const qty = Number(item.quantity) || 1;
                return (
                  <div key={idx} className="flex justify-between items-center text-xs text-slate-700 font-medium">
                    <span className="truncate pr-2">• {name} {item.variantName ? `(${item.variantName})` : ''} x{qty}</span>
                    <span className="shrink-0 font-bold">{formatPrice((price * qty))}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>{t('totalPaidLabel')}</span>
              <span className="text-emerald-700 font-black text-base">{formatPrice(paidTotal)}</span>
            </div>
          </div>

          {/* Direct action buttons */}
          <div className="mt-6 space-y-3">
            <a
              href={contactWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{t('contactSupport')}</span>
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
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToStore')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center min-h-screen">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 text-white/40">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white">{t('emptyCartTitle')}</h2>
        <p className="text-sm text-slate-300 mt-2 mb-8">
          {t('emptyCartSub')}
        </p>
        <button
          onClick={navigateToHome}
          className="px-6 py-3 rounded-lg bg-yellow-400 text-slate-950 font-bold text-sm shadow-md hover:bg-[#eab308] transition-colors cursor-pointer"
        >
          {t('backToStore')}
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="py-10 sm:py-14 bg-slate-900 text-white min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8">
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-slate-600 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-400" />
            <span>{t('backToCatalog')}</span>
          </button>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-yellow-400">
              {t('checkoutTitle')}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
            {t('checkoutSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Detalle de Productos en el Carrito (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1e293b] rounded-lg border border-slate-700 shadow-md p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 text-yellow-400 flex items-center justify-center border border-amber-400/30">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <span>{language === 'ES' ? 'Productos en tu orden' : 'Products in your order'}</span>
                </h2>
                <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-slate-700">
                  {totalQuantity} {totalQuantity === 1 ? t('item') : t('items')}
                </span>
              </div>

              {/* Products list */}
              <div className="divide-y divide-white/10 mb-6 pr-1">
                {items.map(item => {
                  const itemUnitPrice = item.unitPrice ?? item.product.price;
                  const itemKey = item.id || (item.selectedVariant ? `${item.product.id}-${item.selectedVariant}` : item.product.id);
                  const displayVariantName = item.variantName || (
                    item.selectedVariant === 'oem' ? t('licenseTypeOEM') || 'OEM Key' :
                    item.selectedVariant === 'retail' ? t('licenseTypeRetail') || 'Retail Key' : undefined
                  );
                  const itemName = getProductName(item.product);
                  return (
                    <div key={itemKey} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-14 rounded-lg bg-[#0f172a] p-1.5 border border-slate-700 shrink-0 flex items-center justify-center shadow-md">
                          <img
                            src={item.product.imageUrl}
                            alt={itemName}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = item.product.fallbackImage;
                            }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm truncate" title={itemName}>
                            {itemName}
                          </div>
                          {displayVariantName && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 border border-purple-400/30">
                              {displayVariantName}
                            </span>
                          )}
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {language === 'ES' ? 'Precio unitario:' : 'Unit price:'} <strong className="text-white">{formatPrice(itemUnitPrice)}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        {/* Quantity Stepper */}
                        {(() => {
                          const itemMaxStock = typeof item.product?.stock === 'number' && item.product.stock > 0
                            ? item.product.stock
                            : 99;
                          const isAtMax = item.quantity >= itemMaxStock;

                          return (
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center rounded-lg border border-slate-600 bg-[#0f172a] p-0.5">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(itemKey, -1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer font-bold active:scale-95"
                                  aria-label={t('decrease') || 'Decrease'}
                                  title={item.quantity === 1 ? (t('removeProduct') || 'Remove product') : (t('decrease') || 'Decrease')}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={itemMaxStock}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val)) {
                                      setQuantity(itemKey, Math.min(itemMaxStock, Math.max(1, val)));
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (isNaN(val) || val < 1) {
                                      setQuantity(itemKey, 1);
                                    } else if (val > itemMaxStock) {
                                      setQuantity(itemKey, itemMaxStock);
                                    }
                                  }}
                                  className="w-9 text-center text-xs font-black text-white bg-transparent focus:bg-white/20 focus:outline-none rounded py-0.5 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  aria-label={t('editQuantity') || 'Edit quantity'}
                                />
                                <button
                                  type="button"
                                  disabled={isAtMax}
                                  onClick={() => updateQuantity(itemKey, 1)}
                                  className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold transition-colors ${
                                    isAtMax
                                      ? 'text-slate-600 bg-slate-800 cursor-not-allowed'
                                      : 'hover:bg-white/20 text-white cursor-pointer active:scale-95'
                                  }`}
                                  aria-label={t('increase') || 'Increase'}
                                  title={isAtMax ? `Stock máximo alcanzado (${itemMaxStock})` : (t('increase') || 'Increase')}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              {isAtMax && item.product?.stock && (
                                <span className="text-[10px] font-bold text-amber-400">
                                  Máx. {itemMaxStock}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                        <span className="font-black text-yellow-400 shrink-0 tabular-nums text-sm min-w-[75px] text-right">
                          {formatPrice((itemUnitPrice * item.quantity))}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(itemKey)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer shrink-0"
                          title={t('removeProduct') || 'Remove product'}
                          aria-label={t('removeProduct') || 'Remove product'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon input on Checkout */}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-yellow-400" />
                    {t('hasCouponPrompt')}
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span className="font-mono font-bold text-xs text-emerald-200">
                        {appliedCoupon}
                      </span>
                      <span className="text-[11px] text-emerald-300 font-medium">
                        {language === 'ES'
                          ? `(${Math.round(discountRate * 100)}% de descuento aplicado)`
                          : `(${Math.round(discountRate * 100)}% discount applied)`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-slate-400 hover:text-red-400 font-bold px-1 transition-colors cursor-pointer"
                      title={t('removeCoupon') || 'Quitar cupón'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={e => setInputCoupon(e.target.value)}
                      placeholder={t('couponCode')}
                      className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-lg border border-slate-600 bg-[#0f172a] text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      {t('apply')}
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <div
                    className={`mt-2 text-[11px] p-2.5 rounded-lg flex items-start gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-1 ${
                      couponFeedback.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                        : couponFeedback.type === 'info'
                        ? 'bg-slate-700/50 text-slate-300 border border-slate-700'
                        : 'bg-red-500/20 text-red-200 border border-red-500/30 shadow-xs'
                    }`}
                  >
                    {couponFeedback.type === 'error' ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-300" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-300" />
                    )}
                    <span className="leading-snug">{couponFeedback.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Datos del Cliente para la Entrega Digital */}
            <div id="customer-delivery-card" className="bg-[#1e293b] rounded-lg border border-slate-700 shadow-md p-6 sm:p-7 space-y-5 text-white">
              <div className="flex items-start justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-yellow-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                      <span>{t('digitalDeliveryData')}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider">
                        {t('requiredLabel')}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {t('digitalDeliverySubtitle')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email field (Mandatory) */}
              <div className="space-y-1.5">
                <label htmlFor="customer-email-input" className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-yellow-400" />
                    {t('customerEmailLabel')} <span className="text-red-400 font-black">*</span>
                  </span>
                  {customerEmail && isValidEmail(customerEmail) && (
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t('emailVerifiedForDelivery')}
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
                        setEmailError(t('emailRequiredError'));
                      } else if (!isValidEmail(customerEmail)) {
                        setEmailError(t('validEmailError'));
                      } else {
                        setEmailError(null);
                      }
                    }}
                    placeholder="ej: nombre@gmail.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm border font-medium transition-all focus:outline-none ${
                      emailError
                        ? 'border-red-400 bg-red-500/20 text-white placeholder-red-200 focus:ring-2 focus:ring-red-400'
                        : customerEmail && isValidEmail(customerEmail)
                        ? 'border-emerald-400 bg-emerald-500/20 text-white focus:ring-2 focus:ring-emerald-400'
                        : 'border-slate-600 bg-[#0f172a] text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                {emailError && (
                  <p className="text-xs text-red-300 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Optional Name and Phone in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label htmlFor="customer-name-input" className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {t('customerNameLabel')} <span className="text-slate-500 font-normal">({t('optionalLabel') || 'Opcional'})</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-name-input"
                      type="text"
                      autoComplete="name"
                      value={customerName}
                      onChange={e => handleNameChange(e.target.value)}
                      placeholder={language === 'ES' ? 'ej: Roberto M. / IT Dept' : 'e.g.: Robert M. / IT Dept'}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg text-xs sm:text-sm border border-slate-600 bg-[#0f172a] text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {language === 'ES' ? 'Para personalizar tu comprobante de compra' : 'To customize your purchase receipt'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="customer-phone-input" className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {language === 'ES' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'} <span className="text-slate-500 font-normal">({t('optionalLabel') || 'Opcional'})</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-phone-input"
                      type="tel"
                      autoComplete="tel"
                      value={customerPhone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="ej: 555-0123"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg text-xs sm:text-sm border border-slate-600 bg-[#0f172a] text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {language === 'ES' ? 'Para darte soporte directo en la activación' : 'For direct activation assistance'}
                  </p>
                </div>
              </div>

              {/* Flow notice on Mercado Pago registration */}
              <div className="pt-3 border-t border-slate-700 flex flex-col gap-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {language === 'ES'
                      ? 'Para Colombia, México y otros países, por favor selecciona el pago con tarjeta de crédito o débito.'
                      : 'For international payments, please select credit or debit card payment.'}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {language === 'ES'
                      ? 'La información es encriptada y procesada de forma segura por Mercado Pago. Solo se te cobrará el monto elegido, sin recargos.'
                      : 'Information is encrypted and processed securely by Mercado Pago. You are only charged the selected amount, with no extra fees.'}
                  </span>
                </div>
              </div>

              {/* Privacy note */}
              <div className="p-3 bg-[#0f172a] rounded-lg border border-slate-700 flex items-start gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  <strong>{language === 'ES' ? 'Privacidad y entrega garantizada:' : 'Privacy and guaranteed delivery:'}</strong>{' '}
                  {language === 'ES'
                    ? 'Tus datos están protegidos y se usan exclusivamente para asignarte tus pedidos y emitir tu comprobante.'
                    : 'Your data is protected and used exclusively to assign your orders and issue your receipt.'}
                </span>
              </div>
            </div>

            {/* Garantías de UpClic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-lg bg-slate-700/50 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'ES' ? 'Compra Segura 100%' : '100% Secure Purchase'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'ES' ? 'Garantía de 6 meses (telefónica 1 mes)' : '6-month warranty (phone 1 month)'}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'ES' ? 'Entrega Garantizada' : 'Guaranteed Delivery'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'ES' ? 'Envío seguro y protegido' : 'Fast & protected dispatch'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'ES' ? 'Soporte Técnico' : 'Technical Support'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'ES' ? 'Asistencia remota personalizada' : 'Personalized remote assistance'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Resumen de Compra & Payment Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1e293b] rounded-lg border border-slate-700 shadow-md p-6 sm:p-7 sticky top-24 text-white">
              <h2 className="text-base font-black text-white mb-4 pb-3 border-b border-slate-700 flex items-center justify-between">
                <span>{t('paymentSummaryLabel')}</span>
              </h2>

              {/* Subtotal & Discount breakdown */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{t('subtotalLabel')}</span>
                  <span className="font-bold text-white tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                {hasDiscount && (
                  <div className="flex justify-between items-baseline py-0.5 text-emerald-400 font-semibold text-xs">
                    <span>
                      {isMultiItemDiscount
                        ? (language === 'ES' ? 'Descuento 10%:' : 'Discount 10%:')
                        : `${language === 'ES' ? 'Descuento' : 'Discount'} ${Math.round(discountRate * 100)}%:`}
                    </span>
                    <span className="tabular-nums font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline text-base font-black text-white pt-3 border-t border-slate-700">
                  <span>{t('totalLabel')}</span>
                  <div className="text-right">
                    <span className="text-blue-400 text-xl sm:text-2xl font-black tabular-nums tracking-tight">
                      {formatPrice(total)}
                    </span>
                    <div className="text-[11px] text-slate-400 font-medium">
                      ≈ ${totalUSD} USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="mt-5 pt-3 border-t border-slate-700 space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  {isEn ? 'Select Payment Method:' : 'Selecciona el Método de Pago:'}
                </label>

                {hasOnlyMercadoPagoItem ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentGateway('mercadopago')}
                      className="w-full p-3.5 rounded-xl border flex items-center justify-between gap-3 bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/40 text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src="https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png"
                          alt="Mercado Pago"
                          className="h-6 w-auto object-contain"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold block">Mercado Pago</span>
                          <span className="text-[10px] text-slate-400 font-medium">Soles, Yape, Plin, Tarjeta</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded shadow-2xs">
                        Entrega Inmediata ⚡
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentGateway('mercadopago')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedPaymentGateway === 'mercadopago'
                          ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/40 text-white'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <img
                        src="https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png"
                        alt="Mercado Pago"
                        className="h-5 w-auto object-contain"
                      />
                      <span className="text-[11px] font-bold">Mercado Pago</span>
                      <span className="text-[9px] text-slate-400 font-medium">Soles, Yape, Plin, Tarjeta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToPayPal()}
                      className="p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-800/60 hover:bg-[#003087]/30 border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                        alt="PayPal"
                        className="h-5 w-auto object-contain"
                      />
                      <span className="text-[11px] font-bold">PayPal (USD)</span>
                      <span className="text-[9px] text-amber-300 font-medium">${totalUSD} USD →</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-1">
                {selectedPaymentGateway === 'paypal' ? (
                  /* PayPal Option Details */
                  <div className="space-y-3">
                    <button
                      id="paypal-go-btn"
                      onClick={navigateToPayPal}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-amber-300"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                        alt="PayPal"
                        className="h-5 w-auto object-contain"
                      />
                      <span>{isEn ? `Pay $ ${totalUSD} USD with PayPal` : `Continuar a PayPal ($ ${totalUSD} USD)`}</span>
                      <ExternalLink className="w-4 h-4 ml-0.5 opacity-90 text-[#003087]" />
                    </button>
                  </div>
                ) : (
                  /* Mercado Pago Option */
                  <div>
                    {/* Official Gateway Badge */}
                    <div className="mb-3 p-2.5 rounded-lg bg-white border border-slate-700 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png"
                          alt="Mercado Pago"
                          className="h-6 w-auto object-contain"
                        />
                        <span className="text-[11px] font-bold text-slate-800">Pasarela Oficial</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        100% Seguro
                      </span>
                    </div>

                    {emailError && (
                      <div className="p-3 mb-4 bg-red-500/20 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{t('requiredFieldNotice')}</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed">{emailError}</p>
                        </div>
                      </div>
                    )}

                    {paymentError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{t('paymentErrorNotice')}</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed">{paymentError}</p>
                          <p className="mt-1 text-[10px] text-red-300 font-medium">
                            {t('contactSupportIfPersists')}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      id="mercado-pago-pay-btn"
                      onClick={handleMercadoPago}
                      disabled={isCreatingPreference}
                      className="w-full py-3.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isCreatingPreference ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                          <span className="tracking-tight">{t('connectingStatus') || 'Conectando con Mercado Pago...'}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4.5 h-4.5 text-white" />
                          <span className="tracking-tight">{t('finishPurchaseMercadoPago')}</span>
                          <ExternalLink className="w-4 h-4 ml-0.5 opacity-90" />
                        </>
                      )}
                    </button>

                    {isPayPalAllowed && (
                      <div className="mt-2.5 text-center">
                        <button
                          type="button"
                          onClick={navigateToPayPal}
                          className="text-[11px] text-amber-300 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>{isEn ? `Or pay with PayPal ($ ${totalUSD} USD) →` : `O pagar en Dólares con PayPal ($ ${totalUSD} USD) →`}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Security guarantee footnote */}
              <div className="mt-5 pt-4 border-t border-slate-700 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('securePaymentMercadoPago')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{t('deliveryTimeNotice')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
