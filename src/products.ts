import type { Product, CartTotals, Currency } from './types.ts';

export const WHATSAPP_NUMBER = '51983204384';
export const WHATSAPP_DISPLAY = '+51 983 204 384';
export const MERCADO_PAGO_URL = 'https://www.mercadopago.com.pe';
export const MERCADO_LIBRE_URL = 'https://www.mercadolibre.com.pe/pagina/upclic';
export const MERCADO_LIBRE_DISPLAY = 'Mercado Libre UpClic';
export const INSTAGRAM_URL = 'https://www.instagram.com/upclic.peru/';
export const INSTAGRAM_DISPLAY = '@upclic.peru';

export function getStoredCurrency(): Currency {
  if (typeof window !== 'undefined') {
    const c = localStorage.getItem('upclic_currency') as Currency;
    if (['PEN', 'USD', 'COP', 'MXN'].includes(c)) return c;
  }
  return 'PEN';
}

export function getStoredExchangeRate(): number {
  if (typeof window !== 'undefined') {
    const r = localStorage.getItem('upclic_exchange_rate');
    if (r) {
      const parsed = parseFloat(r);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 3.75;
}

export function getStoredExchangeRates(): { PEN: number; COP: number; MXN: number } {
  const fallback = { PEN: 3.75, COP: 4100, MXN: 19.8 };
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('upclic_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          PEN: Number(parsed.PEN) || fallback.PEN,
          COP: Number(parsed.COP) || fallback.COP,
          MXN: Number(parsed.MXN) || fallback.MXN
        };
      }
    } catch {}
  }
  return fallback;
}

export function formatPrice(priceInPEN: number, customCurrency?: Currency, customRate?: number): string {
  const currency = customCurrency || getStoredCurrency();
  const rates = getStoredExchangeRates();
  const penRate = customRate || rates.PEN || 3.75;
  const priceInUSD = priceInPEN / (penRate || 3.75);

  if (currency === 'USD') {
    return `$ ${priceInUSD.toFixed(2)} USD`;
  }
  if (currency === 'COP') {
    const copRate = rates.COP || 4100;
    const priceInCOP = Math.round(priceInUSD * copRate);
    return `$ ${priceInCOP.toLocaleString('es-CO')} COP`;
  }
  if (currency === 'MXN') {
    const mxnRate = rates.MXN || 19.8;
    const priceInMXN = priceInUSD * mxnRate;
    return `$ ${priceInMXN.toFixed(2)} MXN`;
  }
  return `S/ ${priceInPEN.toFixed(2)}`;
}

export function formatPriceNoSymbol(priceInPEN: number, customCurrency?: Currency, customRate?: number): string {
  const currency = customCurrency || getStoredCurrency();
  const rates = getStoredExchangeRates();
  const penRate = customRate || rates.PEN || 3.75;
  const priceInUSD = priceInPEN / (penRate || 3.75);

  if (currency === 'USD') {
    return priceInUSD.toFixed(2);
  }
  if (currency === 'COP') {
    const copRate = rates.COP || 4100;
    return Math.round(priceInUSD * copRate).toLocaleString('es-CO');
  }
  if (currency === 'MXN') {
    const mxnRate = rates.MXN || 19.8;
    return (priceInUSD * mxnRate).toFixed(2);
  }
  return priceInPEN.toFixed(2);
}

export interface DynamicCoupon {
  code: string;
  discountPercent: number;
  minItems?: number;
  description: string;
  expiresAt?: number;
}

export const DYNAMIC_COUPONS: DynamicCoupon[] = [
  { code: 'UPCLIC10', discountPercent: 10, description: '10% de descuento oficial UpClic' },
  { code: 'COMBO15', discountPercent: 15, minItems: 2, description: '15% de descuento por llevar 2 o más productos' },
  { code: 'VIP20', discountPercent: 20, description: '20% de descuento especial clientes VIP' },
  { code: 'PRICLIC1', discountPercent: 10, description: '10% de descuento exclusivo', expiresAt: 1791417599000 },
  { code: 'UPCLICPROMO', discountPercent: 5, description: '5% de descuento adicional', expiresAt: 1791417599000 }
];

export function validateCoupon(code: string, itemCount: number = 1): { valid: boolean; discountPercent: number; message: string } {
  const cleanCode = code.trim().toUpperCase();
  const found = DYNAMIC_COUPONS.find(c => c.code === cleanCode);
  if (!found) {
    return { valid: false, discountPercent: 0, message: 'Cupón no válido o no encontrado' };
  }
  if (found.expiresAt && Date.now() > found.expiresAt) {
    return { valid: false, discountPercent: 0, message: 'Este cupón ha expirado' };
  }
  if (found.minItems && itemCount < found.minItems) {
    return { valid: false, discountPercent: 0, message: `Este cupón requiere un mínimo de ${found.minItems} productos en el carrito` };
  }
  return { valid: true, discountPercent: found.discountPercent, message: found.description };
}

export function calculateCartTotals(
  items: { product?: Product; quantity: number; selectedVariantId?: string; selectedVariant?: string; unitPrice?: number }[],
  couponCode?: string,
  dynamicCoupon?: DynamicCoupon,
  isMultiItemDiscountActive: boolean = false
): CartTotals {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const product = item.product;
    if (!product) continue;
    let price = item.unitPrice ?? product.price;
    const variantId = (item as any).selectedVariantId || (item as any).selectedVariant;
    if (variantId && product.variants) {
      const v = product.variants.find(va => va.id === variantId);
      if (v) price = v.price;
    }
    subtotal += price * item.quantity;
    totalQuantity += item.quantity;
  }

  let discountAmount = 0;
  let discountRate = 0;
  let discountReason = '';
  let isCouponApplied = false;
  let isMultiItemDiscount = false;

  if (couponCode) {
    const validation = validateCoupon(couponCode, totalQuantity);
    if (validation.valid) {
      discountRate = validation.discountPercent / 100;
      discountAmount = subtotal * discountRate;
      discountReason = validation.message;
      isCouponApplied = true;
    }
  } else if (dynamicCoupon) {
    discountRate = dynamicCoupon.discountPercent / 100;
    discountAmount = subtotal * discountRate;
    discountReason = dynamicCoupon.description;
    isCouponApplied = true;
  } else if (isMultiItemDiscountActive && totalQuantity >= 2) {
    discountRate = 0.15;
    discountAmount = subtotal * discountRate;
    discountReason = '15% Descuento Combo (2+ productos)';
    isMultiItemDiscount = true;
  }

  const total = Math.max(0, subtotal - discountAmount);

  return {
    totalQuantity,
    subtotal,
    hasDiscount: discountAmount > 0,
    discountRate,
    discountAmount,
    total,
    discountReason,
    isMultiItemDiscount,
    isCouponApplied
  };
}

export function searchProducts(query: string, category: string = 'all'): Product[] {
  const q = query.toLowerCase().trim();
  let list = products;
  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }
  if (!q) return list;

  const tokens = q.split(/\s+/).filter(Boolean);
  return list.filter(p => {
    const text = `${p.name} ${p.slug} ${p.description} ${p.category} ${p.badge || ''}`.toLowerCase();
    return tokens.every(t => text.includes(t));
  });
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

export const WINDOWS_STANDARD_STEPS = [
  'Descarga la herramienta oficial Media Creation Tool desde el enlace provisto o crea tu instalador en un USB de al menos 8 GB con Rufus.',
  'Inicia o instala Windows en tu equipo siguiendo el asistente oficial de instalación.',
  'Una vez dentro de Windows, abre Configuración > Sistema > Activación.',
  'Haz clic en "Cambiar la clave de producto" e introduce tu clave alfanumérica de 25 caracteres.',
  'Tu sistema quedará activado de por vida con soporte y actualizaciones oficiales continuas de Microsoft.'
];

export const OFFICE_STANDARD_STEPS = [
  'Descarga el instalador oficial directo de Office provisto en los enlaces de tu compra.',
  'Ejecuta el archivo instalador (.exe o .img) para instalar la suite completa en tu computadora.',
  'Abre cualquier aplicación (Word, Excel o PowerPoint).',
  'Ingresa la clave oficial de activación de 25 caracteres enviada a tu correo o WhatsApp.',
  'Haz clic en "Activar" y disfruta de todas las aplicaciones de por vida sin cobros recurrentes.'
];

export const PROJECT_STANDARD_STEPS = [
  'Descarga el instalador oficial de Microsoft Project desde el enlace provisto.',
  'Ejecuta el instalador para instalar Project en tu equipo.',
  'Abre Microsoft Project e ingresa tu clave oficial de 25 caracteres.',
  'El programa se activará de forma permanente y podrás comenzar a gestionar tus proyectos de inmediato.'
];

export const VISIO_STANDARD_STEPS = [
  'Descarga el instalador oficial de Microsoft Visio desde el enlace provisto.',
  'Ejecuta el archivo para instalar Visio en tu computadora.',
  'Abre Microsoft Visio e ingresa tu clave original de 25 caracteres.',
  'Quedará activado de por vida para crear diagramas profesionales sin suscripciones.'
];

