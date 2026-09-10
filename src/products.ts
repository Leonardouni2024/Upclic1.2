import type { Product, CartTotals, Currency } from './types.ts';

export const WHATSAPP_NUMBER = '51983204384';
export const WHATSAPP_DISPLAY = '+51 983 204 384';
export const MERCADO_PAGO_URL = 'https://www.mercadopago.com.pe';

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

export function formatPrice(priceInPEN: number, customCurrency?: Currency, customRate?: number): string {
  const currency = customCurrency || getStoredCurrency();
  const penRate = customRate || getStoredExchangeRate();
  const priceInUSD = priceInPEN / (penRate || 3.75);

  if (currency === 'USD') {
    return `$ ${priceInUSD.toFixed(2)} USD`;
  }
  if (currency === 'COP') {
    const copRate = 4100;
    const priceInCOP = Math.round(priceInUSD * copRate);
    return `$ ${priceInCOP.toLocaleString('es-CO')} COP`;
  }
  if (currency === 'MXN') {
    const mxnRate = 19.8;
    const priceInMXN = priceInUSD * mxnRate;
    return `$ ${priceInMXN.toFixed(2)} MXN`;
  }
  return `S/ ${priceInPEN.toFixed(2)}`;
}

export function formatPriceNoSymbol(priceInPEN: number, customCurrency?: Currency, customRate?: number): string {
  const currency = customCurrency || getStoredCurrency();
  const penRate = customRate || getStoredExchangeRate();
  const priceInUSD = priceInPEN / (penRate || 3.75);

  if (currency === 'USD') {
    return priceInUSD.toFixed(2);
  }
  if (currency === 'COP') {
    const copRate = 4100;
    return Math.round(priceInUSD * copRate).toLocaleString('es-CO');
  }
  if (currency === 'MXN') {
    const mxnRate = 19.8;
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
  { code: 'UPCLIC10', discountPercent: 10, description: '10% de descuento de bienvenida' },
  { code: 'COMBO15', discountPercent: 15, minItems: 2, description: '15% de descuento por llevar 2 o más productos' },
  { code: 'VIP20', discountPercent: 20, description: '20% de descuento especial clientes VIP' },
  { code: 'PRICLIC1', discountPercent: 10, description: '10% de descuento exclusivo', expiresAt: 1791417599000 },
  { code: 'PROVECLIC1', discountPercent: 50, description: '50% de descuento exclusivo' }
];

export function calculateCartTotals(
  items: { product: Product; quantity: number; unitPrice?: number }[],
  couponCode?: string,
  dynamicCoupon?: { code: string, discountPercent: number, expiresAt?: number }
): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice ?? item.product.price) * item.quantity, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

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

  const isMultiItemDiscount = totalQuantity >= 2 && discountRate < 0.10;
  if (isMultiItemDiscount) {
    discountRate = 0.10;
  }

  const discountAmount = subtotal * discountRate;
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

