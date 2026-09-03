import React, { useState } from 'react';
import { useReviews } from '../context/ReviewsContext.tsx';
import { Product } from '../types.ts';
import {
  Star,
  MessageSquarePlus,
  CheckCircle2,
  ThumbsUp,
  Filter,
  Send,
  ShieldCheck,
  Award,
  Database,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { getProductReviews, getProductStats, addReview, connectionStatus, isSaving, syncWithServer } = useReviews();

  const reviews = getProductReviews(product.id);
  const stats = getProductStats(product.id);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter & Sort State
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  const ratingDescriptions: Record<number, string> = {
    1: 'Malo - No cumplió expectativas',
    2: 'Regular - Podría mejorar',
    3: 'Bueno - Cumple lo esperado',
    4: 'Muy bueno - Satisfecho con el software',
    5: 'Excelente - Totalmente recomendado'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (rating < 1 || rating > 5) {
      setFormError('Por favor selecciona una calificación de 1 a 5 estrellas.');
      return;
    }

    if (!author.trim()) {
      setFormError('Por favor ingresa tu nombre.');
      return;
    }

    if (comment.trim().length < 8) {
      setFormError('Tu opinión debe tener al menos 8 caracteres para ser de ayuda a otros compradores.');
      return;
    }

    await addReview({
      productId: product.id,
      author: author.trim(),
      city: city.trim() || undefined,
      rating,
      comment: comment.trim()
    });

    setSubmittedSuccess(true);
    setAuthor('');
    setCity('');
    setComment('');
    setRating(5);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowForm(false);
    }, 3500);
  };

  // Filter and Sort Reviews
  const filteredReviews = reviews
    .filter(r => {
      if (filterStars === 'all') return true;
      return r.rating === filterStars;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      // 'recent' by default
      return b.id.localeCompare(a.id);
    });

  return (
    <section id="customer-reviews-section" className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 text-[#0066FF] text-xs font-bold uppercase tracking-wider border border-blue-100 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-[#0066FF]" />
              <span>Opiniones Verificadas</span>
            </div>

            {/* Database Connection Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : connectionStatus === 'syncing'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Estado de conexión con la base de datos de reseñas"
            >
              <Database className="w-3 h-3" />
              <span>
                {connectionStatus === 'connected'
                  ? 'Conexión activa a base de datos'
                  : connectionStatus === 'syncing'
                  ? 'Sincronizando reseñas...'
                  : 'Guardado local sincronizado'}
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
            Calificaciones y Reseñas de Clientes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Experiencias reales de clientes que han activado {product.name}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => syncWithServer()}
            title="Sincronizar reseñas con la base de datos"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#0066FF] hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Sincronizar base de datos"
          >
            <RefreshCw className={`w-4 h-4 ${connectionStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setSubmittedSuccess(false);
              setFormError(null);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer active:scale-98 border border-blue-500/20"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showForm ? 'Ocultar formulario' : 'Escribir una opinión'}</span>
          </button>
        </div>
      </div>

      {/* Scorecard & Rating Breakdown Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Col 1: Average Rating Score (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-slate-100 md:pr-6">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight tabular-nums">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex text-amber-400 gap-1 my-2">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = star <= Math.round(stats.averageRating);
                return (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                );
              })}
            </div>
            <p className="text-xs font-bold text-slate-500">
              Basado en <span className="text-slate-900 font-black">{stats.totalReviews}</span> {stats.totalReviews === 1 ? 'opinión' : 'opiniones'}
            </p>
            <span className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Claves originales probadas
            </span>
          </div>

          {/* Col 2: Star Distribution Progress Bars (8 cols) */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = stats.distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;

              return (
                <div
                  key={stars}
                  onClick={() => setFilterStars(filterStars === stars ? 'all' : stars)}
                  className={`flex items-center gap-3 text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                    filterStars === stars ? 'bg-blue-50/70 border border-blue-100' : 'hover:bg-slate-50'
                  }`}
                  title={`Filtrar por ${stars} estrellas`}
                >
                  <div className="flex items-center gap-1 w-20 shrink-0 text-slate-700 font-bold">
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-slate-400 font-normal">estrellas</span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stars >= 4 ? 'bg-amber-400' : stars === 3 ? 'bg-amber-300' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Percentage & Count */}
                  <div className="w-16 text-right shrink-0 flex items-center justify-end gap-1 font-bold text-slate-600 tabular-nums text-[11px]">
                    <span>{percentage}%</span>
                    <span className="text-slate-400 font-normal">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Submission Form Card */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-blue-200 shadow-md p-6 sm:p-8 mb-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0066FF]" />
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Calificar y opinar sobre {product.name}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Paso 1 de 1
            </span>
          </div>

          {submittedSuccess ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-emerald-900">
                ¡Muchas gracias por tu reseña!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-700 mt-1 max-w-md mx-auto">
                Tu opinión ha sido guardada en la base de datos de UpClic y ya se refleja en la calificación oficial del producto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tu Calificación: *
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map(star => {
                      const isActive = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer"
                          aria-label={`Calificar con ${star} estrellas`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isActive ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Name and City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tu Nombre o Apodo: *
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="Ej: Roberto M. / Ing. Carlos"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Ciudad o Región: (opcional)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Ej: Lima, Arequipa, Trujillo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  />
                </div>
              </div>

              {/* Written Review Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tu Opinión / Comentario: *
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Cuéntanos tu experiencia: ¿cómo fue la compra, la atención de soporte, la velocidad de entrega y la activación de la clave?"
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all leading-relaxed"
                />
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                  <span>Mínimo 8 caracteres</span>
                  <span>{comment.length} caracteres</span>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer border border-blue-500/20 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando en servidor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar y guardar opinión</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filters and Sorting Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Star filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterStars('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStars === 'all'
                ? 'bg-[#0066FF] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Todas ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map(s => {
            const count = stats.distribution[s as 1 | 2 | 3 | 4 | 5] || 0;
            if (count === 0 && filterStars !== s) return null;
            return (
              <button
                key={s}
                onClick={() => setFilterStars(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  filterStars === s
                    ? 'bg-[#0066FF] text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{s}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Ordenar por:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066FF] cursor-pointer"
          >
            <option value="recent">Más recientes</option>
            <option value="highest">Mayor calificación</option>
            <option value="lowest">Menor calificación</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map(review => {
            return (
              <article
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                  {/* Author & City */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 text-[#0066FF] font-black text-sm flex items-center justify-center border border-blue-200/60 shrink-0">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-slate-900 text-sm">
                          {review.author}
                        </h4>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Compra Verificada
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        {review.city && (
                          <>
                            <span>{review.city}, Perú</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 self-start sm:self-auto">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800 tabular-nums">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-13">
                  {review.comment}
                </p>

                {/* Helpful badge footer */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 pl-0 sm:pl-13">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    Activación verificada en Microsoft
                  </span>
                  <span>UpClic Reseñas</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/90 shadow-2xs text-slate-500 text-xs">
          No hay opiniones con {filterStars} estrellas aún.{' '}
          <button
            onClick={() => setFilterStars('all')}
            className="text-[#0066FF] font-bold hover:underline ml-1"
          >
            Ver todas las opiniones
          </button>
        </div>
      )}
    </section>
  );
};
