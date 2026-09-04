import React, { useEffect, useState } from 'react';
import { X, Mail, RefreshCw, CheckCircle2, AlertCircle, ShoppingBag, Clock, ShieldCheck, Key, ExternalLink } from 'lucide-react';

interface StoredOrder {
  id: string;
  createdAt: string;
  customerEmail: string;
  customerName?: string | null;
  customerPhone?: string | null;
  total: number;
  items: {
    name: string;
    variantName?: string | null;
    quantity: number;
    unitPrice: number;
  }[];
  status: string;
  channel: string;
  preferenceId?: string;
  discountAmount?: number;
  discountReason?: string | null;
}

interface EmailStatus {
  isConfigured: boolean;
  adminEmail: string;
  smtpHost: string;
  smtpUserConfigured: boolean;
  message: string;
}

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'emailConfig'>('orders');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchOrdersAndStatus = async () => {
    setLoading(true);
    try {
      const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

      const [ordersRes, statusRes] = await Promise.all([
        fetch(`${apiBase}/api/orders`).then(r => r.json()).catch(() => ({ orders: [] })),
        fetch(`${apiBase}/api/admin/email_status`).then(r => r.json()).catch(() => null)
      ]);

      if (ordersRes && Array.isArray(ordersRes.orders)) {
        setOrders(ordersRes.orders);
      }
      if (statusRes) {
        setEmailStatus(statusRes);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    setTestResult(null);
    try {
      const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
      const res = await fetch(`${apiBase}/api/admin/send_test_email`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message: `¡Correo de prueba enviado con éxito a ${data.recipient || 'tu Gmail'}! Revisa tu bandeja de entrada o spam.`
        });
      } else {
        setTestResult({
          success: false,
          message: `Error al enviar: ${data.error || 'No se pudo conectar al servidor de Google.'}`
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Error de conexión: ${e.message || 'Servidor no respondió'}`
      });
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrdersAndStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-[#00C0F3] border border-blue-500/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Panel de Pedidos & Notificaciones</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {orders.length} pedidos
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Registro en tiempo real de clientes, correos de entrega y compras de licencias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrdersAndStatus}
              title="Recargar datos"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos Registrados ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('emailConfig')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'emailConfig'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Configuración de Correos & Notificaciones</span>
            {emailStatus?.isConfigured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0066FF]" />
                  Cargando pedidos registrados...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl p-8">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">Aún no hay pedidos registrados</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Cuando un cliente ingresa su correo en el checkout y procede con Mercado Pago o WhatsApp, aparecerá aquí inmediatamente.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-blue-300 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                              {ord.id}
                            </span>
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              ord.channel === 'mercado_pago'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {ord.channel === 'mercado_pago' ? 'Mercado Pago' : 'WhatsApp'}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-900">
                            <Mail className="w-3.5 h-3.5 text-[#0066FF]" />
                            <span className="font-mono text-sm text-[#0066FF]">{ord.customerEmail}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-500 block">Monto total</span>
                          <span className="text-lg font-black text-slate-900">
                            S/ {ord.total.toFixed(2)}
                          </span>
                          <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(ord.createdAt).toLocaleString('es-PE')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Licencias solicitadas:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between">
                              <span className="font-semibold text-slate-800 truncate mr-2">
                                {it.name} {it.variantName ? `(${it.variantName})` : ''}
                              </span>
                              <span className="text-slate-600 font-mono font-bold shrink-0">
                                x{it.quantity} (S/ {(it.unitPrice * it.quantity).toFixed(2)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer contact button */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 text-[11px]">
                          {ord.customerName ? `👤 ${ord.customerName} ` : ''}
                          {ord.customerPhone ? `📱 ${ord.customerPhone}` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${ord.customerEmail}?subject=Entrega de Licencia UpClic - Pedido ${ord.id}&body=Hola, gracias por tu compra en UpClic. Adjuntamos tus claves de activación...`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-600" />
                            Enviar claves por Email
                          </a>
                          <a
                            href={`https://wa.me/51927465597?text=${encodeURIComponent(`Hola, gestionando entrega para el cliente con correo ${ord.customerEmail}, pedido ${ord.id}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            WhatsApp UpClic
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'emailConfig' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      ¿Por qué no llegó el correo en tu prueba y qué falta?
                    </h3>
                    <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                      ¡Tu prueba con <strong>pedrito2728@gmail.com</strong> sí fue capturada y registrada con éxito en el sistema (puedes verla en la pestaña de pedidos)! Sin embargo, para que un correo llegue físicamente a tu bandeja de Gmail, intervienen 2 factores:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-blue-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
                      <span>En Mercado Pago:</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Al presionar "Pagar con Mercado Pago", se genera el link de pago. Mercado Pago <strong>únicamente envía un correo de comprobante oficial al cliente una vez que el pago ha sido efectivamente pagado y aprobado</strong> (con tarjeta de débito/crédito o QR Yape). Si solo se abre la pasarela de prueba sin pagar, Mercado Pago no despacha recibo.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-blue-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">2</span>
                      <span>Envíos automáticos desde la Tienda:</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Para que la tienda web envíe un correo propio de bienvenida o confirmación a <strong>{emailStatus?.adminEmail || 'leoch5829@gmail.com'}</strong> y al cliente, el servidor Node.js necesita un emisor SMTP de Gmail configurado con su contraseña de aplicación.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  <span>Estado actual del servicio de correo SMTP</span>
                </h4>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Correo administrador de alertas:</span>
                    <span className="text-slate-600 font-mono text-xs">{emailStatus?.adminEmail || 'leoch5829@gmail.com'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Destinatario Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Servidor emisor SMTP:</span>
                    <span className="text-slate-600">{emailStatus?.smtpHost || 'smtp.gmail.com'} (Puerto 465)</span>
                  </div>
                  {emailStatus?.isConfigured ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conectado a Gmail
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Requiere credenciales
                    </span>
                  )}
                </div>

                {/* Send Test Email Button & Result */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Probar envío en vivo
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      Envía un correo de comprobación de prueba a {emailStatus?.adminEmail || 'leoch5829@gmail.com'}
                    </span>
                  </div>
                  <button
                    onClick={handleSendTestEmail}
                    disabled={sendingTest}
                    className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {sendingTest ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Enviar Correo de Prueba</span>
                      </>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-start gap-2.5 ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="leading-relaxed">
                      {testResult.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>UpClic Licencias Digitales • Panel de Gestión</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
