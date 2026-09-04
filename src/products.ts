import { Product, CartTotals } from './types.ts';

// Variable de atención UpClic para WhatsApp oficial
export const WHATSAPP_NUMBER = "51983204384";
export const WHATSAPP_DISPLAY = "+51 983 204 384";

// Código promocional oficial de apertura (10% de descuento en productos desde S/ 40.00, 30 días de vigencia)
export const PROMO_COUPON_CODE = "PRIMUPCLIC";
export const PROMO_COUPON_DISCOUNT = 0.10; // 10%
export const MULTI_ITEM_DISCOUNT = 0.10; // 10% si lleva 2 o más productos
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
    price: 46.50,
    oldPrice: 64.90,
    duration: "Permanente (2 Claves)",
    rating: 5.0,
    reviews: 164,
    imageUrl: "/products/combo-win11-office2024.webp",
    fallbackImage: "/products/combo-win11-office2024.png",
    description: "Paquete definitivo 2 en 1 con super ahorro. Incluye 1 Clave oficial para Windows 11 Pro 64-bit + 1 Clave oficial para Microsoft Office Professional Plus 2024 con activación permanente y garantía de 1 año.",
    features: [
      "1 Licencia original de Windows 11 Pro (32/64 bits) de activación permanente",
      "1 Licencia original de Office Professional Plus 2024 (Word, Excel, PowerPoint, Outlook, Access, OneNote)",
      "Activación oficial directa con garantía de 1 año",
      "Ahorro superior en combo respecto a la compra individual",
      "Soporte prioritario y entrega digital instantánea",
      "Reinstalable en los mismos equipos ante formateos"
    ],
    compatibility: "Compatible con PC y Laptops arquitectura x64 (Windows 11 Pro + Office 2024)",
    badge: "🔥 COMBO 2 EN 1",
    bestSeller: true,
    featured: true,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img",
    downloadLabel: "Descargar Imagen Office 2024 (.IMG)",
    isoFormat: "Imagen (.IMG) Office 2024 + ISO Windows 11 Oficial Microsoft",
    installationSteps: [
      "Paso 1: Para Windows 11, descargue la imagen ISO oficial desde Microsoft (microsoft.com/software-download/windows11) o use la herramienta oficial en un USB.",
      "Paso 2: Instale o actualice a Windows 11 Pro en su computadora y active en: Inicio > Configuración > Sistema > Activación con la primera clave provista.",
      "Paso 3: Para Office 2024, pulse el botón de descarga para bajar la imagen oficial (.IMG) directamente de los servidores CDN de Microsoft.",
      "Paso 4: Haga doble clic en el archivo .IMG descargado para montarlo y ejecute 'Setup.exe'.",
      "Paso 5: Al terminar la instalación, abra Word o Excel e introduzca la segunda clave de 25 caracteres para activar permanentemente su suite."
    ]
  },
  {
    id: "prod-m365",
    slug: "microsoft-365",
    name: "Microsoft Office 365 Profesional Cuenta 1 año",
    category: "office",
    price: 46.50,
    oldPrice: 79.90,
    duration: "1 año",
    rating: 4.9,
    reviews: 142,
    imageUrl: "/products/microsoft-365.webp",
    fallbackImage: "/products/microsoft-365.png",
    description: "Suscripción oficial a Microsoft Office 365 Profesional Cuenta 1 año. Modalidad de acceso por cuenta oficial: este producto no se entrega mediante clave alfanumérica (key), sino mediante una cuenta oficial de Microsoft con correo electrónico y contraseña asignados a su dominio para iniciar sesión en portal.office.com y descargar las aplicaciones en hasta 5 dispositivos (PC, Mac, tablets o smartphones), con 100 GB de almacenamiento en la nube OneDrive y actualizaciones continuas durante todo el periodo.",
    cloudStorage: "100 GB en la nube",
    badge: "1 AÑO - 100 GB",
    isAccountAccess: true,
    features: [
      "Acceso directo por cuenta oficial asignada a su dominio en portal.office.com",
      "Se le enviará el correo electrónico y la contraseña oficial de inicio de sesión",
      "Aplicaciones completas de escritorio: Word, Excel, PowerPoint, Outlook y OneNote",
      "100 GB de almacenamiento en la nube OneDrive garantizado",
      "Acceso y sincronización en PC, Mac, tablets y smartphones (hasta 5 equipos simultáneos)",
      "Actualizaciones continuas y oficiales de Microsoft durante el año de suscripción",
      "Entrega digital inmediata con garantía de soporte"
    ],
    compatibility: "Compatible con Windows 10, Windows 11, macOS, iOS y Android",
    bestSeller: true,
    featured: true,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/O365ProPlusRetail.img",
    downloadLabel: "Descargar Instalador Office 365 (.IMG) Oficial",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN + Portal portal.office.com",
    installationSteps: [
      "Paso 1: Una vez confirmado su pago, le enviaremos sus credenciales oficiales (correo y clave) asignadas a su dominio.",
      "Paso 2: Ingrese a portal.office.com e inicie sesión con las credenciales provistas.",
      "Paso 3: En el panel principal de bienvenida de Microsoft 365, presione el botón superior 'Instalar aplicaciones' o descargue la imagen oficial .IMG provista.",
      "Paso 4: Ejecute el instalador descargado para instalar Word, Excel, PowerPoint y Outlook.",
      "Paso 5: Abra cualquiera de las aplicaciones instaladas e inicie sesión con su cuenta para activar su licencia y OneDrive."
    ]
  },
  {
    id: "prod-office-2024",
    slug: "office-professional-plus-2024",
    name: "Microsoft Office Professional Plus 2024",
    category: "office",
    price: 25.00,
    oldPrice: 59.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 218,
    imageUrl: "/products/office-2024.webp",
    fallbackImage: "/products/office-2024.png",
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
    featured: true,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2024Retail.img",
    downloadLabel: "Descargar Imagen Oficial Office 2024 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar Imagen Oficial' para obtener el archivo .IMG original desde los servidores oficiales de Microsoft.",
      "Paso 2: Una vez finalizada la descarga, haga doble clic sobre el archivo descargado para montarlo (o clic derecho > 'Montar').",
      "Paso 3: Dentro de la unidad montada, abra el archivo 'Setup.exe' y espere a que la instalación concluya.",
      "Paso 4: Abra cualquier programa de la suite, como Microsoft Word o Excel.",
      "Paso 5: En la ventana de activación, ingrese su clave de producto original de 25 caracteres y presione 'Activar producto'."
    ]
  },
  {
    id: "prod-office-2021",
    slug: "office-professional-plus-2021",
    name: "Microsoft Office Professional Plus 2021",
    category: "office",
    price: 24.00,
    oldPrice: 49.90,
    duration: "Permanente",
    rating: 4.8,
    reviews: 324,
    imageUrl: "/products/office-2021.webp",
    fallbackImage: "/products/office-2021.png",
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
    featured: true,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2021Retail.img",
    downloadLabel: "Descargar Imagen Oficial Office 2021 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Descargue el archivo de instalación oficial (.IMG) de Office 2021 Pro Plus con el botón de descarga.",
      "Paso 2: Al descargarse, haga doble clic sobre el archivo para montarlo en Windows 10 u 11.",
      "Paso 3: Ejecute el archivo 'Setup.exe' que aparece en la unidad y permita que la instalación finalice.",
      "Paso 4: Inicie Microsoft Word o Excel.",
      "Paso 5: Introduzca la clave digital de 25 dígitos que le entregamos para la activación permanente de por vida."
    ]
  },
  {
    id: "prod-office-2019",
    slug: "office-professional-plus-2019",
    name: "Microsoft Office Professional Plus 2019",
    category: "office",
    price: 23.00,
    oldPrice: 45.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 189,
    imageUrl: "/products/office-2019.webp",
    fallbackImage: "/products/office-2019.png",
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
    featured: false,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProPlus2019Retail.img",
    downloadLabel: "Descargar Imagen Oficial Office 2019 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Pulse 'Descargar Imagen Oficial' para descargar la imagen .IMG oficial de Microsoft Office 2019.",
      "Paso 2: Abra el archivo descargado haciendo doble clic (Windows lo abrirá como si fuera un disco).",
      "Paso 3: Haga doble clic en 'Setup.exe' para iniciar el instalador.",
      "Paso 4: Al finalizar, abra Word 2019 y pulse en 'Cuenta'.",
      "Paso 5: Ingrese su clave de activación de 25 caracteres para validar la licencia perpetua."
    ]
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
    fallbackImage: "/products/office-2016.png",
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
    featured: false,
    downloadUrl: "https://officecdn.microsoft.com/pr/39168D7E-077B-48E7-8728-0E25E0E51512/media/es-es/ProPlusRetail.img",
    downloadLabel: "Descargar Imagen Oficial Office 2016 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Descargue el instalador oficial en formato .IMG pulsando el botón de descarga.",
      "Paso 2: Monte el archivo .IMG en su explorador de Windows o extráigalo.",
      "Paso 3: Ejecute 'Setup.exe' y espere la instalación de los programas de Office 2016.",
      "Paso 4: Inicie Word 2016 o Excel 2016.",
      "Paso 5: Escriba su clave de 25 caracteres cuando el asistente de activación lo solicite."
    ]
  },
  {
    id: "prod-office-2013",
    slug: "office-professional-plus-2013",
    name: "Microsoft Office Professional Plus 2013",
    category: "office",
    price: 27.90,
    oldPrice: 42.00,
    duration: "Permanente",
    rating: 4.7,
    reviews: 98,
    imageUrl: "/products/office-2013.webp",
    fallbackImage: "/products/office-2013.png",
    description: "Paquete ofimático confiable y ligero con interfaz moderna y optimizada para equipos con recursos moderados.",
    features: [
      "Word 2013, Excel 2013, PowerPoint 2013, Outlook 2013 y OneNote",
      "Licencia permanente para 1 PC",
      "Modo lectura mejorado y compatibilidad con documentos PDF",
      "Bajo consumo de memoria RAM y rendimiento fluido"
    ],
    compatibility: "Compatible con Windows 7, Windows 8.1, Windows 10 y Windows 11",
    badge: undefined,
    bestSeller: false,
    featured: false,
    downloadUrl: "https://archive.org/download/office-2013-sp1-proplus-spanish/es_office_professional_plus_2013_with_sp1_x64_dvd_3928788.iso",
    downloadLabel: "Descargar ISO Directa Office 2013 SP1 (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial SP1 en Español",
    installationSteps: [
      "Paso 1: Descargue el instalador oficial en formato .ISO mediante el botón provisto.",
      "Paso 2: Monte o descomprima el archivo ISO descargado en su equipo.",
      "Paso 3: Ejecute el archivo 'Setup.exe' y complete la instalación.",
      "Paso 4: Abra cualquier aplicación como Word 2013 o Excel 2013.",
      "Paso 5: Ingrese la clave de activación de 25 caracteres para validar su licencia permanente."
    ]
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
    fallbackImage: "/products/office-2010.png",
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
    featured: false,
    downloadUrl: "https://archive.org/download/Microsoft_Office_2010_Pro_Plus_10_LANG/es_office_professional_plus_2010_x86_x64_dvd_515085.iso",
    downloadLabel: "Descargar ISO Directa Office 2010 (Español)",
    isoFormat: "Descarga Directa ISO Oficial en Español (x86/x64)",
    installationSteps: [
      "Paso 1: Descargue la imagen ISO oficial de Microsoft Office 2010 mediante el botón de descarga.",
      "Paso 2: Monte o descomprima la ISO y ejecute 'Setup.exe' e ingrese su clave original de 25 caracteres provista.",
      "Paso 3: Seleccione los componentes que desea instalar (Word, Excel, PowerPoint, Access).",
      "Paso 4: Complete la instalación y verifique en Archivo > Ayuda que figure con licencia permanente."
    ]
  },
  {
    id: "prod-win11-pro",
    slug: "windows-11-pro",
    name: "Windows 11 Pro",
    category: "windows",
    price: 25.00,
    oldPrice: 49.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 380,
    imageUrl: "/products/windows-11-pro.webp",
    fallbackImage: "/products/windows-11-pro.png",
    description: "El sistema operativo más avanzado de Microsoft diseñado para profesionales, creadores y empresas que exigen máxima seguridad, estabilidad y rendimiento.\n\nTipos de Claves disponibles:\n• Clave OEM (S/ 25.00): Licencia original que se vincula permanentemente a la placa madre (Motherboard) de su equipo PC o Laptop. Es la opción más económica e ideal para 1 equipo, permitiendo reinstalaciones y formateos ilimitados en la misma máquina sin perder la activación.\n• Clave Retail (S/ 30.00): Licencia original oficial transferible de Microsoft. Se vincula a su hardware o cuenta Microsoft y cuenta con la ventaja de poder ser transferida a otra PC o Laptop en caso de renovar o cambiar su equipo en el futuro (1 equipo activo a la vez).",
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
    featured: true,
    variants: [
      {
        id: "oem",
        name: "Clave tipo OEM",
        type: "OEM",
        price: 25.00,
        oldPrice: 45.00,
        badge: "Económica",
        shortDesc: "Vinculada a placa madre del equipo. Reinstalable de por vida en la misma PC tras formateos."
      },
      {
        id: "retail",
        name: "Clave Retail",
        type: "Retail",
        price: 30.00,
        oldPrice: 55.00,
        badge: "Transferible",
        shortDesc: "Licencia transferible entre equipos. Se vincula a cuenta o hardware y permite migrar a otra PC en el futuro."
      }
    ],
    downloadUrl: "https://archive.org/download/win-11-24-h-2-spanish-x-64/Win11_24H2_Spanish_x64.iso",
    downloadLabel: "Descargar ISO Directa Windows 11 (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial en Español (x64)",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar ISO Directa' para descargar la imagen ISO oficial en español.",
      "Paso 2: Grabe la ISO en una unidad USB (mínimo 8 GB) usando herramientas estándar como Rufus o Ventoy.",
      "Paso 3: Si ya tiene Windows 11 Home, puede subir directamente a Pro ingresando la clave sin reinstalar.",
      "Paso 4: Para activar: Diríjase a Inicio > Configuración > Sistema > Activación.",
      "Paso 5: Haga clic en 'Cambiar la clave de producto', escriba su clave original de 25 caracteres y presione 'Activar'."
    ]
  },
  {
    id: "prod-win11-home",
    slug: "windows-11-home",
    name: "Windows 11 Home",
    category: "windows",
    price: 23.50,
    oldPrice: 45.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 175,
    imageUrl: "/products/windows-11-home.webp",
    fallbackImage: "/products/windows-11-home.png",
    description: "Experiencia moderna y fluida con interfaz renovada, perfecta para el hogar, estudiantes y entusiastas de los videojuegos en PC.\n\nTipos de Claves disponibles:\n• Clave OEM (S/ 23.50): Licencia original vinculada a la placa madre de su PC o laptop. Permite reinstalaciones ilimitadas en el mismo equipo ante formateos.\n• Clave Retail (S/ 27.00): Licencia original transferible de Microsoft. Permite transferir la activación si cambia de equipo en el futuro.",
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
    featured: false,
    variants: [
      {
        id: "oem",
        name: "Clave tipo OEM",
        type: "OEM",
        price: 23.50,
        oldPrice: 45.00,
        badge: "Económica",
        shortDesc: "Vinculada a placa madre del equipo. Reinstalable de por vida en la misma PC tras formateos."
      },
      {
        id: "retail",
        name: "Clave Retail",
        type: "Retail",
        price: 27.00,
        oldPrice: 55.00,
        badge: "Transferible",
        shortDesc: "Licencia transferible entre equipos. Se vincula a cuenta o hardware y permite migrar a otra PC en el futuro."
      }
    ],
    downloadUrl: "https://archive.org/download/win-11-24-h-2-spanish-x-64/Win11_24H2_Spanish_x64.iso",
    downloadLabel: "Descargar ISO Directa Windows 11 Home (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial en Español (x64)",
    installationSteps: [
      "Paso 1: Descargue la ISO oficial de Windows 11 directamente mediante el botón de descarga.",
      "Paso 2: Grabe la ISO en un pendrive USB con la herramienta Rufus o Media Creation Tool.",
      "Paso 3: Inicie su equipo desde el USB e instale Windows 11 Home.",
      "Paso 4: Vaya a Inicio > Configuración > Sistema > Activación.",
      "Paso 5: Ingrese su clave de 25 caracteres para activar permanentemente."
    ]
  },
  {
    id: "prod-win11-enterprise",
    slug: "windows-11-enterprise",
    name: "Windows 11 Enterprise",
    category: "windows",
    price: 35.00,
    oldPrice: 59.00,
    duration: "Permanente",
    rating: 4.9,
    reviews: 94,
    imageUrl: "/products/windows-11-enterprise.webp",
    fallbackImage: "/products/windows-11-enterprise.png",
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
    featured: true,
    downloadUrl: "https://archive.org/download/win-11-24-h-2-spanish-x-64/Win11_24H2_Spanish_x64.iso",
    downloadLabel: "Descargar ISO Directa Windows 11 Enterprise",
    isoFormat: "Descarga Directa ISO Oficial (x64) Español",
    installationSteps: [
      "Paso 1: Descargue la ISO de Windows 11 directamente mediante el botón de descarga provisto.",
      "Paso 2: Cree el medio de instalación en un USB o aplique la imagen en su servidor de despliegue.",
      "Paso 3: Instale Windows 11 Enterprise en los equipos de su red.",
      "Paso 4: Ingrese a Configuración > Sistema > Activación.",
      "Paso 5: Ingrese su clave de activación empresarial permanente."
    ]
  },
  {
    id: "prod-win10-pro",
    slug: "windows-10-pro",
    name: "Windows 10 Pro",
    category: "windows",
    price: 28.00,
    oldPrice: 45.00,
    duration: "Permanente",
    rating: 4.9,
    reviews: 410,
    imageUrl: "/products/windows-10-pro.webp",
    fallbackImage: "/products/windows-10-pro.png",
    description: "El sistema operativo más estable y compatible del mundo. Reconocido por su alta compatibilidad con software industrial, juegos y periféricos.\n\nTipos de Claves disponibles:\n• Clave OEM (S/ 28.00): Licencia original que se vincula permanentemente a la placa madre (Motherboard) de su equipo PC o Laptop. Es la opción más económica e ideal para 1 equipo, permitiendo reinstalaciones y formateos ilimitados en la misma máquina sin perder la activación.\n• Clave Retail (S/ 30.00): Licencia original oficial transferible de Microsoft. Se vincula a su hardware o cuenta Microsoft y cuenta con la ventaja de poder ser transferida a otra PC o Laptop en caso de renovar o cambiar su equipo en el futuro (1 equipo activo a la vez).",
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
    featured: true,
    variants: [
      {
        id: "oem",
        name: "Clave tipo OEM",
        type: "OEM",
        price: 28.00,
        oldPrice: 40.00,
        badge: "Económica",
        shortDesc: "Vinculada a placa madre del equipo. Reinstalable de por vida en la misma PC tras formateos."
      },
      {
        id: "retail",
        name: "Clave Retail",
        type: "Retail",
        price: 30.00,
        oldPrice: 50.00,
        badge: "Transferible",
        shortDesc: "Licencia transferible entre equipos. Se vincula a cuenta o hardware y permite migrar a otra PC en el futuro."
      }
    ],
    downloadUrl: "https://archive.org/download/windows-10-22h2-multi-edition-iso/Windows%2010%20v.22H2/Win10_22H2_Spanish/Win10_22H2_Spanish_x64v1.iso",
    downloadLabel: "Descargar ISO Directa Windows 10 Pro (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial en Español (x64)",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar ISO Directa' para descargar la imagen ISO oficial 22H2 en español.",
      "Paso 2: Cree una unidad USB booteable con Rufus o grabe la imagen en un medio físico.",
      "Paso 3: Si ya tiene Windows 10 Home instalado, no necesita reinstalar: ingrese la clave directamente en Activación para actualizar a Pro.",
      "Paso 4: Abra Inicio > Configuración > Actualización y seguridad > Activación.",
      "Paso 5: Haga clic en 'Cambiar clave de producto' e ingrese su clave de 25 caracteres para activar permanentemente."
    ]
  },
  {
    id: "prod-win10-home",
    slug: "windows-10-home",
    name: "Windows 10 Home",
    category: "windows",
    price: 25.00,
    oldPrice: 40.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 145,
    imageUrl: "/products/windows-10-home.webp",
    fallbackImage: "/products/windows-10-home.png",
    description: "La edición confiable para uso doméstico, navegación web, trabajo escolar y entretenimiento diario.\n\nTipos de Claves disponibles:\n• Clave OEM (S/ 25.00): Licencia original vinculada a la placa madre de su equipo. Permite reinstalaciones ilimitadas en la misma PC ante formateos.\n• Clave Retail (S/ 28.00): Licencia original transferible de Microsoft en caso de renovar equipo.",
    features: [
      "Arranque veloz e inicio de sesión seguro con Windows Hello",
      "Navegador Microsoft Edge ultra eficiente",
      "Microsoft Defender Security Center",
      "Licencia digital permanente para 1 computadora"
    ],
    compatibility: "PC y notebooks con procesadores de 32 o 64 bits",
    badge: undefined,
    bestSeller: false,
    featured: false,
    variants: [
      {
        id: "oem",
        name: "Clave tipo OEM",
        type: "OEM",
        price: 25.00,
        oldPrice: 40.00,
        badge: "Económica",
        shortDesc: "Vinculada a placa madre del equipo. Reinstalable de por vida en la misma PC tras formateos."
      },
      {
        id: "retail",
        name: "Clave Retail",
        type: "Retail",
        price: 28.00,
        oldPrice: 50.00,
        badge: "Transferible",
        shortDesc: "Licencia transferible entre equipos. Se vincula a cuenta o hardware y permite migrar a otra PC en el futuro."
      }
    ],
    downloadUrl: "https://archive.org/download/windows-10-22h2-multi-edition-iso/Windows%2010%20v.22H2/Win10_22H2_Spanish/Win10_22H2_Spanish_x64v1.iso",
    downloadLabel: "Descargar ISO Directa Windows 10 Home (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial en Español (x64)",
    installationSteps: [
      "Paso 1: Descargue la ISO oficial de Windows 10 directamente mediante el botón de descarga.",
      "Paso 2: Cree el pendrive de instalación e instale Windows 10 Home en su equipo.",
      "Paso 3: Vaya a Configuración > Actualización y seguridad > Activación.",
      "Paso 4: Ingrese su clave digital de 25 caracteres para activar de por vida."
    ]
  },
  {
    id: "prod-win10-enterprise",
    slug: "windows-10-enterprise",
    name: "Windows 10 Enterprise",
    category: "windows",
    price: 33.00,
    oldPrice: 55.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 82,
    imageUrl: "/products/windows-10-enterprise.webp",
    fallbackImage: "/products/windows-10-enterprise.png",
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
    featured: false,
    downloadUrl: "https://archive.org/download/windows-10-22h2-multi-edition-iso/Windows%2010%20v.22H2/Win10_22H2_Spanish/Win10_22H2_Spanish_x64v1.iso",
    downloadLabel: "Descargar ISO Directa Windows 10 Enterprise",
    isoFormat: "Descarga Directa ISO Oficial (x64) Español",
    installationSteps: [
      "Paso 1: Descargue la imagen ISO oficial de Windows 10 mediante el botón provisto.",
      "Paso 2: Instale la edición Enterprise en su equipo de trabajo o servidor.",
      "Paso 3: Diríjase a Configuración > Actualización y seguridad > Activación e ingrese la clave provista."
    ]
  },
  {
    id: "prod-win8-pro",
    slug: "windows-8-1-pro",
    name: "Windows 8.1 Pro",
    category: "windows",
    price: 54.00,
    oldPrice: 79.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 78,
    imageUrl: "/products/windows-8-1-pro.webp",
    fallbackImage: "/products/windows-8-1-pro.png",
    description: "Sistema operativo ligero optimizado para equipos de generación anterior y pantallas táctiles.",
    warning: "Versión antigua de Windows.",
    features: [
      "Interfaz de mosaicos vivos moderna con botón de inicio clásico",
      "BitLocker para protección de información confidencial",
      "Consumo sumamente bajo de memoria RAM",
      "Licencia permanente digital"
    ],
    compatibility: "Equipos clásicos con procesadores de 32 o 64 bits",
    badge: "OFERTA",
    bestSeller: false,
    featured: false,
    downloadUrl: "https://archive.org/download/windows-8.1-core-pro-update-3-win-8.1-spanish-x-64/Windows%208.1%20Core-Pro%20Update%203---Win8.1_Spanish_x64.iso",
    downloadLabel: "Descargar ISO Directa Windows 8.1 Pro (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial (64 bits - Español)",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar ISO Directa' para bajar el instalador oficial en formato .iso.",
      "Paso 2: Grabe la ISO en un pendrive USB (mediante Rufus o Ventoy) o DVD.",
      "Paso 3: Instale el sistema y active con su clave de 25 caracteres en Configuración del PC > Activar Windows."
    ]
  },
  {
    id: "prod-win7-pro",
    slug: "windows-7-professional",
    name: "Windows 7 Professional",
    category: "windows",
    price: 31.00,
    oldPrice: 50.00,
    duration: "Permanente",
    rating: 4.7,
    reviews: 130,
    imageUrl: "/products/windows-7-professional.webp",
    fallbackImage: "/products/windows-7-professional.png",
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
    featured: false,
    downloadUrl: "https://archive.org/download/Win7ProSP1ESP/es_windows_7_professional_with_sp1_x64_dvd_u_676947.iso",
    downloadLabel: "Descargar ISO Directa Windows 7 Pro SP1 (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial SP1 (64 bits - Español)",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar instalador' para descargar el archivo .iso oficial de Windows 7 Professional SP1 en Español.",
      "Paso 2: Cree un USB de arranque con Rufus e instale Windows 7 en su computadora (PC o laptop).",
      "Paso 3: Haga clic derecho en 'Equipo' > 'Propiedades'.",
      "Paso 4: En la parte inferior, haga clic en 'Activar Windows ahora' e ingrese su clave original de 25 caracteres."
    ]
  },
  {
    id: "prod-win7-ultimate",
    slug: "windows-7-ultimate",
    name: "Windows 7 Ultimate",
    category: "windows",
    price: 32.00,
    oldPrice: 55.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 98,
    imageUrl: "/products/windows-7-ultimate.webp",
    fallbackImage: "/products/windows-7-ultimate.png",
    description: "La edición más completa y versátil de Windows 7. Reúne todas las herramientas de las ediciones Home Premium y Professional con soporte de 35 idiomas.",
    warning: "Versión antigua de Windows.",
    features: [
      "Incluye todas las características existentes en Windows 7",
      "Soporte multilingüe con paquetes de 35 idiomas integrados",
      "Cifrado BitLocker y subsistema para aplicaciones basadas en Unix",
      "Licencia digital permanente para 1 PC"
    ],
    compatibility: "Equipos antiguos o especializados (32 y 64 bits)",
    badge: undefined,
    bestSeller: false,
    featured: false,
    downloadUrl: "https://archive.org/download/Win7UltimateSP1ESP/es_windows_7_ultimate_with_sp1_x64_dvd_u_677350.iso",
    downloadLabel: "Descargar ISO Directa Windows 7 Ultimate SP1 (64 bits)",
    isoFormat: "Descarga Directa ISO Oficial SP1 Multilenguaje (64 bits - Español)",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar instalador' para iniciar la descarga inmediata del archivo .iso oficial de Windows 7 Ultimate SP1.",
      "Paso 2: Instale la edición Ultimate en su computadora (PC o laptop).",
      "Paso 3: Ingrese a Propiedades del sistema y active con su clave de 25 caracteres."
    ]
  },

  // MICROSOFT PROJECT PROFESSIONAL (2024, 2021, 2019)
  {
    id: "prod-project-2024",
    slug: "project-professional-2024",
    name: "Microsoft Project Professional 2024",
    category: "project-visio",
    price: 35.00,
    oldPrice: 69.90,
    duration: "Permanente",
    rating: 4.9,
    reviews: 58,
    imageUrl: "/products/project-2024.webp",
    fallbackImage: "/products/project-2024.png",
    description: "La herramienta líder mundial para gestión de proyectos, diagramas de Gantt, presupuestos, rutas críticas y asignación de recursos en su versión 2024 con garantía oficial por 1 año.",
    features: [
      "Diagramas de Gantt dinámicos y automatización de cronogramas",
      "Control exhaustivo de presupuestos, costos y nivelación de recursos",
      "Plantillas predefinidas optimizadas para iniciar proyectos ágilmente",
      "Sincronización con Project Server y SharePoint",
      "Licencia perpetua de un solo pago para 1 computadora",
      "Activación oficial directa con garantía de 1 año"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11 (32 y 64 bits)",
    badge: "PROYECTOS 2024",
    bestSeller: true,
    featured: true,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2024Retail.img",
    downloadLabel: "Descargar Imagen Oficial Project 2024 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar Imagen Oficial' para descargar la imagen oficial .IMG desde los servidores de Microsoft.",
      "Paso 2: Haga doble clic sobre el archivo .IMG descargado para explorarlo y montarlo.",
      "Paso 3: Abra 'Setup.exe' para iniciar la instalación.",
      "Paso 4: Al terminar, abra Microsoft Project 2024.",
      "Paso 5: Escriba su clave de activación de 25 caracteres provista para dejarlo activado de por vida."
    ]
  },
  {
    id: "prod-project-2021",
    slug: "project-professional-2021",
    name: "Microsoft Project Professional 2021",
    category: "project-visio",
    price: 30.00,
    oldPrice: 59.90,
    duration: "Permanente",
    rating: 4.8,
    reviews: 72,
    imageUrl: "/products/project-2021.webp",
    fallbackImage: "/products/project-2021.png",
    description: "Gestione plazos, presupuestos y recursos con la máxima estabilidad. La versión predilecta por directores de obra, ingenieros y líderes de proyecto.",
    features: [
      "Líneas base de control de proyectos y análisis de valor ganado",
      "Programación de tareas flexible y seguimiento de hitos",
      "Generación de informes ejecutivos en tiempo real",
      "Licencia permanente sin cuotas mensuales",
      "Activación digital oficial con garantía de 1 año"
    ],
    compatibility: "Compatible exclusivamente con Windows 10 y Windows 11",
    badge: "PROYECTOS",
    bestSeller: false,
    featured: false,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2021Retail.img",
    downloadLabel: "Descargar Imagen Oficial Project 2021 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Descargue el archivo de instalación .IMG oficial mediante el botón de descarga.",
      "Paso 2: Monte el archivo .IMG con doble clic.",
      "Paso 3: Ejecute 'Setup.exe' y aguarde a que finalice.",
      "Paso 4: Abra Project 2021 e introduzca su clave de activación permanente de 25 caracteres."
    ]
  },
  {
    id: "prod-project-2019",
    slug: "project-professional-2019",
    name: "Microsoft Project Professional 2019",
    category: "project-visio",
    price: 32.00,
    oldPrice: 55.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 64,
    imageUrl: "/products/project-2019.webp",
    fallbackImage: "/products/project-2019.png",
    description: "Solución consolidada de gestión y cronogramas para planificación estructurada de proyectos con excelente relación costo-beneficio.",
    features: [
      "Diagramación de tareas jerárquicas y dependencias",
      "Control de recursos de personal y materiales",
      "Menú desplegable para vinculación rápida de tareas",
      "Licencia permanente con garantía oficial por 1 año",
      "Entrega digital inmediata con soporte"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11",
    badge: "OFERTA",
    bestSeller: false,
    featured: false,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/ProjectPro2019Retail.img",
    downloadLabel: "Descargar Imagen Oficial Project 2019 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Descargue la imagen oficial .IMG desde el botón de descarga.",
      "Paso 2: Abra el archivo .IMG descargado y ejecute 'Setup.exe'.",
      "Paso 3: Al concluir la instalación, inicie Project 2019 e ingrese la clave de activación provista."
    ]
  },

  // MICROSOFT VISIO PROFESSIONAL (2024, 2021, 2013)
  {
    id: "prod-visio-2024",
    slug: "visio-professional-2024",
    name: "Microsoft Visio Professional 2024",
    category: "project-visio",
    price: 30.00,
    oldPrice: 65.00,
    duration: "Permanente",
    rating: 4.9,
    reviews: 51,
    imageUrl: "/products/visio-2024.webp",
    fallbackImage: "/products/visio-2024.png",
    description: "Cree diagramas de flujo avanzados, organigramas, esquemas de red, planos de planta y modelos de ingeniería con más de 250,000 formas actualizadas.",
    features: [
      "Decenas de miles de formas y plantillas modernas para diagramación",
      "Compatibilidad total con estándares BPMN 2.0, UML 2.5 e IEEE",
      "Vinculación en vivo de datos de diagramas con hojas de cálculo Excel",
      "Herramientas táctiles y de dibujo con lápiz digital",
      "Licencia perpetua de un solo pago para 1 equipo",
      "Activación oficial directa con garantía de 1 año"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11 (32 y 64 bits)",
    badge: "DIAGRAMAS 2024",
    bestSeller: true,
    featured: true,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2024Retail.img",
    downloadLabel: "Descargar Imagen Oficial Visio 2024 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Haga clic en 'Descargar Imagen Oficial' para descargar la imagen oficial .IMG de Microsoft Visio 2024.",
      "Paso 2: Haga doble clic sobre el archivo descargado para montarlo en Windows.",
      "Paso 3: Ejecute 'Setup.exe' y espere que la instalación termine.",
      "Paso 4: Abra Visio 2024.",
      "Paso 5: Escriba su clave de 25 caracteres para activar permanentemente su licencia."
    ]
  },
  {
    id: "prod-visio-2021",
    slug: "visio-professional-2021",
    name: "Microsoft Visio Professional 2021",
    category: "project-visio",
    price: 32.00,
    oldPrice: 60.00,
    duration: "Permanente",
    rating: 4.8,
    reviews: 67,
    imageUrl: "/products/visio-2021.webp",
    fallbackImage: "/products/visio-2021.png",
    description: "Potente suite de diagramación técnica y empresarial. Diseñe mapas conceptuales, topologías de red e infraestructura IT con facilidad.",
    features: [
      "Amplia biblioteca de plantillas para redes, arquitectura y procesos",
      "Validación de diagramas y reglas empresariales integradas",
      "Exportación a formatos vectoriales SVG, PDF y alta resolución",
      "Licencia permanente para 1 computadora",
      "Activación digital instantánea con garantía de 1 año"
    ],
    compatibility: "Compatible con Windows 10 y Windows 11",
    badge: "DIAGRAMAS",
    bestSeller: false,
    featured: false,
    downloadUrl: "https://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/es-es/VisioPro2021Retail.img",
    downloadLabel: "Descargar Imagen Oficial Visio 2021 (.IMG)",
    isoFormat: "Imagen de Disco (.IMG) Oficial Microsoft CDN en Español",
    installationSteps: [
      "Paso 1: Descargue la imagen oficial de Visio 2021 en formato .IMG mediante el botón de descarga.",
      "Paso 2: Monte la imagen con doble clic y ejecute 'Setup.exe'.",
      "Paso 3: Al concluir, abra Microsoft Visio.",
      "Paso 4: Escriba su clave de activación de 25 caracteres provista para disfrutar de su activación permanente."
    ]
  },
  {
    id: "prod-visio-2013",
    slug: "visio-professional-2013",
    name: "Microsoft Visio Professional 2013",
    category: "project-visio",
    price: 49.00,
    oldPrice: 75.00,
    duration: "Permanente",
    rating: 4.7,
    reviews: 43,
    imageUrl: "/products/visio-2013.webp",
    fallbackImage: "/products/visio-2013.png",
    description: "Versión clásica, ágil y de muy bajo consumo de recursos de Microsoft Visio. Ideal para equipos con hardware ligero y versiones anteriores de Windows.",
    features: [
      "Diagramación de procesos, mapas conceptuales y organigramas clásicos",
      "Bajo consumo de memoria RAM y arranque ultra rápido",
      "Soporte amplio en Windows 7, Windows 8.1, Windows 10 y Windows 11",
      "Licencia digital permanente con garantía oficial de 1 año",
      "Activación garantizada"
    ],
    compatibility: "Compatible con Windows 7, 8.1, 10 y 11 (32 y 64 bits)",
    badge: "CLÁSICO",
    bestSeller: false,
    featured: false,
    downloadUrl: "https://archive.org/download/Microsoft_Visio_2013_Professional_x86_x64.iso/Microsoft_Visio_2013_Professional_x86_x64.iso",
    downloadLabel: "Descargar ISO Directa Visio 2013 (x86/x64)",
    isoFormat: "Descarga Directa ISO Oficial (32/64 bits)",
    installationSteps: [
      "Paso 1: Descargue la imagen ISO oficial de Visio 2013 desde el botón de descarga.",
      "Paso 2: Monte el archivo ISO descargado o extráigalo y ejecute 'Setup.exe'.",
      "Paso 3: Siga los pasos del asistente e ingrese la clave de 25 caracteres provista para la activación permanente."
    ]
  }
];

