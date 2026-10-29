# Rediseño UI/UX: Estilo Tecnológico Minimalista & Bento Box para Licencias Microsoft Office

Este plan transforma la experiencia visual de la tienda hacia un diseño **Tecnológico Minimalista con arquitectura tipo Bento Box**, enfocado en transmitir máxima autoridad, seguridad oficial, transparencia y velocidad de entrega, alejándose por completo de la apariencia saturada de los sitios informales.

---

## 1. Sistema de Diseño & Paleta Visual

- **Fondos y Superficies (Bento Box)**:
  - Fondo general de página: Gris ultra claro (`#F8FAFC` / `bg-slate-50`).
  - Bloques Bento: Blanco puro (`#FFFFFF`) con bordes sutiles (`border-slate-200/80`), esquinas ampliamente redondeadas (`rounded-2xl` y `rounded-3xl`) y sombras suaves de elevación progresiva (`shadow-xs hover:shadow-md`).
- **Acentos Oficiales Microsoft & Office**:
  - **Azul Oficial Microsoft (`#0078D4`)**: Acciones principales de navegación, insignias de verificación, iconos de confianza y tarjetas informativas.
  - **Naranja Oficial Office (`#D83B01`)**: Botones de Llamada a la Acción (CTA) críticos de conversión (*"Comprar y Recibir Al Instante"*, etiqueta *"Más Popular"*).
- **Tipografía**:
  - Fuente Sans-Serif limpia (`Inter` / `system-ui`), jerarquía marcada con titulares en `text-slate-900` (`font-extrabold`, `tracking-tight`) y textos descriptivos en `text-slate-600`.

---

## 2. Estructura de Secciones y Componentes a Implementar

### Sección 1: Hero Section (Primer Pantallazo en Formato Bento)
- **Archivo a actualizar**: `src/components/Hero.tsx`
- **Elementos clave**:
  - **Badge flotante superior**: Píldora discreta y elegante con icono de escudo verificado en verde esmeralda y azul `#0078D4`: *"Garantía de activación del 100%"*.
  - **Titular de alto impacto**: Enfoque directo en originalidad, entrega inmediata y respaldo técnico (*"Licencias Originales de Microsoft Office con Entrega Inmediata y Garantía Total"*).
  - **Subtexto explicativo**: Aclara de forma transparente que la licencia es permanente, 100% genuina y se vincula o activa directamente en los servidores oficiales de Microsoft.
  - **Doble CTA**:
    - Botón Principal en Naranja Office (`#D83B01`) o Azul Microsoft (`#0078D4`): *"Ver Licencias Disponibles"* (desplazamiento suave a la tabla comparativa / catálogo).
    - Botón Secundario limpio con borde sutil: *"Soporte por WhatsApp"* (conexión directa con especialista en vivo).
  - **Panel Bento Visual Derecho**: Composición limpia de tarjetas modulares mostrando los iconos oficiales de las aplicaciones de Office (Word, Excel, PowerPoint, Outlook), estado de *"Servidor Microsoft: En línea"* y métrica de tiempo de entrega (*"< 2 min al correo"*).

### Sección 2: Proceso Ultra Rápido (3 Pasos en Diseño Bento Box)
- **Archivo a actualizar**: `src/components/BenefitsSection.tsx`
- **Diseño**: Cuadrícula Bento de 3 columnas (`grid-cols-1 md:grid-cols-3 gap-6`) con numeración clara (`01`, `02`, `03`), iconos modernos en contenedores `#0078D4/10` y micro-indicadores visuales:
  - **Paso 1**: *Elige tu versión de Office y paga de forma segura* (Icono de selección / escudo de pago encriptado).
  - **Paso 2**: *Recibe tu clave de producto digital por Email en menos de 2 minutos* (Icono de envío instantáneo al correo y WhatsApp).
  - **Paso 3**: *Sigue nuestra guía paso a paso y activa directamente en el sitio oficial de Microsoft* (Icono de verificación oficial Microsoft).

### Sección 3: Tabla Comparativa de Productos (Las 3 Tarjetas Principales de Office)
- **Archivo a actualizar**: `src/components/FeaturedProductsSection.tsx`
- **Diseño**: 3 tarjetas comparativas alineadas en cuadrícula (`grid-cols-1 lg:grid-cols-3 gap-8 items-stretch`) conectadas directamente con el carrito y flujo de compra instantánea de la tienda:
  1. **Tarjeta 1: Office Home & Student / Standard** (*Ideal para estudiantes y uso esencial en casa*)
     - Aplicaciones con bullets limpios: Word, Excel, PowerPoint, OneNote.
     - Licencia permanente para 1 PC, pago único sin anualidades.
     - Botón CTA: *"Comprar y Recibir Al Instante"*.
  2. **Tarjeta 2 (Destacada): Office Professional Plus 2024** (*El más vendido*)
     - Resaltada con **borde de color (`border-2 border-[#0078D4]`)**, sombra superior y etiqueta flotante en Naranja Office (`#D83B01`): **"MÁS POPULAR"**.
     - Aplicaciones incluidas con bullets limpios: Word, Excel, PowerPoint, Outlook, Access, Publisher, OneNote.
     - Licencia permanente vitalicia, activación oficial y soporte incluido.
     - Botón CTA principal en Naranja Office (`#D83B01`): *"Comprar y Recibir Al Instante"*.
  3. **Tarjeta 3: Microsoft 365 Personal** (*Formato suscripción anual Multi-dispositivo*)
     - Aplicaciones incluidas: Word, Excel, PowerPoint, Outlook, OneDrive (100 GB - 1 TB en la nube) para hasta 5 dispositivos (PC, Mac, iPad, móvil).
     - Actualizaciones continuas e inteligencia artificial integrada.
     - Botón CTA: *"Comprar y Recibir Al Instante"*.
- *Nota*: Debajo de esta comparativa principal se mantiene disponible el catálogo completo interactivo (`ProductGrid`) para los usuarios que busquen Windows u otras versiones específicas.

### Sección 4: Sección de Confianza, Pagos Seguros y Preguntas Frecuentes (FAQ Acordeón)
- **Archivo a actualizar**: `src/components/TrustSection.tsx`
- **Diseño en bloques Bento**:
  - **Bloque A — Widget de Calificaciones de Clientes**: Resumen visual estilo Trustpilot / Google Reviews con 5 estrellas, puntuación **4.9 / 5.0** y tarjetas de reseñas verificadas de compradores reales.
  - **Bloque B — Pasarelas y Métodos de Pago Seguros**: Barra Bento con distintivos limpios de **Tarjetas de Crédito/Débito (Visa, Mastercard, Amex), PayPal, Mercado Pago, Yape y Plin**, acompañado de sello de encriptación SSL de 256 bits.
  - **Bloque C — Acordeón Interactivo de Preguntas Frecuentes (FAQ)**: Componente desplegable limpio que responde de forma clara y directa:
    1. *¿Son licencias de por vida?*
    2. *¿Qué pasa si tengo problemas para activar?*
    3. *¿Entregan factura?*

---

## 3. Plan de Verificación
1. Compilación de TypeScript y validación de tipos (`compile_applet` y `lint_applet`).
2. Verificación de interactividad: los botones *"Comprar y Recibir Al Instante"* agregan el producto correspondiente y llevan al usuario directo al checkout o abren el carrito sin fricción; el acordeón FAQ abre y cierra suavemente.
3. Revisión responsiva en móvil, tablet y escritorio verificando espaciados Bento y contraste tipográfico.
