import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, PROMO_COUPON_CODE } from '../products.ts';
import { Product } from '../types.ts';

export interface LocalChatResponse {
  reply: string;
  suggestedProducts?: Array<{
    id: string;
    slug: string;
    name: string;
    price: number;
    oldPrice?: number;
    imageUrl: string;
    badge?: string;
  }>;
  showAdminWhatsApp?: boolean;
}

export function generateLocalChatReply(message: string): LocalChatResponse {
  const cleanMessage = message.trim();
  const cleanLower = cleanMessage.toLowerCase();

  const asksForAdmin =
    cleanLower.includes('whatsapp') ||
    cleanLower.includes('humano') ||
    cleanLower.includes('administrador') ||
    cleanLower.includes('admin') ||
    cleanLower.includes('asesor') ||
    cleanLower.includes('persona') ||
    cleanLower.includes('llamar') ||
    cleanLower.includes('contacto directo') ||
    cleanLower.includes('numero') ||
    cleanLower.includes('número') ||
    cleanLower.includes('telefono') ||
    cleanLower.includes('teléfono');

  let reply = '';

  const offTopicKeywords = [
    'netflix', 'spotify', 'juego', 'gta', 'minecraft', 'playstation', 'xbox', 'steam',
    'tarjeta de video', 'laptop dell', 'memoria ram', 'disco duro', 'celular', 'iphone',
    'ropa', 'comida', 'restaurante', 'clima', 'vuelo', 'hotel', 'adobe', 'photoshop', 'canva'
  ];
  const isOffTopic = offTopicKeywords.some(k => cleanLower.includes(k));

  if (isOffTopic) {
    reply = `¡Hola! Con mucho gusto le atiendo. 😊\n\nEn **UpClic** nos especializamos **exclusivamente en licencias digitales y software oficial de Microsoft** (Office, Windows, Visio, Project y Combos) para garantizarle los mejores precios, entrega digital inmediata y garantía oficial.\n\nNo disponemos de productos de terceros o hardware físico. Si necesita activar o renovar **Microsoft Office** (desde S/ 18.00) o **Windows 10/11** (desde S/ 18.90), ¡dígame y le recomendaré la versión ideal para su equipo! 🛍️`;
  } else if (asksForAdmin) {
    reply = `¡Con mucho gusto! Puede comunicarse directamente con nuestro **Administrador Oficial y Soporte Técnico** por WhatsApp para atención personalizada, cotizaciones corporativas con RUC o asistencia remota:\n\n📱 **WhatsApp:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n⚡ **Atención rápida:** Lunes a Domingo de 8:00 AM a 11:00 PM.`;
  } else if (
    cleanLower.includes('cupon') ||
    cleanLower.includes('cupón') ||
    cleanLower.includes('descuento') ||
    cleanLower.includes('promocion') ||
    cleanLower.includes('promoción') ||
    cleanLower.includes('oferta')
  ) {
    reply = `🎉 ¡Tenemos excelentes promociones para usted!\n\n1. 🎁 **Cupón especial:** Aplique el código **\`${PROMO_COUPON_CODE}\`** en el carrito y obtenga **10% de descuento** en compras desde S/ 40.00.\n2. 🔥 **Descuento por volumen:** Al llevar 2 o más productos, el carrito le aplica un **10% de descuento automático**.\n\n¿Desea que le recomiende alguna combinación en combo con super ahorro?`;
  } else if (
    cleanLower.includes('instalar') ||
    cleanLower.includes('activar') ||
    cleanLower.includes('activacion') ||
    cleanLower.includes('activación') ||
    cleanLower.includes('descarga') ||
    cleanLower.includes('como funciona') ||
    cleanLower.includes('cómo funciona') ||
    cleanLower.includes('como es la entrega') ||
    cleanLower.includes('cómo es la entrega')
  ) {
    reply = `⚡ **El proceso de compra y activación en UpClic es súper rápido y 100% garantizado:**\n\n1. **Selección:** Elige su versión de Office o Windows y completa el pedido.\n2. **Entrega Inmediata:** Recibe su clave original de 25 caracteres y el enlace de descarga oficial de Microsoft por correo y WhatsApp.\n3. **Descarga e Instalación:** Descarga la imagen ISO/instalador oficial desde los servidores de Microsoft e ingresa su clave para activación permanente.\n4. **Garantía Oficial:** Cuenta con 6 meses a 1 año de garantía y soporte técnico incluido.\n\nSi necesita asistencia guiada, nuestro administrador está listo para ayudarle en WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`;
  } else if (cleanLower.includes('oem') || cleanLower.includes('retail') || cleanLower.includes('diferencia entre oem y retail')) {
    reply = `🔑 **Diferencia entre claves OEM y Retail:**\n\n• **Clave OEM:** Se asocia a la placa madre de tu PC actual. Es económica, de activación permanente y soporta formateos y reinstalaciones ilimitadas en el mismo equipo.\n• **Clave Retail:** Es la versión comercial completa. Se vincula a tu cuenta de Microsoft y permite transferir la licencia a una nueva computadora en el futuro si cambias de PC.\n\nEn **UpClic** puedes elegir entre versión OEM y Retail en nuestros productos de Windows 11 y Windows 10.`;
  } else if (
    cleanLower.includes('office') ||
    cleanLower.includes('word') ||
    cleanLower.includes('excel') ||
    cleanLower.includes('powerpoint')
  ) {
    reply = `💼 **Opciones de Microsoft Office recomendadas en UpClic:**\n\n• **Office 2024 Professional Plus:** La versión más moderna y rápida para Windows 10 y 11. Pago único permanente a solo **S/ 25.00**.\n• **Office 2021 Professional Plus:** Muy estable y completo (Word, Excel, PowerPoint, Outlook, Access). Pago único a **S/ 20.00**.\n• **Microsoft 365 Profesional (1 año):** Incluye apps completas en hasta 5 dispositivos y **100 GB en la nube** a solo **S/ 46.50**.\n• **Office 2019 / 2016:** Para computadoras con Windows 7, 8.1 o 10 desde **S/ 18.00**.\n\n¿Para qué tipo de computadora o trabajo lo necesita? Le asesoro con gusto.`;
  } else if (
    cleanLower.includes('windows') ||
    cleanLower.includes('win 11') ||
    cleanLower.includes('win 10') ||
    cleanLower.includes('sistema operativo')
  ) {
    reply = `💻 **Licencias oficiales de Windows en UpClic:**\n\n• **Windows 11 Pro (64-bit):** Máxima seguridad, velocidad y diseño moderno desde **S/ 19.90** (OEM) y Retail disponible.\n• **Windows 10 Pro (32/64 bits):** Gran rendimiento y máxima compatibilidad desde **S/ 18.90** (OEM) y Retail disponible.\n• **Combo Windows 11 Pro + Office 2024:** Las dos licencias oficiales juntas con super ahorro a solo **S/ 46.50**.\n\nTodas nuestras claves son de activación permanente y reinstalables en la misma máquina. 🛡️`;
  } else if (cleanLower.includes('combo') || cleanLower.includes('pack')) {
    reply = `🔥 **Nuestros Combos con Mayor Ahorro:**\n\n• **Combo Windows 11 Pro + Office 2024:** Todo actualizado y de por vida a solo **S/ 46.50** (Ahorro de más de S/ 40.00).\n• **Combo Windows 10 Pro + Office 2021:** Excelente estabilidad para productividad a solo **S/ 42.00**.\n\nAl adquirir un combo recibes ambas claves con entrega inmediata y soporte de instalación.`;
  } else if (cleanLower.includes('visio') || cleanLower.includes('project')) {
    reply = `📐 **Herramientas Profesionales de Microsoft:**\n\n• **Project 2024 / 2021 Professional:** Gestión avanzada de proyectos, cronogramas y diagramas de Gantt a solo **S/ 24.50**.\n• **Visio 2024 / 2021 Professional:** Creación de diagramas de flujo, planos y arquitectura visual a solo **S/ 24.50**.\n\nLicencias de pago único permanente de por vida.`;
  } else if (
    cleanLower.includes('pago') ||
    cleanLower.includes('pagar') ||
    cleanLower.includes('yape') ||
    cleanLower.includes('plin') ||
    cleanLower.includes('bcp') ||
    cleanLower.includes('tarjeta')
  ) {
    reply = `💳 **Métodos de pago 100% seguros en UpClic:**\n\n• **Billeteras Digitales:** Yape y Plin con confirmación rápida.\n• **Transferencias Bancarias:** BCP, BBVA, Interbank y Scotiabank.\n• **Tarjetas de Débito/Crédito:** Aceptamos todas las tarjetas a través de Mercado Pago.\n\nUna vez realizado el pedido, la entrega de su clave es inmediata por WhatsApp y correo electrónico.`;
  } else if (
    cleanLower.includes('hola') ||
    cleanLower.includes('buenas') ||
    cleanLower.includes('buenos dias') ||
    cleanLower.includes('buenas tardes') ||
    cleanLower.includes('buenas noches')
  ) {
    reply = `¡Hola! Bienvenido a **UpClic**. 😊 Soy su Asistente Virtual y estoy aquí para ayudarle a resolver cualquier duda sobre nuestras licencias digitales originales de **Microsoft Office, Windows, Visio y Project**.\n\n¿En qué le puedo colaborar hoy?\n• 🛍️ Recomendarle la mejor suite de Office o Windows para su PC.\n• 🔑 Explicarle la diferencia entre claves OEM y Retail.\n• ⚡ Ayuda con la descarga o activación de su clave.\n• 🎁 Cupones y promociones vigentes.\n• 📲 Contactar con nuestro Administrador por WhatsApp.`;
  } else {
    reply = `Con gusto le asesoro en **UpClic**. 😊 Contamos con licencias digitales 100% originales de **Microsoft Office** (2024, 2021, 2019, 365), **Windows 10/11 Pro/Home**, **Project y Visio** con entrega inmediata y garantía oficial.\n\n¿Desea que le recomiende alguna versión específica para su computadora o prefiere comunicarse directamente con nuestro **Administrador por WhatsApp**?`;
  }

  // Detect matching products to attach cards
  const matchedProducts = products.filter((p: Product) => {
    const pNameLower = p.name.toLowerCase();
    const pSlugLower = p.slug.toLowerCase();
    return (
      reply.toLowerCase().includes(pNameLower) ||
      cleanLower.includes(p.slug) ||
      (cleanLower.includes('2024') && pSlugLower.includes('2024')) ||
      (cleanLower.includes('2021') && pSlugLower.includes('2021')) ||
      (cleanLower.includes('365') && pSlugLower.includes('365')) ||
      (cleanLower.includes('combo') && pSlugLower.includes('combo')) ||
      (cleanLower.includes('visio') && pSlugLower.includes('visio')) ||
      (cleanLower.includes('project') && pSlugLower.includes('project')) ||
      (cleanLower.includes('windows 11') && pSlugLower.includes('windows-11')) ||
      (cleanLower.includes('windows 10') && pSlugLower.includes('windows-10'))
    );
  }).slice(0, 3);

  return {
    reply,
    suggestedProducts: matchedProducts.map((p: Product) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      imageUrl: p.fallbackImage || p.imageUrl,
      badge: p.badge,
    })),
    showAdminWhatsApp: asksForAdmin || reply.toLowerCase().includes('whatsapp'),
  };
}
