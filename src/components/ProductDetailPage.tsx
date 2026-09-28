import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { products, getProductBySlug, getProductDeliveryType, WHATSAPP_DISPLAY, WHATSAPP_NUMBER , formatPrice } from '../products.ts';
import { useCart } from '../context/CartContext.tsx';
import { useReviews } from '../context/ReviewsContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ProductReviewsSection } from './ProductReviewsSection.tsx';
import { ShareModal } from './ShareModal.tsx';
import {
  Star,
  ShoppingCart,
  Zap,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Clock,
  HelpCircle,
  AlertCircle,
  Share2,
  Lock,
  ChevronDown,
  BookOpen,
  CreditCard,
  Send,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { 
    addItem, 
    navigateToHome, 
    navigateToCheckout, 
    t, 
    currency, 
    language,
    formatPrice,
    getProductName,
    getProductDesc,
    getProductFeatures,
    getProductCompatibility,
    getDurationLabel,
    getBadgeLabel
  } = useCart();
  const { getProductStats } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const product = getProductBySlug(slug) || products[0];
  const stats = getProductStats(product.id);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );
  
  const [showScarcity, setShowScarcity] = useState<{ show: boolean, count: number }>({ show: false, count: 0 });

  const productName = getProductName(product);
  const productDesc = getProductDesc(product);
  const productFeatures = getProductFeatures(product);
  const productCompat = getProductCompatibility(product);
  const durationLabel = getDurationLabel(product.duration);
  const badgeLabel = getBadgeLabel(product.badge);

  useEffect(() => {
    // Generate scarcity badge after 15-20 seconds on the page
    const timer = setTimeout(() => {
      // Random count between 2 and 6
      const randomCount = Math.floor(Math.random() * 5) + 2;
      setShowScarcity({ show: true, count: randomCount });
    }, 15000);
    return () => clearTimeout(timer);
  }, [product.id]);

  // Reset selected variant only when navigating to a different product
  useEffect(() => {
    setImgSrc(product.imageUrl);
    setQuantity(1);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product.id, product.slug]);

  const currentVariant = product.variants
    ? product.variants.find(v => v.id === selectedVariantId) || product.variants[0]
    : undefined;

  
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;
  const discountPercent = activeOldPrice && activeOldPrice > activePrice 
    ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100) 
    : 0;


  // Synchronize dynamic SEO title, meta description, and OpenGraph social share tags
  useEffect(() => {
    const variantSuffix = currentVariant ? ` (${currentVariant.name})` : '';
    const pageTitle = `${product.name}${variantSuffix} - S/ ${activePrice.toFixed(2)} | UpClic`;
    document.title = pageTitle;

    const shortDesc = `Compra ${product.name}${variantSuffix} al mejor precio de S/ ${activePrice.toFixed(2)} en UpClic. Licencia digital original, entrega en 10 a 30 min y garantía oficial.`;
    
    // Update or create helper for meta tags
    const updateMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) element.setAttribute('property', propName);
        } else if (selector.includes('name=')) {
          const nameAttr = selector.match(/name="([^"]+)"/)?.[1];
          if (nameAttr) element.setAttribute('name', nameAttr);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    const fullImageUrl = window.location.origin + product.imageUrl;
    const currentUrl = window.location.href;

    updateMetaTag('meta[name="description"]', 'content', shortDesc);
    updateMetaTag('meta[property="og:title"]', 'content', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'content', shortDesc);
    updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
    updateMetaTag('meta[property="og:url"]', 'content', currentUrl);
    updateMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', shortDesc);
    updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);
  }, [product.name, product.imageUrl, activePrice, currentVariant]);

  const handleAddToCart = () => {
    addItem(product, quantity, currentVariant ? currentVariant.id : undefined);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, currentVariant ? currentVariant.id : undefined);
    navigateToCheckout();
  };

  // Related products from same category or complementary
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.bestSeller))
    .slice(0, 4);

  const getDynamicFaqs = () => {
    const isEn = language === 'EN';

    if (product.id === 'prod-gemini-ai-pro') {
      return [
        {
          q: isEn ? 'How do I receive my Gemini AI Pro (18 Months) account?' : '¿Cómo recibo mi cuenta completa de Gemini AI Pro (18 Meses)?',
          a: isEn
            ? 'You will receive the official credentials for your complete Google account (email and temporary password) via email and WhatsApp. You can customize the password and security options immediately.'
            : 'Recibirás en tu correo y WhatsApp las credenciales de tu cuenta completa de Google (correo y contraseña). Puedes cambiar la contraseña y configurar tus métodos de seguridad personales inmediatamente.'
        },
        {
          q: isEn ? 'Can I share the subscription with other users?' : '¿Puedo compartir la cuenta con otras personas?',
          a: isEn
            ? 'Yes! Being the owner of the complete account with the Google One plan, you can invite and share the benefits with up to 5 additional users via family invitation to their personal Gmail.'
            : '¡Sí! Al ser el dueño de la cuenta completa con plan Google One, puedes invitar y compartir el beneficio hasta con 5 usuarios más mediante invitación directa a sus correos Gmail.'
        },
        {
          q: isEn ? 'Is the 5 TB cloud storage private for each user?' : '¿El almacenamiento de 5 TB es privado para cada miembro?',
          a: isEn
            ? '100% private. Files in Google Drive, personal Google Photos, and Gmail emails are strictly confidential and never accessible to other group members.'
            : 'Totalmente privado e independiente. Cada usuario accede con su propio perfil y ningún otro miembro puede ver sus archivos de Drive, fotos ni correos electrónicos.'
        },
        {
          q: isEn ? 'Which AI models and features are included?' : '¿Qué funciones y modelos de IA incluye?',
          a: isEn
            ? 'You get full access to Google’s most advanced multimodal AI models (Gemini Pro / Advanced), native AI assistance in Google Docs, Sheets, Slides, and Gmail, and high-speed processing.'
            : 'Incluye acceso completo a los modelos más avanzados de Inteligencia Artificial de Google (Gemini Pro / Advanced), asistencia integrada de IA en Google Docs, Sheets, Slides y Gmail, y máxima velocidad de procesamiento.'
        },
        {
          q: isEn ? 'Does it include technical support and warranty?' : '¿Cuenta con soporte técnico y garantía?',
          a: isEn
            ? 'Yes, your complete account includes full official warranty and technical support throughout the entire 18 months.'
            : 'Sí, tu cuenta completa cuenta con garantía de funcionamiento total y soporte técnico durante los 18 meses completos.'
        }
      ];
    }

    if (product.id === 'prod-gemini-ai-pro-12m') {
      return [
        {
          q: isEn ? 'How do I receive and activate Gemini AI Pro (12 Months)?' : '¿Cómo recibo y activo mi suscripción a Gemini AI Pro (12 Meses)?',
          a: isEn
            ? 'You will receive the official Google family group invitation link via email and WhatsApp. Open the link with your personal Gmail account and accept the invite. No passwords are ever required.'
            : 'Recibirás en tu correo electrónico y WhatsApp el enlace oficial de invitación de Google para unirte al grupo familiar. Solo debes abrir el enlace con tu cuenta de Gmail personal iniciada y aceptar unirte. No necesitas entregar contraseñas.'
        },
        {
          q: isEn ? 'Is my 5 TB cloud storage private and independent?' : '¿Es privado mi almacenamiento de 5 TB en Google One?',
          a: isEn
            ? '100% private. Although the 5 TB total capacity is shared across the family plan, no other member can view, access, or modify your Google Drive files, Google Photos, or Gmail emails. Your data remains strictly confidential.'
            : 'Totalmente privado e independiente. Aunque los 5 TB de capacidad total se gestionan a través del plan familiar, ningún otro miembro puede ver tus fotos de Google Fotos, archivos de Drive ni correos de Gmail. Tu información es 100% confidencial.'
        },
        {
          q: isEn ? 'Which AI models and features are included?' : '¿Qué funciones y modelos de IA incluye?',
          a: isEn
            ? 'You get full access to Google’s most advanced multimodal AI models, native AI assistance in Google Docs, Sheets, Slides, and Gmail, and high-speed processing.'
            : 'Incluye acceso completo a los modelos más avanzados de Inteligencia Artificial de Google, asistencia integrada de IA en Google Docs, Sheets, Slides y Gmail, y máxima velocidad de procesamiento.'
        },
        {
          q: isEn ? 'Does it work on mobile phones and computers?' : '¿Funciona en teléfonos móviles y computadoras?',
          a: isEn
            ? 'Yes, it works across web browsers (PC and Mac), Android smartphones, iPhone, iPad, and all devices connected to your Google account.'
            : 'Sí, funciona en cualquier navegador web (PC y Mac), smartphones Android, iPhone, iPad y tablets vinculadas a tu cuenta de Google.'
        },
        {
          q: isEn ? 'Does it include technical support and warranty?' : '¿Cuenta con soporte técnico y garantía?',
          a: isEn
            ? 'Yes, your subscription includes full technical warranty and support throughout the entire 12 months.'
            : 'Sí, tu suscripción cuenta con garantía de funcionamiento total y soporte técnico durante los 12 meses completos.'
        }
      ];
    }

    if (product.id === 'prod-canva-pro') {
      return [
        {
          q: isEn ? 'How do I receive Canva Pro?' : '¿Cómo recibo mi acceso a Canva Pro?',
          a: isEn
            ? 'We will send an official Canva invitation link to your personal email. Accepting it upgrades your personal Canva account to Pro for 12 months.'
            : 'Te enviaremos una invitación oficial de Canva directamente a tu correo electrónico personal. Al aceptarla, tu cuenta personal pasa automáticamente a contar con todas las funciones de Canva Pro por 12 meses.'
        },
        {
          q: isEn ? 'Will I keep my existing designs?' : '¿Conservaré mis proyectos y diseños anteriores?',
          a: isEn
            ? 'Yes! All your previous designs, folders, and brand assets remain completely intact in your personal account.'
            : '¡Sí! Todos tus diseños, carpetas y creaciones previas se mantienen intactos en tu cuenta personal.'
        },
        {
          q: isEn ? 'What features does Canva Pro include?' : '¿Qué herramientas incluye Canva Pro?',
          a: isEn
            ? 'Full access to 100M+ premium stock photos and videos, one-click Magic Background Remover, Magic Studio AI tools, and unlimited brand kits.'
            : 'Acceso ilimitado a más de 100 millones de fotos y videos premium, quitafondos mágico de un clic, herramientas de IA Magic Studio y kits de marca con fuentes y logos ilimitados.'
        },
        {
          q: isEn ? 'On which devices can I use Canva?' : '¿En qué dispositivos puedo usar Canva?',
          a: isEn
            ? 'You can use it simultaneously on Web (PC/Mac), mobile apps (Android and iOS), and iPad tablets.'
            : 'Puedes usarlo en cualquier navegador web (PC y Mac), en la app móvil para Android e iOS, y en tablets iPad.'
        },
        {
          q: isEn ? 'Is it guaranteed?' : '¿Tiene garantía de uso?',
          a: isEn
            ? 'Yes, 12 months full warranty with immediate replacement support if needed.'
            : 'Sí, cuenta con garantía total durante los 12 meses completos con asistencia inmediata.'
        }
      ];
    }

    if (product.id === 'prod-duolingo-super') {
      return [
        {
          q: isEn ? 'How is Duolingo Super activated?' : '¿Cómo se activa Duolingo Super?',
          a: isEn
            ? 'You will receive an official activation invitation for your personal Duolingo account. Clicking the link enables Super benefits on your account.'
            : 'Recibirás la invitación oficial para tu cuenta personal de Duolingo (correo personal). Al hacer clic en el enlace, tu cuenta se actualiza al plan Super de inmediato.'
        },
        {
          q: isEn ? 'What benefits do I get with Duolingo Super?' : '¿Qué ventajas obtengo con Duolingo Super?',
          a: isEn
            ? 'Unlimited hearts/lives, zero ads, personalized mistake practice, offline lessons, and all languages unlocked.'
            : 'Vidas infinitas para practicar sin pausas, cero anuncios molestos, repaso personalizado de errores y lecciones descargables sin conexión a internet.'
        },
        {
          q: isEn ? 'Will my streaks and progress be saved?' : '¿Se conserva mi racha y progreso de idiomas?',
          a: isEn
            ? 'Yes! Your learning streak, XP points, and completed lessons remain 100% saved in your account.'
            : '¡Totalmente! Tu racha de días, puntos de experiencia (XP) y avance en cada idioma se mantienen intactos.'
        },
        {
          q: isEn ? 'On which devices can I learn?' : '¿En qué dispositivos puedo usarlo?',
          a: isEn
            ? 'Android, iPhone, iPad, and Web browsers.'
            : 'En smartphones Android, iPhone, iPad y en la versión web para computadoras.'
        },
        {
          q: isEn ? 'How long is the subscription?' : '¿Por cuánto tiempo está activo?',
          a: isEn
            ? '12 months continuous service with full warranty.'
            : '12 meses continuos de servicio con garantía total.'
        }
      ];
    }

    if (product.id.includes('-tel')) {
      return [
        {
          q: isEn ? 'How does automated phone activation work?' : '¿Cómo funciona la activación telefónica automatizada?',
          a: isEn
            ? 'You download the official installer, and use Microsoft’s automated verification system or toll-free hotline to get your permanent Confirmation ID.'
            : 'Descargas el instalador oficial de Microsoft e introduces los bloques numéricos en el sistema telefónico o portal web automatizado de Microsoft para recibir tu ID de confirmación de por vida.'
        },
        {
          q: isEn ? 'Is it a genuine Microsoft activation?' : '¿Es una activación 100% original de Microsoft?',
          a: isEn
            ? 'Yes, it is validated directly on official Microsoft activation servers with permanent lifetime validity.'
            : 'Sí, queda validada directamente en los servidores de Microsoft de por vida para 1 equipo.'
        },
        {
          q: isEn ? 'Is it easy to do?' : '¿Es fácil realizar el proceso?',
          a: isEn
            ? 'Very simple! We include an illustrated step-by-step guide and our technical team is available on WhatsApp to assist you.'
            : '¡Muy sencillo! Incluye guía paso a paso ilustrada y nuestro equipo técnico te acompaña por WhatsApp ante cualquier duda.'
        },
        {
          q: isEn ? 'Can I reinstall if needed?' : '¿Se puede reinstalar en la misma PC?',
          a: isEn
            ? 'Yes, the activation remains permanent for that PC.'
            : 'Sí, la activación es de por vida para esa computadora.'
        },
        {
          q: isEn ? 'Do I get technical support?' : '¿Incluye soporte técnico?',
          a: isEn
            ? 'Yes, full activation warranty and priority support.'
            : 'Sí, garantía total de activación y soporte prioritario por WhatsApp.'
        }
      ];
    }

    // Default FAQs for Standard Keys and Suites
    return [
      {
        q: t('productFaqTitle1'),
        a: product.isAccountAccess
          ? t('productFaqAns1M365')
          : t('productFaqAns1Default')
      },
      {
        q: t('productFaqTitle2'),
        a: t('productFaqAns2')
      },
      {
        q: t('productFaqTitle3'),
        a: product.duration === '1 año'
          ? t('productFaqAns3M365')
          : product.isAccountAccess
          ? t('productFaqAns3M365Corp')
          : t('productFaqAns3Default')
      },
      {
        q: t('productFaqTitle4'),
        a: t('productFaqAns4')
      },
      {
        q: t('productFaqTitle5'),
        a: product.isAccountAccess
          ? t('productFaqAns5M365')
          : product.category === 'windows'
          ? t('productFaqAns5Windows')
          : t('productFaqAns5Default')
      }
    ];
  };

  const faqs = getDynamicFaqs();

  return (
    <div id="product-detail-view" className="py-10 sm:py-14 bg-slate-50 text-slate-800 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#00A3E0] hover:border-[#00A3E0] shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#00A3E0]" />
            <span>{t('backToStore')}</span>
          </button>

          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            {t('home')} / {product.category.toUpperCase()} / {productName}
          </span>
        </div>

        {/* Main Product Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image Column (1:1 Aspect Ratio, clean background) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[480px] aspect-square rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs flex items-center justify-center group overflow-hidden">
                {/* Share Button on Top-Right of the image */}
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-xs transition-all duration-200 cursor-pointer text-xs font-bold active:scale-95 group/share"
                  title={t('productShareTitle')}
                  aria-label={t('productShareTitle')}
                >
                  <Share2 className="w-3.5 h-3.5 text-[#00A3E0]" />
                  <span className="text-[11px] sm:text-xs font-bold">{t('share')}</span>
                </button>

                <img
                  src={imgSrc}
                  alt={productName}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (imgSrc !== product.fallbackImage) {
                      setImgSrc(product.fallbackImage);
                    }
                  }}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
                />
              </div>

              {/* Trust Badge under image */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {t('officialActivationGuaranteed')}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Lock className="w-4 h-4 text-amber-500" />
                  {currency === 'PEN' ? t('securePaymentMercadoPago') : (language === 'ES' ? 'Pago seguro garantizado' : 'Secure payment guaranteed')}
                </span>
              </div>
            </div>

            {/* Information & Purchase Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Warning notice if legacy version */}
                {product.warning && (
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{product.warning}</span>
                  </div>
                )}

                {/* Stars and Reviews */}
                <div
                  onClick={() => {
                    const el = document.getElementById('customer-reviews-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 mb-2 cursor-pointer group w-fit"
                  title={t('productReviewsTitle')}
                >
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(stats.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 tabular-nums group-hover:text-[#00A3E0] transition-colors">
                    {stats.averageRating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-[#00A3E0] underline underline-offset-2 transition-colors">
                    ({stats.totalReviews} {t('productVerifiedRatings')})
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {productName}
                </h1>

                {/* License Tag & Cloud pill & Stock */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-slate-200">
                    {t('modeLabel')} {durationLabel}
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold border border-emerald-200/80 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Stock: {product.stock ?? 30} unid.</span>
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-blue-50 text-[#00A3E0] text-[11px] sm:text-xs font-bold border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('license100Original')}</span>
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-cyan-50 text-cyan-700 text-[11px] sm:text-xs font-bold border border-cyan-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('instantDigitalDeliveryPill')}</span>
                  </span>
                </div>

                {/* Variant Selector (OEM vs Retail) for Windows products */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                        {t('selectKeyType')}
                      </span>
                      <span className="text-[11px] font-bold text-white bg-[#00A3E0] px-2 py-0.5 rounded-md">
                        {currentVariant?.name} ({formatPrice(activePrice)})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariantId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-cyan-50/60 border-[#00A3E0] shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#00A3E0] bg-[#00A3E0]'
                                      : 'border-slate-300 bg-transparent'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span className={`text-xs font-black ${isSelected ? 'text-[#0070ba]' : 'text-slate-800'}`}>
                                  {v.name}
                                </span>
                              </div>
                              {v.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {v.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-sm font-black text-[#0070ba]">
                                {formatPrice(v.price)}
                              </span>
                              {v.oldPrice && (
                                <span className="text-xs text-slate-400 line-through tabular-nums">
                                  {formatPrice(v.oldPrice)}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 leading-snug font-medium">
                              {v.shortDesc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black text-[#0070ba] tabular-nums tracking-tight">
                    {formatPrice(activePrice)}
                  </div>
                  {activeOldPrice && (
                    <span className="text-base sm:text-lg text-slate-400 line-through font-semibold tabular-nums">
                      {formatPrice(activeOldPrice)}
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    {language === 'ES' ? 'Cantidad:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg text-slate-700 hover:bg-slate-200 font-black text-base flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                      aria-label={t('decrease') || 'Decrease'}
                      title={t('decrease') || 'Decrease'}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setQuantity(Math.min(99, Math.max(1, val)));
                        } else if (e.target.value === '') {
                          setQuantity(1);
                        }
                      }}
                      onBlur={() => {
                        if (!quantity || quantity < 1) {
                          setQuantity(1);
                        }
                      }}
                      className="w-12 text-center font-black text-sm text-slate-900 bg-transparent focus:bg-slate-100 focus:outline-none rounded py-1 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label={language === 'ES' ? 'Cantidad deseada' : 'Desired quantity'}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="w-8 h-8 rounded-lg text-slate-700 hover:bg-slate-200 font-black text-base flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                      aria-label={t('increase') || 'Increase'}
                      title={t('increase') || 'Increase'}
                    >
                      +
                    </button>
                  </div>

                  {quantity > 1 && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                      Subtotal: <strong className="text-slate-900 font-black">{formatPrice(activePrice * quantity)}</strong>
                    </span>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      id="detail-add-to-cart-btn"
                      onClick={handleAddToCart}
                      className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-slate-300"
                    >
                      <ShoppingCart className="w-4 h-4 text-slate-600" />
                      <span>{t('addToCart')}</span>
                    </button>

                    <button
                      id="detail-buy-now-btn"
                      onClick={handleBuyNow}
                      className="py-3.5 px-6 rounded-xl bg-[#00A3E0] hover:bg-[#0092cc] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-[#0092cc]"
                    >
                      <Zap className="w-4 h-4 text-white fill-white" />
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>

                  {/* Scarcity & Trust Indicators */}
                  <div className="flex flex-col gap-3 my-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('purchaseWarranty')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('instantEmailDelivery')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('freeRemoteSupport')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('secureEncryptedPayment')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description & Features (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Description */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm text-slate-700">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00A3E0]" />
                <span>{t('productDescriptionTitle')}</span>
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                {productDesc}
              </p>

              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mt-6 mb-3 uppercase tracking-wider">
                {t('keyFeaturesTitle')}
              </h4>
              <ul className="space-y-2.5">
                {productFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compatibility & License details */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm text-slate-700">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00A3E0]" />
                <span>{t('compatibilityAndRequirements')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {productCompat}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-900 block mb-1">{t('licenseDurationLabel')}</span>
                  <span>{durationLabel}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-900 block mb-1">
                    {t('deliveryTypeLabel')}
                  </span>
                  <span>
                    {getProductDeliveryType(product, language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion Column (1 col) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm text-slate-700 h-fit">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00A3E0]" />
              <span>{t('frequentlyAskedQuestions')}</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-100 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'transform rotate-180 text-[#00A3E0]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer Reviews and Rating System */}
        <ProductReviewsSection product={product} />

        {/* Related Products Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('relatedProductsTitle')}
            </h3>
            <button
              onClick={navigateToHome}
              className="text-xs sm:text-sm font-bold text-[#00A3E0] hover:underline cursor-pointer"
            >
              {t('viewAllCatalogArrow')}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Social Media & Product Share Modal */}
      <ShareModal
        product={product}
        currentVariant={currentVariant}
        activePrice={activePrice}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

