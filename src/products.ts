import { Product, CartTotals } from './types.ts';

// Variable de atención UpClic para WhatsApp oficial
export const WHATSAPP_NUMBER = "51983204384";
export const WHATSAPP_DISPLAY = "+51 983 204 384";

// Código promocional oficial de apertura (30% de descuento, 30 días de vigencia)
export const PROMO_COUPON_CODE = "PRIMUPCLIC";
export const PROMO_COUPON_DISCOUNT = 0.30; // 30%
export const MULTI_ITEM_DISCOUNT = 0.35; // 35% si lleva 2 o más productos
export const PROMO_COUPON_EXPIRATION_DAYS = 30;

// Enlace oficial e inalterable de Mercado Pago según requerimiento
export const MERCADO_PAGO_URL = "https://link.mercadopago.com.pe/iptvfuxionpago";

export const products: Product[] = [
  // COMBO DESTACADO (Windows 11 Pro + Microsoft Office 2024)
  {
    id: "prod-combo-win11-office2024",
    slug: "combo-windows-11-pro-office-2024",
    name: "Combo Windows 11 Pro + Microsoft Office 2024",
    category: "combos",
    price: 65.00,
    oldPrice: 139.80,
    duration: "Permanente (2 Claves)",
    rating: 5.0,
    reviews: 164,
    imageUrl: "/products/combo-win11-office2024.svg",
    fallbackImage: "/products/combo-win11-office2024.svg",
    description: "Paquete definitivo 2 en 1 con super ahorro. Incluye 1 Clave oficial para Windows 11 Pro 64-bit + 1 Clave oficial para Microsoft Office Professional Plus 2024 con activación permanente de por vida.",
    features: [
      "1 Licencia original de Windows 11 Pro (32/64 bits) de activación permanente",
      "1 Licencia original de Office Professional Plus 2024 (Word, Excel, PowerPoint, Outlook, Access, OneNote)",
      "Activación oficial directa y garantizada de por vida",
      "Ahorro superior en combo respecto a la compra individual",
      "Soporte prioritario y entrega digital instantánea",
      "Reinstalable en los mismos equipos ante formateos"
    ],
    compatibility: "Compatible con PC y Laptops arquitectura x64 (Windows 11 Pro + Office 2024)",
    badge: "🔥 COMBO 2 EN 1",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-m365",
    slug: "microsoft-365",
    name: "Microsoft 365",
    category: "office",
    price: 59.90,
    oldPrice: 89.90,
    duration: "1 año",
    rating: 4.9,
    reviews: 142,
    imageUrl: "/products/microsoft-365.webp",
    fallbackImage: "/products/microsoft-365.svg",
    description: "Suscripción digital con acceso a las aplicaciones y servicios incluidos en la modalidad comercializada.",
    cloudStorage: "100 GB en la nube",
    features: [
      "Aplicaciones completas de escritorio: Word, Excel, PowerPoint y Outlook",
      "100 GB de almacenamiento seguro en la nube OneDrive",
      "1 año completo de suscripción activa y garantizada",
      "Acceso y sincronización continua en PC, Mac, tablets y smartphones",
      "Actualizaciones continuas de características y parches de seguridad oficial",
      "Entrega digital instantánea con guía de activación paso a paso"
    ],
    compatibility: "Compatible con Windows 10, Windows 11, macOS, iOS y Android",
    badge: "1 AÑO",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-office-2024",
    slug: "office-professional-plus-2024",
    name: "Microsoft Office Professional Plus 2024",
    category: "office",
    price: 49.90,
    oldPrice: 79.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 218,
    imageUrl: "/products/office-2024.webp",
    fallbackImage: "/products/office-2024.svg",
    description: "La versión más moderna y completa de la suite ofimática de Microsoft. Incluye todas las aplicaciones profesionales con licencia perpetua para un equipo.",
    features: [
      "Incluye Word 2024, Excel 2024, PowerPoint 2024, Outlook 2024, Access y OneNote",
      "Licencia permanente de por vida (un solo pago, sin mensualidades ni renovaciones)",
      "Activación oficial directa en 1 PC con clave digital original",
      "Nuevas fórmulas dinámicas en Excel y herramientas visuales actualizadas",
      "Soporte multilenguaje oficial (incluye Español)",
      "Reinstalable en el mismo equipo ante formateos"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11 (ediciones de 32 y 64 bits)",
    badge: "TOP VENTAS",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-office-2021",
    slug: "office-professional-plus-2021",
    name: "Microsoft Office Professional Plus 2021",
    category: "office",
    price: 39.90,
    oldPrice: 65.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 324,
    imageUrl: "/products/office-2021.webp",
    fallbackImage: "/products/office-2021.svg",
    description: "La suite ofimática clásica favorita de empresas y profesionales que buscan estabilidad total, alto rendimiento y sin suscripciones recurrentes.",
    features: [
      "Suite completa: Word, Excel, PowerPoint, Outlook, Publisher y Access 2021",
      "Licencia perpetua de un solo pago para 1 computadora",
      "Integración nativa con Microsoft Teams para trabajo en equipo",
      "Función XLOOKUP (BUSCARX) y matrices dinámicas en Excel",
      "Activación digital permanente y garantizada",
      "Bajo consumo de recursos del sistema"
    ],
    compatibility: "Compatible exclusivamente con Windows 10 y Windows 11",
    badge: "MÁS VENDIDO",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-office-2019",
    slug: "office-professional-plus-2019",
    name: "Microsoft Office Professional Plus 2019",
    category: "office",
    price: 34.90,
    oldPrice: 55.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 189,
    imageUrl: "/products/office-2019.webp",
    fallbackImage: "/products/office-2019.svg",
    description: "Suite esencial para oficina y estudio con herramientas confiables y probadas para redacción, hojas de cálculo complejas y presentaciones de alto impacto.",
    features: [
      "Word 2019, Excel 2019, PowerPoint 2019, Outlook 2019 y Access",
      "Licencia permanente sin cuotas recurrentes",
      "Capacidad de dibujo digital y transiciones Morph (Transformación)",
      "Activación digital rápida y sencilla",
      "Excelente relación calidad-precio"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11",
    badge: "OFERTA",
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-office-2016",
    slug: "office-professional-plus-2016",
    name: "Microsoft Office Professional Plus 2016",
    category: "office",
    price: 29.90,
    oldPrice: 45.00,
    duration: "Permanente",
    rating: 4.7,
    reviews: 112,
    imageUrl: "/products/office-2016.webp",
    fallbackImage: "/products/office-2016.svg",
    description: "Solución ofimática económica y sumamente confiable para equipos de oficina, estudiantes y computadoras de trabajo estándar.",
    features: [
      "Word 2016, Excel 2016, PowerPoint 2016, Outlook 2016 y OneNote",
      "Licencia permanente para 1 PC",
      "Función de búsqueda inteligente '¿Qué desea hacer?'",
      "Muy liviano y rápido en ejecución"
    ],
    compatibility: "Compatible con Windows 7, Windows 8.1, Windows 10 y Windows 11",
    badge: undefined,
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-office-2010",
    slug: "office-professional-plus-2010",
    name: "Microsoft Office Professional Plus 2010",
    category: "office",
    price: 24.90,
    oldPrice: 39.00,
    duration: "Permanente",
    rating: 4.6,
    reviews: 87,
    imageUrl: "/products/office-2010.webp",
    fallbackImage: "/products/office-2010.svg",
    description: "Versión clásica y ultraligera para ordenadores con especificaciones técnicas limitadas o sistemas operativos anteriores.",
    warning: "Versión antigua. Verifica compatibilidad antes de comprar.",
    features: [
      "Word 2010, Excel 2010, PowerPoint 2010 y Access 2010",
      "Consumo mínimo de memoria RAM y procesador",
      "Licencia de por vida para 1 equipo",
      "Interfaz Ribbon clásica de Microsoft"
    ],
    compatibility: "Windows 7, Windows Vista, Windows XP (No recomendado para Windows 11)",
    badge: "CLÁSICO",
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-win11-pro",
    slug: "windows-11-pro",
    name: "Windows 11 Pro",
    category: "windows",
    price: 39.90,
    oldPrice: 69.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 380,
    imageUrl: "/products/windows-11-pro.webp",
    fallbackImage: "/products/windows-11-pro.svg",
    description: "El sistema operativo más avanzado de Microsoft diseñado para profesionales, creadores y empresas que exigen máxima seguridad, virtualización y rendimiento.",
    features: [
      "Cifrado de disco BitLocker de grado militar para proteger tus archivos",
      "Escritorio Remoto (RDP) oficial para conectarte a tu PC desde cualquier lugar",
      "Windows Sandbox para ejecutar programas sospechosos en entornos aislados",
      "Hyper-V y subsistema de Windows para Linux (WSL2)",
      "Unión a dominio corporativo y Azure Active Directory",
      "Activación permanente de por vida en 1 equipo"
    ],
    compatibility: "Requiere PC con procesador compatible de 64 bits y soporte TPM 2.0 / Secure Boot",
    badge: "MÁS VENDIDO",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-win11-home",
    slug: "windows-11-home",
    name: "Windows 11 Home",
    category: "windows",
    price: 34.90,
    oldPrice: 59.90,
    duration: "Permanente",
    rating: 4.8,
    reviews: 175,
    imageUrl: "/products/windows-11-home.webp",
    fallbackImage: "/products/windows-11-home.svg",
    description: "Experiencia moderna y fluida con interfaz renovada, perfecta para el hogar, estudiantes y entusiastas de los videojuegos en PC.",
    features: [
      "Diseño estilizado con menú Inicio centrado y diseño de ventanas Snap",
      "DirectStorage y Auto HDR para tiempos de carga ultrarrápidos en juegos",
      "Antivirus integrado Microsoft Defender sin costo extra",
      "Integración de widgets con clima, noticias y calendario",
      "Clave original para activación digital permanente"
    ],
    compatibility: "Requiere equipo de 64 bits con TPM 2.0 habilitado",
    badge: undefined,
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-win11-enterprise",
    slug: "windows-11-enterprise",
    name: "Windows 11 Enterprise",
    category: "windows",
    price: 49.90,
    oldPrice: 89.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 94,
    imageUrl: "/products/windows-11-enterprise.webp",
    fallbackImage: "/products/windows-11-enterprise.svg",
    description: "Edición diseñada para organizaciones y corporaciones que necesitan gestión avanzada de TI, políticas de grupo y máxima protección contra ciberataques.",
    features: [
      "Windows Defender Application Guard y Credential Guard",
      "Soporte completo para DirectAccess y BranchCache",
      "Control exhaustivo de actualizaciones y directivas de grupo (GPO)",
      "Telemetría controlada y modo quiosco para infraestructura corporativa",
      "Licencia digital permanente de activación única"
    ],
    compatibility: "Equipos empresariales con arquitectura x64 y TPM 2.0",
    badge: "EMPRESARIAL",
    bestSeller: false,
    featured: true
  },
  {
    id: "prod-win10-pro",
    slug: "windows-10-pro",
    name: "Windows 10 Pro",
    category: "windows",
    price: 29.90,
    oldPrice: 49.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 410,
    imageUrl: "/products/windows-10-pro.webp",
    fallbackImage: "/products/windows-10-pro.svg",
    description: "El sistema operativo más estable y compatible del mundo. Reconocido por su alta compatibilidad con software industrial, juegos y periféricos.",
    features: [
      "Protección de datos mediante cifrado de disco BitLocker",
      "Escritorio remoto incorporado de alta velocidad",
      "Compatibilidad total con software clásico de 32 bits y 64 bits",
      "Actualizaciones periódicas de estabilidad y soporte",
      "Activación digital permanente"
    ],
    compatibility: "Cualquier PC o laptop con procesador de 32 o 64 bits",
    badge: "MÁS VENDIDO",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-win10-home",
    slug: "windows-10-home",
    name: "Windows 10 Home",
    category: "windows",
    price: 24.90,
    oldPrice: 40.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 145,
    imageUrl: "/products/windows-10-home.webp",
    fallbackImage: "/products/windows-10-home.svg",
    description: "La edición confiable para uso doméstico, navegación web, trabajo escolar y entretenimiento diario.",
    features: [
      "Arranque veloz e inicio de sesión seguro con Windows Hello",
      "Navegador Microsoft Edge ultra eficiente",
      "Microsoft Defender Security Center",
      "Licencia digital permanente para 1 computadora"
    ],
    compatibility: "PC y notebooks con procesadores de 32 o 64 bits",
    badge: undefined,
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-win10-enterprise",
    slug: "windows-10-enterprise",
    name: "Windows 10 Enterprise",
    category: "windows",
    price: 39.90,
    oldPrice: 65.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 82,
    imageUrl: "/products/windows-10-enterprise.webp",
    fallbackImage: "/products/windows-10-enterprise.svg",
    description: "Edición orientada a empresas medianas y grandes que requieren estabilidad a largo plazo y máxima seguridad de red.",
    features: [
      "Gestión centralizada de dispositivos móviles y equipos",
      "Windows Defender Advanced Threat Protection (ATP)",
      "Compatibilidad con hardware industrial y servidores de trabajo",
      "Licencia permanente digital para 1 equipo"
    ],
    compatibility: "PC y terminales empresariales (32/64 bits)",
    badge: "EMPRESARIAL",
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-win8-pro",
    slug: "windows-8-1-pro",
    name: "Windows 8.1 Pro",
    category: "windows",
    price: 24.90,
    oldPrice: 39.90,
    duration: "Permanente",
    rating: 4.5,
    reviews: 63,
    imageUrl: "/products/windows-8-1-pro.webp",
    fallbackImage: "/products/windows-8-1-pro.svg",
    description: "Sistema operativo ligero optimizado para equipos de generación anterior y pantallas táctiles.",
    warning: "Versión antigua de Windows.",
    features: [
      "Interfaz de mosaicos vivos moderna con botón de inicio clásico",
      "BitLocker para protección de información confidencial",
      "Consumo sumamente bajo de memoria RAM",
      "Licencia permanente digital"
    ],
    compatibility: "Equipos clásicos con procesadores de 32 o 64 bits",
    badge: undefined,
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-win7-pro",
    slug: "windows-7-professional",
    name: "Windows 7 Professional",
    category: "windows",
    price: 19.90,
    oldPrice: 35.00,
    duration: "Permanente",
    rating: 4.7,
    reviews: 130,
    imageUrl: "/products/windows-7-professional.webp",
    fallbackImage: "/products/windows-7-professional.svg",
    description: "La edición legendaria con interfaz Aero Glass. Muy requerida para maquinaria de taller, software médico o programas que no admiten Windows 10/11.",
    warning: "Versión antigua de Windows.",
    features: [
      "Modo Windows XP para retrocompatibilidad con programas antiguos",
      "Interfaz visual Aero Glass icónica",
      "Estabilidad comprobada en sistemas cerrados o industriales",
      "Licencia permanente para 1 equipo"
    ],
    compatibility: "Equipos antiguos o dedicados de 32 o 64 bits",
    badge: undefined,
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-win7-ultimate",
    slug: "windows-7-ultimate",
    name: "Windows 7 Ultimate",
    category: "windows",
    price: 24.90,
    oldPrice: 40.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 98,
    imageUrl: "/products/windows-7-ultimate.webp",
    fallbackImage: "/products/windows-7-ultimate.svg",
    description: "La edición más completa y versátil de Windows 7. Reúne todas las herramientas de las ediciones Home Premium y Professional con soporte de 35 idiomas.",
    warning: "Versión antigua de Windows.",
    features: [
      "Incluye todas las características existentes en Windows 7",
      "Soporte multilingüe con paquetes de 35 idiomas integrados",
      "Cifrado BitLocker y subsistema para aplicaciones basadas en Unix",
      "Licencia digital permanente"
    ],
    compatibility: "Equipos antiguos o especializados (32 y 64 bits)",
    badge: undefined,
    bestSeller: false,
    featured: false
  },

  // MICROSOFT PROJECT PROFESSIONAL (2024, 2021, 2019)
  {
    id: "prod-project-2024",
    slug: "project-professional-2024",
    name: "Microsoft Project Professional 2024",
    category: "project-visio",
    price: 79.90,
    oldPrice: 149.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 58,
    imageUrl: "/products/project-2024.svg",
    fallbackImage: "/products/project-2024.svg",
    description: "La herramienta líder mundial para gestión de proyectos, diagramas de Gantt, presupuestos, rutas críticas y asignación de recursos en su versión 2024 más reciente.",
    features: [
      "Diagramas de Gantt dinámicos y automatización de cronogramas",
      "Control exhaustivo de presupuestos, costos y nivelación de recursos",
      "Plantillas predefinidas optimizadas para iniciar proyectos ágilmente",
      "Sincronización con Project Server y SharePoint",
      "Licencia perpetua de un solo pago para 1 computadora",
      "Activación oficial directa y permanente"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11 (32 y 64 bits)",
    badge: "PROYECTOS 2024",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-project-2021",
    slug: "project-professional-2021",
    name: "Microsoft Project Professional 2021",
    category: "project-visio",
    price: 69.90,
    oldPrice: 129.90,
    duration: "Permanente",
    rating: 4.8,
    reviews: 72,
    imageUrl: "/products/project-2021.svg",
    fallbackImage: "/products/project-2021.svg",
    description: "Gestione plazos, presupuestos y recursos con la máxima estabilidad. La versión predilecta por directores de obra, ingenieros y líderes de proyecto.",
    features: [
      "Líneas base de control de proyectos y análisis de valor ganado",
      "Programación de tareas flexible y seguimiento de hitos",
      "Generación de informes ejecutivos en tiempo real",
      "Licencia permanente sin cuotas mensuales",
      "Activación digital oficial 100% garantizada"
    ],
    compatibility: "Compatible exclusivamente con Windows 10 y Windows 11",
    badge: "PROYECTOS",
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-project-2019",
    slug: "project-professional-2019",
    name: "Microsoft Project Professional 2019",
    category: "project-visio",
    price: 59.90,
    oldPrice: 110.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 64,
    imageUrl: "/products/project-2019.svg",
    fallbackImage: "/products/project-2019.svg",
    description: "Solución consolidada de gestión y cronogramas para planificación estructurada de proyectos con excelente relación costo-beneficio.",
    features: [
      "Diagramación de tareas jerárquicas y dependencias",
      "Control de recursos de personal y materiales",
      "Menú desplegable para vinculación rápida de tareas",
      "Licencia permanente de por vida",
      "Entrega digital inmediata con soporte"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11",
    badge: "OFERTA",
    bestSeller: false,
    featured: false
  },

  // MICROSOFT VISIO PROFESSIONAL (2024, 2021, 2013)
  {
    id: "prod-visio-2024",
    slug: "visio-professional-2024",
    name: "Microsoft Visio Professional 2024",
    category: "project-visio",
    price: 79.90,
    oldPrice: 149.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 51,
    imageUrl: "/products/visio-2024.svg",
    fallbackImage: "/products/visio-2024.svg",
    description: "Cree diagramas de flujo avanzados, organigramas, esquemas de red, planos de planta y modelos de ingeniería con más de 250,000 formas actualizadas.",
    features: [
      "Decenas de miles de formas y plantillas modernas para diagramación",
      "Compatibilidad total con estándares BPMN 2.0, UML 2.5 e IEEE",
      "Vinculación en vivo de datos de diagramas con hojas de cálculo Excel",
      "Herramientas táctiles y de dibujo con lápiz digital",
      "Licencia perpetua de un solo pago para 1 equipo",
      "Activación oficial directa y permanente"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11 (32 y 64 bits)",
    badge: "DIAGRAMAS 2024",
    bestSeller: true,
    featured: true
  },
  {
    id: "prod-visio-2021",
    slug: "visio-professional-2021",
    name: "Microsoft Visio Professional 2021",
    category: "project-visio",
    price: 69.90,
    oldPrice: 120.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 67,
    imageUrl: "/products/visio-2021.svg",
    fallbackImage: "/products/visio-2021.svg",
    description: "Potente suite de diagramación técnica y empresarial. Diseñe mapas conceptuales, topologías de red e infraestructura IT con facilidad.",
    features: [
      "Amplia biblioteca de plantillas para redes, arquitectura y procesos",
      "Validación de diagramas y reglas empresariales integradas",
      "Exportación a formatos vectoriales SVG, PDF y alta resolución",
      "Licencia permanente para 1 computadora",
      "Activación digital instantánea y oficial"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11",
    badge: "DIAGRAMAS",
    bestSeller: false,
    featured: false
  },
  {
    id: "prod-visio-2013",
    slug: "visio-professional-2013",
    name: "Microsoft Visio Professional 2013",
    category: "project-visio",
    price: 45.00,
    oldPrice: 85.00,
    duration: "Permanente",
    rating: 4.7,
    reviews: 43,
    imageUrl: "/products/visio-2013.svg",
    fallbackImage: "/products/visio-2013.svg",
    description: "Versión clásica, ágil y de muy bajo consumo de recursos de Microsoft Visio. Ideal para equipos con hardware ligero y versiones anteriores de Windows.",
    features: [
      "Diagramación de procesos, mapas conceptuales y organigramas clásicos",
      "Bajo consumo de memoria RAM y arranque ultra rápido",
      "Soporte amplio en Windows 7, Windows 8.1, Windows 10 y Windows 11",
      "Licencia digital permanente de por vida",
      "Activación garantizada"
    ],
    compatibility: "Compatible con Windows 7, 8.1, 10 y 11 (32 y 64 bits)",
    badge: "CLÁSICO",
    bestSeller: false,
    featured: false
  }
];

// Helper to calculate cart totals and auto-discount:
// Reglas requeridas:
// - Si lleva 2 o más productos: descuento del 35% (no combinable)
// - Código promocional 'PRIMUPCLIC': 30% de descuento (expiración 30 días por apertura)
// - REGLA OBLIGATORIA: El descuento de 30% solo aplica desde S/ 39.90 de cada producto (si es menor no aplica)
export const MIN_PRICE_FOR_30_COUPON = 39.90;

export function calculateCartTotals(
  items: { product: Product; quantity: number }[],
  appliedCoupon?: string
): CartTotals {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cleanCoupon = appliedCoupon ? appliedCoupon.trim().toUpperCase() : '';
  const isCouponValid = cleanCoupon === PROMO_COUPON_CODE;
  const isMultiItem = totalQuantity >= 2;

  let discountRate = 0;
  let hasDiscount = false;
  let discountReason = '';
  let isMultiItemDiscount = false;
  let isCouponApplied = false;
  let discountAmount = 0;

  if (isMultiItem) {
    // 2 o más productos: 35% de descuento
    hasDiscount = true;
    discountRate = MULTI_ITEM_DISCOUNT; // 0.35
    isMultiItemDiscount = true;
    discountAmount = Number((subtotal * discountRate).toFixed(2));
    if (isCouponValid) {
      isCouponApplied = true;
      discountReason = '35% de descuento por llevar 2 o más productos (Cupón PRIMUPCLIC activo - descuentos no acumulables)';
    } else {
      discountReason = '35% de descuento por llevar 2 o más productos';
    }
  } else if (isCouponValid) {
    // Cupón PRIMUPCLIC 30%: solo aplica a productos con precio >= S/ 39.90
    const eligibleItems = items.filter(item => item.product.price >= MIN_PRICE_FOR_30_COUPON);
    const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (eligibleItems.length > 0) {
      hasDiscount = true;
      discountRate = PROMO_COUPON_DISCOUNT; // 0.30
      isCouponApplied = true;
      discountAmount = Number((eligibleSubtotal * discountRate).toFixed(2));
      discountReason = 'Cupón PRIMUPCLIC: 30% de descuento en productos desde S/ 39.90';
    } else {
      hasDiscount = false;
      discountRate = 0;
      discountAmount = 0;
      isCouponApplied = false;
      discountReason = 'El cupón del 30% solo aplica a productos con precio desde S/ 39.90 (no aplicable a productos de menor precio)';
    }
  }

  const total = Number(Math.max(0, subtotal - discountAmount).toFixed(2));

  return {
    totalQuantity,
    subtotal: Number(subtotal.toFixed(2)),
    hasDiscount,
    discountRate,
    discountAmount,
    total,
    discountReason,
    isMultiItemDiscount,
    isCouponApplied
  };
}

// Generate the exact WhatsApp confirmation message requested
export function buildWhatsAppMessage(
  items: { product: Product; quantity: number }[],
  appliedCoupon?: string
) {
  const { totalQuantity, subtotal, hasDiscount, discountRate, discountAmount, total, discountReason } = calculateCartTotals(items, appliedCoupon);
  
  const productLines = items
    .map(item => `• ${item.product.name} x${item.quantity} - S/ ${(item.product.price * item.quantity).toFixed(2)}`)
    .join('\n');

  let discountBlock = '';
  if (hasDiscount) {
    discountBlock = `\nSubtotal: S/ ${subtotal.toFixed(2)}\nDescuento (${(discountRate * 100).toFixed(0)}%): -S/ ${discountAmount.toFixed(2)} (${discountReason})\n`;
  }

  return `Hola UpClic, deseo confirmar mi compra.

Productos:
${productLines}

Cantidad total:
${totalQuantity}${discountBlock}
Monto total a pagar:
S/ ${total.toFixed(2)}

He realizado el pago y adjunto mi comprobante para la activación de mis licencias.`;
}

// Generate WhatsApp direct URL with encoded text
export function getWhatsAppConfirmationUrl(
  items: { product: Product; quantity: number }[],
  appliedCoupon?: string
) {
  const message = buildWhatsAppMessage(items, appliedCoupon);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Find product by slug or id
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug || p.id === slug);
}

// Smart Search Function with Prefix & Tokenized Matching:
// Permite ubicar el producto con solo escribir las primeras palabras o letras
// Ej: 'win' -> Windows, 'off' -> Office, 'vis' -> Visio, 'proj' -> Project, 'com' -> Combo, '11' -> Windows 11, '2024' -> versiones 2024
export function searchProducts(query: string, list: Product[] = products): Product[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return list;

  // Split query into tokens/words
  const tokens = clean.split(/\s+/).filter(Boolean);

  // Score each product for best match
  const scored = list.map(product => {
    const nameLower = product.name.toLowerCase();
    const slugLower = product.slug.toLowerCase();
    const catLower = product.category.toLowerCase();
    const descLower = product.description.toLowerCase();
    const words = nameLower.split(/[\s+-]+/).filter(Boolean);

    let score = 0;

    // Check tokens against product
    let allTokensMatch = true;

    for (const token of tokens) {
      // 1. Starts with token at the beginning of the full name
      if (nameLower.startsWith(token)) {
        score += 100;
      }
      // 2. Starts with token in ANY word of the product name (prefix match)
      else if (words.some(w => w.startsWith(token))) {
        score += 60;
      }
      // 3. Name contains token
      else if (nameLower.includes(token)) {
        score += 30;
      }
      // 4. Slug or category starts with or contains token
      else if (slugLower.startsWith(token) || catLower.startsWith(token)) {
        score += 20;
      }
      // 5. Description or badge contains token
      else if (descLower.includes(token) || (product.badge && product.badge.toLowerCase().includes(token))) {
        score += 10;
      } else {
        allTokensMatch = false;
      }
    }

    // Special abbreviations handling (e.g., w11 -> Windows 11, o24 -> Office 2024, pro -> Professional)
    if (clean === 'w11' && nameLower.includes('windows 11')) score += 80;
    if (clean === 'w10' && nameLower.includes('windows 10')) score += 80;
    if (clean === 'o24' && nameLower.includes('office') && nameLower.includes('2024')) score += 80;
    if (clean === 'p24' && nameLower.includes('project') && nameLower.includes('2024')) score += 80;
    if (clean === 'v24' && nameLower.includes('visio') && nameLower.includes('2024')) score += 80;

    return { product, score, allTokensMatch };
  });

  return scored
    .filter(item => item.allTokensMatch && item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}