export const COMBO_WIN11_OFFICE2024_STEPS = [
  'Windows: Descargar Media Creation Tool Windows 11 o la ISO oficial y preparar tu USB booteable. Instalar Windows 11 en tu PC.',
  'Activar Windows: Ir a Configuración > Sistema > Activación e ingresar tu clave de 25 caracteres de Windows 11 Pro.',
  'Office: Descargar el instalador directo de Office 2024 Pro Plus y ejecutar el archivo exe para instalar las aplicaciones en tu PC.',
  'Activar Office: Abrir Word o Excel, entrar a Cuenta > Activar producto e introducir tu clave de 25 caracteres de Office 2024 Pro Plus.'
];

export const COMBO_WIN10_OFFICE2021_STEPS = [
  'Windows: Conectar un USB de al menos 8 GB, abrir Rufus, seleccionar la ISO de Windows 10, elegir esquema GPT/MBR y presionar Empezar. Reiniciar la PC con la tecla de booteo (F12/F11/F9) para iniciar desde el USB e instalar Windows.',
  'Activar Windows: Ir a Configuración > Actualización y seguridad > Activación e ingresar tu clave de 25 caracteres de Windows 10 Pro.',
  'Office: Descargar el instalador directo de Office 2021 Pro Plus y ejecutar el archivo exe para instalar las aplicaciones en tu PC.',
  'Activar Office: Abrir Word o Excel, entrar a Cuenta > Activar producto e ingresar tu clave de 25 caracteres de Office 2021 Pro Plus.'
];

export const COMBO_WIN10_OFFICE2024_STEPS = [
  'Windows: Conectar un USB de al menos 8 GB, abrir Rufus, seleccionar la ISO de Windows 10, elegir esquema GPT/MBR y presionar Empezar. Reiniciar la PC con la tecla de booteo (F12/F11/F9) para iniciar desde el USB e instalar Windows.',
  'Activar Windows: Ir a Configuración > Actualización y seguridad > Activación e ingresar tu clave de 25 caracteres de Windows 10 Pro.',
  'Office: Descargar el instalador directo de Office 2024 Pro Plus y ejecutar el archivo exe para instalar las aplicaciones en tu PC.',
  'Activar Office: Abrir Word o Excel, entrar a Cuenta > Activar producto e ingresar tu clave de 25 caracteres de Office 2024 Pro Plus.'
];

export const TELEPHONE_ACTIVATION_STEPS = [
  'Descarga e instala el software oficial de Microsoft utilizando el enlace del instalador directo provisto en tu pedido.',
  'Abre cualquier aplicación (Word, Excel o en Configuración > Activación de Windows) y selecciona la opción "Deseo activar el software por teléfono".',
  'El asistente de activación oficial de Microsoft generará tu Identificador de Instalación (ID de instalación compuesto por varios bloques de números).',
  'Accede al portal web oficial de activación telefónica de Microsoft (o a la línea telefónica gratuita) e introduce tu Identificador de Instalación.',
  'El sistema automatizado de Microsoft verificará los datos y te entregará tu Identificador de Confirmación (bloques de la A a la H). Ingrésalos en la pantalla y el software quedará activado de por vida con garantía de activación de 1 mes.'
];

export const DEFAULT_PRODUCT_STOCK = 30;

