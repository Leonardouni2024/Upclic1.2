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
      reply: `Le transferimos de inmediato con la central de **Soporte Técnico y Licenciamiento Corporativo** por WhatsApp:\n\n• **Línea Directa:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n• **Horario de Atención:** Lunes a Domingo de 8:00 AM a 11:00 PM.\n\nTambién puede presionar el botón directo a continuación para establecer contacto inmediato con un especialista.`,
      showAdminWhatsApp: true,
      suggestedProducts: [],
    };
  }

  // 2. Specific technical troubleshooting & installation issues
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
      reply: `Procedimiento de diagnóstico rápido para la validación de clave:\n\n1. **Verificación de edición:** Si adquirió *Windows 11 Pro*, compruebe que no posea una compilación *Home* o *Single Language* sin actualizar.\n2. **Conexión de red:** Asegúrese de contar con acceso a Internet para la validación de tokens con los servidores de Microsoft.\n3. **Comando de validación por consola (cmd):**\n   - Inicie la consola como Administrador.\n   - Ingrese: \`slmgr.vbs /ipk SU-CLAVE-DE-25-DIGITOS\` y presione Enter.\n   - Ingrese: \`slmgr.vbs /ato\` para forzar la activación online.\n4. **Para Microsoft Office:** Desinstale cualquier paquete de prueba previo antes de validar la clave final.\n\nTodas nuestras licencias disponen de garantía de soporte técnico de 1 año. Si el código de error persiste, comuníquenos el mensaje exacto para realizar el reemplazo de token de inmediato.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 3. Questions about RUC, corporate invoices or formal quotes
  if (norm.includes('factura') || norm.includes('boleta') || norm.includes('ruc') || norm.includes('empresa') || norm.includes('cotizacion')) {
    return {
      reply: `**Emisión de Comprobantes Electrónicos y Licenciamiento Empresarial:**\n\n• Emitimos **Boleta o Factura electrónica con RUC** para personas naturales, profesionales y empresas en Perú.\n• Durante el proceso de pago, puede especificar los datos tributarios (RUC, DNI, Razón Social).\n• Para cotizaciones corporativas por volumen (5 a 50+ licencias), elaboramos el expediente en formato PDF formal.\n\n¿Indíquenos cuántas licencias requiere para su organización?`,
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
      reply: `Resumen de licenciamiento de Microsoft Office para evaluación técnica:\n\n1. **Office 2024 Professional Plus (S/ 25.00 - Pago Único):**\n   • La edición perpetua más reciente con funciones avanzadas para Windows 10 y 11.\n   • *Modalidad:* Licencia perpetua de pago único.\n\n2. **Office 2021 Professional Plus (S/ 20.00 - Pago Único):**\n   • Estándar corporativo altamente estable (Word, Excel, PowerPoint, Outlook, Access, Publisher, OneNote).\n   • *Modalidad:* Licencia perpetua de pago único.\n\n3. **Microsoft 365 Profesional (S/ 46.50 - Suscripción 1 Año):**\n   • Cobertura multi-plataforma para hasta 5 dispositivos simultáneos (Windows, macOS, iOS, Android) + 100 GB en OneDrive.\n   • *Modalidad:* Suscripción corporativa de 12 meses.\n\n¿Indíquenos en qué sistema operativo planea realizar el despliegue?`,
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
      reply: `Diferencias de arquitectura de licenciamiento (OEM vs Retail):\n\n• **Clave OEM (Original Equipment Manufacturer):**\n  - Se enlaza a la placa madre (firmware/hardware) de la estación de trabajo.\n  - Costo de entrada optimizado (**desde S/ 18.90**).\n  - Permite formateos y reinstalaciones ilimitadas en el mismo equipo físico.\n\n• **Clave Retail (Licencia Comercial Transferible):**\n  - Se asocia a la cuenta de usuario de Microsoft.\n  - Ofrece el derecho de reubicación de la licencia hacia una nueva estación de trabajo en caso de sustitución de hardware.\n\nAmbas modalidades están disponibles tanto para Windows 11 Pro como para Windows 10 Pro.`,
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
      reply: `Procedimiento de activación oficial:\n\n**Para Microsoft Office (2024 / 2021):**\n1. Desinstale versiones anteriores o de evaluación en el panel de control.\n2. Inicie su aplicación instalada oficial.\n3. En la ventana de activación de Word/Excel, introduzca la clave alfanumérica de 25 dígitos proporcionada.\n\n**Para Windows 10 / 11:**\n1. Ingrese a **Inicio > Configuración > Sistema > Activación**.\n2. Seleccione **Cambiar la clave del producto**.\n3. Ingrese su clave original y presione **Siguiente > Activar**.\n\nLa activación se valida directamente con la infraestructura de servidores de Microsoft.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 7. Questions about Mac / Apple compatibility
  if (norm.includes('mac') || norm.includes('apple') || norm.includes('macbook') || norm.includes('macos')) {
    return {
      reply: `Para la plataforma **macOS (MacBook Air, MacBook Pro, iMac, Mac Mini)**, la versión de despliegue oficial es:\n\n• **Microsoft Office 365 Profesional (1 Año - S/ 46.50):**\n  - Compatibilidad nativa con **macOS** e integración multi-dispositivo.\n  - Incluye Word, Excel, PowerPoint, Outlook y 100 GB de almacenamiento en OneDrive.\n  - Activación por inicio de sesión de cuenta oficial corporativa en portal.office.com.\n\n*Nota:* Las ediciones Office 2024 / 2021 Professional Plus aplican exclusivamente a entornos Windows 10 y 11.`,
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
      reply: `En **UpClic** la pasarela de pagos está respaldada por la infraestructura oficial de **Mercado Pago**:\n\n• **Aceptación bancaria:** Tarjetas de Crédito/Débito (Visa, Mastercard, Amex, Diners) con confirmación inmediata.\n• **Billeteras Digitales y Banca en Línea:** Yape, PagoEfectivo y bancas móviles peruanas.\n• **Tiempo de Entrega:** Entre 10 a 25 minutos vía correo electrónico tras la confirmación de la orden, incluyendo clave de 25 caracteres (o instrucciones de activación).`,
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
      reply: `Estructura de descuentos aplicables en plataforma:\n\n• **Descuento Automático por Volumen:** Al integrar 2 o más licencias al carrito, el sistema calcula un **10% de rebaja directa**.\n• **Paquetes Combinados (Combos):** Los conjuntos de Windows + Office incorporan un margen de ahorro optimizado frente a licencias independientes.\n\n¿Requiere alguna recomendación de software para sus equipos?`,
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
      reply: `Paquetes recomendados de software corporativo:\n\n1. **Combo Windows 11 Pro + Office 2024 Professional Plus:**\n   • Solución integral con licencia perpetua de por vida.\n   • **Inversión:** S/ 46.50\n\n2. **Combo Windows 10 Pro + Office 2021 Professional Plus:**\n   • Alta estabilidad para infraestructuras existentes.\n   • **Inversión:** S/ 42.00\n\nCada paquete contiene 2 licencias independientes con garantía de activación directa de 1 año.`,
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
      reply: `Software oficial para gestión de proyectos e infraestructura técnica:\n\n• **Microsoft Visio 2024 / 2021 Professional (S/ 24.50):** Modelado de procesos, diagramas de arquitectura, redes y esquemas de ingeniería.\n• **Microsoft Project 2024 / 2021 Professional (S/ 24.50):** Gestión de cronogramas, diagramas de Gantt, control presupuestario y asignación de recursos.\n\nAmbas soluciones corresponden a licencias perpetuas para sistemas Windows 10 y 11.`,
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
      reply: `Sistemas Operativos Windows de distribución oficial:\n\n• **Windows 11 Pro (64-bit):** Arquitectura moderna para alto rendimiento y seguridad de datos. Desde **S/ 19.90**.\n• **Windows 10 Pro (32/64 bits):** Estabilidad óptima para hardware corporativo o residencial. Desde **S/ 18.90**.\n• **Ediciones Home:** Soluciones orientadas al usuario particular desde **S/ 18.90**.`,
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
      reply: `Catálogo de suites de productividad Microsoft Office:\n\n• **Office 2024 Professional Plus (S/ 25.00):** Versión reciente de pago único para Windows 10 y 11.\n• **Office 2021 Professional Plus (S/ 20.00):** Edición estándar corporativa de alta adopción.\n• **Microsoft 365 Profesional 1 Año (S/ 46.50):** Cobertura multi-dispositivo y almacenamiento en la nube.\n• **Office 2019 / 2016 (Desde S/ 18.00):** Para compatibilidad con sistemas Windows anteriores.`,
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
      reply: `En **UpClic** nos especializamos de manera exclusiva en **licencias digitales de software Microsoft** (Office, Windows, Visio y Project).\n\nNo comercializamos hardware físico ni suscripciones de entretenimiento. Si requiere asesoría sobre software corporativo o sistemas operativos, con gusto le asistiremos.`,
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
      reply: `Bienvenido al Centro de Atención Técnica de **UpClic**.\n\nLe brindamos asesoría especializada sobre licencias originales de **Microsoft Office, Windows 10/11, Visio y Project**, guías de instalación y facturación electrónica.\n\n¿En qué podemos asistirle hoy?`,
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
      reply: `Quedamos a su disposición. Si requiere asistencia adicional durante el proceso de validación o instalación, estamos para servirle.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 17. Intelligent keyword & context matcher for any other query
  const matchingKeywords = norm.split(/\s+/).filter(w => w.length > 2);
  const matched = products.filter((p: Product) => {
    const pText = normalizeText(`${p.name} ${p.category} ${p.description} ${p.features.join(' ')}`);
    return matchingKeywords.some(k => pText.includes(k));
  }).slice(0, 3);

  if (matched.length > 0) {
    const pNames = matched.map(p => `• **${p.name}:** S/ ${p.price.toFixed(2)} (${p.duration})`).join('\n');
    return {
      reply: `En relación a su consulta, le sugerimos revisar las siguientes licencias recomendadas:\n\n${pNames}\n\nTodas las licencias cuentan con autenticación oficial ante servidores de Microsoft, entrega digital y garantía técnica.`,
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
    reply: `En **UpClic** disponemos de soluciones integrales de software Microsoft (Office, Windows 10/11, Project y Visio) con garantía oficial y soporte técnico.\n\n¿Indíquenos qué solución de software requiere su equipo o empresa?`,
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
