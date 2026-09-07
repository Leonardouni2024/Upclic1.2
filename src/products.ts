import type { Product, CartTotals, Currency } from './types.ts';

export const WHATSAPP_NUMBER = '51920038890';
export const WHATSAPP_DISPLAY = '+51 920 038 890';
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
}

export const DYNAMIC_COUPONS: DynamicCoupon[] = [
  { code: 'UPCLIC10', discountPercent: 10, description: '10% de descuento de bienvenida' },
  { code: 'COMBO15', discountPercent: 15, minItems: 2, description: '15% de descuento por llevar 2 o más productos' },
  { code: 'VIP20', discountPercent: 20, description: '20% de descuento especial clientes VIP' }
];

export function calculateCartTotals(
  items: { product: Product; quantity: number; unitPrice?: number }[],
  couponCode?: string
): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice ?? item.product.price) * item.quantity, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  let discountRate = 0;
  let appliedCoupon: DynamicCoupon | undefined = undefined;

  if (couponCode) {
    const matched = DYNAMIC_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (matched) {
      if (!matched.minItems || totalQuantity >= matched.minItems) {
        discountRate = matched.discountPercent / 100;
        appliedCoupon = matched;
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
    downloadUrl: 'https://setup.office.com',
    downloadLabel: 'Descargar e instalar desde setup.office.com',
    installationSteps: [
      'Ingresa a setup.office.com e inicia sesión con tu cuenta de Microsoft.',
      'Introduce la clave de 25 dígitos entregada en tu pedido.',
      'Descarga el instalador oficial y ejecútalo en tu equipo.',
      'Abre Word o Excel para verificar la activación permanente.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Ingresa a setup.office.com con tu cuenta Microsoft.',
      'Escribe tu clave de 25 caracteres y descarga el instalador.',
      'Ejecuta el asistente y abre Word para finalizar.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Accede a setup.office.com con tu cuenta.',
      'Introduce tu código de 25 caracteres.',
      'Descarga e instala en tu equipo.'
    ]
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
      'Activación directa en setup.office.com'
    ],
    compatibility: 'Windows 10 / Windows 11',
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Ve a setup.office.com.',
      'Ingresa la clave de 25 dígitos.',
      'Descarga e instala.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Ingresa a setup.office.com e instala en tu PC.'
    ]
  },
  {
    id: 'prod-office-2013',
    slug: 'office-2013-pro-plus',
    name: 'Microsoft Office 2013 Professional Plus',
    description: 'Versión ligera y ligera para computadoras con recursos moderados.',
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: ['Activa con tu clave oficial en setup.office.com']
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: ['Instala con el ejecutable y activa online.']
  },
  {
    id: 'prod-microsoft-365',
    slug: 'microsoft-365-personal-family',
    name: 'Microsoft 365 Personal (Suscripción)',
    description: 'Suscripción oficial a la suite Microsoft 365. Incluye Word, Excel, PowerPoint, Outlook y 1 TB de almacenamiento en la nube OneDrive.',
    price: 49.00,
    oldPrice: 110.00,
    duration: '1 año',
    category: 'office',
    imageUrl: '/products/microsoft-365.webp',
    fallbackImage: '/products/microsoft-365.png',
    cloudStorage: '1 TB OneDrive',
    rating: 4.94,
    reviews: 215,
    features: [
      'Suscripción oficial garantizada por 1 año',
      '1 TB de almacenamiento seguro en la nube OneDrive',
      'Funciona en PC, Mac, iPad, iPhone y Android'
    ],
    compatibility: 'Windows, macOS, iOS, Android',
    downloadUrl: 'https://account.microsoft.com/services',
    installationSteps: [
      'Inicia sesión en tu cuenta Microsoft.',
      'Vincula el código o correo asignado.',
      'Descarga e instala Microsoft 365 en tus dispositivos.'
    ]
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
    downloadUrl: 'https://www.microsoft.com/software-download/windows11',
    downloadLabel: 'Descargar desde el sitio oficial de Microsoft',
    installationSteps: [
      'Ve a Inicio > Configuración > Sistema > Activación.',
      'Haz clic en "Cambiar la clave de producto".',
      'Ingresa la clave de 25 caracteres recibida por correo.',
      'Haz clic en Activar para completar el proceso.'
    ]
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
      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 30.00 },
      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 34.00 }
    ],
    compatibility: 'Windows 11 (64 Bit)',
    downloadUrl: 'https://www.microsoft.com/software-download/windows11',
    installationSteps: ['Ingresa en Configuración > Sistema > Activación']
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
    downloadUrl: 'https://www.microsoft.com/software-download/windows11',
    installationSteps: ['Activar mediante clave de producto oficial.']
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
      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 21.90 },
      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 25.90 }
    ],
    compatibility: 'Windows 10 (32 & 64 Bit)',
    downloadUrl: 'https://www.microsoft.com/software-download/windows10',
    installationSteps: [
      'Ve a Configuración > Actualización y seguridad > Activación.',
      'Introduce la clave enviada a tu correo.',
      'Haz clic en Activar.'
    ]
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
      { id: 'oem', name: 'Clave tipo OEM', type: 'OEM', price: 26.00 },
      { id: 'retail', name: 'Clave tipo Retail', type: 'Retail', price: 30.00 }
    ],
    compatibility: 'Windows 10 (32/64 Bit)',
    downloadUrl: 'https://www.microsoft.com/software-download/windows10',
    installationSteps: ['Activa directamente desde la configuración de Windows.']
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
    downloadUrl: 'https://www.microsoft.com/evalcenter',
    installationSteps: ['Ingresa la clave en Panel de control o CMD slmgr.']
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
    downloadUrl: 'https://www.microsoft.com/software-download/windows81',
    installationSteps: ['Activa con tu clave de 25 caracteres.']
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
    downloadUrl: 'https://www.microsoft.com',
    installationSteps: ['Activar en el menú Inicio > Propiedades del equipo.']
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
    imageUrl: '/products/windows-7-pro.webp',
    fallbackImage: '/products/windows-7-pro.png',
    rating: 4.88,
    reviews: 64,
    features: ['BitLocker, Aero Glass y soporte multilenguaje completo'],
    compatibility: 'Windows 7 (32/64 Bit)',
    downloadUrl: 'https://www.microsoft.com',
    installationSteps: ['Activar en el menú Inicio > Propiedades del equipo.']
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
    downloadUrl: 'https://setup.office.com',
    downloadLabel: 'Descargadores oficiales de Microsoft',
    installationSteps: [
      'Activa primero Windows 11 Pro en la sección Configuración > Activación.',
      'Ingresa a setup.office.com para asociar y descargar Office 2024 Pro Plus.',
      'Disfruta de ambos programas oficialmente activados de por vida.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Activa Windows 10 Pro en Configuración > Activación.',
      'Registra Office 2021 en setup.office.com e instálalo.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Inicia sesión en setup.office.com.',
      'Ingresa la clave de Project 2024.',
      'Descarga e instala el software oficial.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Visita setup.office.com.',
      'Introduce tu clave de Visio 2024.',
      'Descarga e instala la aplicación.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Activa en setup.office.com e instala en tu equipo.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: ['Activa con tu clave de 25 dígitos.']
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: ['Instalación mediante setup.office.com']
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: [
      'Activa en setup.office.com e instala en tu equipo.'
    ]
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: ['Descargar e instalar desde setup.office.com']
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
    downloadUrl: 'https://setup.office.com',
    installationSteps: ['Activar con tu clave oficial.']
  }
];
