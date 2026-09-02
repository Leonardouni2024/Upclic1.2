import { Review } from './types.ts';

export const initialReviews: Review[] = [
  // Microsoft 365 (prod-m365)
  {
    id: 'rev-m365-1',
    productId: 'prod-m365',
    author: 'Carlos Mendoza',
    city: 'Lima',
    rating: 5,
    comment: 'Activación inmediata y los 100 GB en OneDrive se habilitaron sin ningún problema. Pude sincronizar mi laptop y mi celular en 5 minutos.',
    date: '14/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-m365-2',
    productId: 'prod-m365',
    author: 'Mariana Rojas',
    city: 'Arequipa',
    rating: 5,
    comment: 'Súper fácil de configurar. La atención por WhatsApp fue muy amable y me resolvieron una duda sobre Word al instante. Excelente servicio.',
    date: '02/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-m365-3',
    productId: 'prod-m365',
    author: 'Jorge Huamán',
    city: 'Cusco',
    rating: 4,
    comment: 'Buen producto y entrega rápida por correo y WhatsApp. Todo original de Microsoft, muy satisfecho.',
    date: '28/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Office Professional Plus 2024 (prod-office-2024)
  {
    id: 'rev-off24-1',
    productId: 'prod-office-2024',
    author: 'Ing. Fernando Castro',
    city: 'Lima',
    rating: 5,
    comment: 'Excelente versión de Office 2024. Licencia perpetua activada directamente en los servidores de Microsoft sin necesidad de cracks ni programas raros.',
    date: '18/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off24-2',
    productId: 'prod-office-2024',
    author: 'Lucía Paredes',
    city: 'Trujillo',
    rating: 5,
    comment: 'Compré 2 licencias para mi estudio contable y me aplicaron el 10% de descuento automático. Excel 2024 vuela y las nuevas fórmulas son perfectas.',
    date: '10/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off24-3',
    productId: 'prod-office-2024',
    author: 'Rodrigo Salazar',
    city: 'Chiclayo',
    rating: 5,
    comment: 'Pago por Mercado Pago súper seguro y confirmación inmediata por WhatsApp. Clave enviada con guía paso a paso en menos de 3 minutos.',
    date: '25/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Office Professional Plus 2021 (prod-office-2021)
  {
    id: 'rev-off21-1',
    productId: 'prod-office-2021',
    author: 'Valeria Gómez',
    city: 'Piura',
    rating: 5,
    comment: 'Clave 100% original. Activó al primer intento en Windows 11. La mejor compra para evitar cuotas mensuales.',
    date: '12/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off21-2',
    productId: 'prod-office-2021',
    author: 'David Alarcón',
    city: 'Huancayo',
    rating: 5,
    comment: 'Todo perfecto con Word y Excel 2021. La función BUSCARX funciona impecable. La atención por WhatsApp fue muy paciente y rápida.',
    date: '30/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off21-3',
    productId: 'prod-office-2021',
    author: 'Silvia Tello',
    city: 'Lima',
    rating: 4,
    comment: 'Licencia permanente sin problemas. Me enviaron el instalador directo de setup.office.com y activó sin contratiempos.',
    date: '19/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Office Professional Plus 2019 (prod-office-2019)
  {
    id: 'rev-off19-1',
    productId: 'prod-office-2019',
    author: 'Manuel Quispitupa',
    city: 'Cusco',
    rating: 5,
    comment: 'Excelente para mi laptop de trabajo. La instalación tomó menos de 10 minutos y quedó activado para siempre.',
    date: '05/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off19-2',
    productId: 'prod-office-2019',
    author: 'Karla Benavides',
    city: 'Arequipa',
    rating: 5,
    comment: 'Muy buen precio y soporte técnico de primera. Me asistieron por WhatsApp para desinstalar una versión previa que me daba error.',
    date: '22/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Office Professional Plus 2016 (prod-office-2016)
  {
    id: 'rev-off16-1',
    productId: 'prod-office-2016',
    author: 'Ricardo Vega',
    city: 'Ica',
    rating: 5,
    comment: 'Liviano y perfecto para mi PC de oficina con especificaciones modestas. Rápido y sin complicaciones.',
    date: '08/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off16-2',
    productId: 'prod-office-2016',
    author: 'Patricia Ramos',
    city: 'Lima',
    rating: 4,
    comment: 'Buena opción económica, todo funciona según lo descrito en la tienda. Clave original.',
    date: '15/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Office Professional Plus 2010 (prod-office-2010)
  {
    id: 'rev-off10-1',
    productId: 'prod-office-2010',
    author: 'César Morales',
    city: 'Tacna',
    rating: 5,
    comment: 'Excelente para equipos con hardware antiguo en nuestro taller. Activación sin contratiempos.',
    date: '03/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-off10-2',
    productId: 'prod-office-2010',
    author: 'Elena Chávez',
    city: 'Puno',
    rating: 4,
    comment: 'Me sirvió justo para una máquina de laboratorio que requería esta versión específica. Muchas gracias.',
    date: '20/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 11 Pro (prod-win11-pro)
  {
    id: 'rev-win11p-1',
    productId: 'prod-win11-pro',
    author: 'Álvaro Navarro',
    city: 'Lima',
    rating: 5,
    comment: 'Activó Windows 11 Pro al instante desde Configuración > Activación. BitLocker y Escritorio Remoto funcionando al 100%.',
    date: '19/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win11p-2',
    productId: 'prod-win11-pro',
    author: 'Esteban Rivas',
    city: 'Arequipa',
    rating: 5,
    comment: 'Compré la clave para mi nueva PC gamer armada. Todo original y entrega en minutos por WhatsApp con enlace oficial de Microsoft.',
    date: '11/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win11p-3',
    productId: 'prod-win11-pro',
    author: 'Gabriela Montes',
    city: 'Lima',
    rating: 5,
    comment: 'Excelente soporte, tenía dudas con el TPM 2.0 y el asesor me ayudó de inmediato por llamada de WhatsApp. Recomendadísimos.',
    date: '01/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 11 Home (prod-win11-home)
  {
    id: 'rev-win11h-1',
    productId: 'prod-win11-home',
    author: 'Raúl Carrillo',
    city: 'Trujillo',
    rating: 5,
    comment: 'Activación limpia para la laptop de estudio de mi hijo. Muy buen precio comparado con comprarlo directo.',
    date: '14/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win11h-2',
    productId: 'prod-win11-home',
    author: 'Sofía Medina',
    city: 'Chimbote',
    rating: 5,
    comment: 'Fácil de aplicar la clave en Windows. Proceso transparente y rápido con Mercado Pago.',
    date: '29/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 11 Enterprise (prod-win11-enterprise)
  {
    id: 'rev-win11e-1',
    productId: 'prod-win11-enterprise',
    author: 'Lic. Martín Bazán',
    city: 'Lima',
    rating: 5,
    comment: 'Implementado en equipos de nuestra empresa. Activación impecable y directivas de seguridad corporativas operativas.',
    date: '16/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win11e-2',
    productId: 'prod-win11-enterprise',
    author: 'Héctor Vidal',
    city: 'Callao',
    rating: 5,
    comment: 'Soporte empresarial rápido y comprobado. La clave se validó sin problemas en el dominio.',
    date: '04/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 10 Pro (prod-win10-pro)
  {
    id: 'rev-win10p-1',
    productId: 'prod-win10-pro',
    author: 'Julio Cárdenas',
    city: 'Lima',
    rating: 5,
    comment: 'El sistema más estable. Activé mi PC de escritorio en 1 minuto. Ya no me aparece la marca de agua de activar Windows.',
    date: '17/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win10p-2',
    productId: 'prod-win10-pro',
    author: 'Ana Paula Silva',
    city: 'Arequipa',
    rating: 5,
    comment: 'Rápido, seguro y confiable. Pagué por Mercado Pago y me llegó la clave al WhatsApp de inmediato con instrucciones detalladas.',
    date: '09/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win10p-3',
    productId: 'prod-win10-pro',
    author: 'Walter Espinoza',
    city: 'Huancayo',
    rating: 5,
    comment: 'Excelente servicio postventa, me resolvieron todas las dudas para formatear e instalar desde cero.',
    date: '27/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 10 Home (prod-win10-home)
  {
    id: 'rev-win10h-1',
    productId: 'prod-win10-home',
    author: 'Beatriz Fuentes',
    city: 'Lima',
    rating: 5,
    comment: 'Todo perfecto para uso en casa y tareas escolares. Licencia permanente sin fechas de vencimiento.',
    date: '13/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win10h-2',
    productId: 'prod-win10-home',
    author: 'Óscar Villegas',
    city: 'Cusco',
    rating: 4,
    comment: 'Buen precio y entrega digital veloz. Totalmente recomendado para no gastar de más.',
    date: '23/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 10 Enterprise (prod-win10-enterprise)
  {
    id: 'rev-win10e-1',
    productId: 'prod-win10-enterprise',
    author: 'Ing. Dante Flores',
    city: 'Lima',
    rating: 5,
    comment: 'Ideal para terminales de red y oficinas que requieren estabilidad prolongada sin reinicios forzados.',
    date: '15/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win10e-2',
    productId: 'prod-win10-enterprise',
    author: 'Marcos Del Solar',
    city: 'Arequipa',
    rating: 5,
    comment: 'Soporte corporativo eficiente y clave válida verificada en los servidores oficiales.',
    date: '31/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 8.1 Pro (prod-win8-pro)
  {
    id: 'rev-win8-1',
    productId: 'prod-win8-pro',
    author: 'Gonzalo Rivera',
    city: 'Tacna',
    rating: 5,
    comment: 'Funcionó perfecto para una laptop táctil antigua. Activación en segundos.',
    date: '06/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win8-2',
    productId: 'prod-win8-pro',
    author: 'Miriam Soto',
    city: 'Lima',
    rating: 4,
    comment: 'Todo conforme, la clave fue aceptada sin problemas en el asistente de activación.',
    date: '18/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 7 Professional (prod-win7-pro)
  {
    id: 'rev-win7p-1',
    productId: 'prod-win7-pro',
    author: 'Víctor Zambrano',
    city: 'Trujillo',
    rating: 5,
    comment: 'Indispensable para nuestro torno CNC que solo corre en Windows 7. 100% operativo y activado.',
    date: '10/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win7p-2',
    productId: 'prod-win7-pro',
    author: 'Guillermo Lozano',
    city: 'Lima',
    rating: 4,
    comment: 'Activación exitosa, excelente para máquinas de trabajo antiguas en taller automotriz.',
    date: '21/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Windows 7 Ultimate (prod-win7-ultimate)
  {
    id: 'rev-win7u-1',
    productId: 'prod-win7-ultimate',
    author: 'Andrés Farfán',
    city: 'Arequipa',
    rating: 5,
    comment: 'Trae los paquetes de idiomas completos y BitLocker. Clave original permanente.',
    date: '12/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-win7u-2',
    productId: 'prod-win7-ultimate',
    author: 'Clara Meza',
    city: 'Cusco',
    rating: 5,
    comment: 'Muy contenta con la atención y la rapidez en responder por WhatsApp con la clave.',
    date: '26/07/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Combo Windows 11 Pro + Microsoft Office 2024 (prod-combo-win11-office2024)
  {
    id: 'rev-combo-1',
    productId: 'prod-combo-win11-office2024',
    author: 'Alejandro Morales',
    city: 'Lima',
    rating: 5,
    comment: 'El mejor combo de la tienda. Activé mi laptop nueva con Windows 11 Pro y Office 2024 en cuestión de minutos. El ahorro es tremendo.',
    date: '20/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-combo-2',
    productId: 'prod-combo-win11-office2024',
    author: 'Brenda Vilchez',
    city: 'Arequipa',
    rating: 5,
    comment: 'Ambas claves funcionaron a la perfección. La atención por WhatsApp fue super rápida y cordial.',
    date: '16/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Project Professional 2024 (prod-project-2024)
  {
    id: 'rev-proj24-1',
    productId: 'prod-project-2024',
    author: 'Ing. Mateo Salinas',
    city: 'Lima',
    rating: 5,
    comment: 'Project 2024 con diagramas de Gantt y gestión de recursos actualizada. Licencia original que activó sin ninguna complicación.',
    date: '19/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },
  {
    id: 'rev-proj24-2',
    productId: 'prod-project-2024',
    author: 'Daniela Cáceres',
    city: 'Trujillo',
    rating: 5,
    comment: 'Excelente herramienta para la gestión de proyectos de mi empresa constructora. 100% recomendada.',
    date: '14/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Project Professional 2021 (prod-project-2021)
  {
    id: 'rev-proj21-1',
    productId: 'prod-project-2021',
    author: 'Gabriel Ramos',
    city: 'Huancayo',
    rating: 5,
    comment: 'Muy estable y rápido. Clave permanente vinculada a mi cuenta. Servicio de soporte técnico impecable.',
    date: '11/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Project Professional 2019 (prod-project-2019)
  {
    id: 'rev-proj19-1',
    productId: 'prod-project-2019',
    author: 'César Portocarrero',
    city: 'Piura',
    rating: 5,
    comment: 'Justo la versión que requería para compatibilidad con las plantillas de mi cliente. Activación al instante.',
    date: '08/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Visio Professional 2024 (prod-visio-2024)
  {
    id: 'rev-vis24-1',
    productId: 'prod-visio-2024',
    author: 'Renato Silva',
    city: 'Lima',
    rating: 5,
    comment: 'Visio 2024 trae plantillas de redes y arquitectura en la nube fantásticas. Activó en línea directo con Microsoft.',
    date: '18/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Visio Professional 2021 (prod-visio-2021)
  {
    id: 'rev-vis21-1',
    productId: 'prod-visio-2021',
    author: 'Patricia Wong',
    city: 'Chiclayo',
    rating: 5,
    comment: 'Excelente software para diagramación de procesos y flujogramas ISO. Muy satisfecha con la compra.',
    date: '13/08/2026',
    isDemo: true,
    verifiedPurchase: true
  },

  // Visio Professional 2013 (prod-visio-2013)
  {
    id: 'rev-vis13-1',
    productId: 'prod-visio-2013',
    author: 'Marcos Benítez',
    city: 'Cusco',
    rating: 4,
    comment: 'Ideal para computadoras de bajo rendimiento en planta. Cumple perfectamente con su función y activa de por vida.',
    date: '05/08/2026',
    isDemo: true,
    verifiedPurchase: true
  }
];
