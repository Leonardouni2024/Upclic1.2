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
  dynamicCoupon?: { code: string, discountPercent: number, expiresAt?: number },
  isMultiItemDiscountActive: boolean = true
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

  const isMultiItemDiscount = isMultiItemDiscountActive && totalQuantity >= 2 && discountRate < 0.10 && !(appliedCoupon && appliedCoupon.code === 'PROVECLIC1');
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
  'El sistema automatizado de Microsoft verificará los datos y te entregará tu Identificador de Confirmación (bloques de la A a la H). Ingrésalos en la pantalla y el software quedará activado de por vida con garantía de activación de 1 mes.'
];

export const DEFAULT_PRODUCT_STOCK = 30;

const rawProducts: Product[] = [];

export const products: Product[] = rawProducts.map(p => ({
  ...p,
  stock: p.stock ?? DEFAULT_PRODUCT_STOCK
}));

export function getProductDeviceTag(product: Product, language: 'ES' | 'EN' = 'ES'): string {
  const isEn = language === 'EN';

  if (product.id === 'prod-prime-video' || product.id === 'prod-crunchyroll-premium') {
    return isEn ? '1 Profile (1 device)' : '1 Perfil (1 dispositivo)';
  }
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

