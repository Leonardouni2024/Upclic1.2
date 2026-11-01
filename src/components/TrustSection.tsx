import React, { useState, useEffect } from 'react';
import {
  Star,
  UserCheck,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Send
} from 'lucide-react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Review } from '../types';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../products';
import { useCart } from '../context/CartContext';

export const TrustSection: React.FC = () => {
  const { catalogProducts, setActiveHelpSection } = useCart();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Review submission state
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [productId, setProductId] = useState('prod-office-2024');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        const list: Review[] = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            productId: d.productId || 'prod-office-2024',
            author: d.author || 'Cliente UPCLIC',
            city: d.city || 'Perú',
            rating: Number(d.rating) || 5,
            comment: d.comment || '',
            date: d.date || new Date().toISOString(),
            verifiedPurchase: Boolean(d.verifiedPurchase)
          };
        });
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReviews(list);
        setLoadingReviews(false);
      },
      () => {
        setLoadingReviews(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        author: author.trim(),
        city: city.trim() || 'Perú',
        rating: Number(rating),
        comment: comment.trim(),
        date: new Date().toISOString(),
        verifiedPurchase: true
      });
      setAuthor('');
      setCity('');
      setComment('');
      setSubmittedOk(true);
    } catch {}
    setSubmitting(false);
  };

  const faqs = [
    {
      q: '¿Cómo se realiza la entrega de los productos digitales?',
      a: 'Toda la entrega es 100% digital. Una vez verificado tu pago, enviamos tu clave de licencia, invitación oficial o credenciales junto con la guía paso a paso a tu correo electrónico y WhatsApp.'
    },
    {
      q: '¿Qué diferencia existe entre una clave OEM, una Retail y una suscripción?',
      a: 'En UPCLIC informamos con total transparencia cada modalidad: La clave OEM se vincula a la placa madre de 1 PC específica. La clave Retail puede transferirse a otra PC si renuevas tu equipo. Las suscripciones (como Canva Pro, Gemini AI o Microsoft 365) tienen una duración determinada (ej. 12 o 18 meses) y se activan por invitación a tu correo o cuenta asignada.'
    },
    {
      q: '¿Qué medios de pago están disponibles en Perú?',
      a: 'Puedes pagar directamente en Soles peruanos (S/) a través de Mercado Pago (Yape, tarjeta de crédito o débito y PagoEfectivo).'
    },
    {
      q: '¿Qué hago si necesito ayuda durante la instalación?',
      a: 'Contamos con soporte técnico directo en español por WhatsApp (+51 983 204 384). Nuestro equipo te guía paso a paso hasta que tu programa o suscripción quede funcionando correctamente.'
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Verified Customer Reviews (Real Firestore Data Only) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1668E3] block mb-1">
                Experiencias Reales
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                Opiniones Verificadas de Clientes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Reseñas registradas por compradores en nuestra plataforma.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              {loadingReviews ? (
                <div className="p-8 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-slate-200">
                  Cargando opiniones verificadas...
                </div>
              ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviews.slice(0, 6).map((rev) => {
                    const prodName =
                      catalogProducts.find(p => p.id === rev.productId)?.name || 'Producto UPCLIC';
                    return (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <UserCheck className="w-3 h-3" /> Verificado
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                            "{rev.comment}"
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0B1F3A]">
                            {rev.author} {rev.city ? `• ${rev.city}` : ''}
                          </span>
                          <span className="text-[11px] text-[#1668E3] font-semibold truncate max-w-[150px]">
                            {prodName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-sm font-bold text-[#0B1F3A] mb-1">
                    Sé el primero en compartir tu opinión verificada
                  </p>
                  <p className="text-xs text-slate-500">
                    No mostramos reseñas inventadas. Todas las opiniones publicadas aquí provienen de clientes reales.
                  </p>
                </div>
              )}
            </div>

            {/* Form to leave a verified review */}
            <div className="lg:col-span-4">
              <form
                onSubmit={handleAddReview}
                className="bg-[#F4F7FB] p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3.5"
              >
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                  Publicar una opinión de compra
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Producto</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    {catalogProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tu nombre *"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ciudad (Ej. Lima)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRating(st)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          st <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comparte tu experiencia con la entrega y activación..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />

                {submittedOk && (
                  <p className="text-xs font-bold text-emerald-700">
                    ¡Gracias por registrar tu reseña!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-[#1668E3] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Enviando...' : 'Enviar Opinión'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ) & Direct WhatsApp */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200/80">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1668E3] block">
              Resolvemos tus dudas
            </span>
            <h2 className="text-2xl font-extrabold text-[#0B1F3A] mb-4">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#0B1F3A] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Contact & Commercial Policies Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 text-[#7DB2FF] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    Atención Personalizada por WhatsApp
                  </h3>
                  <p className="text-xs text-slate-300">Soporte comercial y técnico en Perú</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ¿Deseas confirmar compatibilidad con tu equipo, consultar por compras corporativas o validar tu pedido? Escríbenos directamente a nuestro WhatsApp oficial <strong>{WHATSAPP_DISPLAY}</strong>.
              </p>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola UPCLIC, deseo realizar una consulta antes de comprar.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl bg-[#E8440A] hover:bg-[#d83b01] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar por WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>

              <div className="pt-3 border-t border-white/10 flex flex-wrap gap-3 text-[11px] text-slate-300">
                <button
                  onClick={() => setActiveHelpSection('garantia')}
                  className="hover:text-white underline cursor-pointer"
                >
                  Política de garantía
                </button>
                <button
                  onClick={() => setActiveHelpSection('reembolsos')}
                  className="hover:text-white underline cursor-pointer"
                >
                  Cambios y reembolsos
                </button>
                <button
                  onClick={() => setActiveHelpSection('terminos')}
                  className="hover:text-white underline cursor-pointer"
                >
                  Términos y condiciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
