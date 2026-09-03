import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initialReviews } from "./src/initialReviews.ts";
import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, PROMO_COUPON_CODE } from "./src/products.ts";

const app = express();
const PORT = 3000;

// Gemini client lazy initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Build compact catalog description for system prompt
const productCatalogSummary = products
  .map(
    (p) =>
      `• [${p.name}] (Categoría: ${p.category}) - Precio: S/ ${p.price.toFixed(2)}${
        p.oldPrice ? ` (Antes S/ ${p.oldPrice.toFixed(2)})` : ""
      } | Tipo: ${p.duration || "Permanente"} | URL: /producto/${p.slug} | Detalles: ${p.description.substring(0, 140)}`
  )
  .join("\n");

const SYSTEM_INSTRUCTION = `Eres el Asistente Virtual Oficial y Asesor Experto de "UpClic" (tienda online líder en licencias digitales originales de Microsoft Office, Windows, Visio y Project en Perú).

TU MISIÓN Y TONO:
- Tu objetivo es ayudar a los clientes con amabilidad, paciencia, empatía y soluciones rápidas y claras.
- Responde siempre en español con un tono cercano, educado y profesional.
- Utiliza viñetas y emojis amigables (🛍️, 💡, 🛡️, ⚡, 🔑, 📲) para que la lectura sea dinámica e intuitiva.

REGLAS DE ÁMBITO Y CATÁLOGO (ESTRICTO):
1. ENTORNO EXCLUSIVO DE UPCLIC: Solo debes recomendar y brindar información sobre los productos y servicios de UpClic (Office, Windows, Visio, Project y Combos).
2. SI EL CLIENTE CONSULTA POR ALGO FUERA DE LA TIENDA (por ejemplo: videojuegos, hardware, componentes físicos, cuentas de streaming como Netflix/Spotify, software de Adobe u otros programas ajenos):
   - NO intentes dar soporte ni responder sobre esos productos externos.
   - Responde de forma muy amable e intuitiva diciendo: "En UpClic nos especializamos exclusivamente en licencias digitales y software oficial de Microsoft para garantizarle el mejor precio, activación 100% garantizada y soporte técnico oficial. Con mucho gusto le puedo ayudar a encontrar la versión ideal de Office o Windows para su computadora."

SOLUCIONES DE SOPORTE TÉCNICO RÁPIDAS:
- Entrega: 100% digital e inmediata tras confirmar el pago (por correo y WhatsApp).
- Formato de instalación: Descargas directas oficiales (.ISO / .IMG) desde servidores de Microsoft o portal.office.com (en caso de Microsoft 365).
- Activación permanente: Claves alfanuméricas originales de 25 caracteres que se ingresan directamente en Word/Excel o en Configuración de Windows. Se pueden reinstalar en el mismo equipo.
- Microsoft 365: Se entrega por cuenta oficial con usuario y contraseña (hasta 5 dispositivos + 100 GB en OneDrive).
- Medios de pago aceptados: Yape, Plin, Transferencias directas (BCP, BBVA, Interbank) y Mercado Pago.
- Promociones vigentes:
  * Cupón "${PROMO_COUPON_CODE}": 10% de descuento en compras de productos desde S/ 40.00.
  * Descuento automático del 10% al llevar 2 o más productos en el carrito.
- Garantía: 6 meses a 1 año de garantía oficial con soporte técnico incluido.

ESCALAMIENTO DIRECTO AL ADMINISTRADOR POR WHATSAPP:
- Cuando el cliente tenga un problema técnico que requiera atención humana (error de clave no resuelto, soporte remoto guiado, factura corporativa con RUC, compras al por mayor, o si el cliente pide hablar con una persona):
- Facilita de inmediato el contacto con el Administrador y Soporte Humano:
  * WhatsApp Oficial: ${WHATSAPP_DISPLAY}
  * Enlace directo: https://wa.me/${WHATSAPP_NUMBER}

CATÁLOGO DE PRODUCTOS DISPONIBLES EN UPCLIC:
${productCatalogSummary}

RECOMENDACIONES:
- Cuando sugieras productos, menciona su nombre, su precio en Soles (S/) y su enlace relativo en la tienda (ejemplo: [Ver producto](/producto/office-professional-plus-2024)).`;

// Middleware for parsing JSON
app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStoredReviews() {
  ensureDataDirectory();
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading reviews.json, falling back to seed data:", err);
  }

  // Seed with initial reviews
  saveReviewsToFile(initialReviews);
  return initialReviews;
}

function saveReviewsToFile(reviews: any[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving reviews to file:", err);
    return false;
  }
}

