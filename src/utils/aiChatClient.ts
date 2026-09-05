import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, MERCADO_PAGO_URL } from '../products.ts';
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

// Helper to normalize and remove accents
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function generateLocalChatReply(message: string, history?: Array<{ role: string; content: string }>): LocalChatResponse {
  const cleanMessage = message.trim();
  const rawLower = cleanMessage.toLowerCase();
  const norm = normalizeText(cleanMessage);

  // 1. Explicit request to talk with a human / WhatsApp / phone
  const explicitAdminRequest =
    norm.includes('quiero hablar con') ||
    norm.includes('hablar con una persona') ||
    norm.includes('hablar con un humano') ||
    norm.includes('hablar con el administrador') ||
    norm.includes('hablar con el admin') ||
    norm.includes('hablar con soporte') ||
    norm.includes('hablar con alguien') ||
    norm.includes('asesor humano') ||
    norm.includes('atencion humana') ||
    norm.includes('pasame con un asesor') ||
    norm.includes('pasame con el admin') ||
    norm.includes('pasame con el administrador') ||
    norm.includes('dame el whatsapp') ||
    norm.includes('tu whatsapp') ||
    norm.includes('su whatsapp') ||
    norm.includes('link de whatsapp') ||
    norm.includes('numero de whatsapp') ||
    norm.includes('numero de telefono') ||
    norm.includes('quiero llamar') ||
    norm.includes('llamada telefonica');

  if (explicitAdminRequest) {
    return {
      reply: `¡Con mucho gusto te conecto directamente con nuestro **Administrador y Soporte Técnico Oficial** por WhatsApp! 😊\n\n📱 **WhatsApp:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n⚡ **Horario de atención:** Lunes a Domingo de 8:00 AM a 11:00 PM.\n\nTambién puedes pulsar el botón directo de WhatsApp abajo para iniciar la conversación de inmediato. ¡Te atenderán al instante!`,
      showAdminWhatsApp: true,
      suggestedProducts: [],
    };
  }

  // 2. Specific technical troubleshooting & installation issues
  // Example: Error code 0xC004C008, 0xC004C003, error de activacion, etc.
  if (
    norm.includes('error') ||
    norm.includes('no funciona la clave') ||
    norm.includes('clave invalida') ||
    norm.includes('clave no funciona') ||
    norm.includes('falla') ||
    norm.includes('problema al activar') ||
    norm.includes('no puedo activar') ||
    norm.includes('0x')
  ) {
    return {
      reply: `Lamento el inconveniente. Vamos a solucionarlo rápidamente paso a paso: 🛠️\n\n1️⃣ **Verifica la edición exacta:** Si compraste *Windows 11 Pro*, asegúrate de no tener instalada la versión *Home* o *Single Language* sin actualizar.\n2️⃣ **Verifica la conexión:** Comprueba que tu equipo tenga conexión estable a Internet y que la fecha y hora de tu sistema estén sincronizadas automáticamente.\n3️⃣ **Comando de activación rápida (en Windows):**\n   - Abre el menú Inicio, escribe **cmd**, haz clic derecho y selecciona **Ejecutar como administrador**.\n   - Escribe: \`slmgr.vbs /ipk TU-CLAVE-DE-25-DIGITOS\` y presiona Enter.\n   - Luego escribe: \`slmgr.vbs /ato\` y presiona Enter.\n4️⃣ **Para Office:** Asegúrate de desinstalar versiones previas de Office de prueba antes de ingresar tu clave oficial.\n\nSi el problema persiste, todas nuestras claves cuentan con **garantía de reemplazo inmediato**. ¡Cuéntame qué mensaje o código de error exacto te aparece en pantalla y te guío con la solución!`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 3. Questions about RUC, corporate invoices or formal quotes
  if (norm.includes('factura') || norm.includes('boleta') || norm.includes('ruc') || norm.includes('empresa') || norm.includes('cotizacion')) {
    return {
      reply: `📄 **Emisión de Comprobantes y Cotizaciones Corporativas en UpClic:**\n\n• Emitimos **Boleta o Factura electrónica con RUC** para personas naturales, profesionales independientes y empresas.\n• Al momento de completar tu compra en el checkout, puedes seleccionar la opción de comprobante e ingresar tu RUC o DNI y razón social.\n• Si necesitas una **cotización formal en PDF** para tu empresa o compras por volumen (5 a 50+ licencias), te la preparamos en minutos.\n\n¿Para cuántos equipos necesitas licencias o qué productos deseas cotizar?`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 4. Questions about difference between Office 2024, Office 2021, and Office 365
  if (
    (norm.includes('diferencia') || norm.includes('cual es mejor') || norm.includes('que me recomiendas')) &&
    (norm.includes('office') || norm.includes('2024') || norm.includes('2021') || norm.includes('365'))
  ) {
    return {
      reply: `Aquí tienes una comparativa clara para que elijas la versión perfecta de **Microsoft Office**: 💡\n\n1️⃣ **Office 2024 Professional Plus (S/ 25.00 - Pago Único Permanente):**\n   • La versión más moderna, con interfaz renovada, fórmulas nuevas en Excel y máxima velocidad en Windows 10 y 11.\n   • **Ventaja:** Pagas una sola vez y te queda de por vida.\n\n2️⃣ **Office 2021 Professional Plus (S/ 20.00 - Pago Único Permanente):**\n   • Súper estable, probada y económica. Incluye Word, Excel, PowerPoint, Outlook, Access, Publisher y OneNote.\n   • **Ventaja:** Ideal para trabajo diario de oficina, colegios y universidades.\n\n3️⃣ **Microsoft 365 Profesional (S/ 46.50 - Suscripción 1 Año):**\n   • Incluye acceso completo a las apps en hasta **5 dispositivos simultáneos** (PC, Mac, celular, tablet) + **100 GB en OneDrive**.\n   • **Ventaja:** Si tienes Mac o varios dispositivos, esta es tu mejor opción.\n\n¿En qué tipo de equipo lo vas a instalar?`,
      suggestedProducts: products.filter(p => p.category === 'office').slice(0, 3).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 5. Questions about OEM vs Retail
  if (norm.includes('oem') || norm.includes('retail') || (norm.includes('diferencia') && norm.includes('clave'))) {
    return {
      reply: `¡Excelente consulta! Te explico la diferencia exacta entre las dos modalidades: 🔑\n\n🔹 **Clave OEM (Original Equipment Manufacturer):**\n• Se enlaza a la placa madre (hardware) de tu computadora actual.\n• Es la alternativa más económica (**desde S/ 18.90**).\n• Activación **permanente e ilimitada** en esa misma PC: puedes formatear tu disco y reinstalar Windows todas las veces que quieras sin perder la licencia.\n\n🔹 **Clave Retail (Licencia Comercial Transferible):**\n• Se asocia a tu cuenta personal de Microsoft.\n• Te da la ventaja de que, si en el futuro cambias de laptop o armas una nueva PC, **puedes transferir tu licencia** al nuevo equipo.\n\nEn **UpClic** puedes elegir entre OEM y Retail tanto para **Windows 11 Pro** como para **Windows 10 Pro**. ¿Cuál se acomoda mejor a lo que buscas?`,
      suggestedProducts: products.filter(p => p.category === 'windows').slice(0, 2).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 6. Step-by-step activation / installation guide
  if (
    norm.includes('como se instala') ||
    norm.includes('como instalar') ||
    norm.includes('como activo') ||
    norm.includes('como activar') ||
    norm.includes('pasos para instalar') ||
    norm.includes('donde descargo') ||
    norm.includes('donde se descarga') ||
    norm.includes('link de descarga')
  ) {
    return {
      reply: `Aquí tienes la **guía rápida de instalación y activación oficial**: 🚀\n\n📌 **Para Microsoft Office (2024 / 2021):**\n1. Desinstala cualquier versión previa o de prueba de Office en tu panel de control.\n2. Descarga la imagen oficial (.IMG) de Microsoft desde el enlace seguro que te proporcionamos.\n3. Haz doble clic en el archivo descargado y ejecuta **Setup.exe**.\n4. Al abrir Word o Excel, aparecerá la ventana de activación. Escribe tu clave de 25 caracteres y presiona **Activar**.\n\n📌 **Para Windows 10 / 11:**\n1. Ve a **Inicio > Configuración > Sistema > Activación**.\n2. Haz clic en **Cambiar la clave del producto**.\n3. Ingresa tu clave de 25 dígitos provista y presiona **Siguiente > Activar**.\n\n¡La activación queda enlazada de inmediato con los servidores de Microsoft! ¿Tienes alguna consulta sobre algún paso?`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 7. Questions about Mac / Apple compatibility
  if (norm.includes('mac') || norm.includes('apple') || norm.includes('macbook') || norm.includes('macos')) {
    return {
      reply: `Para computadoras **Mac (MacBook Air, MacBook Pro, iMac, Mac Mini)**, la versión oficial compatible es:\n\n🍏 **Microsoft Office 365 Profesional (Cuenta 1 Año - S/ 46.50):**\n• 100% compatible con **macOS** (y también Windows, iPad, iPhone y Android).\n• Te permite instalar Word, Excel, PowerPoint y Outlook nativos para Mac.\n• Incluye **100 GB de almacenamiento en OneDrive**.\n• Se activa iniciando sesión con tu cuenta oficial asignada en portal.office.com.\n\n*Nota:* Las versiones Office 2024 / 2021 Professional Plus son exclusivamente para sistemas operativos Windows 10 y 11.\n\n¿Deseas que te agregue Microsoft 365 a tu pedido?`,
      suggestedProducts: products.filter(p => p.id === 'prod-m365').map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 8. Payment methods & delivery time
  if (
    norm.includes('como pago') ||
    norm.includes('metodos de pago') ||
    norm.includes('medio de pago') ||
    norm.includes('yape') ||
    norm.includes('plin') ||
    norm.includes('transferencia') ||
    norm.includes('tarjeta') ||
    norm.includes('mercado pago') ||
    norm.includes('bcp') ||
    norm.includes('bbva') ||
    norm.includes('interbank')
  ) {
    return {
      reply: `En **UpClic** el proceso de pago está 100% automatizado con la pasarela oficial de **Mercado Pago**: 💳🔒\n\n• 💳 **Tarjetas de Débito y Crédito:** Visa, Mastercard, American Express y Diners con acreditación instantánea.\n• 📱 **Billeteras Digitales y Efectivo:** Yape, PagoEfectivo y banca móvil.\n• ⚡ **Proceso sin complicaciones:** Seleccionas tus licencias, presionas "Pagar con Mercado Pago" y al finalizar el pago eres redirigido automáticamente a nuestro WhatsApp con tu pedido en estado **PAGADO** y tu número de transacción.\n\n⏱️ **Entrega por correo electrónico (10 a 25 min):** Será enviado a su correo electrónico tras confirmar el pago con su clave original de 25 caracteres, enlaces oficiales de descarga de Microsoft y guía de instalación.\n\n¿Tienes listo el producto que deseas adquirir?`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 9. Coupons, discounts, pricing & offers
  if (
    norm.includes('cupon') ||
    norm.includes('descuento') ||
    norm.includes('promocion') ||
    norm.includes('oferta') ||
    norm.includes('rebaja') ||
    norm.includes('mas barato') ||
    norm.includes('precio')
  ) {
    return {
      reply: `¡Tenemos promociones imperdibles para que compres al mejor precio! 🎉\n\n🔥 **Descuento automático por volumen:** Al llevar 2 o más licencias en tu carrito, el sistema te aplica un **10% de descuento adicional automático**.\n💥 **Combos ahorro:** Nuestros combos de Windows + Office ya tienen un ahorro de más de S/ 40.00 incluido.\n\n¿Qué software necesitas para tu equipo?`,
      suggestedProducts: products.filter(p => p.featured || p.bestSeller).slice(0, 3).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 10. Combos & Packs
  if (norm.includes('combo') || norm.includes('pack') || norm.includes('juntos') || (norm.includes('windows') && norm.includes('office'))) {
    return {
      reply: `¡Nuestros combos son la opción más recomendada y con mayor ahorro! 📦🔥\n\n1️⃣ **Combo Windows 11 Pro + Office 2024 Professional Plus:**\n   • Todo lo último de Microsoft con activación permanente de por vida.\n   • **Precio Especial:** Solo **S/ 46.50** (Ahorras más de S/ 40.00 comparado con comprar por separado).\n\n2️⃣ **Combo Windows 10 Pro + Office 2021 Professional Plus:**\n   • Ideal para rendimiento ágil, estabilidad y compatibilidad en cualquier computadora.\n   • **Precio Especial:** Solo **S/ 42.00**.\n\nAmbos combos incluyen 2 claves originales independientes, enlaces oficiales de descarga, guía paso a paso y garantía de 1 año. ¿Te gustaría añadir alguno a tu carrito?`,
      suggestedProducts: products.filter(p => p.category === 'combos').map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 11. Visio & Project
  if (norm.includes('visio') || norm.includes('project') || norm.includes('diagrama') || norm.includes('gantt') || norm.includes('cronograma')) {
    return {
      reply: `Contamos con las herramientas profesionales oficiales de Microsoft para ingeniería, gestión y arquitectura: 📐📊\n\n• 📐 **Microsoft Visio 2024 / 2021 Professional (S/ 24.50):** Creación avanzada de diagramas de flujo, planos de redes, mapas de procesos, organigramas y esquemas técnicos.\n• 📊 **Microsoft Project 2024 / 2021 Professional (S/ 24.50):** Planificación integral de proyectos, diagramas de Gantt, control de costos, asignación de recursos y tiempos.\n\nAmbas licencias son de **pago único permanente de por vida** para Windows 10 y 11 con soporte oficial. ¿Cuál de los dos necesitas?`,
      suggestedProducts: products.filter(p => p.category === 'project-visio').map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 12. Windows 11 / Windows 10 recommendations
  if (norm.includes('windows') || norm.includes('win 11') || norm.includes('win 10') || norm.includes('formatear') || norm.includes('sistema operativo')) {
    return {
      reply: `Para el sistema operativo de tu PC te ofrecemos licencias 100% oficiales y permanentes: 💻\n\n• 🌟 **Windows 11 Pro (64-bit):** La versión más segura, veloz y moderna con soporte para Auto HDR, DirectStorage y pestañas en el explorador. Desde **S/ 19.90** (OEM) y Retail disponible.\n• ⚡ **Windows 10 Pro (32/64 bits):** Excelente estabilidad y bajo consumo de recursos para cualquier hardware. Desde **S/ 18.90** (OEM) y Retail disponible.\n• 🔥 **Windows 11 Home / Windows 10 Home:** Opciones ideales para uso personal y hogareño desde **S/ 18.90**.\n\n¿Tu computadora ya tiene Windows instalado para activarlo, o vas a hacer una instalación limpia desde cero?`,
      suggestedProducts: products.filter(p => p.category === 'windows').slice(0, 3).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 13. Office recommendations
  if (norm.includes('office') || norm.includes('word') || norm.includes('excel') || norm.includes('powerpoint') || norm.includes('access')) {
    return {
      reply: `En **UpClic** disponemos de todas las ediciones oficiales de **Microsoft Office**: 💼\n\n• 🌟 **Office 2024 Professional Plus (S/ 25.00):** La edición más moderna de pago único permanente para Windows 10 y 11.\n• 💼 **Office 2021 Professional Plus (S/ 20.00):** La más utilizada en empresas y universidades (Word, Excel, PowerPoint, Outlook, Access, Publisher, OneNote).\n• ☁️ **Microsoft 365 Profesional 1 Año (S/ 46.50):** Hasta 5 dispositivos simultáneos (PC, Mac, celular) con 100 GB en la nube OneDrive.\n• 🚀 **Office 2019 / 2016 (Desde S/ 18.00):** Para computadoras con Windows 7, 8.1 o 10.\n\n¿Para qué tipo de computadora o trabajo lo vas a emplear? Te recomiendo la versión exacta.`,
      suggestedProducts: products.filter(p => p.category === 'office').slice(0, 3).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 14. Off-topic topics
  const offTopicWords = ['netflix', 'spotify', 'juego', 'gta', 'minecraft', 'playstation', 'xbox', 'steam', 'ram', 'laptop', 'celular', 'iphone', 'adobe', 'photoshop', 'canva'];
  if (offTopicWords.some(w => norm.includes(w))) {
    return {
      reply: `¡Hola! Con gusto te oriento. 😊\n\nEn **UpClic** nos enfocamos exclusivamente en la venta de **licencias digitales oficiales de Microsoft** (Office, Windows, Visio y Project) para asegurarte activación 100% original, garantía y los precios más accesibles de Perú.\n\nNo comercializamos hardware físico, cuentas de streaming ni software de terceros. Si necesitas instalar o activar **Office** (Word, Excel, PowerPoint) o **Windows 10/11**, ¡cuéntame qué versión estás buscando y te ayudo al instante!`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 15. Friendly greetings
  if (
    norm === 'hola' ||
    norm === 'buenas' ||
    norm === 'buenas tardes' ||
    norm === 'buenos dias' ||
    norm === 'buenas noches' ||
    norm.startsWith('hola ') ||
    norm.startsWith('que tal')
  ) {
    return {
      reply: `¡Hola! Qué gusto tenerte por aquí. 😊 Bienvenido a **UpClic**.\n\nSoy tu asesor digital y estoy listo para resolver cualquier duda sobre nuestras licencias originales de **Microsoft Office, Windows 10/11, Visio y Project**, guiarte con tu proceso de instalación o ayudarte a encontrar el mayor descuento para tu pedido.\n\n¿En qué te puedo asesorar hoy?`,
      suggestedProducts: products.filter(p => p.featured).slice(0, 2).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // 16. Gratitude / farewell
  if (norm.includes('gracias') || norm.includes('genial') || norm.includes('perfecto') || norm.includes('excelente') || norm.includes('listo')) {
    return {
      reply: `¡Un placer ayudarte! 😊 Si te surge cualquier otra pregunta durante tu compra o al activar tu licencia, solo escríbeme por aquí. ¡Que tengas un excelente día y mucho éxito con tu software! 🌟`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 17. Intelligent keyword & context matcher for any other query
  // Finds best matching products in store catalog
  const matchingKeywords = norm.split(/\s+/).filter(w => w.length > 2);
  const matched = products.filter((p: Product) => {
    const pText = normalizeText(`${p.name} ${p.category} ${p.description} ${p.features.join(' ')}`);
    return matchingKeywords.some(k => pText.includes(k));
  }).slice(0, 3);

  if (matched.length > 0) {
    const pNames = matched.map(p => `• **${p.name}:** S/ ${p.price.toFixed(2)} (${p.duration})`).join('\n');
    return {
      reply: `Comprendo lo que necesitas. 👍 Para lo que me consultas, te recomiendo revisar estas opciones disponibles en nuestra tienda:\n\n${pNames}\n\nTodas nuestras licencias cuentan con activación 100% original con los servidores de Microsoft, entrega digital inmediata tras tu pago y garantía oficial.\n\n¿Deseas conocer más detalles técnicos o cómo realizar la instalación de alguna de ellas?`,
      suggestedProducts: matched.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      showAdminWhatsApp: false,
    };
  }

  // Default helpful response
  return {
    reply: `¡Entendido! En **UpClic** contamos con un catálogo completo de licencias digitales oficiales de **Microsoft Office** (2024, 2021, 365), **Windows 10 y 11** (Pro, Home, OEM y Retail), **Project y Visio**, todas con activación permanente y garantía.\n\n¿Te gustaría que te recomiende la mejor opción para tu computadora, o tienes alguna consulta sobre la instalación o métodos de pago?`,
    suggestedProducts: products.filter(p => p.featured).slice(0, 2).map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      imageUrl: p.fallbackImage || p.imageUrl,
      badge: p.badge,
    })),
    showAdminWhatsApp: false,
  };
}
