import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { formatPrice } from '../products.ts';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Mail,
  User,
  Phone,
  Loader2,
  RefreshCw,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export const PayPalCheckoutPage: React.FC = () => {
  const {
    items,
    totalQuantity,
    subtotal,
    hasDiscount,
    discountRate,
    discountAmount,
    total,
    isMultiItemDiscount,
    navigateToCheckout,
    language,
    getProductName,
    exchangeRate
  } = useCart();

  const isEn = language === 'EN';

  // Check if cart contains any item that explicitly disallows PayPal (Crunchyroll and Amazon Prime Video)
  const hasImmediateDeliveryItem = items.some(it => {
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

  // Synchronized exchange rate with the store
  const penRate = exchangeRate || 3.75;
  const totalUSD = (total / penRate).toFixed(2);
  const subtotalUSD = (subtotal / penRate).toFixed(2);
  const discountAmountUSD = (discountAmount / penRate).toFixed(2);

  // Dynamic product title summary based on cart items
  const productTitleSummary = items.length === 1
    ? `${getProductName(items[0].product)}${items[0].selectedVariant ? ` (${items[0].selectedVariant.name})` : ''}`
    : (items.length > 1
        ? items.map(it => `${it.quantity > 1 ? `${it.quantity}x ` : ''}${getProductName(it.product)}`).join(' + ')
        : 'Licencia Digital UpClic');

  // Customer contact state for digital delivery
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
  const [registeredOrderId, setRegisteredOrderId] = useState<string | null>(null);
  const [isRegisteringOrder, setIsRegisteringOrder] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const customerEmailRef = useRef(customerEmail);
  const customerNameRef = useRef(customerName);
  const customerPhoneRef = useRef(customerPhone);

  useEffect(() => {
    customerEmailRef.current = customerEmail;
  }, [customerEmail]);

  useEffect(() => {
    customerNameRef.current = customerName;
  }, [customerName]);

  useEffect(() => {
    customerPhoneRef.current = customerPhone;
  }, [customerPhone]);

  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const hasRenderedRef = useRef(false);
  const hasBeenClickedRef = useRef(false);
  const forceFreshRenderButtonRef = useRef<() => void>(() => {});
  const isRegisteringOrderRef = useRef(false);
  const hasRegisteredOrderRef = useRef(false);
  const lastRegisteredKeyRef = useRef('');
  const registeredOrderIdRef = useRef<string | null>(null);
  const interceptorsAttachedRef = useRef(false);

  const handleEmailChange = (val: string) => {
    setCustomerEmail(val);
    customerEmailRef.current = val;
    hasRegisteredOrderRef.current = false;
    lastRegisteredKeyRef.current = '';
    if (emailError && val.includes('@') && val.includes('.')) {
      setEmailError(null);
    }
    try {
      localStorage.setItem('upclic_customer_email', val);
    } catch {}
  };

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    customerNameRef.current = val;
    try {
      localStorage.setItem('upclic_customer_name', val);
    } catch {}
  };

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    customerPhoneRef.current = val;
    try {
      localStorage.setItem('upclic_customer_phone', val);
    } catch {}
  };

  // Register order snapshot & dispatch confirmation email to customer before/during payment
  const registerOrderBeforePayment = async () => {
    const trimmedEmail = customerEmailRef.current.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return null;
    }

    const sessionKey = `${trimmedEmail}_${totalUSD}_${items.map(it => `${it.product.id}:${it.quantity}`).join(',')}`;
    if (isRegisteringOrderRef.current || hasRegisteredOrderRef.current || lastRegisteredKeyRef.current === sessionKey) {
      console.log('Orden PayPal ya registrada previamente en esta sesión. Omitiendo llamada duplicada.');
      return registeredOrderIdRef.current;
    }

    try {
      isRegisteringOrderRef.current = true;
      lastRegisteredKeyRef.current = sessionKey;
      setIsRegisteringOrder(true);
      // Save order snapshot in localStorage so return flow has complete details
      try {
        localStorage.setItem('upclic_last_order', JSON.stringify({
          items: items.map(it => ({
            product: it.product,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            variantName: it.variantName
          })),
          total,
          usdTotal: totalUSD,
          discountAmount,
          customerEmail: trimmedEmail,
          customerName: customerNameRef.current.trim(),
          customerPhone: customerPhoneRef.current.trim(),
          channel: 'paypal',
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Error saving last order to localStorage', e);
      }

      const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
        (typeof window !== 'undefined' && (window.location.hostname === 'upclic.store' || window.location.hostname.endsWith('github.io'))
          ? 'https://upclic12-rypnq.sevalla.app'
          : '');

      const response = await fetch(`${apiBase}/api/paypal/create_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items,
          discountAmount,
          total,
          usdTotal: totalUSD,
          customerEmail: trimmedEmail,
          customerName: customerNameRef.current.trim(),
          customerPhone: customerPhoneRef.current.trim(),
          channel: 'paypal',
          orderId: registeredOrderIdRef.current || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.orderId) {
          registeredOrderIdRef.current = data.orderId;
          hasRegisteredOrderRef.current = true;
          setRegisteredOrderId(data.orderId);
          try {
            const rawStored = localStorage.getItem('upclic_last_order');
            const stored = rawStored ? JSON.parse(rawStored) : {};
            stored.orderId = data.orderId;
            localStorage.setItem('upclic_last_order', JSON.stringify(stored));
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error al registrar orden PayPal en backend:', err);
    } finally {
      isRegisteringOrderRef.current = false;
      setIsRegisteringOrder(false);
    }
  };

  useEffect(() => {
    if (hasImmediateDeliveryItem) {
      navigateToCheckout();
    }
  }, [hasImmediateDeliveryItem, navigateToCheckout]);

  // Initialization and continuous amount & product title sync
  useEffect(() => {
    if (hasImmediateDeliveryItem) return;

    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;
    let continuousSyncInterval: NodeJS.Timeout | null = null;
    let observer: MutationObserver | null = null;
    let attempts = 0;
    const maxAttempts = 50;

    const fixProductTitleAndFillAmount = () => {
      const container = document.getElementById('paypal-container-9W56EUJ67HRS4');
      if (!container) return;

      // 1. Replace default hosted text with the selected product name
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && (/pavor/i.test(node.nodeValue) || /pago por servicio/i.test(node.nodeValue) || /servicio upclic/i.test(node.nodeValue) || /pago paypal/i.test(node.nodeValue))) {
          node.nodeValue = productTitleSummary;
        }
      }

      const allTextElements = container.querySelectorAll('p, div, span, label, font, h1, h2, h3, h4');
      allTextElements.forEach(el => {
        if (el.children.length === 0 && el.textContent && (/pavor/i.test(el.textContent) || /servicio upclic/i.test(el.textContent) || /pago paypal/i.test(el.textContent))) {
          el.textContent = productTitleSummary;
        }
      });

      // 2. Set price in USD automatically into all inputs inside the container
      const allInputs = container.querySelectorAll('input, textarea, select');
      allInputs.forEach((element) => {
        const input = element as HTMLInputElement;
        if (input.type === 'hidden') {
          if (input.name === 'amount' || input.name?.includes('price') || input.name?.includes('total') || input.name === 'item_number') {
            input.value = totalUSD;
          }
          if (input.name === 'item_name') {
            input.value = productTitleSummary;
          }
        } else if (input.type === 'text' || input.type === 'number' || !input.type || input.tagName === 'INPUT') {
          // Always keep amount field synced with the order total in USD
          if (input.value !== totalUSD || input.value === '' || input.value === '0' || input.value === '0.00') {
            const proto = window.HTMLInputElement.prototype;
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
            if (nativeSetter) {
              nativeSetter.call(input, totalUSD);
            } else {
              input.value = totalUSD;
            }
            input.setAttribute('value', totalUSD);
            input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
          }
        }
      });
    };

    const attachContainerInterceptors = () => {
      const container = document.getElementById('paypal-container-9W56EUJ67HRS4');
      if (!container || interceptorsAttachedRef.current) return;
      interceptorsAttachedRef.current = true;

      let lastInteractionTimestamp = 0;

      const onUserInteraction = (e: Event) => {
        const now = Date.now();
        // Debounce interactions to prevent rapid multi-clicks or multi-event triggers
        if (now - lastInteractionTimestamp < 1200) {
          return;
        }
        lastInteractionTimestamp = now;

        const trimmedEmail = customerEmailRef.current.trim();
        if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          setEmailTouched(true);
          setEmailError(
            isEn
              ? 'Please enter your email address above before paying so we can deliver your digital license.'
              : 'Por favor ingresa tu correo electrónico arriba antes de pagar para que podamos enviarte tu licencia.'
          );
          emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          emailInputRef.current?.focus();
          return;
        }

        setEmailError(null);
        fixProductTitleAndFillAmount();
        hasBeenClickedRef.current = true;
        registerOrderBeforePayment();
      };

      container.addEventListener('click', onUserInteraction, true);
      container.addEventListener('mouseenter', fixProductTitleAndFillAmount, true);
    };

    const renderPayPalButtonInstance = () => {
      const targetEl = document.getElementById('paypal-container-9W56EUJ67HRS4');
      if (!targetEl || !(window as any).paypal?.HostedButtons) return false;

      try {
        targetEl.innerHTML = '';
        (window as any).paypal.HostedButtons({
          hostedButtonId: "9W56EUJ67HRS4",
        }).render("#paypal-container-9W56EUJ67HRS4");

        hasRenderedRef.current = true;
        hasBeenClickedRef.current = false;
        if (isMounted) {
          setIsScriptLoading(false);
          setScriptError(null);
          setIsRefreshing(false);
        }

        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
          fixProductTitleAndFillAmount();
        });
        observer.observe(targetEl, { childList: true, subtree: true, characterData: true });

        attachContainerInterceptors();

        setTimeout(fixProductTitleAndFillAmount, 50);
        setTimeout(fixProductTitleAndFillAmount, 150);
        setTimeout(fixProductTitleAndFillAmount, 300);
        setTimeout(fixProductTitleAndFillAmount, 600);
        setTimeout(fixProductTitleAndFillAmount, 1200);
        return true;
      } catch (err: any) {
        console.error('Error rendering PayPal button:', err);
        if (isMounted) {
          setIsScriptLoading(false);
          setIsRefreshing(false);
          setScriptError('Hubo un error al inicializar el botón de PayPal.');
        }
        return false;
      }
    };

    forceFreshRenderButtonRef.current = () => {
      setIsRefreshing(true);
      renderPayPalButtonInstance();
      setTimeout(() => {
        if (isMounted) setIsRefreshing(false);
      }, 500);
    };

    const handleWindowFocusOrReturn = () => {
      // If payment was previously clicked and user returns to tab, refresh button session
      if (hasBeenClickedRef.current) {
        renderPayPalButtonInstance();
      } else {
        fixProductTitleAndFillAmount();
        setTimeout(fixProductTitleAndFillAmount, 50);
        setTimeout(fixProductTitleAndFillAmount, 150);
        setTimeout(fixProductTitleAndFillAmount, 350);
      }
    };

    const tryRenderButton = () => {
      if (!isMounted || hasRenderedRef.current) return;
      const success = renderPayPalButtonInstance();
      if (success) {
        if (pollInterval) clearInterval(pollInterval);
        continuousSyncInterval = setInterval(fixProductTitleAndFillAmount, 200);
      }
    };

    const scriptSrc = 'https://www.paypal.com/sdk/js?client-id=BAAGKblPRgZljGBu-t-j6EMM8p9xxfAXtlhAujiETAiUqep6rE0mxDoHMSv7vPkQUahF1LJMJMdGP8vuBA&components=hosted-buttons&disable-funding=venmo&currency=USD';
    let scriptTag = document.querySelector(`script[src*="hosted-buttons"]`) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.src = scriptSrc;
      scriptTag.async = true;
      scriptTag.onload = () => {
        tryRenderButton();
      };
      scriptTag.onerror = () => {
        if (isMounted) {
          setIsScriptLoading(false);
          setScriptError('No se pudo conectar con el servidor de PayPal.');
        }
      };
      document.body.appendChild(scriptTag);
    } else {
      scriptTag.addEventListener('load', tryRenderButton);
    }

    tryRenderButton();

    pollInterval = setInterval(() => {
      attempts++;
      if (hasRenderedRef.current || attempts > maxAttempts) {
        if (pollInterval) clearInterval(pollInterval);
        if (attempts > maxAttempts && !hasRenderedRef.current && isMounted) {
          setIsScriptLoading(false);
          setScriptError('El botón de PayPal tardó en responder. Por favor haz clic en recargar.');
        }
        return;
      }
      tryRenderButton();
    }, 150);

    // Event listeners when returning to tab/window and before user interaction
    window.addEventListener('focus', handleWindowFocusOrReturn);
    window.addEventListener('pageshow', handleWindowFocusOrReturn);
    document.addEventListener('visibilitychange', handleWindowFocusOrReturn);
    window.addEventListener('pointerdown', fixProductTitleAndFillAmount, true);
    window.addEventListener('mousedown', fixProductTitleAndFillAmount, true);
    window.addEventListener('touchstart', fixProductTitleAndFillAmount, true);
    window.addEventListener('click', fixProductTitleAndFillAmount, true);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (continuousSyncInterval) clearInterval(continuousSyncInterval);
      if (observer) observer.disconnect();
      window.removeEventListener('focus', handleWindowFocusOrReturn);
      window.removeEventListener('pageshow', handleWindowFocusOrReturn);
      document.removeEventListener('visibilitychange', handleWindowFocusOrReturn);
      window.removeEventListener('pointerdown', fixProductTitleAndFillAmount, true);
      window.removeEventListener('mousedown', fixProductTitleAndFillAmount, true);
      window.removeEventListener('touchstart', fixProductTitleAndFillAmount, true);
      window.removeEventListener('click', fixProductTitleAndFillAmount, true);
    };
  }, [totalUSD, productTitleSummary, hasImmediateDeliveryItem]);

  if (hasImmediateDeliveryItem) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center text-slate-700">
        <Loader2 className="w-8 h-8 text-[#0070ba] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 text-slate-800">
      {/* Clean scoped styles for PayPal container layout */}
      <style>{`
        #paypal-container-9W56EUJ67HRS4 {
          width: 100% !important;
          max-width: 360px !important;
          margin: 0 auto !important;
          min-height: 120px !important;
        }
        #paypal-container-9W56EUJ67HRS4 * {
          box-sizing: border-box !important;
        }
        #paypal-container-9W56EUJ67HRS4 p,
        #paypal-container-9W56EUJ67HRS4 div[style*="text-align"] {
          font-weight: 800 !important;
          font-size: 14px !important;
          color: #0f172a !important;
          text-align: center !important;
          margin-bottom: 6px !important;
        }
        #paypal-container-9W56EUJ67HRS4 form {
          width: 100% !important;
          margin: 0 auto !important;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={navigateToCheckout}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer bg-white hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#0070ba]" />
            <span>{isEn ? 'Back to Payment Options' : 'Volver a Opciones de Pago'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#0070ba]" />
            <span>{isEn ? 'Official PayPal Gateway' : 'Pasarela Oficial de PayPal'}</span>
          </div>
        </div>

        {/* Top Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-xs p-2 shrink-0 border border-slate-200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="PayPal"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0070ba] border border-blue-200">
                    {isEn ? 'International Payment' : 'Pago Internacional'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    USD ($)
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {isEn ? 'PayPal Checkout (US Dollars)' : 'Pagar con PayPal (Dólares USD)'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEn
                    ? 'Official encrypted checkout in US Dollars ($ USD)'
                    : 'Pasarela oficial de cobro en Dólares Estadounidenses ($ USD)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Order Breakdown & Email / Right PayPal Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols): Products breakdown + Delivery Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Contact Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 text-slate-900 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0070ba]" />
                  {isEn ? 'License Delivery Information' : 'Datos para el Envío de tu Licencia'}
                </span>
                <span className="text-[11px] text-cyan-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {isEn ? 'Delivery in 10-30 min' : 'Entrega en 10-30 min'}
                </span>
              </h3>

              <div className="space-y-1.5">
                <label htmlFor="paypal-customer-email" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{isEn ? 'Email address (Where you will receive the product key)' : 'Correo Electrónico (donde recibirás la clave y descarga)'} *</span>
                  {emailError && (
                    <span className="text-[11px] text-red-500 font-bold flex items-center gap-1">
                      ⚠️ {isEn ? 'Email required' : 'Correo requerido'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    id="paypal-customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={e => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setEmailTouched(true);
                      if (!customerEmail.trim() || !customerEmail.includes('@') || !customerEmail.includes('.')) {
                        setEmailError(
                          isEn
                            ? 'Please enter a valid email address so we can send your digital key.'
                            : 'Por favor ingresa un correo electrónico válido para enviarte tu clave.'
                        );
                      } else {
                        setEmailError(null);
                        registerOrderBeforePayment();
                      }
                    }}
                    placeholder="ej: tuemail@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${
                      emailError
                        ? 'border-red-400 bg-red-50 text-slate-900 placeholder-red-300 focus:ring-1 focus:ring-red-400'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-[#0070ba] focus:ring-2 focus:ring-[#0070ba]/20'
                    } focus:outline-none font-medium transition-all`}
                  />
                  <Mail className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                </div>

                {emailError ? (
                  <p className="text-[11px] text-red-500 font-medium">
                    {emailError}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    {isEn
                      ? 'Your official activation key, direct Microsoft installer and support guide will be sent here.'
                      : 'A este correo te llegará tu clave digital original, enlaces de descarga oficiales y guía de instalación paso a paso.'}
                  </p>
                )}

                {registeredOrderId && (
                  <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isEn
                        ? `Delivery email registered. Your product keys and setup guide will arrive at ${customerEmail}`
                        : `Datos registrados. Tu licencia digital y guía de instalación llegarán a ${customerEmail}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label htmlFor="paypal-customer-name" className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isEn ? 'Customer Name (optional)' : 'Nombre (opcional)'}</span>
                  </label>
                  <input
                    id="paypal-customer-name"
                    type="text"
                    value={customerName}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder={isEn ? 'e.g. John Doe' : 'ej: Roberto M.'}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0070ba] focus:ring-2 focus:ring-[#0070ba]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="paypal-customer-phone" className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isEn ? 'WhatsApp / Phone (optional)' : 'WhatsApp / Teléfono (opcional)'}</span>
                  </label>
                  <input
                    id="paypal-customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0070ba] focus:ring-2 focus:ring-[#0070ba]/20"
                  />
                </div>
              </div>
            </div>

            {/* Cart Items Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 text-slate-900 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#0070ba]" />
                  {isEn ? 'Order Items' : 'Detalle de tu Pedido'} ({totalQuantity})
                </span>
              </h3>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const itemUnitPricePEN = Number(item.unitPrice ?? item.product?.price) || 0;
                  const itemUnitPriceUSD = (itemUnitPricePEN / penRate).toFixed(2);
                  const itemTotalPEN = itemUnitPricePEN * item.quantity;
                  const itemTotalUSD = (itemTotalPEN / penRate).toFixed(2);

                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                          <img
                            src={item.product?.imageUrl || item.product?.fallbackImage}
                            alt={getProductName(item.product)}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              if (item.product?.fallbackImage && e.currentTarget.src !== item.product.fallbackImage) {
                                e.currentTarget.src = item.product.fallbackImage;
                              }
                            }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate text-xs">
                            {getProductName(item.product)}
                          </h4>
                          {item.selectedVariant && (
                            <p className="text-[11px] text-[#0070ba] truncate">
                              {item.selectedVariant.name}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500">
                            {isEn ? 'Qty:' : 'Cant:'} {item.quantity} × ${itemUnitPriceUSD} USD
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-[#0070ba] tabular-nums text-sm">
                          ${itemTotalUSD} USD
                        </div>
                        <div className="text-[10px] text-slate-400 tabular-nums">
                          ({formatPrice(itemTotalPEN, 'PEN')})
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Breakdown in USD */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span>{isEn ? 'Subtotal:' : 'Subtotal:'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">${subtotalUSD} USD</span>
                </div>

                {hasDiscount && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>
                      {isMultiItemDiscount
                        ? (isEn ? '10% Multi-product Discount:' : 'Descuento 10% por 2+ productos:')
                        : (isEn ? `Discount ${Math.round(discountRate * 100)}%:` : `Descuento ${Math.round(discountRate * 100)}%:`)}
                    </span>
                    <span className="font-bold tabular-nums">-${discountAmountUSD} USD</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline text-sm sm:text-base font-black text-slate-900 pt-2.5 border-t border-slate-100">
                  <span>{isEn ? 'Total in US Dollars ($ USD):' : 'Total a pagar en Dólares ($ USD):'}</span>
                  <div className="text-right">
                    <span className="text-[#0070ba] text-xl sm:text-2xl font-black tabular-nums">
                      ${totalUSD} USD
                    </span>
                    <div className="text-[10px] text-slate-400 font-normal">
                      ({formatPrice(total, 'PEN')})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Official PayPal Hosted Button Container */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-7 sticky top-24 text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isEn ? 'PayPal Payment' : 'Pago PayPal'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? 'Instant & secure gateway' : 'Pasarela instantánea y segura'}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-[#0070ba] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Seguro SSL
                </span>
              </div>

              {/* White High-Contrast Card for PayPal Hosted Button */}
              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 min-h-[160px] flex flex-col items-center justify-center">
                {isScriptLoading && (
                  <div className="flex flex-col items-center justify-center gap-3 py-6 text-slate-600">
                    <Loader2 className="w-8 h-8 text-[#0070ba] animate-spin" />
                    <span className="text-xs font-bold text-slate-700">
                      {isEn ? 'Loading PayPal buttons...' : 'Cargando botones de PayPal...'}
                    </span>
                  </div>
                )}

                {scriptError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-center w-full">
                    <p className="font-bold mb-1">{scriptError}</p>
                    <button
                      onClick={() => forceFreshRenderButtonRef.current?.()}
                      className="mt-2 text-[11px] font-bold underline text-[#0070ba] hover:text-[#005a96]"
                    >
                      {isEn ? 'Reload' : 'Recargar'}
                    </button>
                  </div>
                )}

                {/* The Official Hosted PayPal Container */}
                <div
                  id="paypal-container-9W56EUJ67HRS4"
                  className="w-full text-slate-900"
                />
              </div>

              {/* Direct WhatsApp Button to Notify Seller */}
              <div className="mt-4 pt-3 text-center">
                <a
                  href={`https://wa.me/51983204384?text=Hola%20UpClic,%20acabo%20de%20realizar%20mi%20pago%20por%20PayPal%20para%20mi%20licencia.%20Mi%20correo%20es:%20${encodeURIComponent(customerEmail || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0" />
                  <span>{isEn ? 'Notify seller on WhatsApp (I already paid)' : 'Notificar al vendedor por WhatsApp que ya pagué'}</span>
                </a>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {isEn
                    ? 'Click here after completing payment on PayPal to coordinate your license delivery and activation.'
                    : 'Haz clic aquí después de pagar en PayPal para coordinar el envío de tus claves y activación.'}
                </p>
              </div>

              {/* Guarantees & Features */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0070ba] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    {isEn
                      ? 'PayPal Buyer Protection: transaction is encrypted and guaranteed.'
                      : 'Protección al Comprador de PayPal: tu compra está 100% garantizada.'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    {isEn
                      ? 'Direct digital delivery to your email in 10 to 30 minutes.'
                      : 'Entrega digital garantizada a tu correo en 10 a 30 minutos.'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    {isEn
                      ? 'Includes installation guide and technical support.'
                      : 'Incluye instalador original y soporte técnico especializado.'}
                  </span>
                </div>
              </div>

              {/* Alternative gateway link */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={navigateToCheckout}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium"
                >
                  <span>{isEn ? 'Prefer local currency (PEN, COP, MXN)?' : '¿Prefieres pagar en Soles (Yape/Plin)?'}</span>
                  <span className="text-[#0070ba] underline font-bold">
                    {isEn ? 'Use Mercado Pago' : 'Usar Mercado Pago'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
