import type { Product, CartTotals, Currency } from './types.ts';

export const WHATSAPP_NUMBER = '51983204384';
export const WHATSAPP_DISPLAY = '+51 983 204 384';
export const MERCADO_PAGO_URL = 'https://www.mercadopago.com.pe';
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
  { code: 'PROVECLIC1', discountPercent: 50, description: 'Descuento especial PROVECLIC1 aplicable' }
];

export function calculateCartTotals(
  items: { product: Product; quantity: number; unitPrice?: number }[],
  couponCode?: string,
  dynamicCoupon?: { code: string, discountPercent: number, expiresAt?: number }
): CartTotals {
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = Number(item.unitPrice ?? item.product?.price) || 0;
    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
    return acc + (unitPrice * qty);
  }, 0);
  
  const totalQuantity = items.reduce((acc, item) => {
    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
    return acc + qty;
  }, 0);

  let discountRate = 0;
  let appliedCoupon: DynamicCoupon | undefined = undefined;

  if (couponCode) {
    const cleanCode = couponCode.trim().toUpperCase();
    const matchedStatic = DYNAMIC_COUPONS.find(c => c.code.toUpperCase() === cleanCode);
    
    let matchedDynamic = dynamicCoupon;
    if (!matchedDynamic && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('upclic_dynamic_coupon');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.code && parsed.code.toUpperCase() === cleanCode) {
            matchedDynamic = parsed;
          }
        }
      } catch (e) {}
    }

    if (matchedStatic) {
      const isNotExpired = !matchedStatic.expiresAt || Date.now() <= matchedStatic.expiresAt;
      if (isNotExpired && (!matchedStatic.minItems || totalQuantity >= matchedStatic.minItems)) {
        discountRate = matchedStatic.discountPercent / 100;
        appliedCoupon = matchedStatic;
      }
    } else if (matchedDynamic && matchedDynamic.code.toUpperCase() === cleanCode) {
      const isNotExpired = !matchedDynamic.expiresAt || Date.now() <= matchedDynamic.expiresAt;
      if (isNotExpired) {
        discountRate = matchedDynamic.discountPercent / 100;
        appliedCoupon = { code: matchedDynamic.code, discountPercent: matchedDynamic.discountPercent, description: `Cupón especial ${matchedDynamic.discountPercent}% OFF` };
      }
    }
  }

  const isMultiItemDiscount = totalQuantity >= 2 && discountRate < 0.10 && !(appliedCoupon && appliedCoupon.code === 'PROVECLIC1');
  if (isMultiItemDiscount) {
    discountRate = 0.10;
  }

  let discountAmount = subtotal * discountRate;

  // Custom logic for PROVECLIC1
  if (appliedCoupon && appliedCoupon.code === 'PROVECLIC1') {
    discountAmount = 0;
    items.forEach(item => {
      const price = item.unitPrice ?? item.product.price;
      const rate = price < 30 ? 0.20 : 0.50;
      discountAmount += (price * rate) * item.quantity;
    });
    if (subtotal > 0) discountRate = discountAmount / subtotal;
  }

  const total = Math.max(0, subtotal - discountAmount);

  return {
    totalQuantity,
    subtotal,
    hasDiscount: discountRate > 0,
    discountRate,
    discountAmount,
    total,
    discountReason: appliedCoupon
      ? appliedCoupon.description
      : isMultiItemDiscount
      ? 'Descuento del 10% por 2 o más licencias'
      : undefined,
    isMultiItemDiscount,
    isCouponApplied: !!appliedCoupon
  };
}

export function searchProducts(query: string, category: string = 'all'): Product[] {
  const q = query.trim().toLowerCase();
  
  let list = products;
  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }

  if (!q) return list;

  const tokens = q.split(/\s+/).filter(Boolean);

  return list.filter(product => {
    const targetText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return tokens.every(token => targetText.includes(token));
  });
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug || p.id === slug);
}

export const OFFICE_STANDARD_STEPS = [
  'Descargar instalador: Haz clic en el botón de descarga directa para bajar el archivo de instalación oficial en tu computadora.',
  'Ejecutar el archivo exe: Abre la descarga o monta la imagen y haz doble clic en el instalador (.exe) para iniciar la instalación.',
  'Esperar a que finalice la instalación automática de todas las aplicaciones en tu equipo.',
  'Abrir cualquier aplicación (ej. Word o Excel), dirigirse a Cuenta > Cambiar clave de producto (o Activar) e ingresar la clave oficial de 25 caracteres recibida en tu compra.'
];

export const WINDOWS_STANDARD_STEPS = [
  'Descargar el archivo ISO de instalación de Windows mediante el enlace directo y descargar la herramienta gratuita Rufus (rufus.ie).',
  'Conectar una memoria USB de al menos 8 GB a tu computadora (se formateará durante el proceso, asegúrate de respaldar tus archivos importantes).',
  'Abrir Rufus en tu equipo y en la opción "Dispositivo" seleccionar tu memoria USB conectada.',
  'En "Elección de arranque", hacer clic en "Seleccionar" y escoger el archivo ISO de Windows descargado.',
  'En "Esquema de partición", seleccionar "GPT" (recomendado para equipos modernos con UEFI) o "MBR" (para equipos antiguos con BIOS heredado). Dejar el sistema de archivos en NTFS.',
  'Hacer clic en "Empezar" en Rufus, confirmar las advertencias y esperar a que la barra llegue al 100% (creación de USB booteable lista).',
  'Conectar el USB booteable en la PC donde instalarás Windows, reiniciar el equipo y presionar repetidamente la tecla del menú de booteo (F12, F11, F9 o ESC según la placa madre) para iniciar desde el USB.',
  'Seguir las instrucciones del instalador en pantalla, seleccionar tu partición o disco y esperar a que concluya la instalación de Windows.',
  'Una vez dentro de Windows, ingresar a Configuración > Sistema > Activación (o Actualización y seguridad > Activación), presionar "Cambiar clave de producto" e ingresar la clave oficial de 25 caracteres.'
];

export const OFFICE_365_PRO_STEPS = [
  'Descargar instalador: Haz clic en el botón de descarga directa para obtener el archivo instalador oficial (OfficeSetup.exe).',
  'Instalarlo: Ejecuta el archivo descargado para iniciar la instalación completa de las aplicaciones de Office en tu equipo.',
  'Iniciar sesión: Abre cualquier aplicación (como Word o Excel), haz clic en "Iniciar sesión" en la esquina superior derecha y accede con el correo y contraseña que se te proporcionaron en tu orden de compra.',
  'Crear nueva contraseña: A continuación, el sistema te solicitará obligatoriamente cambiar la contraseña temporal y crear una nueva contraseña personal y segura.',
  'Guardar contraseña: Guarda muy bien tu nueva contraseña personal para que puedas iniciar sesión y entrar en tus otros dispositivos (PC, Mac, tablet o smartphone).'
];

export const COMBO_WIN11_OFFICE2024_STEPS = [
  'Windows: Conectar un USB de al menos 8 GB, abrir Rufus, seleccionar la ISO de Windows 11, elegir esquema GPT/MBR y presionar Empezar. Reiniciar la PC con la tecla de booteo (F12/F11/F9) para iniciar desde el USB e instalar Windows.',
  'Activar Windows: Ir a Configuración > Sistema > Activación, presionar en "Cambiar la clave de producto" e ingresar tu clave de 25 caracteres de Windows 11 Pro.',
  'Office: Descargar el instalador directo de Office 2024 Pro Plus y ejecutar el archivo exe para instalar las aplicaciones en tu PC.',
  'Activar Office: Abrir Word o Excel, entrar a Cuenta > Activar producto e introducir tu clave de 25 caracteres de Office 2024 Pro Plus.'
];

export const COMBO_WIN10_OFFICE2021_STEPS = [
  'Windows: Conectar un USB de al menos 8 GB, abrir Rufus, seleccionar la ISO de Windows 10, elegir esquema GPT/MBR y presionar Empezar. Reiniciar la PC con la tecla de booteo (F12/F11/F9) para iniciar desde el USB e instalar Windows.',
  'Activar Windows: Ir a Configuración > Actualización y seguridad > Activación e ingresar tu clave de 25 caracteres de Windows 10 Pro.',
  'Office: Descargar el instalador directo de Office 2021 Pro Plus y ejecutar el archivo exe para instalar las aplicaciones en tu PC.',
  'Activar Office: Abrir Word o Excel, entrar a Cuenta > Activar producto e ingresar tu clave de 25 caracteres de Office 2021 Pro Plus.'
];

