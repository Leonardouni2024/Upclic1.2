import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Tag,
  CreditCard,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  ArrowLeft,
  RefreshCw,
  Upload,
  Save,
  X
} from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../firebase';
import { useCart } from '../context/CartContext';
import { Product, OrderStatus, CatalogCategory, PaymentSettings } from '../types';
import { OFFICIAL_CATEGORIES, getCategoryLabel } from '../products';

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pendiente de pago',
  'Pago en revisión',
  'Pagado',
  'En preparación',
  'Entregado',
  'Cancelado'
];

export const AdminPanel: React.FC = () => {
  const { goToHome, refreshCatalog } = useCart();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'orders' | 'products' | 'coupons' | 'payments'
  >('orders');

  const [loadingData, setLoadingData] = useState(false);
  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    paidOrdersCount: 0,
    reviewOrdersCount: 0,
    pendingOrdersCount: 0,
    totalRevenuePEN: 0,
    totalProductsCount: 0,
    activeProductsCount: 0
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentSettings | null>(null);

  // Order filter & receipt modal
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any | null>(null);

  // Product Form Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // New Coupon inputs
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Status feedback
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const getAuthToken = async (): Promise<string> => {
    if (!currentUser) return '';
    return await currentUser.getIdToken();
  };

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser || currentUser.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return;
    setLoadingData(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'No se pudo cargar el panel.');
      }
      const data = await res.json();
      setStats(data.stats || {});
      setOrders(data.orders || []);
      setProductsList(data.products || []);
      setCouponsList(data.coupons || []);
      setPaymentConfig(data.paymentSettings || null);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      fetchDashboardData();
    }
  }, [currentUser, fetchDashboardData]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        setAuthError(
          `Acceso restringido. La cuenta ${result.user.email} no tiene permisos de administrador en UPCLIC.`
        );
      }
    } catch (err: any) {
      setAuthError('Error al iniciar sesión con Google. Verifica la ventana emergente.');
    }
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        showToast(`Pedido ${orderId} actualizado a: ${newStatus}`);
        fetchDashboardData();
      }
    } catch {
      showToast('Error al actualizar el estado del pedido.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || editingProduct.price === undefined) return;
    setSavingProduct(true);
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editingProduct,
          price: Number(editingProduct.price),
          oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : undefined,
          category: editingProduct.category || 'office',
          duration: editingProduct.duration || '12 meses',
          imageUrl: editingProduct.imageUrl || '/products/office-2024.webp',
          fallbackImage: editingProduct.fallbackImage || editingProduct.imageUrl || '/products/office-2024.png',
          description: editingProduct.description || '',
          features: Array.isArray(editingProduct.features)
            ? editingProduct.features
            : ['Licencia / suscripción digital verificada', 'Soporte y garantía oficial UPCLIC'],
          compatibility: editingProduct.compatibility || 'Windows, Mac, Android e iOS',
          downloadUrl: editingProduct.downloadUrl || 'https://upclic.store',
          installationSteps: Array.isArray(editingProduct.installationSteps)
            ? editingProduct.installationSteps
            : ['Recibirás las instrucciones y accesos en tu correo y WhatsApp tras verificar el pago.'],
          rating: editingProduct.rating || 4.95,
          reviews: editingProduct.reviews || 12,
          stock: Number(editingProduct.stock ?? 30),
          active: editingProduct.active !== false
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductsList(data.products || []);
        setEditingProduct(null);
        await refreshCatalog();
        showToast('Producto guardado correctamente en el catálogo.');
      }
    } catch {
      showToast('Error al guardar el producto.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleProductActive = async (prod: Product) => {
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...prod,
          active: prod.active === false ? true : false
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductsList(data.products || []);
        await refreshCatalog();
        showToast(
          `Producto "${prod.name}" ${prod.active === false ? 'activado' : 'desactivado'}.`
        );
      }
    } catch {}
  };

  const handleDeleteProduct = async (prodId: string) => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/products/${encodeURIComponent(prodId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductsList(data.products || []);
        await refreshCatalog();
        showToast('Producto eliminado del catálogo.');
      }
    } catch {}
  };

  const handleImageUploadForProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingProduct({ ...editingProduct, imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const updated = [
      ...couponsList.filter(c => c.code !== newCouponCode.trim().toUpperCase()),
      {
        code: newCouponCode.trim().toUpperCase(),
        discountPercent: Number(newCouponDiscount) || 10,
        description: newCouponDesc.trim() || `${newCouponDiscount}% de descuento`,
        active: true
      }
    ];
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ coupons: updated })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCouponsList(data.coupons);
        setNewCouponCode('');
        setNewCouponDesc('');
        await refreshCatalog();
        showToast('Cupón guardado.');
      }
    } catch {}
  };

  const handleDeleteCoupon = async (code: string) => {
    const updated = couponsList.filter(c => c.code !== code);
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ coupons: updated })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCouponsList(data.coupons);
        await refreshCatalog();
        showToast('Cupón eliminado.');
      }
    } catch {}
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentConfig) return;
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentConfig)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentConfig(data.paymentSettings);
        await refreshCatalog();
        showToast('Configuración de métodos de pago y analítica guardada.');
      }
    } catch {}
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-6">
        <div className="text-center text-sm font-bold text-slate-600">
          Verificando sesión de administrador...
        </div>
      </div>
    );
  }

  const isAuthorizedAdmin =
    currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#7DB2FF]" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0B1F3A] mb-2">
            Panel de Administración UPCLIC
          </h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Acceso protegido mediante autenticación segura de Google para gestionar productos, precios, pedidos, comprobantes y pagos.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {authError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-5 rounded-xl bg-[#1668E3] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mb-3"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Iniciar Sesión como Administrador</span>
          </button>

          <button
            onClick={goToHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders =
    orderFilter === 'ALL'
      ? orders
      : orders.filter(o => (o.orderStatus || 'Pendiente de pago') === orderFilter);

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-20">
      {/* Top Admin Header */}
      <div className="bg-[#0B1F3A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goToHome}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Volver a la tienda"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <span>Panel de Administración UPCLIC</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  Protegido
                </span>
              </h1>
              <p className="text-xs text-slate-300">Sesión activa: {currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button
              onClick={() => signOut(auth)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-md">
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Real Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              Ingresos Verificados (S/)
            </span>
            <span className="text-2xl font-extrabold text-[#0B1F3A]">
              S/ {Number(stats.totalRevenuePEN || 0).toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              {stats.paidOrdersCount || 0} pedidos pagados / entregados
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              Pagos en Revisión
            </span>
            <span className="text-2xl font-extrabold text-[#E8440A]">
              {stats.reviewOrdersCount || 0}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Con comprobante por validar
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              Total de Pedidos
            </span>
            <span className="text-2xl font-extrabold text-[#0B1F3A]">
              {stats.totalOrders || 0}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {stats.pendingOrdersCount || 0} pendientes de pago
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              Productos en Catálogo
            </span>
            <span className="text-2xl font-extrabold text-[#1668E3]">
              {stats.activeProductsCount || productsList.length}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              De {stats.totalProductsCount || productsList.length} registrados
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1668E3] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pedidos y Comprobantes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#1668E3] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Productos y Categorías ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#1668E3] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promociones y Cupones ({couponsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#1668E3] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Métodos de Pago y Analítica</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & RECEIPTS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#0B1F3A]">
                Gestión de Pedidos y Estados
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {['ALL', ...ORDER_STATUS_OPTIONS].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#0B1F3A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL' ? 'Todos' : st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                No hay pedidos en este estado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase">
                      <th className="py-3 px-3">ID / Fecha</th>
                      <th className="py-3 px-3">Cliente</th>
                      <th className="py-3 px-3">Productos</th>
                      <th className="py-3 px-3">Total / Método</th>
                      <th className="py-3 px-3">Comprobante</th>
                      <th className="py-3 px-3">Estado del Pedido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-3 font-mono">
                          <strong className="text-[#0B1F3A] block">{order.id}</strong>
                          <span className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleString('es-PE')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <strong className="text-slate-800 block">
                            {order.customerName || 'Cliente'}
                          </strong>
                          <span className="text-slate-500 block">{order.customerEmail}</span>
                          {order.customerPhone && (
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1668E3] font-bold hover:underline"
                            >
                              WA: {order.customerPhone}
                            </a>
                          )}
                        </td>
                        <td className="py-3.5 px-3 max-w-xs">
                          {(order.items || []).map((it: any, i: number) => (
                            <div key={i} className="truncate text-slate-700">
                              {it.quantity}x {it.name}{' '}
                              {it.variantName ? `(${it.variantName})` : ''}
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-3">
                          <strong className="text-sm text-[#0B1F3A] block">
                            S/ {Number(order.total || 0).toFixed(2)}
                          </strong>
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {order.channel || order.gateway || 'yape'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {order.operationNumber && (
                            <span className="block font-mono text-[11px] text-slate-700">
                              Op: {order.operationNumber}
                            </span>
                          )}
                          {order.receiptImage ? (
                            <button
                              onClick={() => setSelectedReceiptOrder(order)}
                              className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1668E3] font-bold hover:bg-blue-100 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver captura
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Sin captura</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <select
                            value={order.orderStatus || 'Pendiente de pago'}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-xs bg-white text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1668E3]"
                          >
                            {ORDER_STATUS_OPTIONS.map(st => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS & CATEGORIES */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-[#0B1F3A]">
                  Gestión de Catálogo y Precios ({productsList.length} productos)
                </h2>
                <p className="text-xs text-slate-500">
                  Agrega, edita precios en Soles (S/), asigna categorías o activa/desactiva productos.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingProduct({
                    name: '',
                    category: 'streaming',
                    price: 15,
                    oldPrice: 30,
                    duration: '1 Mes',
                    stock: 30,
                    active: true,
                    description: '',
                    imageUrl: '/products/prime-video.svg'
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase">
                    <th className="py-3 px-3">Producto</th>
                    <th className="py-3 px-3">Categoría</th>
                    <th className="py-3 px-3">Precio (S/)</th>
                    <th className="py-3 px-3">Duración</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsList.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-10 h-10 object-contain rounded-lg border border-slate-200 p-1 bg-white shrink-0"
                        />
                        <div>
                          <strong className="text-[#0B1F3A] block">{prod.name}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /producto/{prod.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {getCategoryLabel(prod.category)}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-sm text-[#0B1F3A]">
                          S/ {Number(prod.price).toFixed(2)}
                        </strong>
                        {prod.oldPrice && (
                          <span className="block text-[11px] text-slate-400 line-through">
                            S/ {Number(prod.oldPrice).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{prod.duration}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleProductActive(prod)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                            prod.active !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {prod.active !== false ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-2 rounded-lg bg-blue-50 text-[#1668E3] hover:bg-blue-100 cursor-pointer"
                          title="Editar producto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-extrabold text-[#0B1F3A]">
              Promociones y Cupones de Descuento
            </h2>

            <form
              onSubmit={handleAddCoupon}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
            >
              <input
                type="text"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                placeholder="Código (Ej. PERU15)"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase"
              />
              <input
                type="number"
                required
                min={1}
                max={90}
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                placeholder="% Descuento"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                value={newCouponDesc}
                onChange={(e) => setNewCouponDesc(e.target.value)}
                placeholder="Descripción del cupón"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1668E3] hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Guardar Cupón
              </button>
            </form>

            <div className="divide-y divide-slate-100">
              {couponsList.map(c => (
                <div key={c.code} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-extrabold text-[#0B1F3A] bg-blue-50 px-2.5 py-1 rounded-md mr-2">
                      {c.code}
                    </span>
                    <span className="font-bold text-emerald-700">{c.discountPercent}% OFF</span>
                    <span className="text-slate-500 ml-2">— {c.description}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(c.code)}
                    className="text-rose-600 hover:underline font-bold cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT METHODS & ANALYTICS */}
        {activeTab === 'payments' && paymentConfig && (
          <form
            onSubmit={handleSavePaymentSettings}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
          >
            <h2 className="text-base font-extrabold text-[#0B1F3A]">
              Configuración de Pagos (Perú) y Analítica (GA4 / Meta Pixel)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mercado Pago */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                    Mercado Pago Perú (Yape, Tarjetas y PagoEfectivo)
                  </h3>
                  <input
                    type="checkbox"
                    checked={paymentConfig.mercadopago?.enabled !== false}
                    onChange={(e) =>
                      setPaymentConfig({
                        ...paymentConfig,
                        mercadopago: { enabled: e.target.checked }
                      })
                    }
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Procesa pagos en Soles (S/) con Yape, tarjetas de crédito/débito y PagoEfectivo a través de la pasarela oficial de Mercado Pago.
                </p>
              </div>

              {/* PayPal */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-[#0B1F3A]">PayPal (USD $)</h3>
                  <input
                    type="checkbox"
                    checked={paymentConfig.paypal?.enabled !== false}
                    onChange={(e) =>
                      setPaymentConfig({
                        ...paymentConfig,
                        paypal: { enabled: e.target.checked }
                      })
                    }
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Habilita cobros internacionales en dólares americanos (USD).
                </p>
              </div>

              {/* Analítica GA4 & Meta Pixel */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                  Analítica y Conversiones (Opcional)
                </h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Google Analytics 4 Measurement ID (Ej. G-XXXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    value={paymentConfig.analytics?.ga4MeasurementId || ''}
                    onChange={(e) =>
                      setPaymentConfig({
                        ...paymentConfig,
                        analytics: {
                          ...(paymentConfig.analytics || {}),
                          ga4MeasurementId: e.target.value
                        }
                      })
                    }
                    placeholder="G-..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Meta Pixel ID (Numérico)
                  </label>
                  <input
                    type="text"
                    value={paymentConfig.analytics?.metaPixelId || ''}
                    onChange={(e) =>
                      setPaymentConfig({
                        ...paymentConfig,
                        analytics: {
                          ...(paymentConfig.analytics || {}),
                          metaPixelId: e.target.value
                        }
                      })
                    }
                    placeholder="123456789012345"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#1668E3] hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </form>
        )}
      </div>

      {/* Receipt Image Preview Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                  Comprobante del Pedido {selectedReceiptOrder.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Operación: {selectedReceiptOrder.operationNumber || 'No indicada'}
                </p>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto flex items-center justify-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img
                src={selectedReceiptOrder.receiptImage}
                alt="Comprobante de pago"
                className="max-h-80 object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedReceiptOrder.id, 'Pagado');
                  setSelectedReceiptOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Marcar como Pagado
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-[#0B1F3A]">
                {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría *</label>
                <select
                  value={editingProduct.category || 'streaming'}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value as CatalogCategory
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {OFFICIAL_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Duración *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.duration || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, duration: e.target.value })
                  }
                  placeholder="Ej. 1 Mes / 12 Meses / Permanente"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Precio en Soles (S/) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price ?? 0}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Precio Anterior (S/ - Opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.oldPrice ?? ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      oldPrice: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  URL de Imagen o Subir Imagen
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProduct.imageUrl || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    }
                    placeholder="/products/prime-video.svg o https://..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 cursor-pointer inline-flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadForProduct}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Condiciones de uso (OEM / Retail / Perfil / Cuenta completa)
                </label>
                <input
                  type="text"
                  value={editingProduct.termsOfUse || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, termsOfUse: e.target.value })
                  }
                  placeholder="Especifica claramente las condiciones de uso..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="px-5 py-2 rounded-xl bg-[#1668E3] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                {savingProduct ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