// Helper to calculate cart totals and auto-discount:
// Reglas requeridas:
// - Si lleva 2 o más productos: descuento del 10% (no combinable)
// - Código promocional 'PRIMUPCLIC': 10% de descuento (expiración 30 días por apertura)
// - REGLA OBLIGATORIA: El descuento de cupón del 10% solo aplica a productos desde S/ 40.00
export const MIN_PRICE_FOR_COUPON = 40.00;
export const MIN_PRICE_FOR_30_COUPON = 40.00; // Alias para compatibilidad

export function calculateCartTotals(
  items: { product: Product; quantity: number; unitPrice?: number; variantName?: string }[],
  appliedCoupon?: string
): CartTotals {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity, 0);

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
    // 2 o más productos: 10% de descuento
    hasDiscount = true;
    discountRate = MULTI_ITEM_DISCOUNT; // 0.10
    isMultiItemDiscount = true;
    discountAmount = Number((subtotal * discountRate).toFixed(2));
    if (isCouponValid) {
      isCouponApplied = true;
      discountReason = '10% de descuento por llevar 2 o más productos (Cupón PRIMUPCLIC activo - descuentos no acumulables)';
    } else {
      discountReason = '10% de descuento por llevar 2 o más productos';
    }
  } else if (isCouponValid) {
    // Cupón PRIMUPCLIC 10%: solo aplica a productos con precio >= S/ 40.00
    const eligibleItems = items.filter(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);
    const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity, 0);

    if (eligibleItems.length > 0) {
      hasDiscount = true;
      discountRate = PROMO_COUPON_DISCOUNT; // 0.10
      isCouponApplied = true;
      discountAmount = Number((eligibleSubtotal * discountRate).toFixed(2));
      discountReason = 'Cupón PRIMUPCLIC: 10% de descuento en productos desde S/ 40.00';
    } else {
      hasDiscount = false;
      discountRate = 0;
      discountAmount = 0;
      isCouponApplied = false;
      discountReason = 'El cupón del 10% solo aplica a productos con precio desde S/ 40.00 (no aplicable a productos de menor precio)';
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

export interface CustomerCheckoutInfo {
  email?: string;
  name?: string;
  phone?: string;
}

// Generate the exact WhatsApp confirmation message requested
export function buildWhatsAppMessage(
  items: { product: Product; quantity: number; unitPrice?: number; variantName?: string }[],
  appliedCoupon?: string,
  customerInfo?: CustomerCheckoutInfo
) {
  const { totalQuantity, subtotal, hasDiscount, discountRate, discountAmount, total, discountReason } = calculateCartTotals(items, appliedCoupon);
  
  const productLines = items
    .map(item => {
      const price = item.unitPrice ?? item.product.price;
      const variantSuffix = item.variantName ? ` (${item.variantName})` : '';
      return `• ${item.product.name}${variantSuffix} x${item.quantity} - S/ ${(price * item.quantity).toFixed(2)}`;
    })
    .join('\n');

  let customerBlock = '';
  if (customerInfo?.email || customerInfo?.name || customerInfo?.phone) {
    const lines: string[] = [];
    if (customerInfo.email) lines.push(`• 📧 Correo de Entrega: ${customerInfo.email}`);
    if (customerInfo.name) lines.push(`• 👤 Nombre / Razón Social: ${customerInfo.name}`);
    if (customerInfo.phone) lines.push(`• 📱 Teléfono: ${customerInfo.phone}`);
    customerBlock = `\n👤 *DATOS DEL CLIENTE PARA ENTREGA:*\n${lines.join('\n')}\n`;
  }

  let discountBlock = '';
  if (hasDiscount) {
    discountBlock = `\nSubtotal: S/ ${subtotal.toFixed(2)}\nDescuento (${(discountRate * 100).toFixed(0)}%): -S/ ${discountAmount.toFixed(2)} (${discountReason})\n`;
  }

  return `Hola UpClic, deseo confirmar mi compra.
${customerBlock}
📦 *Productos:*
${productLines}

📊 *Resumen:*
• Cantidad total: ${totalQuantity}${discountBlock}
• Monto total a pagar: S/ ${total.toFixed(2)}

He seleccionado mi pedido y deseo coordinar la entrega de mis licencias digitales a mi correo electrónico.`;
}

// Generate WhatsApp direct URL with encoded text
export function getWhatsAppConfirmationUrl(
  items: { product: Product; quantity: number; unitPrice?: number; variantName?: string }[],
  appliedCoupon?: string,
  customerInfo?: CustomerCheckoutInfo
) {
  const message = buildWhatsAppMessage(items, appliedCoupon, customerInfo);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Generate the exact WhatsApp confirmation message for PAID Mercado Pago orders
export function buildWhatsAppPaidMessage(
  items: { product: Product; quantity: number; unitPrice?: number; variantName?: string }[],
  appliedCoupon?: string,
  paymentDetails?: { paymentId?: string; status?: string; customerInfo?: CustomerCheckoutInfo }
) {
  const { totalQuantity, subtotal, hasDiscount, discountRate, discountAmount, total, discountReason } = calculateCartTotals(items, appliedCoupon);
  
  const productLines = items
    .map(item => {
      const price = item.unitPrice ?? item.product.price;
      const variantSuffix = item.variantName ? ` (${item.variantName})` : '';
      return `• ${item.product.name}${variantSuffix} x${item.quantity} - S/ ${(price * item.quantity).toFixed(2)}`;
    })
    .join('\n');

  let customerBlock = '';
  const cInfo = paymentDetails?.customerInfo;
  if (cInfo?.email || cInfo?.name || cInfo?.phone) {
    const lines: string[] = [];
    if (cInfo.email) lines.push(`• 📧 Correo de Entrega: ${cInfo.email}`);
    if (cInfo.name) lines.push(`• 👤 Nombre / Razón Social: ${cInfo.name}`);
    if (cInfo.phone) lines.push(`• 📱 Teléfono: ${cInfo.phone}`);
    customerBlock = `\n👤 *DATOS DEL CLIENTE PARA ENTREGA:*\n${lines.join('\n')}\n`;
  }

  let discountBlock = '';
  if (hasDiscount) {
    discountBlock = `\nSubtotal: S/ ${subtotal.toFixed(2)}\nDescuento (${(discountRate * 100).toFixed(0)}%): -S/ ${discountAmount.toFixed(2)} (${discountReason})\n`;
  }

  const paymentIdStr = paymentDetails?.paymentId ? `\n• N° de Pago Mercado Pago: #${paymentDetails.paymentId}` : '';

  return `✅ *¡PEDIDO PAGADO CON ÉXITO EN UPCLIC!*

Hola UpClic, acabo de realizar mi pago a través de Mercado Pago y solicito la entrega de mis licencias:
${customerBlock}
📦 *Detalle del Pedido:*
${productLines}

📊 *Resumen de Compra:*
• Cantidad de licencias: ${totalQuantity}${discountBlock}
• Monto Total: S/ ${total.toFixed(2)}
• Estado de Pago: *PAGADO* (Aprobado en Mercado Pago)${paymentIdStr}

Por favor, envíenme las claves de activación originales y las guías de instalación a mi correo y por este medio. ¡Muchas gracias!`;
}

export function getWhatsAppPaidConfirmationUrl(
  items: { product: Product; quantity: number; unitPrice?: number; variantName?: string }[],
  appliedCoupon?: string,
  paymentDetails?: { paymentId?: string; status?: string; customerInfo?: CustomerCheckoutInfo }
) {
  const message = buildWhatsAppPaidMessage(items, appliedCoupon, paymentDetails);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Find product by slug or id
export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  let clean = '';
  try {
    clean = decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    clean = slug.trim().toLowerCase();
  }
  // Strip trailing slashes and hash/query parts if present
  clean = clean.replace(/\/+$/, '').split('?')[0].split('#')[0];
  if (clean.startsWith('/producto/')) {
    clean = clean.replace('/producto/', '');
  } else if (clean.startsWith('producto/')) {
    clean = clean.replace('producto/', '');
  }

  // Exact slug or ID match
  const exact = products.find(p => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean);
  if (exact) return exact;

  // Suffix match (e.g. if slug passed was full URL or path)
  return products.find(p => clean.endsWith(p.slug.toLowerCase()) || p.slug.toLowerCase().endsWith(clean));
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

// Guías oficiales de instalación en páginas externas (Microsoft Support / Portal Oficial)
