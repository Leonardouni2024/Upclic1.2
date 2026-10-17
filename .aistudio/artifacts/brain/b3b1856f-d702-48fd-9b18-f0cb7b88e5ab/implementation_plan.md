# Renovación Visual E-Commerce Pro y Actualización de Canva Pro

Plan integral para actualizar el precio de Canva Pro (12 meses) a S/ 10.00 y transformar la tienda UpClic en una experiencia e-commerce de alto impacto visual, profesional, no minimalista y plenamente responsiva en todos los dispositivos (móvil, tableta y escritorio).

### User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas y acordadas para la ejecución de esta versión:

- **Precio y Modalidad de Canva Pro**: Confirmado a **S/ 10.00** para la suscripción completa de **12 meses** (antes S/ 30.00 / S/ 79.00), manteniendo la entrega por invitación oficial directa a cuenta personal de correo.
- **Dirección Visual & Estilo**: Confirmado **Estilo e-commerce con sellos de garantía, banners y ofertas destacadas**, alejándose de estéticas ultra-minimalistas frías para adoptar una presentación comercial rica, cálida y de alta confianza con relieves sutiles, microinteracciones, insignias de verificación y tarjetas llamativas.
- **Alcance Responsivo Integral**: Confirmado para **todo el sitio**, optimizando la experiencia táctil en celulares (pantallas de 360px a 430px), tabletas (768px a 1024px) y pantallas de escritorio (1280px a 1440px+) en la barra superior, portada hero, grilla del catálogo, filtros de categoría, carrito deslizable y pantalla de checkout.
- **Tienda Oficial Mercado Libre**: Integración destacada de los sellos y enlaces a la tienda oficial en Mercado Libre (`https://www.mercadolibre.com.pe/pagina/upclic`) como credencial de reputación y garantía.

---

### 1. Overview & Core Concept

- **What It Does**: Proporciona una tienda en línea moderna, vibrante y confiable de licencias digitales de software y apps educativas/creativas en Perú e internacional. Los usuarios pueden explorar productos con precios claros en Soles (PEN), USD y monedas locales, agregar al carrito con retroalimentación instantánea, y completar pagos rápidos vía Mercado Pago, Yape, Plin y PayPal con entrega garantizada.
- **Target Audience / Persona**: Profesionales, diseñadores, estudiantes, educadores y pequeñas empresas que buscan licencias originales y suscripciones garantizadas (como Canva Pro 12 meses a S/ 10, Duolingo Super, Windows, Office, antivirus) con soporte local vía WhatsApp y compra segura.
- **Key Value**: Acceso inmediato a precios de liquidación garantizados, soporte humano en tiempo real, respaldo de tienda líder en Mercado Libre y un proceso de compra claro sin fricciones técnicas.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Descubrimiento y Banners Destacados**: El usuario llega al sitio y visualiza un banner superior con anuncios clave (oferta de Canva Pro a S/ 10, entrega digital garantizada, enlace a Mercado Libre UpClic), seguido de un Hero comercial con tarjetas de ventajas (garantía oficial, soporte 24/7, activación inmediata).
2. **Exploración del Catálogo**: Grilla responsiva adaptativa (1 columna en móviles pequeños, 2 columnas en móviles medianos/grandes, 3 en tabletas, 4 en desktop) con tarjetas de producto que destacan el porcentaje de ahorro, rating con estrellas reales, tipo de entrega y botón de adición rápida.
3. **Ficha Detallada / Modal Rápido**: Vista rápida del producto que desglosa compatibilidad, pasos de instalación asistida, garantía y selector de cantidad con cálculo de total.
4. **Carrito Deslizable Pro**: Drawer lateral responsivo con resumen dinámico, opción de cupón promocional, cálculo de impuestos/descuentos e insignias de métodos de pago aceptados (Mercado Pago, Yape, Plin, Tarjetas, PayPal).
5. **Checkout & Confirmación**: Formulario de un solo paso optimizado para teclado móvil, selección visual de método de pago con confirmación guiada e instrucciones claras de activación.

#### Visual Identity & Theme
- **Aesthetic Direction**: E-commerce profesional dinámico y comercial. Elementos visuales nítidos, fondos con sutiles patrones de cuadrícula/degradado cálido, bordes definidos con iluminación sutil al pasar el cursor, y sellos de confianza tipo insignia de seguridad.
- **Color Palette & Mood**:
  - *Fondo Canvas*: Blanco puro (`#FFFFFF`) y gris ultra suave (`#F8FAFC` / `#F1F5F9`) para descanso visual y máxima legibilidad.
  - *Color Primario*: Azul corporativo UpClic (`#0052CC` / `#1D4ED8` y acentos `#2563EB`) que inspira seguridad bancaria e institucional.
  - *Color de Oferta & Ahorro*: Esmeralda / Verde éxito (`#059669` / `#10B981`) para precios en promoción, ahorros y etiquetas de disponibilidad.
  - *Acentos Especiales*: Amarillo dorado (`#F59E0B` / `#D97706`) para estrellas de reseñas y sello de Mercado Libre Platinum / Mercado Líder Gold.
- **Typography & Hierarchy**:
  - Encabezados: `Plus Jakarta Sans` / `Inter` en pesos semibold (`font-semibold`) y bold (`font-bold`) con tamaños equilibrados que nunca se desbordan en móviles.
  - Precios & Números: Fuentes monoespaciadas tabulares (`font-mono` / `tabular-nums`) para alineación perfecta de dígitos y símbolos monetarios (`S/ 10.00`).
  - Textos de Soporte: Tamaño 13px–14px con alto contraste (WCAG AA compliant $\ge 4.5:1$).
