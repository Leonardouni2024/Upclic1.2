import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const isEmail = searchTerm.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(searchTerm)}` : `id=${encodeURIComponent(searchTerm)}`;
      
      const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
      const res = await fetch(`${apiBase}/api/orders/lookup?${param}`);
      const data = await res.json();
      
      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Mis Pedidos</h2>
              <p className="text-xs text-slate-500 font-medium">Consulta el estado de tus compras anteriores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingresa tu correo o ID de transacción..."
                className="w-full pl-10 pr-[88px] sm:pl-12 sm:pr-32 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 sm:left-4 top-3 sm:top-4" />
              <button
                type="submit"
                disabled={loading || !searchTerm.trim()}
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {hasSearched && !loading && orders.length === 0 && (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 mb-1">No encontramos pedidos</h3>
              <p className="text-sm text-slate-500">
                Verifica que el correo o ID de transacción sea correcto e intenta nuevamente.
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Se encontraron {orders.length} pedido(s)
              </h3>
              
              {orders.map((order, idx) => (
                <div key={order.id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orden:</span>
                        <span className="text-sm font-mono font-bold text-slate-700">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString('es-PE', { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                      order.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {order.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                       order.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> : 
                       <AlertCircle className="w-3.5 h-3.5" />}
                      {order.status === 'paid' ? 'PAGADO Y ENTREGADO' : 
                       order.status === 'pending' ? 'PENDIENTE DE PAGO' : 'CANCELADO'}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                            <p className="text-xs font-medium text-slate-500">
                              Cant: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-700 shrink-0">
                          S/ {(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">TOTAL</span>
                    <span className="text-lg font-black text-[#0066FF]">S/ {order.total?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