const rawProducts: Product[] = [
  // --- OFFICE CLAVES DIRECTAS ---
  {
    id: 'prod-office-2024',
    slug: 'office-2024-pro-plus',
    name: 'Microsoft Office 2024 Professional Plus',
    description: 'Licencia digital oficial permanente para 1 PC. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024. Licencia vitalicia vinculable a tu cuenta de Microsoft.',
    price: 27.00,
    oldPrice: 120.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png',
    rating: 4.98,
    reviews: 342,
    badge: 'MÁS VENDIDO 🔥',
    featured: true,
    bestSeller: true,
    features: [
      'Clave de activación digital de 25 caracteres para 1 PC (Windows 10 u 11)',
      'Activación permanente de por vida (sin pagos mensuales ni suscripciones)',
      'Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024',
      'Actualizaciones oficiales continuas y soporte técnico de por vida',
      'Garantía total de activación y reemplazo por 6 meses'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
    downloadLabel: 'Descargar Office 2024 Pro Plus (.img)',
    downloadOptions: [
      {
        id: 'office2024-exe',
        name: 'Descargar Instalador Directo Office 2024 (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=ProPlus2024Retail&platform=x64&language=es-es',
        badge: 'Recomendado',
        description: 'Instalador online oficial directo de Microsoft. Descarga e instala automáticamente en tu equipo.'
      },
      {
        id: 'office2024-img',
        name: 'Descargar Imagen Offline Completa Office 2024 (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
        badge: 'Instalador Offline',
        description: 'Archivo de imagen ISO completo oficial de Microsoft para instalar sin conexión a internet.'
      }
    ],
    installationSteps: [
      'Descarga el instalador directo de Office 2024 Pro Plus desde el enlace provisto.',
      'Haz doble clic en el instalador descargado para iniciar la instalación automática de Word, Excel, PowerPoint, etc.',
      'Una vez finalizada la instalación, abre cualquier aplicación de Office (por ejemplo, Word).',
      'En la ventana que aparece, ingresa tu clave de 25 caracteres proporcionada en tu compra.',
      'Haz clic en "Activar Office" y tu paquete quedará activado de por vida con soporte y actualizaciones oficiales.'
    ]
  },
  {
    id: 'prod-office-2024-tel',
    slug: 'office-2024-pro-plus-telefono',
    name: 'Office Profesional 2024 (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante el sistema automatizado de activación telefónica de Microsoft. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024 sin pagos mensuales ni suscripciones. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 80.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png',
    rating: 4.88,
    reviews: 145,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave de activación para 1 PC (Windows 10 u 11) mediante activación telefónica automatizada',
      'Permanente de por vida una vez activado (sin suscripciones)',
      'Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024',
      'Guía paso a paso con enlaces directos para activación en 2 minutos',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
    downloadLabel: 'Descargar Office 2024 Pro Plus (.img)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2021-tel',
    slug: 'office-2021-pro-plus-telefono',
    name: 'Office Profesional 2021 (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante el sistema automatizado de activación telefónica de Microsoft. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2021 sin pagos recurrentes. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2021.webp',
    fallbackImage: '/products/office-2021.png',
    rating: 4.89,
    reviews: 198,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave de activación para 1 PC mediante activación telefónica automatizada',
      'Permanente de por vida una vez activado (sin cuotas mensuales)',
      'Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2021',
      'Guía paso a paso con enlaces directos para activación en 2 minutos',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2021Retail.img',
    downloadLabel: 'Descargar Office 2021 Pro Plus (.img)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2019-tel',
    slug: 'office-2019-pro-plus-telefono',
    name: 'Office Profesional 2019 (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante activación telefónica automatizada oficial ante Microsoft. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2019. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 60.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2019.webp',
    fallbackImage: '/products/office-2019.png',
    rating: 4.86,
    reviews: 122,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave de activación para 1 PC mediante activación telefónica oficial automatizada',
      'Permanente de por vida una vez activado',
      'Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2019',
      'Guía paso a paso con enlaces directos para activación rápida',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2019Retail.img',
    downloadLabel: 'Descargar Office 2019 Pro Plus (.img)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2016-tel',
    slug: 'office-2016-pro-plus-telefono',
    name: 'Office Profesional 2016 (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante activación telefónica automatizada ante Microsoft. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2016. Compatible con Windows 7, 8.1, 10 y 11. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 50.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2016.webp',
    fallbackImage: '/products/office-2016.png',
    rating: 4.85,
    reviews: 94,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave de activación para 1 PC mediante activación telefónica automatizada',
      'Permanente de por vida una vez activado',
      'Compatible con Windows 7, Windows 8.1, Windows 10 y Windows 11',
      'Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2016',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 7, 8.1, 10 y 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlusRetail.img',
    downloadLabel: 'Descargar Office 2016 Pro Plus (.img)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2024-3pc',
    slug: 'office-2024-pro-plus-3pc',
    name: 'Microsoft Office 2024 Professional Plus (3 PC)',
    description: 'Paquete de licencias oficiales permanentes para activar hasta 3 computadoras (PC) independientes. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024 sin pagos mensuales ni suscripciones.',
    price: 65.00,
    oldPrice: 320.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png',
    rating: 4.97,
    reviews: 88,
    badge: 'PACK 3 COMPUTADORAS 💻💻💻',
    features: [
      'Activación para hasta 3 computadoras (PC) independientes con Windows 10 u 11',
      'Activación permanente de por vida en cada equipo',
      'Incluye la suite completa: Word, Excel, PowerPoint, Outlook, Access y Publisher 2024',
      'Instaladores oficiales directos incluidos para cada máquina',
      'Garantía oficial completa de 6 meses'
    ],
    compatibility: 'Windows 10 y Windows 11 (Hasta 3 PC)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
    downloadLabel: 'Descargar Office 2024 Pro Plus (.img)',
    downloadOptions: [
      {
        id: 'office2024-3pc-exe',
        name: 'Descargar Instalador Directo Office 2024 (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=ProPlus2024Retail&platform=x64&language=es-es',
        badge: 'Recomendado',
        description: 'Instalador online oficial directo de Microsoft.'
      },
      {
        id: 'office2024-3pc-img',
        name: 'Descargar Imagen Offline Completa (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
        badge: 'Instalador Offline',
        description: 'Imagen completa ISO para instalar en los 3 equipos.'
      }
    ],
    installationSteps: [
      'Descarga el instalador directo de Office 2024 Pro Plus en cada una de las 3 PC.',
      'Instala el software en cada equipo.',
      'Abre Word o Excel en la primera PC e introduce la clave correspondiente.',
      'Repite el proceso en la segunda y tercera PC con las claves suministradas.',
      'Los 3 equipos quedarán activados de por vida con todas las aplicaciones de Office 2024.'
    ]
  },
  {
    id: 'prod-office-2021',
    slug: 'office-2021-pro-plus',
    name: 'Microsoft Office 2021 Professional Plus',
    description: 'Licencia digital oficial permanente para 1 PC. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2021. La versión más estable y compatible para trabajar y estudiar sin suscripciones.',
    price: 25.00,
    oldPrice: 110.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2021.webp',
    fallbackImage: '/products/office-2021.png',
    rating: 4.96,
    reviews: 420,
    badge: 'MÁS VENDIDO 🔥',
    featured: true,
    bestSeller: true,
    features: [
      'Clave original de 25 caracteres para 1 PC (Windows 10 u 11)',
      'Activación vitalicia de por vida sin cuotas mensuales',
      'Incluye Word, Excel, PowerPoint, Outlook, Access y Publisher 2021',
      'Reinstalable en la misma PC tras formateo',
      'Garantía total de activación y reemplazo por 6 meses'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2021Retail.img',
    downloadLabel: 'Descargar Office 2021 Pro Plus (.img)',
    downloadOptions: [
      {
        id: 'office2021-exe',
        name: 'Descargar Instalador Directo Office 2021 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=ProPlus2021Retail&platform=x64&language=es-es',
        badge: 'Recomendado',
        description: 'Instalador online oficial directo de Microsoft.'
      },
      {
        id: 'office2021-img',
        name: 'Descargar Imagen Offline Office 2021 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2021Retail.img',
        badge: 'Instalador Offline',
        description: 'Imagen oficial ISO para instalar sin conexión.'
      }
    ],
    installationSteps: [
      'Descarga el instalador oficial de Office 2021 Pro Plus.',
      'Ejecuta el archivo descargado para iniciar la instalación.',
      'Abre Word o Excel una vez finalizada la instalación.',
      'Introduce tu clave de 25 caracteres enviada a tu correo o WhatsApp.',
      'Presiona "Activar" y disfruta de todas las funciones de por vida.'
    ]
  },
  {
    id: 'prod-office-2021-std',
    slug: 'office-2021-standard',
    name: 'Microsoft Office 2021 Standard',
    description: 'Edición Standard original permanente para 1 PC. Incluye Word, Excel, PowerPoint, Outlook, OneNote y Publisher 2021.',
    price: 24.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2021.webp',
    fallbackImage: '/products/office-2021.png',
    rating: 4.88,
    reviews: 85,
    badge: 'CLAVE DIRECTA',
    features: [
      'Clave original permanente para 1 PC',
      'Word, Excel, PowerPoint, Outlook, OneNote y Publisher 2021',
      'Ideal para oficinas y uso profesional estándar'
    ],
    compatibility: 'Windows 10 y Windows 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/Standard2021Retail.img',
    downloadLabel: 'Descargar Office 2021 Standard (.img)',
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2019',
    slug: 'office-2019-pro-plus',
    name: 'Microsoft Office 2019 Professional Plus',
    description: 'Licencia digital oficial permanente para 1 PC. Incluye Word, Excel, PowerPoint, Outlook, Access y Publisher 2019 sin suscripciones.',
    price: 24.00,
    oldPrice: 90.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2019.webp',
    fallbackImage: '/products/office-2019.png',
    rating: 4.91,
    reviews: 290,
    badge: 'CLAVE DIRECTA',
    features: [
      'Clave original de 25 caracteres para 1 PC',
      'Activación vitalicia sin pagos mensuales',
      'Word, Excel, PowerPoint, Outlook, Access y Publisher 2019'
    ],
    compatibility: 'Windows 10 y Windows 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2019Retail.img',
    downloadLabel: 'Descargar Office 2019 Pro Plus (.img)',
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2016',
    slug: 'office-2016-pro-plus',
    name: 'Microsoft Office 2016 Professional Plus',
    description: 'Licencia original para 1 PC. Máxima compatibilidad con Windows 7, 8.1, 10 y 11. Incluye Word, Excel, PowerPoint, Outlook y Access.',
    price: 24.00,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2016.webp',
    fallbackImage: '/products/office-2016.png',
    rating: 4.88,
    reviews: 195,
    badge: 'CLAVE DIRECTA',
    features: [
      'Clave original de 25 caracteres para 1 PC',
      'Compatible con Windows 7, 8.1, 10 y 11',
      'Word, Excel, PowerPoint, Outlook, Access y Publisher 2016'
    ],
    compatibility: 'Windows 7, 8.1, 10 y 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlusRetail.img',
    downloadLabel: 'Descargar Office 2016 Pro Plus (.img)',
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2013',
    slug: 'office-2013-pro-plus',
    name: 'Microsoft Office 2013 Professional Plus',
    description: 'Edición clásica ligera para equipos de recursos moderados. Compatible con Windows 7, 8, 10 y 11.',
    price: 24.00,
    oldPrice: 55.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2013-pro.webp',
    fallbackImage: '/products/office-2013-pro.png',
    rating: 4.82,
    reviews: 74,
    badge: 'CLAVE DIRECTA',
    features: [
      'Ideal para computadoras antiguas o de bajos recursos',
      'Word, Excel, PowerPoint, Outlook y Access 2013',
      'Licencia permanente de por vida'
    ],
    compatibility: 'Windows 7, 8, 8.1, 10 y 11',
    downloadUrl: 'https://archive.org/download/office-2013-pro-plus-es/Office2013_ProPlus_x64_ES.iso',
    downloadLabel: 'Descargar ISO Office 2013 Pro Plus',
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2010',
    slug: 'office-2010-pro-plus',
    name: 'Microsoft Office 2010 Professional Plus',
    description: 'Versión retro ultra ligera para PC de bajos recursos. Compatible con Windows XP, Vista, 7, 8, 10 y 11.',
    price: 24.00,
    oldPrice: 45.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2010-pro.webp',
    fallbackImage: '/products/office-2010-pro.png',
    rating: 4.80,
    reviews: 62,
    badge: 'CLAVE DIRECTA',
    features: [
      'Funciona en equipos antiguos con Windows XP en adelante',
      'Consumo mínimo de memoria RAM y procesador',
      'Suite completa: Word, Excel, PowerPoint y Access 2010'
    ],
    compatibility: 'Windows XP, Vista, 7, 8, 10 y 11',
    downloadUrl: 'https://archive.org/download/office-2010-pro-plus-sp2-es/Office2010_ProPlus_SP2_x86_x64_ES.iso',
    downloadLabel: 'Descargar ISO Office 2010 Pro Plus',
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-microsoft-365',
    slug: 'microsoft-365-personal-1-ano',
    name: 'Microsoft 365 Personal (Cuenta - 1 Año)',
    description: 'Suscripción oficial a la suite Microsoft 365 por 1 año. Incluye Word, Excel, PowerPoint, Outlook y 100 GB de almacenamiento en la nube OneDrive.',
    price: 33.00,
    oldPrice: 180.00,
    duration: '1 Año (Suscripción)',
    category: 'office',
    imageUrl: '/products/microsoft-365.webp',
    fallbackImage: '/products/microsoft-365.png',
    rating: 4.95,
    reviews: 310,
    badge: 'CUENTA EXCLUSIVA',
    cloudStorage: '100 GB OneDrive Cloud',
    isAccountAccess: true,
    accountNotice: 'Tipo de entrega: Cuenta de acceso oficial exclusiva (1 usuario, hasta en 5 dispositivos) con 100 GB en OneDrive.',
    features: [
      'Tipo de entrega: Cuenta oficial con correo y contraseña asignados',
      'Suscripción oficial garantizada por 1 año',
      '100 GB de almacenamiento en la nube OneDrive seguro y privado',
      'Word, Excel, PowerPoint, Outlook con las últimas funciones de IA',
      'Instalable hasta en 5 dispositivos a la vez (PC, Mac, tablets y celulares)'
    ],
    compatibility: 'Windows 10/11, macOS, iOS y Android (Hasta 5 dispositivos)',
    downloadUrl: 'https://www.office.com',
    downloadLabel: 'Acceder a Portal Office.com',
    installationSteps: [
      'Ingresa a portal.office.com con el correo y contraseña oficial asignados.',
      'Cambia tu contraseña provisional por una personal si el sistema te lo solicita.',
      'Haz clic en el botón superior derecho "Instalar Office" para descargar el instalador.',
      'Ejecuta el archivo descargado para instalar Word, Excel y PowerPoint en tu equipo.',
      'Inicia sesión dentro de cualquier aplicación con tu cuenta para activar la suite y los 100 GB de OneDrive.'
    ]
  },

  // --- WINDOWS CLAVES DIRECTAS ---
  {
    id: 'prod-win11-pro',
    slug: 'windows-11-pro-key',
    name: 'Windows 11 Professional Key 32/64 Bit',
    description: 'Licencia digital oficial original para 1 PC. El sistema operativo más avanzado y seguro de Microsoft. Actualizable gratis desde Windows 10 Pro o para instalación limpia.',
    price: 28.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-pro.webp',
    fallbackImage: '/products/windows-11-pro.png',
    rating: 4.97,
    reviews: 520,
    badge: 'MÁS VENDIDO 🔥',
    featured: true,
    bestSeller: true,
    features: [
      'Clave original de 25 caracteres para 1 PC (32 y 64 Bit)',
      'Activación vitalicia de por vida vinculable al hardware de tu PC',
      'Seguridad avanzada: BitLocker, Windows Sandbox y Windows Defender',
      'Soporte completo para Remote Desktop y virtualización Hyper-V',
      'Garantía total de activación y reemplazo por 6 meses'
    ],
    variants: [
      {
        id: 'oem',
        name: 'Windows 11 Pro OEM',
        type: 'OEM',
        price: 28.00,
        oldPrice: 85.00,
        shortDesc: 'Se vincula a la placa madre de 1 equipo específico.',
        badge: 'OEM • S/ 28'
      },
      {
        id: 'retail',
        name: 'Windows 11 Pro Retail',
        type: 'Retail',
        price: 35.00,
        oldPrice: 105.00,
        shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.',
        badge: 'RETAIL • S/ 35'
      }
    ],
    compatibility: 'Windows 11 (64 Bit) con TPM 2.0 y Secure Boot',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win11-home',
    slug: 'windows-11-home-key',
    name: 'Windows 11 Home Key 64 Bit',
    description: 'Edición Home oficial para uso personal y entretenimiento con interfaz moderna.',
    price: 26.00,
    oldPrice: 75.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-home.webp',
    fallbackImage: '/products/windows-11-home.png',
    rating: 4.91,
    reviews: 210,
    badge: 'CLAVE DIRECTA',
    features: [
      'Widgets, nuevo menú de inicio y controles táctiles avanzados',
      'Seguridad integrada con Windows Defender'
    ],
    variants: [
      { id: 'oem', name: 'Windows 11 Home OEM', type: 'OEM', price: 26.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.', badge: 'OEM • S/ 26' },
      { id: 'retail', name: 'Windows 11 Home Retail', type: 'Retail', price: 32.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.', badge: 'RETAIL • S/ 32' }
    ],
    compatibility: 'Windows 11 (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win11-enterprise',
    slug: 'windows-11-enterprise-key',
    name: 'Windows 11 Enterprise Key 64 Bit',
    description: 'Edición para empresas con funciones avanzadas de gestión, seguridad y despliegue masivo.',
    price: 36.00,
    oldPrice: 130.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-enterprise.webp',
    fallbackImage: '/products/windows-11-enterprise.png',
    rating: 4.93,
    reviews: 95,
    badge: 'EMPRESARIAL 🏢',
    features: [
      'Windows Defender Application Guard y Credential Guard',
      'DirectAccess, BranchCache y virtualización integral'
    ],
    compatibility: 'Windows 11 Enterprise (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win10-pro',
    slug: 'windows-10-pro-key',
    name: 'Windows 10 Professional Key 32/64 Bit',
    description: 'Clave original para Windows 10 Pro. Actualizable gratis a Windows 11 Pro cuando lo desees.',
    price: 26.00,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-pro.webp',
    fallbackImage: '/products/windows-10-pro.png',
    rating: 4.85,
    reviews: 310,
    badge: 'CLAVE DIRECTA',
    features: [
      'Clave vitalicia para 1 PC',
      'Apta para actualización directa desde Windows 10 Home',
      'Soporte completo para Remote Desktop'
    ],
    variants: [
      { id: 'oem', name: 'Windows 10 Pro OEM', type: 'OEM', price: 26.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.', badge: 'OEM • S/ 26' },
      { id: 'retail', name: 'Windows 10 Pro Retail', type: 'Retail', price: 32.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.', badge: 'RETAIL • S/ 32' }
    ],
    compatibility: 'Windows 10 (32 & 64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win10-home',
    slug: 'windows-10-home-key',
    name: 'Windows 10 Home Key 32/64 Bit',
    description: 'Licencia original para usuarios de hogar. Rápido, seguro y estable.',
    price: 25.00,
    oldPrice: 60.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-home.webp',
    fallbackImage: '/products/windows-10-home.png',
    rating: 4.84,
    reviews: 180,
    badge: 'CLAVE DIRECTA',
    features: ['DirectX 12, Cortana y protección integrada'],
    variants: [
      { id: 'oem', name: 'Windows 10 Home OEM', type: 'OEM', price: 25.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.', badge: 'OEM • S/ 25' },
      { id: 'retail', name: 'Windows 10 Home Retail', type: 'Retail', price: 30.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.', badge: 'RETAIL • S/ 30' }
    ],
    compatibility: 'Windows 10 (32/64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win10-enterprise',
    slug: 'windows-10-enterprise-key',
    name: 'Windows 10 Enterprise LTSC Key',
    description: 'Versión corporativa sin aplicaciones innecesarias. Máxima estabilidad.',
    price: 34.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-enterprise.webp',
    fallbackImage: '/products/windows-10-enterprise.png',
    rating: 4.87,
    reviews: 78,
    badge: 'EMPRESARIAL 🏢',
    features: ['Sin telemetría invasiva ni bloatware', 'Soporte extendido por 10 años'],
    compatibility: 'Windows 10 Enterprise LTSC',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win81-pro',
    slug: 'windows-81-pro-key',
    name: 'Windows 8.1 Professional Key',
    description: 'Para equipos compatibles que requieren Windows 8.1 Pro original.',
    price: 38.00,
    oldPrice: 45.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-81-pro.webp',
    fallbackImage: '/products/windows-81-pro.png',
    rating: 4.78,
    reviews: 50,
    badge: 'CLAVE DIRECTA',
    features: ['Activación permanente para 1 PC', 'Estabilidad y rapidez'],
    compatibility: 'Windows 8.1 (32/64 Bit)',
    downloadUrl: 'https://www.microsoft.com/es-es/software-download/windows8ISO',
    downloadLabel: 'Descargar ISO Windows 8.1 Pro',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win7-pro',
    slug: 'windows-7-pro-key',
    name: 'Windows 7 Professional Key',
    description: 'Clave original de por vida para Windows 7 Pro. Ideal para PCs clásicas.',
    price: 32.00,
    oldPrice: 40.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-7-pro.webp',
    fallbackImage: '/products/windows-7-pro.png',
    rating: 4.81,
    reviews: 80,
    badge: 'CLAVE DIRECTA',
    features: ['Ligero y confiable', 'Para máquinas heredadas o sistemas industriales'],
    compatibility: 'Windows 7 Pro (32/64 Bit)',
    downloadUrl: 'https://archive.org/download/windows-7-professional-sp1-es/Win7_Pro_SP1_Spanish_x64.iso',
    downloadLabel: 'Descargar ISO Windows 7 Pro (Español)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win7-ultimate',
    slug: 'windows-7-ultimate-key',
    name: 'Windows 7 Ultimate Key',
    description: 'La versión más completa de Windows 7 con BitLocker y soporte multilingüe.',
    price: 30.00,
    oldPrice: 45.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-7-ultimate.webp',
    fallbackImage: '/products/windows-7-ultimate.png',
    rating: 4.83,
    reviews: 65,
    badge: 'CLAVE DIRECTA',
    features: ['BitLocker y cambio de idioma directo', 'Todas las funciones desbloqueadas'],
    compatibility: 'Windows 7 Ultimate (32/64 Bit)',
    downloadUrl: 'https://archive.org/download/windows-7-ultimate-sp1-es/Win7_Ult_SP1_Spanish_x64.iso',
    downloadLabel: 'Descargar ISO Windows 7 Ultimate (Español)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win11-pro-tel',
    slug: 'windows-11-pro-telefono',
    name: 'Windows 11 Professional (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante el sistema automatizado de activación telefónica de Microsoft. Todas las funciones avanzadas de Windows 11 Pro por una fracción del costo habitual. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-pro.webp',
    fallbackImage: '/products/windows-11-pro.png',
    rating: 4.87,
    reviews: 165,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave para 1 PC mediante activación telefónica automatizada oficial',
      'Permanente de por vida una vez activado (BitLocker, Remote Desktop, Hyper-V)',
      'Instalador directo oficial y enlace al asistente de Microsoft',
      'Guía paso a paso ilustrada para completar en 2 minutos',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 11 (64 Bit) con TPM 2.0 y Secure Boot',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-win11-home-tel',
    slug: 'windows-11-home-telefono',
    name: 'Windows 11 Home (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante el sistema automatizado de activación telefónica de Microsoft. Interfaz fluida, segura y moderna para el hogar y entretenimiento. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 60.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-home.webp',
    fallbackImage: '/products/windows-11-home.png',
    rating: 4.85,
    reviews: 110,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave para 1 PC mediante activación telefónica automatizada ante Microsoft',
      'Permanente de por vida una vez activado',
      'Interfaz moderna con widgets, menús renovados y seguridad Windows Defender',
      'Guía detallada con enlaces directos para activación rápida',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 11 Home (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-win10-pro-tel',
    slug: 'windows-10-pro-telefono',
    name: 'Windows 10 Professional (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante activación telefónica automatizada oficial ante Microsoft. Gran estabilidad y compatibilidad para trabajar y jugar. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 55.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-pro.webp',
    fallbackImage: '/products/windows-10-pro.png',
    rating: 4.86,
    reviews: 215,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave para 1 PC mediante activación telefónica oficial ante Microsoft',
      'Permanente de por vida una vez activado (Remote Desktop, BitLocker)',
      'Máxima compatibilidad con programas, juegos y periféricos',
      'Guía paso a paso para activación en 2 minutos',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 10 (32 y 64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-win10-home-tel',
    slug: 'windows-10-home-telefono',
    name: 'Windows 10 Home (Activación por Teléfono)',
    description: 'Licencia digital oficial permanente para 1 PC mediante activación telefónica automatizada ante Microsoft. Rendimiento rápido y seguro para uso cotidiano. Garantía de activación de 1 mes.',
    price: 16.00,
    oldPrice: 45.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-home.webp',
    fallbackImage: '/products/windows-10-home.png',
    rating: 4.82,
    reviews: 90,
    badge: 'ECONÓMICO ⚡',
    features: [
      'Clave para 1 PC mediante activación telefónica automatizada',
      'Permanente de por vida una vez activado',
      'Protección integrada con Windows Defender y DirectX 12',
      'Guía paso a paso con enlaces directos oficiales',
      'Garantía de activación por 1 mes (según lo adquirido)'
    ],
    compatibility: 'Windows 10 Home (32 y 64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },

  // --- COMBOS AHORRO 2 EN 1 Y 3 EN 1 ---
  {
    id: 'prod-combo-win11-office2024',
    slug: 'combo-windows-11-pro-office-2024-pro-plus',
    name: 'Combo 2 en 1: Windows 11 Pro + Office 2024 Pro Plus',
    description: 'El combo más vendido para equipar tu computadora al 100%. Incluye 2 licencias oficiales originales de activación permanente: Windows 11 Professional (64 Bit) y Microsoft Office 2024 Professional Plus para 1 PC.',
    price: 45.00,
    oldPrice: 190.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-win11-office2024.webp',
    fallbackImage: '/products/combo-win11-office2024.png',
    rating: 4.99,
    reviews: 485,
    badge: 'COMBO FAVORITO 🔥',
    featured: true,
    bestSeller: true,
    features: [
      '2 Claves oficiales independientes para 1 PC (Windows 11 Pro + Office 2024 Pro Plus)',
      'Activación permanente de por vida en ambos productos (sin suscripciones)',
      'Office 2024 incluye Word, Excel, PowerPoint, Outlook, Access y Publisher',
      'Windows 11 Pro incluye BitLocker, Hyper-V y Remote Desktop',
      'Instaladores oficiales directos incluidos en la entrega',
      'Garantía completa de activación y reemplazo por 6 meses'
    ],
    compatibility: 'Windows 11 (64 Bit) para 1 PC',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Windows 11 Pro (.exe)',
    downloadOptions: [
      {
        id: 'combo-win11',
        name: 'Descargar Windows 11 Pro (Media Creation Tool .exe)',
        url: 'https://go.microsoft.com/fwlink/?linkid=2156295',
        badge: 'Windows 11 Pro',
        description: 'Herramienta oficial de Microsoft para preparar tu instalador en USB o ISO.'
      },
      {
        id: 'combo-win11-iso',
        name: 'Descargar ISO directa Windows 11 (64 Bit Español)',
        url: 'https://www.microsoft.com/es-es/software-download/windows11',
        badge: 'Descarga directa',
        description: 'Página oficial de descarga de la imagen ISO oficial de Windows 11.'
      },
      {
        id: 'combo-off2024',
        name: 'Descargar Office 2024 Professional Plus (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=ProPlus2024Retail&platform=x64&language=es-es',
        badge: 'Office 2024 Pro',
        description: 'Instalador online oficial directo de Microsoft.'
      }
    ],
    installationSteps: COMBO_WIN11_OFFICE2024_STEPS
  },
  {
    id: 'prod-combo-office-project-visio',
    slug: 'combo-office-project-visio-2024',
    name: 'Combo 3 en 1: Microsoft Office + Project + Visio Profesional 2024',
    description: 'El combo definitivo de productividad profesional de Microsoft. Incluye 3 licencias oficiales permanentes: Office 2024 Pro Plus, Project 2024 Pro y Visio 2024 Pro. Activación de por vida para 1 PC sin suscripciones ni cobros recurrentes.',
    price: 55.00,
    oldPrice: 380.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-3en1-office-project-visio.webp',
    fallbackImage: '/products/combo-3en1-office-project-visio.png',
    rating: 4.97,
    reviews: 142,
    badge: 'SUPER AHORRO 3 EN 1 💼',
    features: [
      '3 Claves oficiales independientes: Office 2024 Pro Plus + Project 2024 Pro + Visio 2024 Pro',
      'Activación permanente de por vida en los 3 programas para 1 PC',
      'Suite Office 2024 completa: Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher',
      'Microsoft Project 2024 Pro: Gestión avanzada de proyectos, cronogramas y presupuestos',
      'Microsoft Visio 2024 Pro: Diagramación profesional, mapas de procesos y flujogramas',
      'Instaladores oficiales directos incluidos en la entrega',
      'Garantía total de activación y reemplazo por 6 meses'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
    downloadLabel: 'Descargar Office 2024 Pro Plus (.img)',
    installationSteps: [
      'Descarga los 3 instaladores independientes provistos en tu compra.',
      'Instala primero Office 2024 Pro Plus y activa con su clave correspondiente.',
      'Instala Microsoft Project 2024 Pro y activa con su clave de 25 caracteres.',
      'Instala Microsoft Visio 2024 Pro y activa con su clave de 25 caracteres.',
      '¡Listo! Tendrás la suite completa de productividad y diagramación activada de por vida.'
    ]
  },
  {
    id: 'prod-combo-win10-office2024',
    slug: 'combo-windows-10-pro-office-2024-pro-plus',
    name: 'Combo 2 en 1: Windows 10 Pro + Office 2024 Pro Plus',
    description: 'El combo de máxima compatibilidad y estabilidad. Incluye 2 licencias digitales oficiales permanentes para 1 PC: Windows 10 Professional (32/64 Bit) y Microsoft Office 2024 Professional Plus.',
    price: 45.00,
    oldPrice: 170.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-win10-office2024.webp',
    fallbackImage: '/products/combo-win10-office2024.png',
    rating: 4.95,
    reviews: 230,
    badge: 'COMBO EFICIENCIA ⚡',
    features: [
      '2 Claves digitales oficiales independientes para 1 PC (Windows 10 Pro + Office 2024 Pro Plus)',
      'Activación permanente de por vida en ambos productos (sin cuotas mensuales)',
      'Office 2024 completo: Word, Excel, PowerPoint, Outlook, Access y Publisher',
      'Windows 10 Pro completo: BitLocker, Remote Desktop y virtualización',
      'Instaladores oficiales directos incluidos en la entrega',
      'Garantía total de activación y reemplazo por 6 meses'
    ],
    compatibility: 'Windows 10 (32 y 64 Bit) para 1 PC',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Windows 10 Pro (.exe)',
    installationSteps: COMBO_WIN10_OFFICE2024_STEPS
  },

  // --- PROJECT & VISIO CLAVES DIRECTAS ---
  {
    id: 'prod-project-2024',
    slug: 'microsoft-project-professional-2024',
    name: 'Microsoft Project Professional 2024',
    description: 'La herramienta líder en el mundo para administración de proyectos, cronogramas, diagramas de Gantt y asignación de recursos. Licencia oficial permanente para 1 PC.',
    price: 26.00,
    oldPrice: 130.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2024.webp',
    fallbackImage: '/products/project-2024.png',
    rating: 4.96,
    reviews: 145,
    badge: 'MÁS VENDIDO 🔥',
    features: [
      'Clave original de 25 caracteres para 1 PC (Windows 10 u 11)',
      'Activación permanente de por vida sin cobros recurrentes',
      'Plantillas integradas, gestión de costos, cronogramas y líneas base',
      'Sincronización con Project Online y Project Server',
      'Garantía total de activación y soporte técnico por 6 meses'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2024Retail.img',
    downloadLabel: 'Descargar Project 2024 Pro (.img)',
    downloadOptions: [
      {
        id: 'proj2024-exe',
        name: 'Descargar Instalador Directo Project 2024 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=ProjectPro2024Retail&platform=x64&language=es-es',
        badge: 'Recomendado',
        description: 'Instalador online oficial de Microsoft.'
      },
      {
        id: 'proj2024-img',
        name: 'Descargar Imagen Offline Project 2024 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2024Retail.img',
        badge: 'Instalador Offline',
        description: 'Imagen ISO completa oficial de Microsoft.'
      }
    ],
    installationSteps: PROJECT_STANDARD_STEPS
  },
  {
    id: 'prod-coreldraw-2024-mac',
    slug: 'coreldraw-graphics-suite-2024-mac',
    name: 'CorelDRAW Graphics Suite 2024 para Mac (1 PC / Permanente)',
    description: 'Software profesional de diseño gráfico, ilustración vectorial y edición fotográfica para macOS. Licencia oficial de por vida para 1 Mac sin suscripciones ni cuotas recurrentes. Optimizado para procesadores Apple Silicon (M1, M2, M3, M4) e Intel.',
    price: 35.00,
    oldPrice: 190.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/coreldraw-2024-mac.webp',
    fallbackImage: '/products/coreldraw-2024-mac.png',
    rating: 4.96,
    reviews: 84,
    badge: 'ESPECIAL MAC 🍎',
    features: [
      'Clave de licencia digital permanente de por vida para 1 Mac',
      'Optimizado al 100% para Apple Silicon (M1, M2, M3, M4) y chips Intel',
      'Incluye CorelDRAW (ilustración vectorial) y Corel PHOTO-PAINT (edición de imágenes)',
      'Herramientas avanzadas de tipografía, maquetación multipágina y trazado Bitmap a Vector',
      'Instalador directo oficial DMG provisto en tu compra',
      'Garantía oficial completa de activación y funcionamiento durante 6 meses'
    ],
    compatibility: 'macOS Sonoma, Ventura, Monterey o superior (Apple Silicon M1/M2/M3/M4 e Intel)',
    downloadUrl: 'https://www.coreldraw.com/la/pages/download/',
    downloadLabel: 'Descargar CorelDRAW 2024 para Mac',
    installationSteps: [
      'Descarga el archivo instalador oficial .dmg de CorelDRAW 2024 para Mac provisto en tu pedido.',
      'Abre el archivo descargado y arrastra la aplicación a tu carpeta de Aplicaciones en macOS.',
      'Inicia CorelDRAW e introduce la clave oficial de activación suministrada.',
      'Sigue las instrucciones en pantalla para registrar la licencia en tu equipo Mac.',
      '¡Listo! Tu software quedará activado de por vida para 1 Mac sin suscripciones ni cobros recurrentes.'
    ]
  },
  {
    id: 'prod-visio-2024',
    slug: 'microsoft-visio-professional-2024',
    name: 'Microsoft Visio Professional 2024',
    description: 'Crea diagramas de flujo profesionales, mapas de red, organigramas y planos técnicos con facilidad. Licencia oficial permanente para 1 PC.',
    price: 28.00,
    oldPrice: 130.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2024.webp',
    fallbackImage: '/products/visio-2024.png',
    rating: 4.95,
    reviews: 120,
    badge: 'MÁS VENDIDO 🔥',
    features: [
      'Clave original de 25 caracteres para 1 PC (Windows 10 u 11)',
      'Activación permanente sin pagos recurrentes',
      'Miles de formas y plantillas actualizadas: BPMN 2.0, UML 2.5, IEEE',
      'Vinculación de datos en tiempo real desde Excel y SQL',
      'Garantía total de activación y soporte técnico por 6 meses'
    ],
    compatibility: 'Windows 10 y Windows 11 (32 y 64 Bit)',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2024Retail.img',
    downloadLabel: 'Descargar Visio 2024 Pro (.img)',
    installationSteps: VISIO_STANDARD_STEPS
  },
  {
    id: 'prod-project-2021',
    slug: 'microsoft-project-professional-2021',
    name: 'Microsoft Project Professional 2021',
    description: 'Gestión profesional de proyectos, plazos y recursos. Licencia oficial vitalicia para 1 PC.',
    price: 25.00,
    oldPrice: 110.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2021.webp',
    fallbackImage: '/products/project-2021.png',
    rating: 4.93,
    reviews: 130,
    badge: 'CLAVE DIRECTA',
    features: [
      'Clave original permanente para 1 PC',
      'Diagramas de Gantt, gestión de costes y recursos',
      'Reinstalable en la misma máquina'
    ],
    compatibility: 'Windows 10 y Windows 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2021Retail.img',
    downloadLabel: 'Descargar Project 2021 Pro (.img)',
    installationSteps: PROJECT_STANDARD_STEPS
  },
  {
    id: 'prod-project-2019',
    slug: 'microsoft-project-professional-2019',
    name: 'Microsoft Project Professional 2019',
    description: 'Herramienta consolidada de gestión de proyectos y carteras para 1 PC.',
    price: 24.00,
    oldPrice: 90.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2019.webp',
    fallbackImage: '/products/project-2019.png',
    rating: 4.89,
    reviews: 110,
    badge: 'CLAVE DIRECTA',
    features: ['Activación vitalicia para 1 PC', 'Líneas base y reportes predefinidos'],
    compatibility: 'Windows 10 y Windows 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2019Retail.img',
    downloadLabel: 'Descargar Project 2019 Pro (.img)',
    installationSteps: PROJECT_STANDARD_STEPS
  },
  {
    id: 'prod-project-2016',
    slug: 'microsoft-project-professional-2016',
    name: 'Microsoft Project Professional 2016',
    description: 'Gestión eficaz de proyectos compatible con Windows 7, 8.1, 10 y 11.',
    price: 24.00,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2016.webp',
    fallbackImage: '/products/project-2016.png',
    rating: 4.86,
    reviews: 80,
    badge: 'CLAVE DIRECTA',
    features: ['Compatible con Windows 7 en adelante', 'Licencia permanente para 1 PC'],
    compatibility: 'Windows 7, 8.1, 10 y 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectProRetail.img',
    downloadLabel: 'Descargar Project 2016 Pro (.img)',
    installationSteps: PROJECT_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2021',
    slug: 'microsoft-visio-professional-2021',
    name: 'Microsoft Visio Professional 2021',
    description: 'Diagramación avanzada, flujogramas y esquemas técnicos. Licencia oficial para 1 PC.',
    price: 27.00,
    oldPrice: 110.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2021.webp',
    fallbackImage: '/products/visio-2021.png',
    rating: 4.92,
    reviews: 115,
    badge: 'CLAVE DIRECTA',
    features: [
      'Clave original vitalicia para 1 PC',
      'Diagramas UML, BPMN y planos de arquitectura'
    ],
    compatibility: 'Windows 10 y Windows 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2021Retail.img',
    downloadLabel: 'Descargar Visio 2021 Pro (.img)',
    installationSteps: VISIO_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2019',
    slug: 'microsoft-visio-professional-2019',
    name: 'Microsoft Visio Professional 2019',
    description: 'Crea diagramas de procesos y modelos de datos fácilmente. Licencia vitalicia para 1 PC.',
    price: 26.00,
    oldPrice: 90.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2019.webp',
    fallbackImage: '/products/visio-2019.png',
    rating: 4.88,
    reviews: 95,
    badge: 'CLAVE DIRECTA',
    features: ['Activación permanente para 1 PC', 'Plantillas de ingeniería y diagramas de flujo'],
    compatibility: 'Windows 10 y Windows 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2019Retail.img',
    downloadLabel: 'Descargar Visio 2019 Pro (.img)',
    installationSteps: VISIO_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2016',
    slug: 'microsoft-visio-professional-2016',
    name: 'Microsoft Visio Professional 2016',
    description: 'Diagramación confiable compatible con Windows 7, 8.1, 10 y 11.',
    price: 26.00,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2016.webp',
    fallbackImage: '/products/visio-2016.png',
    rating: 4.85,
    reviews: 75,
    badge: 'CLAVE DIRECTA',
    features: ['Compatible con Windows 7 en adelante', 'Licencia permanente para 1 PC'],
    compatibility: 'Windows 7, 8.1, 10 y 11',
    downloadUrl: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioProRetail.img',
    downloadLabel: 'Descargar Visio 2016 Pro (.img)',
    installationSteps: VISIO_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2013',
    slug: 'microsoft-visio-professional-2013',
    name: 'Microsoft Visio Professional 2013',
    description: 'Versión ligera de diagramación para equipos de recursos moderados.',
    price: 26.00,
    oldPrice: 50.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2013.webp',
    fallbackImage: '/products/visio-2013.png',
    rating: 4.81,
    reviews: 55,
    badge: 'CLAVE DIRECTA',
    features: ['Bajo consumo de recursos', 'Licencia vitalicia para 1 PC'],
    compatibility: 'Windows 7, 8, 10 y 11',
    downloadUrl: 'https://archive.org/download/visio-2013-pro-es/Visio2013_Pro_x64_ES.iso',
    downloadLabel: 'Descargar ISO Visio 2013 Pro',
    installationSteps: VISIO_STANDARD_STEPS
  },

  // --- APPS & SUSCRIPCIONES DIGITALES PREMIUM ---
  {
    id: 'prod-duolingo-super',
    slug: 'duolingo-super-12-meses',
    name: 'Duolingo Super (12 Meses)',
    description: 'Suscripción premium a Duolingo Super por 12 meses completos para aprender idiomas sin límites. Vidas infinitas, sin anuncios molestos, modo sin conexión y práctica personalizada de errores. Se activa en tu cuenta personal.',
    price: 30.00,
    oldPrice: 89.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/duolingo-super.webp',
    fallbackImage: '/products/duolingo-super.png',
    rating: 4.96,
    reviews: 245,
    badge: '1 USUARIO',
    isAccountAccess: true,
    accountNotice: 'Tipo de entrega: Invitación oficial a correo personal de Duolingo (1 usuario). Sin necesidad de entregar contraseñas.',
    features: [
      'Acceso completo a Duolingo Super para 1 usuario',
      'Vidas infinitas para practicar idiomas sin interrupciones',
      'Cero anuncios para máxima concentración',
      'Repaso personalizado de errores cometidos',
      'Activación mediante invitación oficial a tu correo personal',
      'Compatible con múltiples dispositivos (Android, iOS y Web)',
      'Garantía oficial durante 6 meses'
    ],
    compatibility: 'Android, iOS, iPad, Web (Dispositivos móviles y PC/Mac)',
    downloadUrl: 'https://www.duolingo.com',
    downloadLabel: 'Acceder a Duolingo Web',
    installationSteps: [
      'Recibirás en tu correo o WhatsApp la invitación oficial de activación para tu cuenta de Duolingo.',
      'Abre el enlace mientras tienes iniciada sesión en tu cuenta de Duolingo (correo personal).',
      'Acepta unirte y tu cuenta quedará actualizada de inmediato a Duolingo Super con vidas infinitas por 12 meses.'
    ]
  },
  {
    id: 'prod-canva-pro',
    slug: 'canva-pro-12-meses',
    name: 'Canva Pro (12 Meses)',
    description: 'Suscripción a Canva Pro por 12 meses para 1 usuario en múltiples dispositivos. Activación directa por invitación oficial a tu correo personal. Acceso ilimitado a más de 100 millones de fotos, videos, gráficos, plantillas premium, quitafondos mágico de imágenes y videos en un clic, y herramientas de Inteligencia Artificial (Magic Studio).',
    price: 30.00,
    oldPrice: 79.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/canva-pro.webp',
    fallbackImage: '/products/canva-pro.png',
    rating: 4.98,
    reviews: 312,
    badge: '1 USUARIO',
    isAccountAccess: true,
    accountNotice: 'Tipo de entrega: Invitación oficial a correo personal de Canva (1 usuario). Sin necesidad de entregar contraseñas.',
    features: [
      'Acceso total a Canva Pro por 12 meses para 1 usuario',
      'Activación por invitación oficial directa a tu correo personal de Canva',
      'Acceso a biblioteca de 100M+ recursos premium (fotos, audio, video)',
      'Herramientas IA Magic Studio y quitafondos instantáneo con un clic',
      'Kits de marca con paletas de colores, fuentes y logos ilimitados',
      'Uso en múltiples dispositivos (Web, App móvil Android e iOS, iPad)',
      'Garantía oficial durante 6 meses'
    ],
    compatibility: 'Web (PC y Mac), App móvil Android e iOS, iPad (Múltiples dispositivos)',
    downloadUrl: 'https://www.canva.com',
    downloadLabel: 'Acceder a Canva Web',
    installationSteps: [
      'Recibirás en tu correo o WhatsApp la invitación oficial de activación para tu cuenta de Canva.',
      'Abre el enlace mientras tienes iniciada tu sesión en tu cuenta de Canva (correo personal).',
      'Acepta la invitación y tu cuenta pasará automáticamente a contar con todas las funciones de Canva Pro por 12 meses.'
    ]
  },
  {
    id: 'prod-gemini-ai-pro',
    slug: 'google-gemini-ia-pro-18-meses',
    name: 'Gemini AI Pro (18 Meses)',
    description: 'Suscripción oficial a Gemini AI Pro / Advanced por 18 meses activable mediante link de activación directo a tu correo personal Gmail. Permite compartir con hasta 5 usuarios más en sus dispositivos e incluye 5 TB de almacenamiento en la nube de Google One.',
    price: 35.00,
    oldPrice: 120.00,
    duration: '18 meses',
    category: 'apps',
    imageUrl: '/products/gemini-ai-pro.webp',
    fallbackImage: '/products/gemini-ai-pro.png',
    rating: 4.97,
    reviews: 184,
    badge: 'HASTA 5 USUARIOS',
    cloudStorage: '5 TB Google One Cloud',
    isAccountAccess: true,
    accountNotice: 'Tipo de entrega: Link de activación suscripción (a tu correo personal Gmail). Hasta en 5 usuarios en sus dispositivos.',
    features: [
      'Link de activación a su correo personal Gmail',
      'Hasta en 5 usuarios (puedes compartir por invitación hasta con 5 usuarios más)',
      'Suscripción oficial a Gemini AI Pro / Advanced durante 18 meses completos',
      'Incluye 5 TB de almacenamiento seguro en la nube de Google One (privado e independiente)',
      'IA integrada de manera nativa en Google Docs, Sheets, Slides y Gmail',
      'Compatible con múltiples dispositivos (Android, iOS, PC, Mac, tablets)',
      'Garantía oficial y soporte técnico durante 6 meses'
    ],
    compatibility: 'Navegadores Web, Windows, macOS, Android e iOS (Múltiples dispositivos)',
    downloadUrl: 'https://gemini.google.com',
    downloadLabel: 'Acceder a Google Gemini Web',
    installationSteps: [
      'Recibirás en tu correo personal Gmail el link oficial de activación de suscripción de Google.',
      'Abre el link de activación con tu cuenta personal de Gmail para vincular los 18 meses de Gemini Pro.',
      'Desde la administración de Google One puedes invitar y compartir el beneficio hasta con 5 usuarios o familiares más en sus dispositivos.',
      '¡Listo! Disfruta de Gemini AI Pro y los 5 TB de almacenamiento con total privacidad en todos tus dispositivos.'
    ]
  },
  {
    id: 'prod-gemini-ai-pro-12m',
    slug: 'gemini-ai-pro-12-meses',
    name: 'Gemini AI Pro (12 Meses)',
    description: 'Suscripción a Gemini AI Pro / Advanced por 12 meses para 1 usuario mediante invitación oficial a correo Gmail personal. Incluye modelos avanzados de IA, 5 TB de almacenamiento en la nube de Google One de forma compartida y totalmente privada, e integración nativa en Google Docs, Sheets y Gmail.',
    price: 20.00,
    oldPrice: 80.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/gemini-ai-pro.webp',
    fallbackImage: '/products/gemini-ai-pro.png',
    rating: 4.95,
    reviews: 130,
    badge: '1 USUARIO',
    cloudStorage: '5 TB Google One Cloud (Compartido y Privado)',
    isAccountAccess: true,
    accountNotice: 'Tipo de entrega: Invitación a correo (a tu correo personal Gmail, 1 usuario en sus dispositivos). Sin necesidad de entregar contraseñas.',
    features: [
      'Tipo de entrega: Invitación a correo (a su correo personal Gmail)',
      'Acceso exclusivo para 1 usuario en sus dispositivos',
      'Acceso a modelos de vanguardia de Inteligencia Artificial (Gemini Pro / Advanced)',
      'Incluye 5 TB de almacenamiento en la nube de Google One (tus archivos son 100% privados e independientes)',
      'IA integrada de forma nativa en Google Docs, Sheets, Slides y Gmail',
      'Uso en múltiples dispositivos (celulares Android, iPhone, iPad, PC y Mac)',
      'Garantía oficial y soporte técnico por 6 meses'
    ],
    compatibility: 'Android, iOS, PC, Mac, Navegadores Web (1 usuario en sus dispositivos)',
    downloadUrl: 'https://gemini.google.com',
    downloadLabel: 'Acceder a Google Gemini Web',
    installationSteps: [
      'Recibirás en tu correo personal Gmail la invitación oficial de activación para tu cuenta.',
      'Acepta unirte con tu cuenta personal de Gmail.',
      'Tu cuenta quedará actualizada de inmediato con acceso a los modelos avanzados de Gemini y los 5 TB de almacenamiento en Google One.',
      'Disfruta de todas las funciones sin contraseñas ajenas ni intermediarios.'
    ]
  },
  {
    id: 'prod-mcafee-antivirus',
    slug: 'mcafee-antivirus-1pc-12-meses',
    name: 'McAfee AntiVirus (1 PC • 12 Meses)',
    description: 'Licencia digital oficial canjeable directamente en la web oficial mcafee.com/activate para 1 PC (Windows). Protección en tiempo real contra virus, malware, ransomware y sitios web peligrosos por 1 año completo.',
    price: 39.00,
    oldPrice: 89.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/mcafee-antivirus.webp',
    fallbackImage: '/products/mcafee-antivirus.png',
    rating: 4.97,
    reviews: 164,
    badge: 'CLAVE OFICIAL 🛡️',
    features: [
      'Clave oficial alfanumérica de 25 caracteres para 1 PC (Windows)',
      'Canjeable y vinculable directamente en tu propia cuenta oficial en mcafee.com/activate',
      'Protección galardonada en tiempo real contra virus, spyware, troyanos y phishing',
      'Navegación web segura con McAfee WebAdvisor (bloqueo de páginas maliciosas)',
      'Optimizador de rendimiento de PC y destructor seguro de archivos confidenciales',
      'Descarga directa del instalador oficial tras registrar tu clave',
      'Garantía oficial completa durante 6 meses'
    ],
    compatibility: 'Windows 11, Windows 10 y Windows 8.1 (1 PC)',
    downloadUrl: 'https://www.mcafee.com/activate',
    downloadLabel: 'Canjear en mcafee.com/activate',
    installationSteps: [
      'Ingresa desde tu navegador a la página oficial de activación: mcafee.com/activate.',
      'Introduce el código de activación oficial de 25 caracteres provisto en tu compra y tu correo electrónico.',
      'Sigue las instrucciones en pantalla para descargar el instalador oficial de McAfee para tu PC.',
      'Ejecuta el instalador descargado para completar la instalación de la protección antivirus en tu equipo.',
      '¡Listo! Tu computadora quedará protegida en tiempo real durante 12 meses completos.'
    ]
  },
  {
    id: 'prod-adobe-acrobat-pro-2018',
    slug: 'adobe-acrobat-pro-dc-2018-permanente',
    name: 'Adobe Acrobat Pro DC 2018 (Licencia Permanente)',
    description: 'Licencia digital oficial permanente de Adobe Acrobat Pro DC 2018 para 1 PC (Windows). Incluye clave de activación vitalicia, instalador completo y guía paso a paso. Crea, edita, convierte, firma, protege y combina documentos PDF profesionales sin suscripciones ni mensualidades.',
    price: 50.00,
    oldPrice: 150.00,
    duration: 'Permanente (De por vida)',
    category: 'apps',
    imageUrl: '/products/adobe-acrobat-pro-2018.webp',
    fallbackImage: '/products/adobe-acrobat-pro-2018.png',
    rating: 4.96,
    reviews: 142,
    badge: 'PAGO ÚNICO 📄',
    features: [
      'Clave oficial permanente de activación digital para 1 PC (Windows)',
      'Pago único de por vida: sin mensualidades ni cuotas recurrentes',
      'Edición completa de texto e imágenes dentro de archivos PDF',
      'Conversión bidireccional entre PDF y Microsoft Word, Excel o PowerPoint',
      'Herramientas avanzadas de firma digital, protección con contraseña y censura de datos',
      'Reconocimiento óptico de caracteres (OCR) para digitalizar documentos escaneados',
      'Instalador oficial completo (.exe) incluido en tu entrega',
      'Garantía total de activación y funcionamiento por 6 meses'
    ],
    compatibility: 'Windows 11, Windows 10, Windows 8.1 y Windows 7 (32 y 64 Bit)',
    downloadUrl: 'https://helpx.adobe.com/download-install/kb/acrobat-2017-downloads.html',
    downloadLabel: 'Descargar Adobe Acrobat DC (.exe)',
    installationSteps: [
      'Descarga el instalador oficial de Adobe Acrobat Pro DC provisto en los enlaces de tu compra.',
      'Ejecuta el instalador en tu computadora con Windows y sigue el asistente de instalación.',
      'Cuando el programa lo solicite, introduce la clave oficial permanente de activación provista.',
      'Finaliza la instalación y reinicia el programa para aplicar la activación.',
      '¡Listo! Tu Adobe Acrobat Pro DC quedará activado de forma definitiva sin pagos recurrentes.'
    ]
  }
];

export const products: Product[] = rawProducts.map(p => ({
  ...p,
  stock: p.stock ?? DEFAULT_PRODUCT_STOCK
}));

export function getProductDeviceTag(product: Product, language: 'ES' | 'EN' = 'ES'): string {
  const isEn = language === 'EN';

  if (product.id === 'prod-gemini-ai-pro') {
    return isEn ? 'Up to 5 users' : 'Hasta 5 usuarios';
  }
  if (product.id === 'prod-gemini-ai-pro-12m') {
    return isEn ? '1 user' : '1 usuario';
  }
  if (product.id === 'prod-canva-pro') {
    return isEn ? '1 user' : '1 usuario';
  }
  if (product.id === 'prod-duolingo-super') {
    return isEn ? '1 user' : '1 usuario';
  }
  if (product.id === 'prod-mcafee-antivirus' || product.id.includes('mcafee')) {
    return '1 PC';
  }
  if (product.id === 'prod-adobe-acrobat-pro-2018' || product.id.includes('adobe')) {
    return '1 PC';
  }
  if (product.id.includes('365-family') || product.id.includes('family')) {
    return isEn ? '6 users' : 'Hasta 6 usuarios';
  }
  if (product.id.includes('365') || product.id.includes('m365')) {
    return isEn ? '5 devices' : '5 dispositivos';
  }
  if (product.category === 'apps' && product.isAccountAccess) {
    return isEn ? '1 user' : '1 usuario';
  }
  if (product.id.includes('3pc')) {
    return '3 PC';
  }
  if (product.id.includes('mac')) {
    return '1 Mac';
  }
  return '1 PC';
}

export function getProductDeliveryType(product: Product, language: 'ES' | 'EN' = 'ES'): string {
  const isEn = language === 'EN';

  if (product.isImmediateDelivery) {
    return isEn
      ? '⚡ Instant Automatic Delivery: Account credentials generated immediately on screen and sent to your email right after payment.'
      : '⚡ Entrega Inmediata y Automática: Credenciales de acceso generadas al instante en pantalla y enviadas a tu correo al completar el pago.';
  }

  if (product.id === 'prod-gemini-ai-pro') {
    return isEn
      ? 'Subscription activation link sent to your personal Gmail account (up to 5 users on your devices).'
      : 'Link de activación suscripción (enviado a tu correo personal Gmail, hasta 5 usuarios en sus dispositivos).';
  }
  if (product.id === 'prod-gemini-ai-pro-12m') {
    return isEn
      ? 'Official email invitation sent to your personal Gmail account (1 user on your devices).'
      : 'Invitación a correo (enviada a tu correo personal Gmail, 1 usuario en sus dispositivos).';
  }
  if (product.id === 'prod-canva-pro') {
    return isEn
      ? 'Official email invitation to your personal Canva account (1 user on your devices).'
      : 'Invitación a correo oficial a tu cuenta personal de Canva (1 usuario en sus dispositivos).';
  }
  if (product.id === 'prod-duolingo-super') {
    return isEn
      ? 'Official email invitation to your personal Duolingo account (1 user on your devices).'
      : 'Invitación a correo oficial para tu cuenta personal de Duolingo (1 usuario en sus dispositivos).';
  }
  if (product.id === 'prod-microsoft-365' || product.isAccountAccess) {
    return isEn
      ? 'Official dedicated access account (1 Year) with 100 GB OneDrive cloud storage across 5 devices.'
      : 'Cuenta de acceso oficial exclusiva (1 Año) con 100 GB en OneDrive para hasta 5 dispositivos.';
  }
  if (product.id.includes('-tel')) {
    const isWindowsTel = product.category === 'windows';
    return isEn
      ? (isWindowsTel
          ? 'Includes official OEM-type activation key + step-by-step phone activation guide (Official Microsoft automated phone activation, 1-month warranty) + direct installer link.'
          : 'Includes activation key + step-by-step phone activation guide (Official Microsoft automated phone activation, 1-month warranty) + direct installer link.')
      : (isWindowsTel
          ? 'Incluye clave de activación tipo OEM + guía de activación (activación telefónica automatizada ante Microsoft, garantía de 1 mes) + instalador directo.'
          : 'Incluye clave de activación + guía de activación (activación telefónica automatizada ante Microsoft, garantía de 1 mes) + instalador directo.');
  }
  if (product.id === 'prod-mcafee-antivirus') {
    return isEn
      ? 'Official 25-character digital activation key for 1 PC redeemable at mcafee.com/activate (6-month warranty).'
      : 'Clave digital oficial de 25 caracteres para 1 PC canjeable en mcafee.com/activate (Garantía de 6 meses).';
  }
  if (product.id === 'prod-coreldraw-2024-mac') {
    return isEn
      ? 'Official lifetime digital license for 1 Mac + official DMG installer (6-month warranty).'
      : 'Clave de licencia digital permanente para 1 Mac + instalador oficial (.dmg) (Garantía de 6 meses).';
  }
  if (product.id === 'prod-adobe-acrobat-pro-2018') {
    return isEn
      ? 'Official lifetime digital product key for 1 PC + full installer included (6-month warranty).'
      : 'Clave digital oficial permanente de por vida para 1 PC + instalador completo incluido (Garantía de 6 meses).';
  }
  if (product.category === 'combos') {
    return isEn
      ? 'Independent official 25-character digital product keys for each suite + official direct installers (6-month warranty).'
      : 'Claves digitales oficiales independientes de 25 caracteres para cada software + instaladores directos (Garantía de 6 meses).';
  }
  if (product.category === 'windows') {
    return isEn
      ? 'Official 25-character alphanumeric digital key (Genuine Microsoft) for activation in Settings > System > Activation (6-month warranty).'
      : 'Clave digital alfanumérica de 25 caracteres (Original Microsoft) para activación en Ajustes > Sistema > Activación (Garantía de 6 meses).';
  }
  return isEn
    ? 'Official 25-character alphanumeric digital key (Genuine Microsoft) for direct activation (6-month warranty).'
    : 'Clave digital alfanumérica de 25 caracteres (Original Microsoft) para activación directa en tu suite (Garantía de 6 meses).';
}