// In-memory cache synced with disk
let cachedReviews = loadStoredReviews();

// --- OPEN GRAPH & SOCIAL METADATA HELPER ---
function injectOpenGraphTags(html: string, req: express.Request): string {
  let productSlug: string | undefined;
  const urlPath = req.path;
  const match = urlPath.match(/\/producto\/([a-zA-Z0-9_-]+)/);
  if (match) {
    productSlug = match[1];
  } else if (req.query.product && typeof req.query.product === "string") {
    productSlug = req.query.product;
  } else if (req.query.p && typeof req.query.p === "string") {
    productSlug = req.query.p;
  }

  const product = productSlug
    ? products.find((p) => p.slug === productSlug || p.id === productSlug)
    : null;

  // Derive absolute host and protocol
  const forwardedProto = req.get("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol || "https";
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  let title = "UpClic - Licencias Microsoft Office y Windows Originales";
  let description =
    "Tienda especializada en licencias digitales originales de Microsoft Office y Windows. Entrega inmediata, soporte personalizado y garantía oficial.";
  let imageUrl = `${baseUrl}/products/microsoft-365.png`;
  let currentUrl = `${baseUrl}${req.originalUrl}`;
  let type = "website";

  if (product) {
    title = `${product.name} - S/ ${product.price.toFixed(2)} | UpClic`;
    description = `¡Te recomiendo este producto! ${product.name} a solo S/ ${product.price.toFixed(2)} en UpClic. Licencia 100% original con entrega inmediata y garantía oficial.`;
    // Use png as fallback for Facebook crawler compatibility
    const imgPath = product.fallbackImage || product.imageUrl;
    imageUrl = imgPath.startsWith("http") ? imgPath : `${baseUrl}${imgPath}`;
    type = "product";
  }

  const ogTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:site_name" content="UpClic Licencias" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${currentUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="600" />
    <meta property="og:image:alt" content="${product ? product.name : 'UpClic Licencias'}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;

  // Clean out existing og/twitter tags and replace before </head>
  let modifiedHtml = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  modifiedHtml = modifiedHtml.replace(/<meta\s+(?:name|property)=["'](?:og:|twitter:|description)[\s\S]*?>/gi, "");
  modifiedHtml = modifiedHtml.replace("</head>", `${ogTags}\n</head>`);

  return modifiedHtml;
}

// --- API ROUTES ---

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    reviewsCount: cachedReviews.length,
    storage: "filesystem_persistent"
  });
});

// GET all reviews
app.get("/api/reviews", (_req, res) => {
  res.json({
    success: true,
    count: cachedReviews.length,
    reviews: cachedReviews
  });
});

// GET reviews by product ID
app.get("/api/reviews/product/:productId", (req, res) => {
  const { productId } = req.params;
  const filtered = cachedReviews.filter((r: any) => r.productId === productId);
  res.json({
    success: true,
    productId,
    count: filtered.length,
    reviews: filtered
  });
});

