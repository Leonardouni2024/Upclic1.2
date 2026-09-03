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

export function generateLocalChatReply(message: string, history?: Array<{ role: string; content: string }>): LocalChatResponse {
  const cleanMessage = message.trim();
  const cleanLower = cleanMessage.toLowerCase();

  // Detect explicit user request to talk with a human, administrator or WhatsApp
  const explicitAdminRequest =
    cleanLower.includes('quiero hablar con') ||
    cleanLower.includes('hablar con una persona') ||
    cleanLower.includes('hablar con un humano') ||
    cleanLower.includes('hablar con el administrador') ||
    cleanLower.includes('hablar con el admin') ||
    cleanLower.includes('hablar con alguien') ||
    cleanLower.includes('atencion humana') ||
    cleanLower.includes('atención humana') ||
    cleanLower.includes('asesor humano') ||
    cleanLower.includes('pasa con un asesor') ||
    cleanLower.includes('pasame con un asesor') ||
    cleanLower.includes('pásame con un asesor') ||
    cleanLower.includes('pasame con el administrador') ||
    cleanLower.includes('pásame con el administrador') ||
    cleanLower.includes('dame el whatsapp') ||
    cleanLower.includes('tu whatsapp') ||
    cleanLower.includes('su whatsapp') ||
    cleanLower.includes('link de whatsapp') ||
    cleanLower.includes('enlace de whatsapp') ||
    cleanLower.includes('numero de whatsapp') ||
    cleanLower.includes('número de whatsapp') ||
    cleanLower.includes('numero de telefono') ||
    cleanLower.includes('número de teléfono') ||
    cleanLower.includes('llamar por telefono') ||
    cleanLower.includes('quiero llamar');

  let reply = '';
  let showAdminWhatsApp = explicitAdminRequest;

  // 1. Explicit request to talk with admin or human
  if (explicitAdminRequest) {
    reply = `¡Por supuesto! Con mucho gusto te conecto directamente con nuestro **Administrador y Soporte Técnico Oficial** por WhatsApp para que te atienda personalmente:\n\n📱 **WhatsApp:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n⚡ **Horario de atención:** Lunes a Domingo de 8:00 AM a 11:00 PM.\n\nTambién puedes hacer clic en el botón directo de WhatsApp que te dejé abajo. ¡Estamos listos para ayudarte!`;
    return {
      reply,
      showAdminWhatsApp: true,
      suggestedProducts: [],
    };
  }

  // 2. Off-topic queries - Answer warmly and redirect to store topics without admin links
  const offTopicKeywords = [
    'netflix', 'spotify', 'juego', 'gta', 'minecraft', 'playstation', 'xbox', 'steam',
    'tarjeta de video', 'laptop dell', 'memoria ram', 'disco duro', 'celular', 'iphone',
    'ropa', 'comida', 'restaurante', 'clima', 'vuelo', 'hotel', 'adobe', 'photoshop', 'canva'
  ];
  const isOffTopic = offTopicKeywords.some(k => cleanLower.includes(k));

  if (isOffTopic) {
    reply = `¡Hola! Con mucho gusto te ayudo. 😊\n\nAquí en **UpClic** nos dedicamos al 100% a la venta de **licencias digitales oficiales de Microsoft** (Office, Windows, Visio y Project), por lo que no manejamos cuentas de streaming, videojuegos ni equipos físicos.\n\nPero si lo que necesitas es instalar o renovar **Word, Excel, PowerPoint** o activar **Windows 10/11** con clave original permanente, ¡cuéntame qué versión estás buscando o qué uso le vas a dar a tu computadora y te asesoro al instante!`;
  }
  // 3. Greetings & friendly introductions
  else if (
    cleanLower === 'hola' ||
    cleanLower === 'buenas' ||
    cleanLower === 'buenas tardes' ||
    cleanLower === 'buenos dias' ||
    cleanLower === 'buenos días' ||
    cleanLower === 'buenas noches' ||
    cleanLower.startsWith('hola ') ||
    cleanLower.startsWith('que tal') ||
    cleanLower.startsWith('qué tal')
  ) {
    reply = `¡Hola! Qué gusto saludarte. 😊 Bienvenido a **UpClic**.\n\nSoy tu asesor virtual y estoy aquí para ayudarte a elegir la mejor licencia de **Microsoft Office**, **Windows**, **Visio** o **Project** para tu equipo, explicarte cómo se instalan, o ayudarte a aprovechar nuestras promociones.\n\n¿En qué te puedo colaborar hoy?`;
  }
  // 4. Questions about who they are / identity
  else if (cleanLower.includes('quien eres') || cleanLower.includes('quién eres') || cleanLower.includes('como te llamas') || cleanLower.includes('cómo te llamas')) {
    reply = `¡Hola! Soy el **Asistente Virtual de UpClic**. 🤖✨\n\nEstoy capacitado para responder todas tus preguntas sobre licencias oficiales de Microsoft, recomendarte el software ideal según tus necesidades y presupuesto, guiarte en el proceso de compra y activación, o compartirte nuestros cupones de descuento.\n\n¿En qué te gustaría que te oriente hoy?`;
  }
  // 5. Difference OEM vs Retail
  else if (cleanLower.includes('oem') || cleanLower.includes('retail') || cleanLower.includes('diferencia')) {
    reply = `¡Excelente pregunta! Es una de las dudas más frecuentes y la diferencia es muy sencilla:\n\n🔹 **Clave OEM (Original Equipment Manufacturer):**\n• Se enlaza a la placa madre (hardware) de tu computadora actual.\n• Es la opción más económica.\n• La activación es **permanente e ilimitada** en esa misma PC (puedes formatear y reinstalar tantas veces como quieras sin perderla).\n\n🔹 **Clave Retail (Licencia Comercial Completa):**\n• Se asocia directamente a tu cuenta de Microsoft.\n• Te da la ventaja de que, si en el futuro cambias de computadora o compras una nueva laptop, **puedes transferir tu licencia** al nuevo equipo.\n\nEn **UpClic** puedes elegir entre versión OEM y Retail en productos como **Windows 11 Pro** y **Windows 10 Pro**. ¿Cuál se adapta mejor a lo que buscas?`;
  }
  // 6. Installation, activation and delivery process
  else if (
    cleanLower.includes('instalar') ||
    cleanLower.includes('activar') ||
    cleanLower.includes('activacion') ||
    cleanLower.includes('activación') ||
    cleanLower.includes('descarga') ||
    cleanLower.includes('como funciona') ||
    cleanLower.includes('cómo funciona') ||
    cleanLower.includes('como se compra') ||
    cleanLower.includes('como es la entrega') ||
    cleanLower.includes('cómo es la entrega') ||
    cleanLower.includes('cuanto demora') ||
    cleanLower.includes('cuánto demora')
  ) {
    reply = `El proceso de compra, entrega e instalación es súper fácil y 100% transparente:\n\n1️⃣ **Realizas tu pedido:** Seleccionas tu producto en la tienda y pagas con tu método preferido (Yape, Plin, BCP, BBVA, Interbank o Tarjeta).\n2️⃣ **Entrega Digital Inmediata:** En cuestión de minutos recibes tu clave original de 25 caracteres y los enlaces oficiales de descarga de Microsoft directamente por WhatsApp y a tu correo.\n3️⃣ **Descarga e Instalación:** Descargas el instalador oficial y colocas la clave.\n4️⃣ **Activación de por Vida:** El software queda 100% activado, con actualizaciones oficiales de Microsoft y garantía de 6 meses a 1 año.\n\n¿Te gustaría que te recomiende la versión perfecta para tu equipo?`;
  }
  // 7. Discounts, coupons & volume promos
  else if (
    cleanLower.includes('cupon') ||
    cleanLower.includes('cupón') ||
    cleanLower.includes('descuento') ||
    cleanLower.includes('promocion') ||
    cleanLower.includes('promoción') ||
    cleanLower.includes('oferta') ||
    cleanLower.includes('precio') ||
    cleanLower.includes('barato')
  ) {
    reply = `¡Claro que sí! En UpClic tenemos promociones activas para que ahorres al máximo:\n\n🎁 **Cupón exclusivo del 10%:** Puedes usar el código **\`${PROMO_COUPON_CODE}\`** al momento de pagar en compras desde S/ 40.00.\n🔥 **Descuento por volumen automático:** Si agregas 2 o más productos a tu carrito, el sistema te aplica un **10% de descuento automático** sin necesidad de cupón.\n💡 **Combos ahorro:** Nuestros combos (como Windows 11 + Office 2024) ya tienen más de un 40% de descuento aplicado.\n\n¿Qué producto o combinación tienes en mente?`;
  }
  // 8. Payment methods
  else if (
    cleanLower.includes('pago') ||
    cleanLower.includes('pagar') ||
    cleanLower.includes('yape') ||
    cleanLower.includes('plin') ||
    cleanLower.includes('bcp') ||
    cleanLower.includes('bbva') ||
    cleanLower.includes('interbank') ||
    cleanLower.includes('scotiabank') ||
    cleanLower.includes('tarjeta') ||
    cleanLower.includes('efectivo')
  ) {
    reply = `Aceptamos los métodos de pago más seguros y rápidos del Perú:\n\n• 📱 **Billeteras Digitales:** Yape y Plin (con confirmación inmediata).\n• 🏦 **Transferencias Bancarias:** BCP, BBVA, Interbank y Scotiabank.\n• 💳 **Tarjetas de Débito y Crédito:** Visa, Mastercard, Diners y Amex mediante la pasarela segura de Mercado Pago.\n\nUna vez completado el pago, tu clave y guía de instalación se envían de forma instantánea. ¿Deseas hacer tu pedido ahora?`;
  }
  // 9. Microsoft Office specific queries
  else if (
    cleanLower.includes('office') ||
    cleanLower.includes('word') ||
    cleanLower.includes('excel') ||
    cleanLower.includes('powerpoint') ||
    cleanLower.includes('access') ||
    cleanLower.includes('outlook')
  ) {
    reply = `Te presento las mejores opciones de **Microsoft Office** que tenemos disponibles según tu necesidad:\n\n1. 🌟 **Office 2024 Professional Plus (S/ 25.00):** La versión más nueva y rápida de pago único permanente. Diseñada especialmente para Windows 10 y 11.\n2. 💼 **Office 2021 Professional Plus (S/ 20.00):** La suite más probada y completa (Word, Excel, PowerPoint, Outlook, Access, Publisher) de pago único de por vida.\n3. ☁️ **Microsoft 365 Profesional 1 Año (S/ 46.50):** Ideal si necesitas usar Office en hasta 5 dispositivos (PC, Mac, celular, tablet) e incluye **100 GB de almacenamiento en OneDrive**.\n4. 🚀 **Office 2019 / 2016 (Desde S/ 18.00):** Excelente para computadoras con Windows 7, 8.1 o 10.\n\n¿Para qué tipo de tareas o equipo lo vas a utilizar?`;
  }
  // 10. Windows specific queries
  else if (
    cleanLower.includes('windows') ||
    cleanLower.includes('win 11') ||
    cleanLower.includes('win 10') ||
    cleanLower.includes('sistema operativo') ||
    cleanLower.includes('formatear')
  ) {
    reply = `Para **Windows** contamos con licencias 100% originales y permanentes:\n\n• 💻 **Windows 11 Pro (64-bit):** La versión recomendada para máxima seguridad, rendimiento gaming y compatibilidad moderna. Desde **S/ 19.90** (OEM) y versión Retail disponible.\n• 🖥️ **Windows 10 Pro (32/64 bits):** Muy fluido, compatible con todo tipo de programas y hardware. Desde **S/ 18.90** (OEM) y Retail disponible.\n• 🔥 **Combos con Office:** Puedes llevar Windows 11 o 10 junto con Office 2024 o 2021 a precio especial con descuento.\n\n¿Tu computadora ya tiene Windows instalado para activarlo, o necesitas hacer una instalación limpia desde cero?`;
  }
  // 11. Combos & Packs
  else if (cleanLower.includes('combo') || cleanLower.includes('pack') || cleanLower.includes('juntos')) {
    reply = `¡Los combos son la mejor opción para ahorrar! Te llevas el sistema operativo y la suite de oficina juntos:\n\n🔥 **Combo Windows 11 Pro + Office 2024 Professional Plus:** Solo **S/ 46.50** (Ahorras más de S/ 40.00 vs comprar por separado).\n⚡ **Combo Windows 10 Pro + Office 2021 Professional Plus:** Solo **S/ 42.00**.\n\nAmbos incluyen activación permanente, claves de 25 caracteres, enlaces de descarga y garantía oficial. ¿Te gustaría añadir alguno al carrito?`;
  }
  // 12. Visio & Project
  else if (cleanLower.includes('visio') || cleanLower.includes('project') || cleanLower.includes('diagrama') || cleanLower.includes('gantt') || cleanLower.includes('cronograma')) {
    reply = `Para gestión y diagramación profesional tenemos:\n\n• 📐 **Microsoft Visio 2024 / 2021 Professional (S/ 24.50):** Para diagramas de flujo, mapas de procesos, planos y organigramas avanzados.\n• 📊 **Microsoft Project 2024 / 2021 Professional (S/ 24.50):** Para planificación de proyectos, diagramas de Gantt, gestión de recursos y cronogramas.\n\nSon licencias de pago único permanente de por vida. ¿Cuál de los dos necesitas?`;
  }
  // 13. Guarantee, security, trust
  else if (cleanLower.includes('garantia') || cleanLower.includes('garantía') || cleanLower.includes('seguro') || cleanLower.includes('confiable') || cleanLower.includes('original')) {
    reply = `En **UpClic** garantizamos tu compra con total seguridad:\n\n🛡️ **Claves 100% Originales:** Se validan y activan directamente en los servidores de Microsoft.\n⏱️ **Garantía Oficial:** Cuentas con 6 meses a 1 año de garantía ante cualquier inconveniente.\n⚡ **Soporte Incluido:** Si necesitas ayuda durante la instalación, te acompañamos paso a paso.\n⭐ **Opiniones Reales:** Cientos de clientes satisfechos en todo el Perú respaldan nuestro servicio.\n\n¿Tienes alguna duda específica sobre algún producto?`;
  }
  // 14. Compatibility / Mac / Requirements
  else if (cleanLower.includes('mac') || cleanLower.includes('apple') || cleanLower.includes('macbook')) {
    reply = `Si tienes una **Mac (macOS)**, la versión ideal y compatible es:\n\n🍎 **Microsoft 365 Profesional (1 Año):** Es 100% compatible con computadoras Mac, Windows, iPad, iPhone y tablets Android. Te da acceso a Word, Excel, PowerPoint, Outlook y 100 GB en OneDrive a solo **S/ 46.50**.\n\n*Nota:* Las versiones Office 2024/2021 Professional Plus son exclusivas para Windows 10 y 11. ¿Tu equipo principal es Mac o Windows?`;
  }
  // 15. Thanks / Goodbye
  else if (cleanLower.includes('gracias') || cleanLower.includes('muchas gracias') || cleanLower.includes('genial') || cleanLower.includes('vale') || cleanLower.includes('perfecto')) {
    reply = `¡Con mucho gusto! Para eso estamos. 😊 Si te surge cualquier otra duda al elegir tu licencia o al hacer tu compra, escríbeme con total confianza. ¡Que tengas un excelente día! ✨`;
  }
  // 16. Default open, conversational response
  else {
    reply = `Te entiendo perfectamente. 😊 En **UpClic** contamos con licencias digitales originales para **Microsoft Office** (2024, 2021, 365), **Windows 10 y 11 Pro/Home**, además de **Project y Visio**, todas con activación permanente, entrega inmediata y garantía oficial.\n\nCuéntame un poco más sobre lo que necesitas o qué uso le das a tu computadora (estudio, oficina, diseño, juegos) y con gusto te daré la mejor recomendación.`;
  }

  // Detect matching products to attach visual cards
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
    showAdminWhatsApp: showAdminWhatsApp,
  };
}

