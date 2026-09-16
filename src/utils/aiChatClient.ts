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

export function generateLocalChatReply(
  message: string,
  history?: Array<{ role: string; content: string }>,
  locale: 'ES' | 'EN' = 'ES'
): LocalChatResponse {
  const cleanMessage = message.trim();
  const rawLower = cleanMessage.toLowerCase();
  const norm = normalizeText(cleanMessage);

  const isEn =
    locale === 'EN' ||
    norm.includes('what') ||
    norm.includes('how') ||
    norm.includes('which') ||
    norm.includes('can you') ||
    norm.includes('difference') ||
    norm.includes('coupon') ||
    norm.includes('discount') ||
    norm.includes('license') ||
    norm.includes('delivery') ||
    norm.includes('support') ||
    norm.includes('hello') ||
    norm.includes('hi');

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
    norm.includes('llamada telefonica') ||
    norm.includes('human') ||
    norm.includes('agent') ||
    norm.includes('contact support') ||
    norm.includes('talk to admin');

  if (explicitAdminRequest) {
    return {
      reply: isEn
        ? `We are transferring you immediately to our **Technical Support & Licensing Center** via WhatsApp:\n\n• **Direct Line:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n• **Business Hours:** Monday to Sunday from 8:00 AM to 11:00 PM.\n\nYou can also click the direct button below to get in touch with a specialist.`
        : `Le transferimos de inmediato con la central de **Soporte Técnico y Licenciamiento Corporativo** por WhatsApp:\n\n• **Línea Directa:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n• **Horario de Atención:** Lunes a Domingo de 8:00 AM a 11:00 PM.\n\nTambién puede presionar el botón directo a continuación para establecer contacto inmediato con un especialista.`,
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
    norm.includes('invalid key') ||
    norm.includes('not working') ||
    norm.includes('0x')
  ) {
    return {
      reply: isEn
        ? `Quick troubleshooting procedure for key validation:\n\n1. **Edition Verification:** If you purchased *Windows 11 Pro*, ensure your PC is not running an un-upgraded *Home* or *Single Language* build.\n2. **Network Connection:** Ensure active internet access for token validation with official Microsoft servers.\n3. **Command Prompt Verification (cmd):**\n   - Open cmd as Administrator.\n   - Enter: \`slmgr.vbs /ipk YOUR-25-DIGIT-KEY\` and press Enter.\n   - Enter: \`slmgr.vbs /ato\` to force online activation.\n4. **For Microsoft Office:** Uninstall any previous trial or unauthorized packages before applying the new license.\n\nAll licenses come with a 1-year replacement warranty. If any code persists, send us the exact message for immediate support.`
        : `Procedimiento de diagnóstico rápido para la validación de clave:\n\n1. **Verificación de edición:** Si adquirió *Windows 11 Pro*, compruebe que no posea una compilación *Home* o *Single Language* sin actualizar.\n2. **Conexión de red:** Asegúrese de contar con acceso a Internet para la validación de tokens con los servidores de Microsoft.\n3. **Comando de validación por consola (cmd):**\n   - Inicie la consola como Administrador.\n   - Ingrese: \`slmgr.vbs /ipk SU-CLAVE-DE-25-DIGITOS\` y presione Enter.\n   - Ingrese: \`slmgr.vbs /ato\` para forzar la activación online.\n4. **Para Microsoft Office:** Desinstale cualquier paquete de prueba previo antes de validar la clave final.\n\nTodas nuestras licencias disponen de garantía de soporte técnico de 1 año. Si el código de error persiste, comuníquenos el mensaje exacto para realizar el reemplazo de token de inmediato.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 3. Questions about RUC, corporate invoices or formal quotes
  if (norm.includes('factura') || norm.includes('boleta') || norm.includes('ruc') || norm.includes('empresa') || norm.includes('cotizacion') || norm.includes('invoice') || norm.includes('quote')) {
    return {
      reply: isEn
        ? `**Electronic Invoicing & Corporate Licensing:**\n\n• We issue official electronic receipts and invoices with Tax ID / RUC for individuals and corporations.\n• During checkout, you can specify your billing details.\n• For corporate volume quotes (5 to 50+ licenses), we prepare formal PDF estimates.\n\nHow many licenses does your organization need?`
        : `**Emisión de Comprobantes Electrónicos y Licenciamiento Empresarial:**\n\n• Emitimos **Boleta o Factura electrónica con RUC** para personas naturales, profesionales y empresas en Perú.\n• Durante el proceso de pago, puede especificar los datos tributarios (RUC, DNI, Razón Social).\n• Para cotizaciones corporativas por volumen (5 a 50+ licencias), elaboramos el expediente en formato PDF formal.\n\n¿Indíquenos cuántas licencias requiere para su organización?`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 4. Questions about difference between Office 2024, Office 2021, and Office 365
  if (
    (norm.includes('diferencia') || norm.includes('difference') || norm.includes('which') || norm.includes('cual es mejor') || norm.includes('que me recomiendas')) &&
    (norm.includes('office') || norm.includes('2024') || norm.includes('2021') || norm.includes('365'))
  ) {
    return {
      reply: isEn
        ? `Microsoft Office Licensing Comparison:\n\n1. **Office 2024 Professional Plus:**\n   • The latest perpetual release with modern features for Windows 10 & 11.\n   • *Type:* One-time perpetual payment.\n\n2. **Office 2021 Professional Plus:**\n   • Highly stable corporate standard (Word, Excel, PowerPoint, Outlook, Access, Publisher, OneNote).\n   • *Type:* One-time perpetual payment.\n\n3. **Microsoft 365 Professional:**\n   • Cross-platform coverage for up to 5 devices (Windows, macOS, iOS, Android) + 100 GB in OneDrive cloud storage.\n   • *Type:* 12-month corporate subscription.\n\nWhich operating system are you deploying on?`
        : `Resumen de licenciamiento de Microsoft Office para evaluación técnica:\n\n1. **Office 2024 Professional Plus (Pago Único):**\n   • La edición perpetua más reciente con funciones avanzadas para Windows 10 y 11.\n   • *Modalidad:* Licencia perpetua de pago único.\n\n2. **Office 2021 Professional Plus (Pago Único):**\n   • Estándar corporativo altamente estable (Word, Excel, PowerPoint, Outlook, Access, Publisher, OneNote).\n   • *Modalidad:* Licencia perpetua de pago único.\n\n3. **Microsoft 365 Profesional (Suscripción 1 Año):**\n   • Cobertura multi-plataforma para hasta 5 dispositivos simultáneos (Windows, macOS, iOS, Android) + 100 GB en OneDrive.\n   • *Modalidad:* Suscripción corporativa de 12 meses.\n\n¿Indíquenos en qué sistema operativo planea realizar el despliegue?`,
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
  if (norm.includes('oem') || norm.includes('retail')) {
    return {
      reply: isEn
        ? `Licensing Architecture Differences (OEM vs Retail):\n\n• **OEM Key (Original Equipment Manufacturer):**\n  - Binds directly to the workstation's motherboard/firmware.\n  - Cost-optimized entry point.\n  - Allows unlimited reinstallation and re-formatting on the same computer.\n\n• **Retail Key (Transferable Commercial License):**\n  - Binds to your Microsoft user account.\n  - Can be transferred to a new workstation if you change computers.\n\nBoth types are available for Windows 11 Pro and Windows 10 Pro.`
        : `Diferencias de arquitectura de licenciamiento (OEM vs Retail):\n\n• **Clave OEM (Original Equipment Manufacturer):**\n  - Se enlaza a la placa madre (firmware/hardware) de la estación de trabajo.\n  - Costo de entrada optimizado.\n  - Permite formateos y reinstalaciones ilimitadas en el mismo equipo físico.\n\n• **Clave Retail (Licencia Comercial Transferible):**\n  - Se asocia a la cuenta de usuario de Microsoft.\n  - Ofrece el derecho de reubicación de la licencia hacia una nueva estación de trabajo en caso de sustitución de hardware.\n\nAmbas modalidades están disponibles tanto para Windows 11 Pro como para Windows 10 Pro.`,
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
    norm.includes('how to activate') ||
    norm.includes('how to install') ||
    norm.includes('download link')
  ) {
    return {
      reply: isEn
        ? `Official Activation Procedure:\n\n**For Microsoft Office (2024 / 2021):**\n1. Uninstall previous or trial editions via the Control Panel.\n2. Open your official Office app (Word or Excel).\n3. When prompted, enter the 25-character alphanumeric key.\n\n**For Windows 10 / 11:**\n1. Go to **Settings > System > Activation**.\n2. Click **Change product key**.\n3. Enter your official license key and click **Next > Activate**.\n\nActivation validates instantly with Microsoft cloud infrastructure.`
        : `Procedimiento de activación oficial:\n\n**Para Microsoft Office (2024 / 2021):**\n1. Desinstale versiones anteriores o de evaluación en el panel de control.\n2. Inicie su aplicación instalada oficial.\n3. En la ventana de activación de Word/Excel, introduzca la clave alfanumérica de 25 dígitos proporcionada.\n\n**Para Windows 10 / 11:**\n1. Ingrese a **Inicio > Configuración > Sistema > Activación**.\n2. Seleccione **Cambiar la clave del producto**.\n3. Ingrese su clave original y presione **Siguiente > Activar**.\n\nLa activación se valida directamente con la infraestructura de servidores de Microsoft.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 7. Questions about Mac / Apple compatibility
  if (norm.includes('mac') || norm.includes('apple') || norm.includes('macbook') || norm.includes('macos')) {
    return {
      reply: isEn
        ? `For **macOS (MacBook Air, MacBook Pro, iMac, Mac Mini)**, the supported version is:\n\n• **Microsoft Office 365 Professional (1 Year):**\n  - Native macOS compatibility with multi-device syncing.\n  - Includes Word, Excel, PowerPoint, Outlook and 100 GB cloud storage.\n  - Direct sign-in activation through portal.office.com.\n\n*Note:* Office 2024 / 2021 Professional Plus are exclusively built for Windows 10 and 11 environments.`
        : `Para la plataforma **macOS (MacBook Air, MacBook Pro, iMac, Mac Mini)**, la versión de despliegue oficial es:\n\n• **Microsoft Office 365 Profesional (1 Año):**\n  - Compatibilidad nativa con **macOS** e integración multi-dispositivo.\n  - Incluye Word, Excel, PowerPoint, Outlook y 100 GB de almacenamiento en OneDrive.\n  - Activación por inicio de sesión de cuenta oficial corporativa en portal.office.com.\n\n*Nota:* Las ediciones Office 2024 / 2021 Professional Plus aplican exclusivamente a entornos Windows 10 y 11.`,
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
    norm.includes('how to pay') ||
    norm.includes('payment') ||
    norm.includes('delivery') ||
    norm.includes('entrega')
  ) {
    return {
      reply: isEn
        ? `Payment & Delivery details:\n\n• **Payment Gateways:** Securely processed through Mercado Pago with full encryption. Accepts Credit and Debit Cards (Visa, Mastercard, Amex, etc.).\n• **Delivery Time:** Between 10 to 30 minutes directly to your email after transaction confirmation, including your 25-digit genuine key and step-by-step activation guide.`
        : `En **UpClic** la pasarela de pagos está respaldada por la infraestructura oficial de **Mercado Pago**:\n\n• **Aceptación bancaria:** Tarjetas de Crédito/Débito (Visa, Mastercard, Amex, Diners) con confirmación inmediata.\n• **Billeteras Digitales:** Yape, PagoEfectivo y banca móvil.\n• **Tiempo de Entrega:** Entre 10 a 30 minutos vía correo electrónico tras la confirmación de la orden, incluyendo clave de 25 caracteres e instrucciones.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 9. Coupons, discounts, pricing & offers
  if (
    norm.includes('cupon') ||
    norm.includes('descuento') ||
    norm.includes('promocion') ||
    norm.includes('coupon') ||
    norm.includes('discount') ||
    norm.includes('promo')
  ) {
    return {
      reply: isEn
        ? `Available discounts and promotional offers:\n\n• **Automatic Multi-Item Discount:** Add 2 or more products to your cart to automatically receive a **10% discount**.\n• **Software Bundles:** Combination packs of Windows + Office feature built-in savings compared to buying single licenses.\n\nWould you like a recommendation for your setup?`
        : `Estructura de descuentos aplicables en plataforma:\n\n• **Descuento Automático por Volumen:** Al integrar 2 o más licencias al carrito, el sistema calcula un **10% de rebaja directa**.\n• **Paquetes Combinados (Combos):** Los conjuntos de Windows + Office incorporan un margen de ahorro optimizado frente a licencias independientes.\n\n¿Requiere alguna recomendación de software para sus equipos?`,
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

  // 10. Greetings
  if (
    norm === 'hola' ||
    norm === 'hello' ||
    norm === 'hi' ||
    norm === 'hey' ||
    norm.startsWith('hola ') ||
    norm.startsWith('hello ')
  ) {
    return {
      reply: isEn
        ? `Welcome to the **UpClic Technical Center**.\n\nWe provide official licenses for **Microsoft Office, Windows 10/11, Visio, and Project**, compatibility advice, and direct assistance.\n\nHow can we help you today?`
        : `Bienvenido al Centro de Atención Técnica de **UpClic**.\n\nLe brindamos asesoría especializada sobre licencias originales de **Microsoft Office, Windows 10/11, Visio y Project**, guías de instalación y facturación electrónica.\n\n¿En qué podemos asistirle hoy?`,
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

  // 11. Gratitude / farewell
  if (norm.includes('gracias') || norm.includes('thank') || norm.includes('thanks') || norm.includes('perfecto') || norm.includes('great')) {
    return {
      reply: isEn
        ? `You're welcome! If you need any assistance during license activation or software setup, we are here to help.`
        : `Quedamos a su disposición. Si requiere asistencia adicional durante el proceso de validación o instalación, estamos para servirle.`,
      suggestedProducts: [],
      showAdminWhatsApp: false,
    };
  }

  // 12. Matching products by keywords
  const matchingKeywords = norm.split(/\s+/).filter(w => w.length > 2);
  const matched = products.filter((p: Product) => {
    const pText = normalizeText(`${p.name} ${p.category} ${p.description} ${p.features.join(' ')}`);
    return matchingKeywords.some(k => pText.includes(k));
  }).slice(0, 3);

  if (matched.length > 0) {
    const pNames = matched.map(p => `• **${p.name}:** ${p.duration}`).join('\n');
    return {
      reply: isEn
        ? `Regarding your inquiry, here are recommended software licenses:\n\n${pNames}\n\nAll licenses include official activation with Microsoft servers, instant digital delivery, and warranty.`
        : `En relación a su consulta, le sugerimos revisar las siguientes licencias recomendadas:\n\n${pNames}\n\nTodas las licencias cuentan con autenticación oficial ante servidores de Microsoft, entrega digital y garantía técnica.`,
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
    reply: isEn
      ? `At **UpClic** we provide genuine digital licenses for Microsoft software (Office, Windows 10/11, Project, and Visio), design and AI suites with warranty and technical support.\n\nWhich software does your computer or team require?`
      : `En **UpClic** disponemos de soluciones integrales de software Microsoft (Office, Windows 10/11, Project y Visio) con garantía oficial y soporte técnico.\n\n¿Indíquenos qué solución de software requiere su equipo o empresa?`,
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