export const TELEPHONE_ACTIVATION_STEPS = [
  'Descarga e instala el software oficial de Microsoft utilizando el enlace del instalador directo provisto en tu pedido.',
  'Abre cualquier aplicación (Word, Excel o en Configuración > Activación de Windows) y selecciona la opción "Deseo activar el software por teléfono".',
  'El asistente de activación oficial de Microsoft generará tu Identificador de Instalación (ID de instalación compuesto por varios bloques de números).',
  'Accede al portal web oficial de activación telefónica de Microsoft (o a la línea telefónica gratuita) e introduce tu Identificador de Instalación.',
  'El sistema automatizado de Microsoft verificará los datos y te entregará tu Identificador de Confirmación (bloques de la A a la H). Ingrésalos en la pantalla y el software quedará activado de por vida con garantía total.'
];

export const products: Product[] = [
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
    rating: 4.9,
    reviews: 342,
    featured: true,
    badge: 'DIRECTA LTSC',
    features: [
      'Clave de 25 caracteres para activación directa oficial',
      'Compatibilidad con Windows 10 y Windows 11',
      'Actualizaciones automáticas de seguridad de Microsoft',
      'Multilenguaje y soporte oficial permanente'
    ],
    compatibility: 'Windows 10 / Windows 11 (32 & 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2024 (.exe)',
    downloadOptions: [
      {
        id: 'office-2024-exe',
        name: 'Descargar Instalador Directo Office 2024 (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Descarga inmediata del ejecutable oficial OfficeSetup.exe en español.'
      },
      {
        id: 'office-2024-img',
        name: 'Descargar Imagen Offline Completa Office 2024 (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN para instalación offline sin internet.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },

  // --- OFFICE ACTIVACIÓN POR TELÉFONO ---
  {
    id: 'prod-office-2024-tel',
    slug: 'office-2024-activacion-telefono',
    name: 'Office Profesional 2024 (Activación por Teléfono)',
    description: 'Alternativa económica y práctica para disfrutar de Microsoft Office 2024 Professional Plus. Incluye guía paso a paso e instrucciones claras para activación telefónica automatizada ante Microsoft. Licencia de por vida para 1 PC.',
    price: 13.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png',
    rating: 4.88,
    reviews: 178,
    badge: '📞 POR TELÉFONO • S/ 13',
    features: [
      'Activación telefónica automatizada Microsoft',
      'Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024',
      'Licencia permanente de pago único para 1 PC',
      'Guía paso a paso ilustrada incluida'
    ],
    compatibility: 'Windows 10 / Windows 11 (32 & 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2024 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2021-tel',
    slug: 'office-2021-activacion-telefono',
    name: 'Office Profesional 2021 (Activación por Teléfono)',
    description: 'Activación telefónica económica y 100% legal de Microsoft Office 2021 Professional Plus. Incluye suite completa de productividad y guía paso a paso para activación en servidores oficiales de Microsoft.',
    price: 12.00,
    oldPrice: 55.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2021.webp',
    fallbackImage: '/products/office-2021.png',
    rating: 4.86,
    reviews: 142,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Activación telefónica oficial Microsoft',
      'Word, Excel, PowerPoint, Outlook, Access 2021',
      'Licencia permanente sin cuotas mensuales',
      'Guía de instalación y activación incluida'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2021Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2021 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2019-tel',
    slug: 'office-2019-activacion-telefono',
    name: 'Office Profesional 2019 (Activación por Teléfono)',
    description: 'Alternativa económica para activar Office 2019 Professional Plus en tu PC de trabajo u hogar mediante el sistema telefónico de Microsoft.',
    price: 12.00,
    oldPrice: 50.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2019.webp',
    fallbackImage: '/products/office-2019.png',
    rating: 4.84,
    reviews: 96,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Word 2019, Excel 2019, PowerPoint 2019, Outlook 2019',
      'Activación telefónica de por vida para 1 PC',
      'Instrucciones paso a paso de fácil ejecución'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2019Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2019 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2016-tel',
    slug: 'office-2016-activacion-telefono',
    name: 'Office Profesional 2016 (Activación por Teléfono)',
    description: 'Super precio accesible para activar Microsoft Office 2016 Professional Plus en cualquier PC con Windows 7, 8, 10 u 11.',
    price: 12.00,
    oldPrice: 45.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2016.webp',
    fallbackImage: '/products/office-2016.png',
    rating: 4.82,
    reviews: 88,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Word, Excel, PowerPoint, Outlook 2016',
      'Excelente compatibilidad con PCs de recursos moderados',
      'Licencia permanente de activación telefónica'
    ],
    compatibility: 'Windows 7 / 8.1 / 10 / 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlusRetail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2016 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-office-2024-3pc',
    slug: 'office-2024-pro-plus-3-pc',
    name: 'Microsoft Office 2024 Professional Plus (3 PC)',
    description: 'Paquete de licencias oficiales permanentes para activar hasta 3 computadoras (PC) independientes. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024 sin pagos mensuales ni suscripciones.',
    price: 70.00,
    oldPrice: 190.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png',
    rating: 4.96,
    reviews: 124,
    badge: 'PACK 3 PC',
    features: [
      'Licencia digital oficial para 3 computadoras (PC)',
      'Activación permanente de por vida sin vencimiento',
      'Word, Excel, PowerPoint, Outlook, Access y Publisher 2024',
      'Soporte completo para Windows 10 y Windows 11 (32 y 64 bits)'
    ],
    compatibility: 'Windows 10 / Windows 11 (32 & 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2024 (.exe)',
    downloadOptions: [
      {
        id: 'office-2024-3pc-exe',
        name: 'Descargar Instalador Directo Office 2024 (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Descarga directa del instalador oficial de Microsoft Office 2024 Pro Plus.'
      },
      {
        id: 'office-2024-3pc-img',
        name: 'Descargar Imagen Offline Completa (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial para instalación en múltiples PCs.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2021',
    slug: 'office-2021-pro-plus',
    name: 'Microsoft Office 2021 Professional Plus',
    description: 'Licencia digital de por vida para Office 2021 Pro Plus. Activación instantánea en tu cuenta o equipo.',
    price: 25.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2021.webp',
    fallbackImage: '/products/office-2021.png',
    rating: 4.88,
    reviews: 195,
    bestSeller: true,
    features: [
      'Word, Excel, PowerPoint, Outlook y Teams',
      'Licencia permanente sin pagos mensuales',
      'Garantía de compra inmediata'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2021Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2021 Pro Plus (.exe)',
    downloadOptions: [
      {
        id: 'office-2021-exe',
        name: 'Descargar Instalador Directo Office 2021 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2021Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para instalación rápida online.'
      },
      {
        id: 'office-2021-img',
        name: 'Descargar Imagen Offline Office 2021 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2021Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG de Microsoft CDN para instalar sin conexión.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2021-std',
    slug: 'office-2021-standard',
    name: 'Microsoft Office 2021 Standard',
    description: 'Edición Standard para empresas e instituciones. Incluye Word, Excel, PowerPoint, Outlook y Publisher.',
    price: 27.90,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2021-standard.webp',
    fallbackImage: '/products/office-2021-standard.png',
    rating: 4.85,
    reviews: 112,
    features: [
      'Suite completa de productividad para empresas',
      'Instalación mediante Click-to-Run oficial',
      'Soporte corporativo y claves por volumen de activación'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=Standard2021Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2021 Standard (.exe)',
    downloadOptions: [
      {
        id: 'office-2021-std-exe',
        name: 'Descargar Instalador Directo Office 2021 Standard (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=Standard2021Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe de la versión Standard.'
      },
      {
        id: 'office-2021-std-img',
        name: 'Descargar Imagen Offline Office 2021 Standard (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/Standard2021Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de la versión Standard.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2019',
    slug: 'office-2019-pro-plus',
    name: 'Microsoft Office 2019 Professional Plus',
    description: 'Licencia digital oficial permanente para Office 2019. Excelente rendimiento para equipos de trabajo.',
    price: 24.00,
    oldPrice: 80.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2019.webp',
    fallbackImage: '/products/office-2019.png',
    rating: 4.86,
    reviews: 164,
    features: [
      'Word 2019, Excel 2019, PowerPoint 2019, Outlook 2019',
      'Licencia permanente para 1 PC',
      'Activación directa en tu equipo'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2019Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2019 Pro Plus (.exe)',
    downloadOptions: [
      {
        id: 'office-2019-exe',
        name: 'Descargar Instalador Directo Office 2019 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2019Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Office 2019.'
      },
      {
        id: 'office-2019-img',
        name: 'Descargar Imagen Offline Office 2019 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2019Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2016',
    slug: 'office-2016-pro-plus',
    name: 'Microsoft Office 2016 Professional Plus',
    description: 'Licencia permanente compatible con Windows 7, 8, 10 y 11. Ideal para equipos clásicos.',
    price: 24.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2016.webp',
    fallbackImage: '/products/office-2016.png',
    rating: 4.82,
    reviews: 145,
    badge: 'DIRECTA LTSC',
    features: [
      'Word 2016, Excel 2016, PowerPoint 2016, Outlook 2016',
      'Excelente compatibilidad con versiones anteriores de Windows'
    ],
    compatibility: 'Windows 7 / 8.1 / 10 / 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlusRetail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 2016 Pro Plus (.exe)',
    downloadOptions: [
      {
        id: 'office-2016-exe',
        name: 'Descargar Instalador Directo Office 2016 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlusRetail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Office 2016.'
      },
      {
        id: 'office-2016-img',
        name: 'Descargar Imagen Offline Office 2016 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlusRetail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN para Office 2016.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2013',
    slug: 'office-2013-pro-plus',
    name: 'Microsoft Office 2013 Professional Plus',
    description: 'Versión ligera para computadoras con recursos moderados.',
    price: 29.00,
    oldPrice: 55.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2013.webp',
    fallbackImage: '/products/office-2013.png',
    rating: 4.79,
    reviews: 98,
    features: [
      'Word, Excel, PowerPoint y Outlook 2013',
      'Bajo consumo de recursos'
    ],
    compatibility: 'Windows 7 / 8 / 10 / 11',
    downloadUrl: 'https://archive.org/download/office-2013-pro-plus-sp-1-spanish-x-64-x-86/Office2013ProPlusSP1_Spanish.iso',
    downloadLabel: 'Descargar instalador Office 2013 Pro Plus',
    downloadOptions: [
      {
        id: 'office-2013-iso',
        name: 'Descargar ISO Directa Office 2013 Pro Plus (Español)',
        url: 'https://archive.org/download/office-2013-pro-plus-sp-1-spanish-x-64-x-86/Office2013ProPlusSP1_Spanish.iso',
        badge: 'Archive.org Servidor Directo (.iso)',
        description: 'Imagen ISO oficial completa en español con SP1.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-office-2010',
    slug: 'office-2010-pro-plus',
    name: 'Microsoft Office 2010 Professional Plus',
    description: 'Edición clásica compatible con sistemas antiguos.',
    price: 29.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2010.webp',
    fallbackImage: '/products/office-2010.png',
    rating: 4.75,
    reviews: 74,
    badge: 'DIRECTA LTSC',
    features: ['Word 2010, Excel 2010 y suite básica de Office'],
    compatibility: 'Windows XP / Vista / 7 / 8 / 10',
    downloadUrl: 'https://archive.org/download/office-2010-professional-plus-sp-2-spanish/Office2010ProPlusSP2_Spanish.iso',
    downloadLabel: 'Descargar instalador Office 2010 Pro Plus',
    downloadOptions: [
      {
        id: 'office-2010-iso',
        name: 'Descargar ISO Directa Office 2010 Pro Plus (Español)',
        url: 'https://archive.org/download/office-2010-professional-plus-sp-2-spanish/Office2010ProPlusSP2_Spanish.iso',
        badge: 'Archive.org Servidor Directo (.iso)',
        description: 'Imagen ISO oficial en español con Service Pack 2.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-microsoft-365',
    slug: 'microsoft-365-personal-family',
    name: 'Microsoft 365 Personal (Cuenta - 1 Año)',
    description: 'Suscripción oficial a la suite Microsoft 365 por 1 año. Incluye Word, Excel, PowerPoint, Outlook y 100 GB de almacenamiento en la nube OneDrive.',
    price: 35.00,
    oldPrice: 110.00,
    duration: '1 año',
    category: 'office',
    imageUrl: '/products/microsoft-365.webp',
    fallbackImage: '/products/microsoft-365.png',
    cloudStorage: '100 GB OneDrive',
    rating: 4.94,
    reviews: 215,
    features: [
      'Acceso mediante cuenta proporcionada (la vinculas a tu dominio)',
      'Suscripción oficial garantizada por 1 año',
      '100 GB de almacenamiento seguro en la nube OneDrive',
      'Funciona en PC, Mac, iPad, iPhone y Android'
    ],
    compatibility: 'Windows, macOS, iOS, Android',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=O365ProPlusRetail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Office 365 (.exe)',
    downloadOptions: [
      {
        id: 'm365-installer',
        name: 'Descargar instalador Office 365 (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=O365ProPlusRetail&platform=x64&language=es-es&version=O16GA',
        badge: 'Instalador Click-to-Run (.exe)',
        description: 'Descarga directa del instalador oficial ejecutable OfficeSetup.exe de aplicaciones de Microsoft 365.'
      },
      {
        id: 'm365-portal',
        name: 'Portal oficial Office.com',
        url: 'https://www.office.com',
        badge: 'Portal de acceso',
        description: 'Acceso directo con el usuario y contraseña asignados para gestionar tus apps y dispositivos.'
      }
    ],
    installationSteps: OFFICE_365_PRO_STEPS
  },
  {
    id: 'prod-gemini-ai-pro',
    slug: 'google-gemini-ia-pro-18-meses',
    name: 'Gemini AI Pro (18 Meses)',
    description: 'Suscripción a Gemini AI Pro / Advanced por 18 meses. Activación oficial con link directo a tu cuenta personal de Google (Gmail). Incluye modelos avanzados, 5 TB de almacenamiento en la nube (Google One) e integración en Docs, Gmail y Drive.',
    price: 35.00,
    oldPrice: 120.00,
    duration: '18 meses',
    category: 'apps',
    imageUrl: '/products/gemini-ai-pro.webp',
    fallbackImage: '/products/gemini-ai-pro.png',
    rating: 4.97,
    reviews: 184,
    badge: 'GOOGLE AI ADVANCED',
    cloudStorage: '5 TB Google One Cloud',
    isAccountAccess: true,
    accountNotice: 'Activación mediante link directo oficial a tu cuenta personal de Google (Gmail). Sin necesidad de entregar contraseñas.',
    features: [
      'Acceso a modelos de vanguardia de Inteligencia Artificial',
      'Link de activación oficial vinculado directamente a tu cuenta personal de Google',
      '5 TB de almacenamiento seguro en la nube (Drive, Fotos y Gmail)',
      'IA integrada de manera nativa en Google Docs, Sheets, Slides y Gmail',
      'Garantía total de funcionamiento durante los 18 meses completos'
    ],
    compatibility: 'Navegadores Web, Windows, macOS, Android e iOS',
    downloadUrl: 'https://gemini.google.com',
    downloadLabel: 'Acceder a Google Gemini Web',
    downloadOptions: [
      {
        id: 'gemini-portal',
        name: 'Portal Oficial Google Gemini IA',
        url: 'https://gemini.google.com',
        badge: 'Portal Oficial Google',
        description: 'Acceso directo a la plataforma de IA de Google con tu cuenta personal activada.'
      }
    ],
    installationSteps: [
      'Recibirás en tu correo o WhatsApp el enlace oficial de invitación y activación directa para tu cuenta Google.',
      'Abre el enlace mientras tienes iniciada tu sesión en tu cuenta de Google (Gmail personal).',
      'Acepta la activación del plan Gemini Pro / Advanced de 18 meses.',
      '¡Listo! Tu cuenta tendrá habilitado de inmediato Gemini Pro y los 5 TB de almacenamiento en Google One.'
    ]
  },

  // --- WINDOWS CLAVES DIRECTAS ---
  {
    id: 'prod-win11-pro',
    slug: 'windows-11-pro-key',
    name: 'Windows 11 Professional Key 32/64 Bit',
    description: 'Clave de activación digital permanente para Windows 11 Pro. Soporta actualizaciones oficiales y multilenguaje.',
    price: 20.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-pro.webp',
    fallbackImage: '/products/windows-11-pro.png',
    rating: 4.95,
    reviews: 418,
    featured: true,
    badge: 'CLAVE DIRECTA',
    variants: [
      {
        id: 'oem',
        name: 'Windows 11 Pro OEM',
        type: 'OEM',
        price: 20.00,
        oldPrice: 85.00,
        shortDesc: 'Se vincula a la placa madre de 1 equipo específico.',
        badge: 'OEM • S/ 20'
      },
      {
        id: 'retail',
        name: 'Windows 11 Pro Retail',
        type: 'Retail',
        price: 28.00,
        oldPrice: 105.00,
        shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.',
        badge: 'RETAIL • S/ 28'
      }
    ],
    features: [
      'Activación directa en Ajustes > Sistema > Activación',
      'Acceso completo a BitLocker, Remote Desktop y Hyper-V',
      'Actualizaciones continuas por Microsoft Update'
    ],
    compatibility: 'PC con soporte para Windows 11 (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    downloadOptions: [
      {
        id: 'win11-tool',
        name: 'Descargar Media Creation Tool Windows 11 (.exe)',
        url: 'https://go.microsoft.com/fwlink/?linkid=2156295',
        badge: 'Herramienta oficial (.exe)',
        description: 'Herramienta oficial de Microsoft para descargar la imagen ISO de Windows 11 o crear un USB booteable con Rufus.'
      },
      {
        id: 'win11-iso',
        name: 'Descargar ISO directa Windows 11 (64 Bit Español)',
        url: 'https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/26200.6584.250915-1905.25h2_ge_release_svc_refresh_CLIENT_CONSUMER_x64FRE_es-es.iso',
        badge: 'ISO Oficial Directa',
        description: 'Enlace de descarga directa oficial de la imagen ISO de Windows 11 para usar con Rufus.'
      },
      {
        id: 'win11-web',
        name: 'Portal oficial de descargas Microsoft Windows 11',
        url: 'https://www.microsoft.com/es-es/software-download/windows11',
        badge: 'Web oficial Microsoft',
        description: 'Página oficial de Microsoft para descargar asistentes o ISO de Windows 11.'
      }
    ],
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win11-home',
    slug: 'windows-11-home-key',
    name: 'Windows 11 Home Key 64 Bit',
    description: 'Edición Home oficial para uso personal y entretenimiento con interfaz moderna.',
    price: 20.00,
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
      { id: 'oem', name: 'Windows 11 Home OEM', type: 'OEM', price: 20.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.', badge: 'OEM • S/ 20' },
      { id: 'retail', name: 'Windows 11 Home Retail', type: 'Retail', price: 26.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.', badge: 'RETAIL • S/ 26' }
    ],
    compatibility: 'Windows 11 (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    downloadOptions: [
      {
        id: 'win11-home-tool',
        name: 'Descargar Media Creation Tool Windows 11 (.exe)',
        url: 'https://go.microsoft.com/fwlink/?linkid=2156295',
        badge: 'Herramienta oficial (.exe)',
        description: 'Herramienta oficial para preparar tu USB booteable con Rufus o descargar la ISO de Windows 11.'
      },
      {
        id: 'win11-home-iso',
        name: 'Descargar ISO directa Windows 11 (64 Bit Español)',
        url: 'https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/26200.6584.250915-1905.25h2_ge_release_svc_refresh_CLIENT_CONSUMER_x64FRE_es-es.iso',
        badge: 'ISO Oficial Directa',
        description: 'Enlace de descarga directa oficial de la imagen ISO de Windows 11.'
      }
    ],
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win11-enterprise',
    slug: 'windows-11-enterprise-key',
    name: 'Windows 11 Enterprise Key 64 Bit',
    description: 'Edición empresarial avanzada con control de dispositivos y seguridad IT.',
    price: 33.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-enterprise.webp',
    fallbackImage: '/products/windows-11-enterprise.png',
    rating: 4.93,
    reviews: 135,
    badge: 'ENTERPRISE',
    features: ['DirectAccess, AppLocker y virtualización corporativa'],
    compatibility: 'Windows 11 (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    downloadOptions: [
      {
        id: 'win11-ent-tool',
        name: 'Descargar Media Creation Tool Windows 11 (.exe)',
        url: 'https://go.microsoft.com/fwlink/?linkid=2156295',
        badge: 'Herramienta oficial (.exe)',
        description: 'Herramienta oficial de Microsoft para preparar tu medio booteable.'
      }
    ],
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win10-pro',
    slug: 'windows-10-pro-key',
    name: 'Windows 10 Professional Key 32/64 Bit',
    description: 'Clave original para Windows 10 Pro. Actualizable gratis a Windows 11 Pro cuando lo desees.',
    price: 20.00,
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
      { id: 'oem', name: 'Windows 10 Pro OEM', type: 'OEM', price: 20.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.', badge: 'OEM • S/ 20' },
      { id: 'retail', name: 'Windows 10 Pro Retail', type: 'Retail', price: 27.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.', badge: 'RETAIL • S/ 27' }
    ],
    compatibility: 'Windows 10 (32 & 64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    downloadOptions: [
      {
        id: 'win10-tool',
        name: 'Descargar Media Creation Tool 22H2 (.exe)',
        url: 'https://go.microsoft.com/fwlink/?LinkId=691209',
        badge: 'Herramienta oficial (.exe)',
        description: 'Herramienta oficial Media Creation Tool 22H2 de Microsoft para descargar la ISO de Windows 10 o crear tu USB booteable.'
      },
      {
        id: 'win10-web',
        name: 'Portal oficial de descargas Microsoft Windows 10',
        url: 'https://www.microsoft.com/es-es/software-download/windows10',
        badge: 'Web oficial Microsoft',
        description: 'Página oficial de Microsoft para descargar la imagen ISO o asistente de actualización de Windows 10.'
      }
    ],
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win10-home',
    slug: 'windows-10-home-key',
    name: 'Windows 10 Home Key 32/64 Bit',
    description: 'Licencia original para usuarios de hogar. Rápido, seguro y estable.',
    price: 19.00,
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
      { id: 'oem', name: 'Windows 10 Home OEM', type: 'OEM', price: 19.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.', badge: 'OEM • S/ 19' },
      { id: 'retail', name: 'Windows 10 Home Retail', type: 'Retail', price: 25.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.', badge: 'RETAIL • S/ 25' }
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
    price: 32.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-enterprise.webp',
    fallbackImage: '/products/windows-10-enterprise.png',
    rating: 4.9,
    reviews: 142,
    badge: 'ENTERPRISE',
    features: ['Long Term Servicing Channel (LTSC) para la máxima estabilidad'],
    compatibility: 'Windows 10 Enterprise LTSC',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 LTSC (.exe)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win81-pro',
    slug: 'windows-8-1-pro-key',
    name: 'Windows 8.1 Professional Key',
    description: 'Licencia vitalicia para Windows 8.1 Pro.',
    price: 35.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-8-1-pro.webp',
    fallbackImage: '/products/windows-8-1-pro.png',
    rating: 4.78,
    reviews: 65,
    badge: 'CLAVE DIRECTA',
    features: ['Soporte para pantalla táctil y escritorio clásico'],
    compatibility: 'Windows 8.1 (32/64 Bit)',
    downloadUrl: 'https://archive.org/download/Win8.1ProSpanishx64/Win8.1_Spanish_x64.iso',
    downloadLabel: 'Descargar ISO Windows 8.1 Pro (64 Bit)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win7-pro',
    slug: 'windows-7-professional-key',
    name: 'Windows 7 Professional Key',
    description: 'Sistema clásico preferido por estabilidad en equipos antiguos.',
    price: 30.00,
    oldPrice: 60.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-7-professional.webp',
    fallbackImage: '/products/windows-7-professional.png',
    rating: 4.82,
    reviews: 128,
    badge: 'CLAVE DIRECTA',
    features: ['Aero Glass, Windows XP Mode y compatibilidad retro'],
    compatibility: 'Windows 7 (32/64 Bit)',
    downloadUrl: 'https://archive.org/download/windows-7-professional-sp1-spanish-x64/Win7_Pro_SP1_Spanish_x64.iso',
    downloadLabel: 'Descargar ISO Windows 7 Pro (SP1 64 Bit)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },
  {
    id: 'prod-win7-ultimate',
    slug: 'windows-7-ultimate-key',
    name: 'Windows 7 Ultimate Key',
    description: 'La edición más completa de Windows 7.',
    price: 28.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-7-ultimate.webp',
    fallbackImage: '/products/windows-7-ultimate.png',
    rating: 4.88,
    reviews: 64,
    badge: 'CLAVE DIRECTA',
    features: ['BitLocker, Aero Glass y soporte multilenguaje completo'],
    compatibility: 'Windows 7 (32/64 Bit)',
    downloadUrl: 'https://archive.org/download/windows-7-ultimate-sp1-spanish-x64/Win7_Ult_SP1_Spanish_x64.iso',
    downloadLabel: 'Descargar ISO Windows 7 Ultimate (SP1 64 Bit)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },

  // --- WINDOWS ACTIVACIÓN POR TELÉFONO ---
  {
    id: 'prod-win11-pro-tel',
    slug: 'windows-11-pro-activacion-telefono',
    name: 'Windows 11 Professional (Activación por Teléfono)',
    description: 'Alternativa económica y práctica para activar Windows 11 Pro en tu equipo. Incluye guía paso a paso e instrucciones claras para activación telefónica automatizada ante Microsoft. Licencia permanente de por vida.',
    price: 12.00,
    oldPrice: 60.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-pro.webp',
    fallbackImage: '/products/windows-11-pro.png',
    rating: 4.9,
    reviews: 165,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Activación telefónica oficial automatizada Microsoft',
      'BitLocker, Remote Desktop, Hyper-V y Windows Sandbox',
      'Licencia permanente de por vida para 1 PC',
      'Guía paso a paso ilustrada incluida'
    ],
    compatibility: 'Windows 11 (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-win11-home-tel',
    slug: 'windows-11-home-activacion-telefono',
    name: 'Windows 11 Home (Activación por Teléfono)',
    description: 'Activación telefónica rápida y económica para Windows 11 Home. Ideal para computadoras personales y entretenimiento en el hogar.',
    price: 12.00,
    oldPrice: 55.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-home.webp',
    fallbackImage: '/products/windows-11-home.png',
    rating: 4.87,
    reviews: 112,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Activación telefónica oficial Microsoft',
      'Interfaz moderna, soporte para DirectX 12 y Widgets',
      'Licencia de por vida para 1 equipo'
    ],
    compatibility: 'Windows 11 (64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?linkid=2156295',
    downloadLabel: 'Descargar Media Creation Tool Windows 11 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-win10-pro-tel',
    slug: 'windows-10-pro-activacion-telefono',
    name: 'Windows 10 Professional (Activación por Teléfono)',
    description: 'La opción más económica para activar Windows 10 Pro de por vida mediante llamada o asistente telefónico de Microsoft. Compatible con cualquier PC.',
    price: 12.00,
    oldPrice: 55.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-pro.webp',
    fallbackImage: '/products/windows-10-pro.png',
    rating: 4.88,
    reviews: 189,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Activación telefónica de por vida para 1 PC',
      'Soporte completo para Remote Desktop y BitLocker',
      'Instrucciones sencillas garantizadas'
    ],
    compatibility: 'Windows 10 (32 & 64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },
  {
    id: 'prod-win10-home-tel',
    slug: 'windows-10-home-activacion-telefono',
    name: 'Windows 10 Home (Activación por Teléfono)',
    description: 'Alternativa económica para activar Windows 10 Home de forma permanente en laptops o PCs de escritorio.',
    price: 12.00,
    oldPrice: 50.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-home.webp',
    fallbackImage: '/products/windows-10-home.png',
    rating: 4.83,
    reviews: 94,
    badge: '📞 POR TELÉFONO • S/ 12',
    features: [
      'Activación telefónica económica y legal',
      'Ideal para uso doméstico y estudio',
      'Sin vencimiento'
    ],
    compatibility: 'Windows 10 (32 & 64 Bit)',
    downloadUrl: 'https://go.microsoft.com/fwlink/?LinkId=691209',
    downloadLabel: 'Descargar Media Creation Tool Windows 10 (.exe)',
    installationSteps: TELEPHONE_ACTIVATION_STEPS
  },

  // --- COMBOS ---
  {
    id: 'prod-combo-win11-office2024',
    slug: 'combo-windows-11-pro-office-2024',
    name: 'Combo 2 en 1: Windows 11 Pro + Office 2024 Pro Plus',
    description: 'Paquete de licencias definitivas. Activa Windows 11 Pro y la suite completa de Office 2024 al mejor precio.',
    price: 45.00,
    oldPrice: 195.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-win11-office2024.webp',
    fallbackImage: '/products/combo-win11-office2024.png',
    rating: 5.0,
    reviews: 289,
    featured: true,
    features: [
      'Incluye 2 licencias 100% independientes y definitivas',
      'Windows 11 Pro + Office 2024 Pro Plus',
      'Ahorro superior al 55% en comparación con licencias individuales',
      'Garantía técnica y soporte de instalación prioritario'
    ],
    compatibility: 'Windows 10 y 11 (32 y 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instaladores de Windows 11 Pro y Office 2024 Pro',
    downloadOptions: [
      {
        id: 'combo-win11-pro',
        name: 'Descargar Windows 11 Pro (Media Creation Tool .exe)',
        url: 'https://go.microsoft.com/fwlink/?linkid=2156295',
        badge: 'Herramienta Windows (.exe)',
        description: 'Herramienta oficial de Microsoft (Media Creation Tool) para descargar la ISO de Windows 11 o preparar tu USB booteable con Rufus.'
      },
      {
        id: 'combo-win11-iso',
        name: 'Descargar ISO directa Windows 11 (64 Bit Español)',
        url: 'https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/26200.6584.250915-1905.25h2_ge_release_svc_refresh_CLIENT_CONSUMER_x64FRE_es-es.iso',
        badge: 'ISO Oficial Directa',
        description: 'Descarga directa oficial de la imagen ISO de Windows 11 en español para grabar en tu USB con Rufus.'
      },
      {
        id: 'combo-office-2024-pro',
        name: 'Descargar Office 2024 Professional Plus (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Instalador Office (.exe)',
        description: 'Descarga directa del instalador ejecutable oficial de Office 2024 Pro Plus (OfficeSetup.exe) en español.'
      }
    ],
    installationSteps: COMBO_WIN11_OFFICE2024_STEPS
  },
  {
    id: 'prod-combo-office-project-visio-2024',
    slug: 'combo-office-project-visio-2024',
    name: 'Combo 3 en 1: Microsoft Office + Project + Visio Profesional 2024',
    description: 'El combo definitivo de productividad profesional de Microsoft. Incluye 3 licencias oficiales permanentes: Office 2024 Pro Plus, Project 2024 Pro y Visio 2024 Pro. Activación de por vida para 1 PC sin suscripciones ni cobros recurrentes.',
    price: 70.00,
    oldPrice: 230.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-3in1-2024.webp',
    fallbackImage: '/products/combo-3in1-2024.png',
    rating: 4.98,
    reviews: 142,
    badge: 'COMBO 3 EN 1',
    featured: true,
    features: [
      '3 licencias digitales oficiales de por vida',
      'Office 2024 Pro Plus (Word, Excel, PowerPoint, Outlook, Access, Publisher)',
      'Microsoft Project Professional 2024 (Cartas Gantt y Recursos)',
      'Microsoft Visio Professional 2024 (Flujogramas BPMN y Redes)',
      'Ahorro superior al 65% en paquete integral'
    ],
    compatibility: 'Windows 10 / Windows 11 (32 & 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instaladores oficiales Microsoft (.exe)',
    downloadOptions: [
      {
        id: 'combo-3in1-office',
        name: 'Instalador Office 2024 Professional Plus (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Office 2024 (.exe)',
        description: 'Descarga directa del ejecutable oficial de Office 2024 Pro Plus.'
      },
      {
        id: 'combo-3in1-project',
        name: 'Instalador Project 2024 Professional (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Project 2024 (.exe)',
        description: 'Descarga directa del instalador de Project 2024 Pro.'
      },
      {
        id: 'combo-3in1-visio',
        name: 'Instalador Visio 2024 Professional (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Visio 2024 (.exe)',
        description: 'Descarga directa del instalador de Visio 2024 Pro.'
      }
    ],
    installationSteps: [
      'Descarga e instala Microsoft Office 2024 Pro Plus ejecutando el archivo instalador oficial y activa con la clave proporcionada.',
      'Descarga e instala Microsoft Project 2024 Professional e introduce la clave oficial de Project.',
      'Descarga e instala Microsoft Visio 2024 Professional e introduce su respectiva clave de activación.',
      'Las 3 aplicaciones quedarán activadas de forma permanente de por vida en tu equipo con soporte oficial.'
    ]
  },
  {
    id: 'prod-combo-win10-office2024',
    slug: 'combo-windows-10-pro-office-2024',
    name: 'Combo 2 en 1: Windows 10 Pro + Office 2024 Pro Plus',
    description: 'Paquete de licencias definitivas. Activa Windows 10 Pro y la suite completa de Office 2024 al mejor precio.',
    price: 44.00,
    oldPrice: 180.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-win11-office2024.webp',
    fallbackImage: '/products/combo-win11-office2024.png',
    rating: 4.95,
    reviews: 178,
    features: [
      'Windows 10 Pro + Office 2024 Pro Plus',
      'Licencias 100% independientes de por vida',
      'Ahorro superior al 55% frente a compra individual',
      'Garantía técnica y soporte de instalación prioritario'
    ],
    compatibility: 'Windows 10 (32 y 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instaladores de Windows 10 Pro y Office 2024 Pro',
    downloadOptions: [
      {
        id: 'combo-win10-pro',
        name: 'Descargar Windows 10 Pro (Media Creation Tool .exe)',
        url: 'https://go.microsoft.com/fwlink/?LinkId=691209',
        badge: 'Herramienta Windows (.exe)',
        description: 'Herramienta oficial Media Creation Tool 22H2 para descargar la ISO de Windows 10 o crear el USB booteable con Rufus.'
      },
      {
        id: 'combo-office-2024-pro',
        name: 'Descargar Office 2024 Professional Plus (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Instalador Office (.exe)',
        description: 'Descarga directa del instalador ejecutable oficial de Office 2024 Pro Plus (OfficeSetup.exe) en español.'
      }
    ],
    installationSteps: COMBO_WIN10_OFFICE2021_STEPS
  },

  // --- PROJECT & VISIO ---
  {
    id: 'prod-project-2024',
    slug: 'microsoft-project-2024-pro',
    name: 'Microsoft Project Professional 2024',
    description: 'Herramienta líder en gestión de proyectos corporativos. Licencia permanente para 1 PC.',
    price: 28.00,
    oldPrice: 110.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2024.webp',
    fallbackImage: '/products/project-2024.png',
    rating: 4.92,
    reviews: 88,
    badge: 'NUEVO • S/ 28',
    features: [
      'Diagramas de Gantt y gestión avanzada de recursos',
      'Integración nativa con Office 2024 y Microsoft Teams',
      'Clave oficial permanente'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Project 2024 Pro (.exe)',
    downloadOptions: [
      {
        id: 'project-2024-exe',
        name: 'Descargar Instalador Directo Project 2024 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Descarga inmediata del ejecutable oficial OfficeSetup.exe para Project 2024.'
      },
      {
        id: 'project-2024-img',
        name: 'Descargar Imagen Offline Project 2024 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2024Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN para instalar sin internet.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-coreldraw-2024-mac',
    slug: 'coreldraw-graphics-suite-2024-mac',
    name: 'CorelDRAW Graphics Suite 2024 para Mac (1 PC / Permanente)',
    description: 'Software profesional de diseño gráfico, ilustración vectorial y edición fotográfica para macOS. Licencia oficial de por vida para 1 Mac sin suscripciones ni cuotas recurrentes. Optimizado para procesadores Apple Silicon (M1, M2, M3, M4) e Intel.',
    price: 32.00,
    oldPrice: 150.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/coreldraw-2024-mac.webp',
    fallbackImage: '/products/coreldraw-2024-mac.png',
    rating: 4.95,
    reviews: 116,
    badge: 'MAC PERMANENTE',
    features: [
      'Licencia oficial vitalicia para 1 Mac sin vencimiento',
      'Optimizado 100% para Apple Silicon (M1/M2/M3/M4) y procesadores Intel',
      'Incluye CorelDRAW 2024, Corel PHOTO-PAINT y Corel Font Manager',
      'Ilustración vectorial profesional, maquetación y tipografía avanzada'
    ],
    compatibility: 'macOS Sequoia, Sonoma, Ventura, Monterey (Apple Silicon & Intel)',
    downloadUrl: 'https://www.coreldraw.com/la/pages/download/',
    downloadLabel: 'Descargar Instalador CorelDRAW 2024 (.dmg)',
    downloadOptions: [
      {
        id: 'coreldraw-mac-pkg',
        name: 'Instalador CorelDRAW Graphics Suite 2024 (.dmg)',
        url: 'https://www.coreldraw.com/la/pages/download/',
        badge: 'Instalador macOS (.dmg)',
        description: 'Instalador oficial de CorelDRAW para macOS con soporte Apple Silicon e Intel.'
      }
    ],
    installationSteps: [
      'Descarga el instalador oficial de CorelDRAW Graphics Suite 2024 para macOS (.dmg).',
      'Abre el archivo descargado y arrastra la aplicación CorelDRAW a tu carpeta de Aplicaciones.',
      'Inicia la aplicación e introduce la clave oficial de activación permanente provista en tu pedido.',
      'Tu software quedará activado de por vida para 1 Mac sin suscripciones ni cobros recurrentes.'
    ]
  },
  {
    id: 'prod-visio-2024',
    slug: 'microsoft-visio-2024-pro',
    name: 'Microsoft Visio Professional 2024',
    description: 'Crea diagramas de flujo, mapas de procesos y esquemas técnicos con la versión oficial 2024.',
    price: 28.00,
    oldPrice: 110.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2024.webp',
    fallbackImage: '/products/visio-2024.png',
    rating: 4.9,
    reviews: 76,
    badge: 'VISIO 2024 • S/ 28',
    features: [
      'Cientos de plantillas vectoriales y formas estándar',
      'Modelado de procesos BPMN 2.0 y UML 2.5',
      'Licencia permanente para 1 equipo'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2024Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Visio 2024 Pro (.exe)',
    downloadOptions: [
      {
        id: 'visio-2024-exe',
        name: 'Descargar Instalador Directo Visio 2024 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2024Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Descarga inmediata del ejecutable oficial OfficeSetup.exe para Visio 2024.'
      },
      {
        id: 'visio-2024-img',
        name: 'Descargar Imagen Offline Visio 2024 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2024Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN para instalar sin internet.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-project-2021',
    slug: 'microsoft-project-2021-pro',
    name: 'Microsoft Project Professional 2021',
    description: 'Gestión profesional de proyectos con diagramas de Gantt y recursos asignados.',
    price: 27.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2021.webp',
    fallbackImage: '/products/project-2021.png',
    rating: 4.88,
    reviews: 62,
    badge: 'PROJECT 2021 • S/ 27',
    features: [
      'Control de costos y programación de tareas',
      'Licencia oficial de por vida'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2021Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Project 2021 Pro (.exe)',
    downloadOptions: [
      {
        id: 'project-2021-exe',
        name: 'Descargar Instalador Directo Project 2021 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2021Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Project 2021.'
      },
      {
        id: 'project-2021-img',
        name: 'Descargar Imagen Offline Project 2021 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2021Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-project-2019',
    slug: 'microsoft-project-2019-pro',
    name: 'Microsoft Project Professional 2019',
    description: 'Lleva el control de tus proyectos corporativos con herramientas oficiales.',
    price: 27.00,
    oldPrice: 80.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2019.webp',
    fallbackImage: '/products/project-2019.png',
    rating: 4.85,
    reviews: 54,
    badge: 'PROJECT 2019 • S/ 27',
    features: ['Diagramas de Gantt y control de entregables'],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2019Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Project 2019 Pro (.exe)',
    downloadOptions: [
      {
        id: 'project-2019-exe',
        name: 'Descargar Instalador Directo Project 2019 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectPro2019Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Project 2019.'
      },
      {
        id: 'project-2019-img',
        name: 'Descargar Imagen Offline Project 2019 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2019Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-project-2016',
    slug: 'microsoft-project-2016-pro',
    name: 'Microsoft Project Professional 2016',
    description: 'Herramienta clásica de proyectos para Windows.',
    price: 27.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2016.webp',
    fallbackImage: '/products/project-2016.png',
    rating: 4.81,
    reviews: 48,
    badge: 'PROJECT 2016 • S/ 27',
    features: ['Planificación e informes de proyectos'],
    compatibility: 'Windows 7 / 8 / 10 / 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectProRetail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Project 2016 Pro (.exe)',
    downloadOptions: [
      {
        id: 'project-2016-exe',
        name: 'Descargar Instalador Directo Project 2016 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProjectProRetail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Project 2016.'
      },
      {
        id: 'project-2016-img',
        name: 'Descargar Imagen Offline Project 2016 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectProRetail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2021',
    slug: 'microsoft-visio-2021-pro',
    name: 'Microsoft Visio Professional 2021',
    description: 'Diagramación profesional y flujo de procesos técnicos.',
    price: 27.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2021.webp',
    fallbackImage: '/products/visio-2021.png',
    rating: 4.87,
    reviews: 58,
    badge: 'VISIO 2021 • S/ 27',
    features: [
      'Plantillas vectoriales y diagramas de flujo',
      'Licencia permanente de por vida'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2021Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Visio 2021 Pro (.exe)',
    downloadOptions: [
      {
        id: 'visio-2021-exe',
        name: 'Descargar Instalador Directo Visio 2021 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2021Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Visio 2021.'
      },
      {
        id: 'visio-2021-img',
        name: 'Descargar Imagen Offline Visio 2021 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2021Retail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2019',
    slug: 'microsoft-visio-2019-pro',
    name: 'Microsoft Visio Professional 2019',
    description: 'Herramientas profesionales para diseño de diagramas, mapas conceptuales e ingeniería de procesos.',
    price: 26.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2019.webp',
    fallbackImage: '/products/visio-2019.png',
    rating: 4.84,
    reviews: 51,
    badge: 'VISIO 2019 • S/ 26',
    features: [
      'Diagramas BPMN 2.0, UML y redes informáticas',
      'Compatibilidad nativa con Windows 10 y 11',
      'Licencia permanente de por vida para 1 PC'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2019Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Visio 2019 Pro (.exe)',
    downloadOptions: [
      {
        id: 'visio-2019-exe',
        name: 'Descargar Instalador Directo Visio 2019 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioPro2019Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Visio 2019.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2016',
    slug: 'microsoft-visio-2016-pro',
    name: 'Microsoft Visio Professional 2016',
    description: 'Diseño de mapas conceptuales e ingenierías.',
    price: 26.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2016.webp',
    fallbackImage: '/products/visio-2016.png',
    rating: 4.8,
    reviews: 42,
    badge: 'VISIO 2016',
    features: ['Diagramas de arquitectura de red y flujogramas'],
    compatibility: 'Windows 7 / 8 / 10 / 11',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioProRetail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instalador Visio 2016 Pro (.exe)',
    downloadOptions: [
      {
        id: 'visio-2016-exe',
        name: 'Descargar Instalador Directo Visio 2016 Pro (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=VisioProRetail&platform=x64&language=es-es&version=O16GA',
        badge: 'Servidor Oficial Microsoft (.exe)',
        description: 'Ejecutable oficial OfficeSetup.exe para Visio 2016.'
      },
      {
        id: 'visio-2016-img',
        name: 'Descargar Imagen Offline Visio 2016 Pro (.img)',
        url: 'https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioProRetail.img',
        badge: 'Microsoft CDN (.img)',
        description: 'Imagen ISO/IMG oficial de Microsoft CDN.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },
  {
    id: 'prod-visio-2013',
    slug: 'microsoft-visio-2013-pro',
    name: 'Microsoft Visio Professional 2013',
    description: 'Esquemas técnicos e ingeniería de procesos.',
    price: 25.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2013.webp',
    fallbackImage: '/products/visio-2013.png',
    rating: 4.76,
    reviews: 35,
    badge: 'VISIO 2013 • S/ 25',
    features: ['Modelado básico de procesos'],
    compatibility: 'Windows 7 / 8 / 10 / 11',
    downloadUrl: 'https://archive.org/download/visio-professional-2013-sp1-spanish/VisioPro2013SP1_Spanish.iso',
    downloadLabel: 'Descargar instalador Visio 2013 Pro',
    downloadOptions: [
      {
        id: 'visio-2013-iso',
        name: 'Descargar ISO Directa Visio 2013 Pro (Español)',
        url: 'https://archive.org/download/visio-professional-2013-sp1-spanish/VisioPro2013SP1_Spanish.iso',
        badge: 'Archive.org Servidor Directo (.iso)',
        description: 'Imagen ISO oficial completa de Visio 2013 SP1 en español.'
      }
    ],
    installationSteps: OFFICE_STANDARD_STEPS
  },

  // --- APPS & SUSCRIPCIONES DIGITALES PREMIUM ---
  {
    id: 'prod-duolingo-super',
    slug: 'duolingo-super-12-meses',
    name: 'Duolingo Super (12 Meses)',
    description: 'Suscripción premium a Duolingo Super por 12 meses completos para aprender idiomas sin límites. Vidas infinitas, sin anuncios molestos, modo sin conexión y práctica personalizada de errores. Se activa en tu cuenta personal.',
    price: 27.00,
    oldPrice: 89.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/duolingo-super.webp',
    fallbackImage: '/products/duolingo-super.png',
    rating: 4.96,
    reviews: 245,
    badge: 'CUENTA PREMIUM',
    features: [
      'Vidas infinitas para practicar sin interrupciones',
      'Cero anuncios para máxima concentración',
      'Repaso personalizado de errores cometidos',
      'Activación en tu cuenta personal de Duolingo',
      'Garantía total durante los 12 meses'
    ],
    compatibility: 'Android, iOS, iPad, Web (PC y Mac)',
    downloadUrl: 'https://www.duolingo.com',
    downloadLabel: 'Acceder a Duolingo Web',
    downloadOptions: [
      {
        id: 'duo-portal',
        name: 'Portal Web Oficial Duolingo',
        url: 'https://www.duolingo.com',
        badge: 'Acceso Oficial Web',
        description: 'Acceso directo a la plataforma con tu suscripción Super activada.'
      }
    ],
    installationSteps: [
      'Recibirás en tu correo o WhatsApp la invitación oficial de activación para tu cuenta de Duolingo.',
      'Abre el enlace mientras tienes iniciada sesión en tu cuenta de Duolingo (correo personal).',
      'Acepta unirte y tu cuenta quedará actualizada de inmediato a Duolingo Super con vidas infinitas por 12 meses.'
    ]
  },
  {
    id: 'prod-gemini-ai-pro-12m',
    slug: 'gemini-ai-pro-12-meses',
    name: 'Gemini AI Pro (12 Meses)',
    description: 'Suscripción a Gemini AI Pro / Advanced por 12 meses. Activación oficial con link directo a tu cuenta personal de Google (Gmail). Incluye modelos avanzados de IA, almacenamiento en la nube e integración nativa en Google Docs, Sheets y Gmail.',
    price: 20.00,
    oldPrice: 80.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/gemini-ai-pro.webp',
    fallbackImage: '/products/gemini-ai-pro.png',
    rating: 4.95,
    reviews: 130,
    badge: 'GOOGLE AI PRO',
    cloudStorage: 'Almacenamiento Google One Cloud',
    isAccountAccess: true,
    accountNotice: 'Activación mediante link directo oficial a tu cuenta personal de Google (Gmail). Sin entregar contraseñas.',
    features: [
      'Acceso a modelos de vanguardia de Inteligencia Artificial',
      'Activación directa en tu cuenta personal de Google (Gmail)',
      'Espacio seguro en la nube Google One',
      'IA integrada de forma nativa en Google Workspace',
      'Garantía total de 12 meses continuos'
    ],
    compatibility: 'Web, Windows, macOS, Android e iOS',
    downloadUrl: 'https://gemini.google.com',
    downloadLabel: 'Acceder a Plataforma IA',
    downloadOptions: [
      {
        id: 'gemini-12m-portal',
        name: 'Portal Oficial Web',
        url: 'https://gemini.google.com',
        badge: 'Portal Oficial',
        description: 'Acceso directo a la plataforma con tu cuenta personal activada.'
      }
    ],
    installationSteps: [
      'Recibirás el enlace oficial de invitación y activación directa para tu cuenta Google.',
      'Abre el enlace con tu sesión de Gmail personal iniciada.',
      'Acepta la activación del plan Pro de 12 meses y disfruta del servicio.'
    ]
  },
  {
    id: 'prod-mcafee-antivirus',
    slug: 'mcafee-antivirus-total-protection-12m',
    name: 'McAfee AntiVirus (1 PC • 12 Meses)',
    description: 'Licencia digital oficial de McAfee AntiVirus para 1 PC durante 12 meses. Protección galardonada contra virus, ransomware, troyanos, robo de identidad y navegación web segura para tu computadora.',
    price: 38.00,
    oldPrice: 120.00,
    duration: '12 meses (1 PC)',
    category: 'apps',
    imageUrl: '/products/mcafee-antivirus.webp',
    fallbackImage: '/products/mcafee-antivirus.jpg',
    rating: 4.92,
    reviews: 164,
    badge: '1 PC • 12 MESES',
    features: [
      'Protección para 1 PC con Windows (12 meses de cobertura completa)',
      'Defensa antivirus, anti-malware y anti-ransomware en tiempo real',
      'Navegación web segura y protección bancaria anti-phishing',
      'Firewall bidireccional avanzado y optimizador de rendimiento para PC',
      'Clave oficial de 25 caracteres canjeable directamente en mcafee.com/activate',
      'Actualizaciones automáticas diarias de seguridad y soporte técnico'
    ],
    compatibility: 'Windows 11 y Windows 10 (32 y 64 bits)',
    downloadUrl: 'https://www.mcafee.com/activate',
    downloadLabel: 'Canjear y Descargar en McAfee Oficial',
    downloadOptions: [
      {
        id: 'mcafee-portal',
        name: 'Portal Oficial Canje McAfee (.com/activate)',
        url: 'https://www.mcafee.com/activate',
        badge: 'Web Oficial McAfee',
        description: 'Ingresa tu clave de 25 caracteres para registrar tu suscripción de 1 PC en tu cuenta McAfee y descargar el instalador.'
      }
    ],
    installationSteps: [
      'Ingresa a la página oficial de activación: mcafee.com/activate.',
      'Introduce la clave oficial de 25 caracteres provista en tu orden e inicia sesión con tu cuenta McAfee (o crea una gratis).',
      'Haz clic en Descargar para bajar el instalador oficial de McAfee AntiVirus en tu PC.',
      'Ejecuta el instalador y tu equipo quedará protegido en tiempo real con 12 meses completos de cobertura.'
    ]
  },
  {
    id: 'prod-canva-pro',
    slug: 'canva-pro-12-meses',
    name: 'Canva Pro (12 Meses)',
    description: 'Suscripción a Canva Pro por 12 meses para diseño gráfico profesional. Activación directa por invitación oficial a tu correo personal. Acceso ilimitado a más de 100 millones de fotos, videos, gráficos, plantillas premium, quitafondos mágico de imágenes y videos en un clic, y herramientas de Inteligencia Artificial (Magic Studio).',
    price: 20.00,
    oldPrice: 79.00,
    duration: '12 meses',
    category: 'apps',
    imageUrl: '/products/canva-pro.webp',
    fallbackImage: '/products/canva-pro.png',
    rating: 4.98,
    reviews: 312,
    badge: 'PRO INVITACIÓN',
    features: [
      'Acceso total a biblioteca de 100M+ recursos premium (fotos, audio, video)',
      'Herramientas IA Magic Studio y quitafondos instantáneo con un clic',
      'Kits de marca con paletas de colores, fuentes y logos ilimitados',
      'Redimensionamiento mágico inteligente a cualquier formato de red social',
      'Activación por invitación directa a tu correo electrónico personal'
    ],
    compatibility: 'Web (PC y Mac), App móvil Android e iOS, iPad',
    downloadUrl: 'https://www.canva.com',
    downloadLabel: 'Acceder a Canva Web',
    downloadOptions: [
      {
        id: 'canva-portal',
        name: 'Portal Oficial Canva Web',
        url: 'https://www.canva.com',
        badge: 'Canva Oficial',
        description: 'Accede a tus proyectos y herramientas Pro directamente en tu navegador o app.'
      }
    ],
    installationSteps: [
      'Recibirás en tu correo o WhatsApp la invitación oficial de activación para tu cuenta de Canva.',
      'Abre el enlace mientras tienes iniciada tu sesión en tu cuenta de Canva (correo personal).',
      'Acepta la invitación y tu cuenta pasará automáticamente a contar con todas las funciones de Canva Pro por 12 meses.'
    ]
  },
  {
    id: 'prod-adobe-acrobat-pro-2018',
    slug: 'adobe-acrobat-pro-dc-2018-licencia-permanente',
    name: 'Adobe Acrobat Pro DC 2018 (Licencia Permanente)',
    description: 'Licencia digital oficial permanente de Adobe Acrobat Pro DC 2018 para Windows. Incluye clave de activación vitalicia, instalador completo y guía paso a paso. Crea, edita, convierte, firma, protege y combina documentos PDF profesionales sin suscripciones ni mensualidades.',
    price: 50.00,
    oldPrice: 160.00,
    duration: 'Permanente (De por vida)',
    category: 'apps',
    imageUrl: '/products/adobe-acrobat-pro-2018.webp',
    fallbackImage: '/products/adobe-acrobat-pro-2018.png',
    rating: 4.96,
    reviews: 148,
    badge: 'PERMANENTE • PDF PRO',
    features: [
      'Licencia permanente de por vida (un solo pago, sin mensualidades)',
      'Clave de activación digital oficial + instalador completo incluido',
      'Edición completa de texto e imágenes directamente en archivos PDF',
      'Conversión precisa de PDF a Word, Excel, PowerPoint y viceversa',
      'Firma electrónica, protección con contraseña y permisos de seguridad',
      'Guía paso a paso de instalación y soporte técnico garantizado'
    ],
    compatibility: 'Windows 10, Windows 11, Windows 8.1 y Windows 7 (32/64 bits)',
    downloadUrl: 'https://helpx.adobe.com/es/acrobat/kb/acrobat-downloads.html',
    downloadLabel: 'Descargar Instalador Adobe Acrobat',
    downloadOptions: [
      {
        id: 'acrobat-installer-direct',
        name: 'Instalador Oficial Adobe Acrobat DC (.exe)',
        url: 'https://helpx.adobe.com/es/acrobat/kb/acrobat-downloads.html',
        badge: 'Instalador + Guía Incluida',
        description: 'Instalador completo oficial provisto junto a tu clave y guía de activación paso a paso.'
      }
    ],
    installationSteps: [
      'Descarga el instalador oficial de Adobe Acrobat Pro DC provisto en tu confirmación de orden.',
      'Ejecuta el asistente de instalación en tu PC siguiendo la guía paso a paso adjunta.',
      'Ingresa tu clave de activación permanente cuando el instalador lo requiera.',
      '¡Listo! Tu Adobe Acrobat Pro DC quedará activado de forma definitiva sin pagos recurrentes.'
    ]
  }
];