- **Component Styling & Layout**:
  - Tarjetas de producto con sombra multinivel suave (`shadow-sm hover:shadow-lg transition-all duration-300`), esquinas redondeadas ergonómicas (`rounded-xl`), y cabecera de imagen enmarcada con proporciones fijas $4:3$.
  - Barra de navegación adhesiva con altura contenida ($\le 64\text{px}$) con buscador integrado, selector de moneda accesible y contador de carrito con microanimación.
  - Banner informativo deslizable o estático de 36px en la parte superior con avisos de ofertas y credenciales de Mercado Libre.

#### Interactive Feedback & Motion
- Hover con elevación suave (`translate-y-[-2px]`) en tarjetas de producto.
- Micro-rebote sutil en el botón del carrito al agregar un ítem.
- Transiciones CSS de 150ms–200ms en modales y drawers para máxima fluidez sin bloquear la interacción.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Ajuste de Canva Pro en Catálogo y Motor de Precios**
  - *Enfoque*: Establecer el precio de `prod-canva-pro` en `price: 10.00` PEN, con precio anterior tachado de `oldPrice: 79.00` PEN (ocho por ciento de descuento visible) y duración de 12 meses. Actualizar también las referencias en descripciones y en el asistente de atención para mantener coherencia total.
  - *Justificación*: El cliente solicitó explícitamente fijar Canva Pro a 10 soles para maximizar la conversión como producto estrella.
  - *Alternativas*: Mantener planes escalonados fue descartado a favor de la oferta única agresiva acordada en las respuestas de clarificación.

- **Decisión 2: Diseño E-Commerce Rico frente a Minimalismo Plano**
  - *Enfoque*: Reemplazar espacios vacíos planos por bloques de valor: carrusel/banner de ofertas destacadas, sellos de confianza ("100% Original", "Garantía de 6 a 12 meses", "Tienda Oficial Mercado Libre"), contador de clientes satisfechos y testimonios reales.
  - *Justificación*: Los compradores de software digital en Perú necesitan verificar la legitimidad de la tienda antes de transferir por Yape o tarjeta; los sellos de garantía y la presencia de Mercado Libre generan confianza inmediata.

- **Decisión 3: Arquitectura Responsiva de Grilla y Checkout**
  - *Enfoque*: Usar grilla CSS fluida con breakpoints precisos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, inputs táctiles grandes ($\ge 44\text{px}$ de alto) y checkout de columna única en móviles con botón de acción flotante si la página es extensa.
  - *Justificación*: Más del 75% del tráfico de compra en Perú proviene de teléfonos inteligentes (WhatsApp y redes sociales).

---

### 4. Technical Architecture & Data Strategy (Technical Reference)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UPCLIC DIGITAL STOREFRONT                       │
├────────────────────────────────────────────────────────────────────────┤
│  Top Trust Bar: Envío Digital Inmediato · Tienda Mercado Libre · Ayuda │
├────────────────────────────────────────────────────────────────────────┤
│  Navbar: Logo UpClic │ Buscador │ Selector Moneda (PEN/USD) │ Carrito   │
├────────────────────────────────────────────────────────────────────────┤
│  Promo Banner / Hero:                                                  │
│   • Oferta Estrella: Canva Pro 12 Meses a solo S/ 10.00                │
│   • Sellos: Mercado Libre Gold · Garantía UpClic · Soporte WhatsApp   │
├────────────────────────────────────────────────────────────────────────┤
│  Filter Bar: Todas │ Apps & Diseño │ Windows & Office │ Antivirus      │
├────────────────────────────────────────────────────────────────────────┤
│  Product Grid (Responsive 1/2/3/4 cols):                               │
│   ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐    │
│   │ Canva Pro 12M     │ │ Duolingo Super    │ │ Office 365 Pro    │    │
│   │ S/ 10.00 (-87%)   │ │ S/ 30.00          │ │ S/ 45.00          │    │
│   │ [ Agregar Carrito]│ │ [ Agregar Carrito]│ │ [ Agregar Carrito]│    │
│   └───────────────────┘ └───────────────────┘ └───────────────────┘    │
├────────────────────────────────────────────────────────────────────────┤
│  Trust & Warranty Section:                                             │
│   • 3 Pasos Simples: Compra -> Recibe en minutos -> Activa con soporte │
│   • Tienda Verificada en Mercado Libre con reputación Verde            │
├────────────────────────────────────────────────────────────────────────┤
│  Slide-over Cart Drawer  ◄───►  Checkout Screen (Mercado Pago / Yape)   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Model & State Mapping
- **Catálogo de Productos (`src/products.ts`)**:
  - Actualización de `prod-canva-pro` con `price: 10.00`, `oldPrice: 79.00`, `duration: '12 meses'`, y viñetas optimizadas de IA Magic Studio, quitafondos y uso multidispositivo.
  - Preservación íntegra de la sincronización de tipo de cambio PEN/USD/COP/MXN.
- **Estado de Carrito (`src/context/CartContext.tsx`)**:
  - Recálculo en tiempo real con el nuevo valor de S/ 10.00 en subtotales, conversiones de moneda y pasarelas de pago.
- **Componentes de Interfaz**:
  - `src/components/Header.tsx`: Barra superior comercial con enlaces a Mercado Libre, WhatsApp y buscador rápido.
  - `src/components/Hero.tsx`: Banner de oferta destacada con tarjeta de Canva Pro a S/ 10 y credenciales de garantía.
  - `src/components/ProductCard.tsx`: Tarjetas comerciales con porcentaje de descuento, etiquetas de garantía y feedback visual al agregar.
  - `src/components/TrustBadges.tsx`: Sección de confianza con sellos de garantía y enlace oficial a Mercado Libre.
  - `src/components/CheckoutPage.tsx` & `src/components/CartDrawer.tsx`: Flujo de pago responsivo y pulido con estilos comerciales integrados.