// POST new review
app.post("/api/reviews", (req, res) => {
  try {
    const { productId, author, city, rating, comment } = req.body;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ success: false, error: "El ID del producto es obligatorio." });
    }

    if (!author || typeof author !== "string" || author.trim().length === 0) {
      return res.status(400).json({ success: false, error: "El nombre del autor es obligatorio." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: "La calificación debe ser un número entre 1 y 5." });
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      return res.status(400).json({ success: false, error: "El comentario debe tener al menos 5 caracteres." });
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

    const newReview = {
      id: `rev-db-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: productId.trim(),
      author: author.trim(),
      city: city?.trim() || undefined,
      rating: Math.round(numRating),
      comment: comment.trim(),
      date: formattedDate,
      isDemo: false,
      verifiedPurchase: true,
      createdAt: now.toISOString()
    };

    // Prepend new review to persistent list
    cachedReviews = [newReview, ...cachedReviews];
    saveReviewsToFile(cachedReviews);

    console.log(`[API] New review saved for product: ${productId} by ${author}`);

    return res.status(201).json({
      success: true,
      message: "Reseña guardada y sincronizada correctamente en la base de datos.",
      review: newReview,
      totalReviews: cachedReviews.length
    });
  } catch (error: any) {
    console.error("Error processing review POST:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno al guardar la reseña en el servidor."
    });
  }
});

// POST reset reviews to initial default data
app.post("/api/reviews/reset", (_req, res) => {
  cachedReviews = [...initialReviews];
  saveReviewsToFile(cachedReviews);
  res.json({
    success: true,
    message: "Reseñas restauradas a los datos iniciales predeterminados.",
    count: cachedReviews.length,
    reviews: cachedReviews
  });
});

// DELETE review by ID
app.delete("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  const initialLen = cachedReviews.length;
  cachedReviews = cachedReviews.filter((r: any) => r.id !== id);

  if (cachedReviews.length !== initialLen) {
    saveReviewsToFile(cachedReviews);
    return res.json({ success: true, message: `Reseña ${id} eliminada.` });
  }

  return res.status(404).json({ success: false, error: "Reseña no encontrada." });
});

// --- AI CHATBOT ASSISTANT ENDPOINT (GEMINI) ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "El mensaje es obligatorio.",
      });
    }

    const cleanMessage = message.trim();
    const cleanLower = cleanMessage.toLowerCase();

    // Check if the user is asking to speak with the administrator or human support
    const asksForAdmin =
      cleanLower.includes("whatsapp") ||
      cleanLower.includes("humano") ||
      cleanLower.includes("administrador") ||
      cleanLower.includes("asesor") ||
      cleanLower.includes("persona") ||
      cleanLower.includes("llamar") ||
      cleanLower.includes("contacto directo") ||
      cleanLower.includes("numero");

    const ai = getGeminiClient();

    let reply = "";

    if (ai) {
      try {
        // Build contents array for multi-turn chat
        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-8)) {
            if (item && item.content && (item.role === "user" || item.role === "model")) {
              contents.push({
                role: item.role,
                parts: [{ text: item.content }],
              });
            }
          }
        }

        // Add current user turn
        contents.push({
          role: "user",
          parts: [{ text: cleanMessage }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents as any,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        reply = response.text || "";
      } catch (geminiError: any) {
        console.error("Error al invocar Gemini API en /api/chat:", geminiError);
      }
    }

    // High-quality local smart fallback if Gemini is offline or API key is not configured
    if (!reply) {
      // Off-topic query detection
      const offTopicKeywords = [
        "netflix", "spotify", "juego", "gta", "minecraft", "playstation", "xbox", "steam",
        "tarjeta de video", "laptop dell", "memoria ram", "disco duro", "celular", "iphone",
        "ropa", "comida", "restaurante", "clima", "vuelo", "hotel", "adobe", "photoshop", "canva"
      ];
      const isOffTopic = offTopicKeywords.some(k => cleanLower.includes(k));

      if (isOffTopic) {
        reply = `¡Hola! Con mucho gusto le atiendo. 😊\n\nEn **UpClic** nos especializamos **exclusivamente en licencias digitales y software oficial de Microsoft** (Office, Windows, Visio, Project y Combos) para garantizarle los mejores precios, entrega digital inmediata y garantía oficial.\n\nNo disponemos de productos de terceros o hardware físico. Si necesita activar o renovar **Microsoft Office** (desde S/ 18.00) o **Windows 10/11** (desde S/ 18.90), ¡dígame y le recomendaré la versión ideal para su equipo! 🛍️`;
      } else if (asksForAdmin) {
        reply = `¡Con mucho gusto! Puede comunicarse directamente con nuestro **Administrador Oficial y Soporte Técnico** por WhatsApp para atención personalizada, cotizaciones corporativas con RUC o asistencia remota:\n\n📱 **WhatsApp:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n⚡ **Atención rápida:** Lunes a Domingo de 8:00 AM a 11:00 PM.`;
      } else if (cleanLower.includes("cupón") || cleanLower.includes("descuento") || cleanLower.includes("promocion") || cleanLower.includes("oferta")) {
        reply = `🎉 ¡Tenemos excelentes promociones para usted!\n\n1. 🎁 **Cupón especial:** Aplique el código **\`${PROMO_COUPON_CODE}\`** en el carrito y obtenga **10% de descuento** en compras de productos desde S/ 40.00.\n2. 🔥 **Descuento por volumen:** Al llevar 2 o más productos, el carrito le aplica un **10% de descuento automático**.\n\n¿Desea que le recomiende alguna combinación en combo con super ahorro?`;
      } else if (cleanLower.includes("instalar") || cleanLower.includes("activar") || cleanLower.includes("descarga") || cleanLower.includes("como funciona")) {
        reply = `⚡ **El proceso de compra y activación en UpClic es súper rápido:**\n\n1. **Selección:** Elige su versión de Office o Windows y completa el pago (Yape, Plin, BCP, BBVA, Interbank o Mercado Pago).\n2. **Entrega Inmediata:** Recibe su clave original de 25 caracteres y el enlace de descarga oficial de Microsoft por correo y WhatsApp.\n3. **Descarga e Instalación:** Descarga la imagen ISO/IMG oficial e ingresa su clave para activación permanente.\n4. **Garantía:** Cuenta con 6 meses a 1 año de garantía y soporte técnico incluido.\n\nSi necesita asistencia guiada, nuestro administrador está listo para ayudarle en WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`;
      } else if (cleanLower.includes("office") || cleanLower.includes("word") || cleanLower.includes("excel")) {
        reply = `💼 **Opciones de Microsoft Office recomendadas en UpClic:**\n\n• **Office 2024 Professional Plus:** La versión más moderna y rápida para Windows 10/11. Pago único permanente a solo **S/ 25.00**.\n• **Office 2021 Professional Plus:** Muy estable y completo (Word, Excel, PowerPoint, Outlook, Access). Pago único a **S/ 20.00**.\n• **Microsoft 365 Profesional (1 año):** Incluye apps completas en hasta 5 dispositivos y **100 GB en la nube** a solo **S/ 46.50**.\n• **Office 2019 / 2016:** Para computadoras con Windows 7, 8.1 o 10 desde **S/ 18.00**.\n\n¿Para qué tipo de computadora o trabajo lo necesita? Le asesoro con gusto.`;
      } else if (cleanLower.includes("windows") || cleanLower.includes("win 11") || cleanLower.includes("win 10")) {
        reply = `💻 **Licencias oficiales de Windows en UpClic:**\n\n• **Windows 11 Pro (64-bit):** Máxima seguridad, velocidad y diseño moderno a solo **S/ 19.90**.\n• **Windows 10 Pro (32/64 bits):** Gran rendimiento y máxima compatibilidad a solo **S/ 18.90**.\n• **Combo Windows 11 Pro + Office 2024:** Las dos licencias oficiales juntas con super ahorro a solo **S/ 46.50**.\n\nTodas nuestras claves son de activación permanente y reinstalables en la misma máquina. 🛡️`;
      } else {
        reply = `¡Hola! Bienvenido a **UpClic**. 😊 Soy su Asistente Virtual y estoy aquí para ayudarle a resolver cualquier duda sobre nuestras licencias digitales de **Microsoft Office, Windows, Visio y Project**.\n\n¿En qué le puedo colaborar hoy?\n• 🛍️ Recomendarle la mejor suite de Office o Windows.\n• ⚡ Ayuda con la descarga o activación de su licencia.\n• 🎁 Información sobre cupones de descuento.\n• 📲 Contactar con nuestro Administrador por WhatsApp.`;
      }
    }

    // Detect mentioned products to attach rich cards
    const matchedProducts = products.filter((p) => {
      const pNameLower = p.name.toLowerCase();
      const pSlugLower = p.slug.toLowerCase();
      return (
        reply.toLowerCase().includes(p.name.toLowerCase()) ||
        cleanLower.includes(p.slug) ||
        (cleanLower.includes("2024") && pSlugLower.includes("2024")) ||
        (cleanLower.includes("365") && pSlugLower.includes("365")) ||
        (cleanLower.includes("combo") && pSlugLower.includes("combo"))
      );
    }).slice(0, 3);

    return res.json({
      success: true,
      reply,
      suggestedProducts: matchedProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        imageUrl: p.fallbackImage || p.imageUrl,
        badge: p.badge,
      })),
      adminWhatsAppUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
      adminWhatsAppDisplay: WHATSAPP_DISPLAY,
    });
  } catch (error: any) {
    console.error("Error en endpoint /api/chat:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno en el asistente virtual.",
      reply: `Disculpe la molestia. En este momento puede contactar directamente a nuestro Administrador por WhatsApp para atención inmediata: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`,
      adminWhatsAppUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
      adminWhatsAppDisplay: WHATSAPP_DISPLAY,
    });
  }
});

// --- VITE & STATIC MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      // Skip API and assets with extensions
      if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/@") || (req.path.includes(".") && !req.path.endsWith(".html"))) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexHtmlPath = path.join(process.cwd(), "index.html");
        let template = fs.readFileSync(indexHtmlPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const html = injectOpenGraphTags(template, req);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      try {
        const indexHtmlPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexHtmlPath)) {
          const template = fs.readFileSync(indexHtmlPath, "utf-8");
          const html = injectOpenGraphTags(template, req);
          return res.status(200).set({ "Content-Type": "text/html" }).send(html);
        }
      } catch (err) {
        console.error("Error serving index.html with OpenGraph:", err);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UpClic Server] Backend activo y escuchando en http://0.0.0.0:${PORT}`);
  });
}

startServer();
