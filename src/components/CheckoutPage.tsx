import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  Copy,
  Check,
  Upload,
  CreditCard,
  Smartphone,
  Building2,
  Globe,
  Clock,
  FileCheck2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../products';
import { PaymentMethodId } from '../types';
import { trackPurchase } from '../utils/analytics';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    cartTotals,
    clearCart,
    goToHome,
    couponCode,
    formatPrice,
    currency,
    paymentSettings
  } = useCart();

  // Required Buyer Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('mercadopago');

  // Manual Payment Fields (Yape / Plin / Transferencia)
  const [operationNumber, setOperationNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');

  // Processing & Order Confirmation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [mpPaymentUrl, setMpPaymentUrl] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Late receipt submission on confirmation screen
  const [lateOpNumber, setLateOpNumber] = useState('');
  const [lateReceiptImg, setLateReceiptImg] = useState('');
  const [isUpdatingReceipt, setIsUpdatingReceipt] = useState(false);
  const [receiptUpdatedSuccess, setReceiptUpdatedSuccess] = useState(false);

  // Check if returning from Mercado Pago redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || params.get('collection_status');
    const orderId = params.get('orderId') || params.get('external_reference');
    const paymentId = params.get('payment_id') || params.get('collection_id');

    if ((status === 'success' || status === 'approved' || status === 'pending') && orderId) {
      const savedCustomerStr = localStorage.getItem('upclic_last_checkout_customer');
      let savedCustomer: any = {};
      try {
        if (savedCustomerStr) savedCustomer = JSON.parse(savedCustomerStr);
      } catch {}

      fetch('/api/confirm_payment_success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentId,
          customerEmail: savedCustomer.email || 'cliente@upclic.store',
          customerName: savedCustomer.name || 'Cliente UPCLIC',
          customerPhone: savedCustomer.phone || '',
          items: savedCustomer.items || items
        })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.order) {
            setConfirmedOrder(data.order);
            if (data.order.orderStatus === 'Pagado') {
              trackPurchase(
                data.order.id,
                data.order.total,
                data.order.items || [],
                currency
              );
            }
            clearCart();
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isLate: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      setErrorMsg('La imagen del comprobante no debe superar los 3.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isLate) {
          setLateReceiptImg(reader.result);
        } else {
          setReceiptImage(reader.result);
          setReceiptFileName(file.name);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const validateBuyerForm = (): boolean => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return false;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido para enviarte tu pedido.');
      return false;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMsg('Por favor ingresa tu número de WhatsApp para coordinar la entrega.');
      return false;
    }
    if (items.length === 0) {
      setErrorMsg('Tu carrito está vacío.');
      return false;
    }
    return true;
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!validateBuyerForm()) return;

    setIsSubmitting(true);

    try {
      // Save buyer info locally in case of gateway redirect
      localStorage.setItem(
        'upclic_last_checkout_customer',
        JSON.stringify({
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          items
        })
      );

      if (selectedMethod === 'yape' || selectedMethod === 'plin' || selectedMethod === 'transferencia') {
        const res = await fetch('/api/orders/create_manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            customerPhone: customerPhone.trim(),
            items,
            couponCode,
            paymentMethod: selectedMethod,
            operationNumber: operationNumber.trim(),
            receiptImage
          })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'No se pudo registrar el pedido.');
        }
        setConfirmedOrder(data.order);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (selectedMethod === 'mercadopago') {
        const res = await fetch('/api/create_preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            couponCode,
            discountAmount: cartTotals.discountAmount,
            discountReason: cartTotals.discountReason,
            total: cartTotals.total,
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            customerPhone: customerPhone.trim(),
            origin: window.location.origin
          })
        });
        const data = await res.json();
        if (!res.ok || !data.init_point) {
          throw new Error(
            data.error ||
              'No se pudo generar el enlace de pago con Mercado Pago. Intenta nuevamente en unos segundos.'
          );
        }

        setMpPaymentUrl(data.init_point);

        // If running inside an iframe (e.g. preview), Mercado Pago blocks embedded checkout/cookies,
        // so open in a top-level browser tab and display the order confirmation with the payment link.
        const isInIframe = (() => {
          try {
            return window.self !== window.top;
          } catch {
            return true;
          }
        })();

        if (isInIframe) {
          const link = document.createElement('a');
          link.href = data.init_point;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setConfirmedOrder(
            data.order || {
              id: data.orderId || `ORD-${Date.now()}`,
              customerName: customerName.trim(),
              customerEmail: customerEmail.trim(),
              customerPhone: customerPhone.trim(),
              total: cartTotals.total,
              items: items.map((it) => ({
                name: it.product.name,
                variantName: it.variantName || null,
                quantity: it.quantity,
                unitPrice: it.unitPrice ?? it.product.price
              })),
              orderStatus: 'Pendiente de pago',
              deliveryStatus: 'Pendiente de envío',
              channel: 'mercado_pago',
              createdAt: new Date().toISOString()
            }
          );
          clearCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        window.location.href = data.init_point;
        return;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLateReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedOrder?.id) return;
    if (!lateOpNumber.trim() && !lateReceiptImg) {
      setErrorMsg('Ingresa el número de operación o adjunta la captura del comprobante.');
      return;
    }
    setIsUpdatingReceipt(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(confirmedOrder.id)}/submit_receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationNumber: lateOpNumber.trim(),
          receiptImage: lateReceiptImg
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar comprobante.');
      }
      setConfirmedOrder(data.order);
      setReceiptUpdatedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsUpdatingReceipt(false);
    }
  };

  const yapeConfig = paymentSettings?.yape || {
    enabled: true,
    phone: '983 204 384',
    holderName: 'UPCLIC STORE PERÚ',
    instructions:
      'Realiza el pago por Yape al número indicado, ingresa el número de operación y adjunta tu comprobante para validar tu pedido.'
  };

  const plinConfig = paymentSettings?.plin || {
    enabled: true,
    phone: '983 204 384',
    holderName: 'UPCLIC STORE PERÚ',
    instructions:
      'Realiza el pago por Plin al número indicado, ingresa el número de operación y adjunta tu comprobante para validar tu pedido.'
  };

  const bankConfig = paymentSettings?.transferencia || {
    enabled: true,
    bankName: 'BCP / Interbank / BBVA',
    accountNumber: 'Solicitar cuenta corporativa o transferir vía CCI',
    cci: 'Consultar en soporte WhatsApp o usar Yape/Plin',
    holderName: 'UPCLIC STORE PERÚ',
    accountType: 'Cuenta Soles (S/)',
    instructions:
      'Realiza la transferencia en Soles (S/), ingresa el número de operación bancaria y adjunta tu constancia.'
  };

  // --- ORDER CONFIRMATION VIEW ---
  if (confirmedOrder) {
    const orderStatusLabel = confirmedOrder.orderStatus || 'Pendiente de pago';
    const deliveryStatusLabel = confirmedOrder.deliveryStatus || 'Pendiente de envío';
    const isPaid = orderStatusLabel === 'Pagado' || orderStatusLabel === 'Entregado';
    const isReview = orderStatusLabel === 'Pago en revisión';

    const whatsappOrderConfirmUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hola UPCLIC, acabo de registrar mi pedido *${confirmedOrder.id}*.\n• Cliente: ${
        confirmedOrder.customerName || customerName
      }\n• Correo: ${confirmedOrder.customerEmail || customerEmail}\n• Total: S/ ${Number(
        confirmedOrder.total || 0
      ).toFixed(2)}\n• Método: ${String(confirmedOrder.channel || selectedMethod).toUpperCase()}\n• Estado: ${orderStatusLabel}${
        confirmedOrder.operationNumber ? `\n• N° Operación: ${confirmedOrder.operationNumber}` : ''
      }`
    )}`;

    return (
      <div className="min-h-screen bg-[#F4F7FB] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 bg-[#0B1F3A] text-white">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[#7DB2FF] text-xs font-bold uppercase tracking-wider">
                Confirmación de Pedido UPCLIC
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Fecha: {new Date(confirmedOrder.createdAt || Date.now()).toLocaleString('es-PE')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¡Pedido {confirmedOrder.id} registrado!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Hemos enviado el resumen de tu pedido a <strong>{confirmedOrder.customerEmail}</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Key Order Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Número de Pedido
                </span>
                <span className="text-sm font-mono font-extrabold text-[#0B1F3A]">
                  {confirmedOrder.id}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Estado del Pago
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-full ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800'
                      : isReview
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {orderStatusLabel}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Estado de Entrega
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 bg-slate-200/70 px-2.5 py-1 rounded-full">
                  {deliveryStatusLabel}
                </span>
              </div>
            </div>

            {/* Purchased Products */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Productos del Pedido
              </div>
              <div className="divide-y divide-slate-100">
                {(confirmedOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#0B1F3A]">
                        {item.quantity}x {item.name}
                      </span>
                      {item.variantName && (
                        <span className="ml-2 text-xs text-[#1668E3] font-semibold">
                          ({item.variantName})
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-800">
                      S/ {(Number(item.unitPrice || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Monto Total:</span>
                <span className="text-xl font-extrabold text-[#0B1F3A]">
                  S/ {Number(confirmedOrder.total || 0).toFixed(2)} PEN
                </span>
              </div>
            </div>

            {mpPaymentUrl && !isPaid && (
              <div className="p-5 rounded-2xl bg-sky-50 border-2 border-[#009EE3] space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#0B1F3A]">
                  <CreditCard className="w-5 h-5 text-[#009EE3]" />
                  <span>Completa tu pago seguro en Mercado Pago Perú</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hemos abierto la pasarela oficial de Mercado Pago en una pestaña nueva. Si tu navegador bloqueó la ventana emergente, haz clic en el botón de abajo para pagar con <strong>Yape, Tarjeta de crédito/débito o PagoEfectivo</strong>:
                </p>
                <a
                  href={mpPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-[#009EE3] hover:bg-[#0089c7] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pagar ahora en Mercado Pago (S/ {Number(confirmedOrder.total || 0).toFixed(2)})</span>
                </a>
              </div>
            )}

            {/* If Pending Payment, allow attaching Receipt / Operation Number */}
            {orderStatusLabel === 'Pendiente de pago' && (
              <form
                onSubmit={handleLateReceiptSubmit}
                className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4"
              >
                <h3 className="text-sm font-extrabold text-[#0B1F3A] flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#E8440A]" />
                  ¿Ya realizaste el pago? Envía tu comprobante para revisión
                </h3>
                <p className="text-xs text-slate-600">
                  Los pagos manuales pasan a <strong>Pago en revisión</strong> una vez adjuntado el número de operación o captura, y nunca se marcan como pagados sin verificación real.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={lateOpNumber}
                    onChange={(e) => setLateOpNumber(e.target.value)}
                    placeholder="Número de operación Yape / Plin / Banco"
                    className="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
                  />
                  <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-bold text-[#1668E3] cursor-pointer hover:bg-blue-50/40">
                    <Upload className="w-4 h-4" />
                    <span>{lateReceiptImg ? 'Captura cargada ✓' : 'Adjuntar captura de pago'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
                {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}
                {receiptUpdatedSuccess && (
                  <p className="text-xs text-emerald-700 font-bold">
                    Comprobante recibido. Tu pedido ahora está en estado: Pago en revisión.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isUpdatingReceipt}
                  className="px-5 py-2.5 rounded-xl bg-[#1668E3] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  {isUpdatingReceipt ? 'Enviando comprobante...' : 'Enviar Comprobante a Revisión'}
                </button>
              </form>
            )}

            {/* Direct WhatsApp Fulfillment & Support */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={whatsappOrderConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notificar y Agilizar Entrega por WhatsApp</span>
              </a>

              <button
                onClick={goToHome}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors cursor-pointer"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CHECKOUT FORM VIEW ---
  return (
    <div className="min-h-screen bg-[#F4F7FB] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={goToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#1668E3] mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Form */}
          <form onSubmit={handleCompleteOrder} className="lg:col-span-7 space-y-6">
            {/* Step 1: Buyer Data */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#1668E3] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#0B1F3A]">
                  Datos para la Entrega Digital
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo electrónico (donde recibirás tu pedido) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Número de WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej. 987 654 321"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection (Peru) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#1668E3] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#0B1F3A]">
                  Selecciona el Método de Pago
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mercadopago')}
                  className="p-4 rounded-xl border-2 border-[#009EE3] bg-sky-50/50 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-[#009EE3]" />
                    <span className="font-extrabold text-xs sm:text-sm text-[#0B1F3A]">
                      Mercado Pago
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Yape, Tarjeta de crédito o débito y PagoEfectivo
                  </span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-slate-700 leading-relaxed">
                Serás redirigido de forma segura a <strong>Mercado Pago Perú</strong> para pagar con <strong>Yape, tarjeta de crédito o débito, o PagoEfectivo</strong> en Soles (S/). UPCLIC nunca almacena números de tarjeta ni códigos CVV.
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs font-bold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 px-6 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] disabled:opacity-50 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando tu pedido...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Confirmar Pedido por {formatPrice(cartTotals.total)}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24">
              <h3 className="text-base font-extrabold text-[#0B1F3A] pb-4 border-b border-slate-100">
                Resumen de Productos ({cartTotals.totalQuantity})
              </h3>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-3">
                {items.map((item) => {
                  const unitPrice = item.unitPrice ?? item.product.price;
                  return (
                    <div key={item.id || item.product.id} className="py-3 flex items-center gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain rounded-lg border border-slate-200/80 p-1 bg-slate-50 shrink-0"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (item.product.fallbackImage && target.src !== item.product.fallbackImage) {
                            target.src = item.product.fallbackImage;
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0B1F3A] truncate">
                          {item.quantity}x {item.product.name}
                        </p>
                        {item.variantName && (
                          <span className="text-[10px] font-bold text-[#1668E3] block">
                            {item.variantName}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{item.product.duration}</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#0B1F3A] shrink-0">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatPrice(cartTotals.subtotal)}</span>
                </div>
                {cartTotals.hasDiscount && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Descuento ({cartTotals.discountReason}):</span>
                    <span>- {formatPrice(cartTotals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-extrabold text-[#0B1F3A] pt-2 border-t border-slate-100">
                  <span>Total en Soles:</span>
                  <span className="text-2xl text-[#0B1F3A]">S/ {cartTotals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Entrega digital en tu correo y WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1668E3] shrink-0" />
                  <span>Garantía oficial UPCLIC y soporte técnico en vivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