export const products: Product[] = [
  // --- OFFICE ---
  {
    id: 'prod-office-2024',
    slug: 'office-2024-pro-plus',
    name: 'Microsoft Office 2024 Professional Plus',
    description: 'Licencia digital oficial permanente para 1 PC. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher 2024. Licencia vitalicia vinculable a tu cuenta de Microsoft.',
    price: 42.90,
    oldPrice: 120.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2024.webp',
    fallbackImage: '/products/office-2024.png',
    rating: 4.9,
    reviews: 342,
    badge: 'MÁS VENDIDO',
    bestSeller: true,
    featured: true,
    features: [
      'Clave de 25 caracteres para activación oficial',
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
  {
    id: 'prod-office-2021',
    slug: 'office-2021-pro-plus',
    name: 'Microsoft Office 2021 Professional Plus',
    description: 'Licencia digital de por vida para Office 2021 Pro Plus. Activación instantánea en tu cuenta o equipo.',
    price: 34.90,
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
      'Garantía de activación inmediata'
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
    price: 24.90,
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
    price: 20.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2016.webp',
    fallbackImage: '/products/office-2016.png',
    rating: 4.82,
    reviews: 145,
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
    price: 50.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'office',
    imageUrl: '/products/office-2010.webp',
    fallbackImage: '/products/office-2010.png',
    rating: 4.75,
    reviews: 74,
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
    price: 45.00,
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

  // --- WINDOWS ---
  {
    id: 'prod-win11-pro',
    slug: 'windows-11-pro-key',
    name: 'Windows 11 Professional Key 32/64 Bit',
    description: 'Clave de activación digital permanente para Windows 11 Pro. Soporta actualizaciones oficiales y multilenguaje.',
    price: 27.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-pro.webp',
    fallbackImage: '/products/windows-11-pro.png',
    rating: 4.95,
    reviews: 418,
    badge: 'POPULAR',
    bestSeller: true,
    featured: true,
    variants: [
      {
        id: 'oem',
        name: 'Clave tipo OEM',
        type: 'OEM',
        price: 27.00,
        oldPrice: 85.00,
        shortDesc: 'Se vincula a la placa madre de 1 equipo específico.',
        badge: 'ECONÓMICA'
      },
      {
        id: 'retail',
        name: 'Clave tipo Retail',
        type: 'Retail',
        price: 31.00,
        oldPrice: 105.00,
        shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.',
        badge: 'RECOMENDADA'
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
    price: 30.00,
    oldPrice: 75.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-home.webp',
    fallbackImage: '/products/windows-11-home.png',
    rating: 4.91,
    reviews: 210,
    features: [
      'Widgets, nuevo menú de inicio y controles táctiles avanzados',
      'Seguridad integrada con Windows Defender'
    ],
    variants: [
      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 30.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.' },
      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 34.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.' }
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
    price: 42.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-11-enterprise.webp',
    fallbackImage: '/products/windows-11-enterprise.png',
    rating: 4.93,
    reviews: 135,
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
    price: 21.90,
    oldPrice: 70.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-pro.webp',
    fallbackImage: '/products/windows-10-pro.png',
    rating: 4.85,
    reviews: 310,
    features: [
      'Clave vitalicia para 1 PC',
      'Apta para actualización directa desde Windows 10 Home',
      'Soporte completo para Remote Desktop'
    ],
    variants: [
      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 21.90, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.' },
      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 25.90, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.' }
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
    price: 26.00,
    oldPrice: 60.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-home.webp',
    fallbackImage: '/products/windows-10-home.png',
    rating: 4.84,
    reviews: 180,
    features: ['DirectX 12, Cortana y protección integrada'],
    variants: [
      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 26.00, shortDesc: 'Se vincula a la placa madre de 1 equipo específico.' },
      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 30.00, shortDesc: 'Transferible a otro equipo en el futuro si cambias de PC.' }
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
    price: 36.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-10-enterprise.webp',
    fallbackImage: '/products/windows-10-enterprise.png',
    rating: 4.9,
    reviews: 142,
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
    price: 55.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: '/products/windows-8-1-pro.webp',
    fallbackImage: '/products/windows-8-1-pro.png',
    rating: 4.78,
    reviews: 65,
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
    price: 32.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'windows',
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_730833-MPE104915494199_012026-O.webp',
    fallbackImage: 'https://http2.mlstatic.com/D_NQ_NP_730833-MPE104915494199_012026-O.webp',
    rating: 4.88,
    reviews: 64,
    features: ['BitLocker, Aero Glass y soporte multilenguaje completo'],
    compatibility: 'Windows 7 (32/64 Bit)',
    downloadUrl: 'https://archive.org/download/windows-7-ultimate-sp1-spanish-x64/Win7_Ult_SP1_Spanish_x64.iso',
    downloadLabel: 'Descargar ISO Windows 7 Ultimate (SP1 64 Bit)',
    installationSteps: WINDOWS_STANDARD_STEPS
  },

  // --- COMBOS ---
  {
    id: 'prod-combo-win11-office2024',
    slug: 'combo-windows-11-pro-office-2024',
    name: 'Combo 2 en 1: Windows 11 Pro + Office 2024 Pro Plus',
    description: 'Paquete de licencias definitivas. Activa Windows 11 Pro y la suite completa de Office 2024 al mejor precio.',
    price: 56.90,
    oldPrice: 195.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-win11-office2024.webp',
    fallbackImage: '/products/combo-win11-office2024.png',
    rating: 5.0,
    reviews: 289,
    badge: 'OFERTA ESPECIAL',
    bestSeller: true,
    featured: true,
    features: [
      'Incluye 2 licencias 100% independientes y definitivas',
      'Ahorro superior al 50% en comparación con licencias individuales',
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
    id: 'prod-combo-win10-office2021',
    slug: 'combo-windows-10-pro-office-2021',
    name: 'Combo 2 en 1: Windows 10 Pro + Office 2021 Pro Plus',
    description: 'Solución completa y económica para repotenciar cualquier laptop o PC de escritorio.',
    price: 46.50,
    oldPrice: 155.00,
    duration: 'Permanente (De por vida)',
    category: 'combos',
    imageUrl: '/products/combo-win11-office2024.webp',
    fallbackImage: '/products/combo-win11-office2024.png',
    rating: 4.89,
    reviews: 142,
    features: [
      'Windows 10 Pro + Office 2021 Pro Plus',
      'Licencias independientes de por vida',
      'Ahorro del 45%'
    ],
    compatibility: 'Windows 10 (32 & 64 Bit)',
    downloadUrl: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2021Retail&platform=x64&language=es-es&version=O16GA',
    downloadLabel: 'Descargar instaladores de Windows 10 Pro y Office 2021 Pro',
    downloadOptions: [
      {
        id: 'combo-win10-pro',
        name: 'Descargar Windows 10 Pro (Media Creation Tool .exe)',
        url: 'https://go.microsoft.com/fwlink/?LinkId=691209',
        badge: 'Herramienta Windows (.exe)',
        description: 'Herramienta oficial Media Creation Tool 22H2 para descargar la ISO de Windows 10 o crear el USB booteable con Rufus.'
      },
      {
        id: 'combo-office-2021-pro',
        name: 'Descargar Office 2021 Professional Plus (.exe)',
        url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=ProPlus2021Retail&platform=x64&language=es-es&version=O16GA',
        badge: 'Instalador Office (.exe)',
        description: 'Descarga directa del instalador ejecutable oficial de Office 2021 Pro Plus (OfficeSetup.exe) en español.'
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
    badge: 'NUEVO',
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
    id: 'prod-visio-2024',
    slug: 'microsoft-visio-2024-pro',
    name: 'Microsoft Visio Professional 2024',
    description: 'Crea diagramas de flujo, mapas de procesos y esquemas técnicos con la versión oficial 2024.',
    price: 34.90,
    oldPrice: 110.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2024.webp',
    fallbackImage: '/products/visio-2024.png',
    rating: 4.9,
    reviews: 76,
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
    price: 28.00,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2021.webp',
    fallbackImage: '/products/project-2021.png',
    rating: 4.88,
    reviews: 62,
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
    price: 28.00,
    oldPrice: 80.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2019.webp',
    fallbackImage: '/products/project-2019.png',
    rating: 4.85,
    reviews: 54,
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
    price: 28.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/project-2016.webp',
    fallbackImage: '/products/project-2016.png',
    rating: 4.81,
    reviews: 48,
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
    price: 29.90,
    oldPrice: 95.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2021.webp',
    fallbackImage: '/products/visio-2021.png',
    rating: 4.87,
    reviews: 58,
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
    id: 'prod-visio-2016',
    slug: 'microsoft-visio-2016-pro',
    name: 'Microsoft Visio Professional 2016',
    description: 'Diseño de mapas conceptuales e ingenierías.',
    price: 29.00,
    oldPrice: 65.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2016.webp',
    fallbackImage: '/products/visio-2016.png',
    rating: 4.8,
    reviews: 42,
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
    price: 35.00,
    oldPrice: 85.00,
    duration: 'Permanente (De por vida)',
    category: 'project-visio',
    imageUrl: '/products/visio-2013.webp',
    fallbackImage: '/products/visio-2013.png',
    rating: 4.76,
    reviews: 35,
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
  }
];
