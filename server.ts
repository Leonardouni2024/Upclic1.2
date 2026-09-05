import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { GoogleGenAI } from "@google/genai";
import { initialReviews } from "./src/initialReviews.ts";
import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, PROMO_COUPON_CODE } from "./src/products.ts";
import { sendOrderEmails, getTransporter, sendEmailWithFallback, diagnoseEmailStrategies } from "./emailService.ts";

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
- Responde como una persona real: cercano, empático, educado, paciente y muy claro.
- Responde directamente y resuelve por ti mismo cualquier duda o consulta del cliente sobre licencias, precios, diferencias entre versiones (OEM vs Retail), instalación, métodos de pago (Yape, Plin, BCP, BBVA, tarjetas) y cupones.
- Usa formato legible con viñetas y emojis amigables (🛍️, 💡, 🛡️, ⚡, 🔑).

REGLA FUNDAMENTAL SOBRE EL ADMINISTRADOR / SOPORTE HUMANO (MUY IMPORTANTE):
- NO derives ni envíes el enlace de WhatsApp del administrador de forma automática en preguntas normales. Responde tú mismo a todas las preguntas con la información de la tienda.
- ÚNICA EXCEPCIÓN: Si el cliente te pide EXPLÍCITAMENTE hablar con una persona humana, un asesor o con el administrador (o te pide su número de WhatsApp), en ese caso específico sí facilítale el contacto oficial:
  * WhatsApp Oficial: ${WHATSAPP_DISPLAY}
  * Enlace directo: https://wa.me/${WHATSAPP_NUMBER}

REGLAS DE CATÁLOGO (UPCLIC):
1. UpClic se especializa en licencias digitales originales de Microsoft (Office, Windows 10/11, Visio, Project y Combos).
2. Si el cliente pregunta por software ajeno (Adobe, juegos, streaming como Netflix o hardware físico): explica amablemente que UpClic se enfoca en software oficial Microsoft con activación de por vida y garantía, y ofrécele ayuda con Office o Windows.

DETALLES TÉCNICOS Y DE COMPRA QUE DEBES EXPLICAR DIRECTAMENTE:
- Entrega: 100% digital e inmediata tras el pago (por WhatsApp y correo).
- Activación permanente: Claves alfanuméricas originales de 25 caracteres para activar de por vida y reinstalables.
- Diferencia OEM vs Retail: OEM se vincula a la placa madre de la PC actual (económica y permanente); Retail se asocia a la cuenta Microsoft y permite transferirse a otra PC en el futuro.
- Microsoft 365: Cuenta oficial con usuario y contraseña (hasta 5 dispositivos + 100 GB en OneDrive).
- Medios de pago: Yape, Plin, transferencias (BCP, BBVA, Interbank) y tarjetas con Mercado Pago.
- Promociones:
  * Cupón "${PROMO_COUPON_CODE}": 10% de descuento en compras desde S/ 40.00.
  * 10% de descuento automático al llevar 2 o más productos.
- Garantía: 6 meses a 1 año de garantía oficial.

CATÁLOGO DE PRODUCTOS DISPONIBLES EN UPCLIC:
${productCatalogSummary}`;

// Middleware for parsing JSON
app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStoredOrders(): any[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading orders.json:", err);
  }
  return [];
}

function saveOrderNotification(orderData: any) {
  ensureDataDirectory();
  try {
    const orders = loadStoredOrders();
    const newRecord = {
      id: orderData.id || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...orderData
    };
    orders.unshift(newRecord);
    // Keep the most recent 250 orders/intents
    const trimmed = orders.slice(0, 250);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
    return newRecord;
  } catch (err) {
    console.error("Error saving order notification to orders.json:", err);
    return orderData;
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

// Enable CORS and JSON parsing for all API endpoints
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use("/api", express.json());

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

    // Check if the user is explicitly asking to speak with the administrator or human support
    const asksForAdmin =
      cleanLower.includes("quiero hablar con") ||
      cleanLower.includes("hablar con una persona") ||
      cleanLower.includes("hablar con un humano") ||
      cleanLower.includes("hablar con el administrador") ||
      cleanLower.includes("hablar con el admin") ||
      cleanLower.includes("atencion humana") ||
      cleanLower.includes("atención humana") ||
      cleanLower.includes("asesor humano") ||
      cleanLower.includes("pasame con un asesor") ||
      cleanLower.includes("pásame con un asesor") ||
      cleanLower.includes("dame el whatsapp") ||
      cleanLower.includes("tu whatsapp") ||
      cleanLower.includes("su whatsapp") ||
      cleanLower.includes("numero de whatsapp") ||
      cleanLower.includes("número de whatsapp") ||
      cleanLower.includes("quiero llamar");

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


// --- MERCADO PAGO INTEGRATION & ORDER NOTIFICATIONS ---
app.post("/api/create_preference", express.json(), async (req, res) => {
  try {
    const { items, discountAmount, discountReason, total, customerEmail, customerName, customerPhone } = req.body;
    
    // Validate required customer email
    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return res.status(400).json({
        error: "Por favor ingresa un correo electrónico válido para recibir tu licencia y comprobante."
      });
    }

    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    const trimmedPhone = typeof customerPhone === "string" ? customerPhone.trim() : "";

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken || accessToken === "YOUR_MERCADOPAGO_ACCESS_TOKEN" || accessToken.trim() === "") {
      return res.status(400).json({ 
        error: "MERCADOPAGO_ACCESS_TOKEN no está configurado en los Secretos. Por favor agrega tu Access Token de Mercado Pago en la sección de Secretos." 
      });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Calculate total original price from items (handling both CartItem and direct product formats)
    const originalTotal = items.reduce((sum: number, item: any) => {
      const price = Number(item.unitPrice ?? item.product?.price ?? item.price ?? 0);
      const qty = Number(item.quantity) || 1;
      return sum + (price * qty);
    }, 0);

    const finalTotal = typeof total === 'number' && total > 0 ? total : Math.max(0, originalTotal - (discountAmount || 0));
    const discountRatio = (originalTotal > 0) ? finalTotal / originalTotal : 1;

    let accumulatedSum = 0;
    const mpItems = items.map((item: any, index: number) => {
      const basePrice = Number(item.unitPrice ?? item.product?.price ?? item.price ?? 0);
      const qty = Math.max(1, Math.round(Number(item.quantity) || 1));
      
      const rawTitle = item.product?.name 
        ? (item.variantName ? `${item.product.name} (${item.variantName})` : item.product.name)
        : (item.name || 'Licencia Digital UpClic');
      
      const slug = item.product?.slug || item.slug || item.id || 'licencia-digital';

      let unitPrice = Number((basePrice * discountRatio).toFixed(2));
      if (unitPrice <= 0) unitPrice = 0.01;

      // Adjust rounding difference on the last item so the total matches finalTotal exactly
      if (index === items.length - 1 && items.length > 1) {
        const remainingNeeded = Number((finalTotal - accumulatedSum).toFixed(2));
        if (remainingNeeded > 0) {
          unitPrice = Number((remainingNeeded / qty).toFixed(2));
        }
      }

      accumulatedSum += unitPrice * qty;

      return {
        id: String(slug).substring(0, 256),
        title: String(rawTitle).substring(0, 256),
        description: String(rawTitle).substring(0, 256),
        unit_price: unitPrice,
        quantity: qty,
        currency_id: 'PEN',
      };
    });

    // Derive real public URL from APP_URL env, request origin/referer, or default to production domain
    const originHeader = req.get('origin') || req.get('referer');
    let appUrl = process.env.APP_URL;
    if (!appUrl && originHeader) {
      try {
        const parsed = new URL(originHeader);
        appUrl = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {
        // ignore
      }
    }
    if (!appUrl || appUrl.includes('localhost')) {
      appUrl = 'https://upclic.store';
    }
    appUrl = appUrl.replace(/\/$/, '');

    const preferenceBody: any = {
      items: mpItems,
      payer: {
        email: trimmedEmail,
        ...(trimmedName ? { name: trimmedName } : {}),
        ...(trimmedPhone ? { phone: { number: trimmedPhone } } : {})
      },
      metadata: {
        customer_email: trimmedEmail,
        customer_name: trimmedName,
        customer_phone: trimmedPhone,
        total_pen: finalTotal,
        items_count: items.length
      },
      back_urls: {
        success: `${appUrl}/checkout?status=success`,
        failure: `${appUrl}/checkout?status=failure`,
        pending: `${appUrl}/checkout?status=pending`,
      },
    };

    // Mercado Pago requires back_urls to be HTTPS for auto_return
    if (appUrl.startsWith('https://')) {
      preferenceBody.auto_return = 'approved';
    }

    const response = await preference.create({
      body: preferenceBody
    });

    // Save order notification to persistent storage
    const recordedOrder = saveOrderNotification({
      preferenceId: response.id,
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: finalTotal,
      items: items.map((it: any) => ({
        name: it.product?.name || it.name || 'Licencia',
        variantName: it.variantName || null,
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.product?.price || it.price || 0,
      })),
      discountAmount: discountAmount || 0,
      discountReason: discountReason || null,
      status: "intent_mercadopago",
      channel: "mercado_pago"
    });

    // Real-time server notification in logs for administrator
    console.log("\n=======================================================");
    console.log("🔔 [NOTIFICACIÓN UPCLIC] NUEVA INTENCIÓN DE COMPRA REGISTRADA");
    console.log(`📧 Correo del Cliente: ${trimmedEmail}`);
    if (trimmedName) console.log(`👤 Nombre/Razón Social: ${trimmedName}`);
    if (trimmedPhone) console.log(`📱 Teléfono: ${trimmedPhone}`);
    console.log(`💰 Monto a Pagar: S/ ${finalTotal.toFixed(2)}`);
    console.log(`📦 Licencias: ${items.map((it: any) => `${it.product?.name || it.name} (x${it.quantity || 1})`).join(', ')}`);
    console.log(`🆔 Preference Mercado Pago: ${response.id}`);
    console.log(`⏰ Fecha: ${new Date().toISOString()}`);
    console.log("=======================================================\n");

    // Trigger automated email notification (customer confirmation + admin alert)
    sendOrderEmails({
      orderId: recordedOrder.id,
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: finalTotal,
      items: recordedOrder.items,
      channel: "mercado_pago",
      status: "intent_mercadopago",
      paymentUrl: response.init_point,
      isPaid: false,
      discountAmount: discountAmount || 0,
      discountReason: discountReason || null,
      createdAt: recordedOrder.createdAt
    }).catch(err => console.error("Error al despachar correos:", err));

    res.json({
      id: response.id,
      init_point: response.init_point,
      orderId: recordedOrder.id,
      customerEmail: trimmedEmail
    });
  } catch (error: any) {
    console.error("Error MercadoPago completo:", error);
    let detailedMsg = "Error al conectar con Mercado Pago.";
    if (error?.message) {
      detailedMsg = error.message;
    }
    if (Array.isArray(error?.cause) && error.cause.length > 0) {
      detailedMsg = error.cause.map((c: any) => c.description || c.code || JSON.stringify(c)).join('; ');
    } else if (error?.cause?.description) {
      detailedMsg = error.cause.description;
    }
    res.status(500).json({ error: `Error Mercado Pago: ${detailedMsg}` });
  }
});

// Endpoint to notify administrator when customer proceeds via WhatsApp
app.post("/api/notify_checkout_intent", express.json(), (req, res) => {
  try {
    const { customerEmail, customerName, customerPhone, items, total, channel } = req.body;
    
    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return res.status(400).json({ error: "Correo electrónico no válido." });
    }

    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    const trimmedPhone = typeof customerPhone === "string" ? customerPhone.trim() : "";

    const recorded = saveOrderNotification({
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: Number(total || 0),
      items: Array.isArray(items) ? items.map((it: any) => ({
        name: it.product?.name || it.name || 'Licencia',
        variantName: it.variantName || null,
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.product?.price || it.price || 0,
      })) : [],
      status: "intent_whatsapp",
      channel: channel || "whatsapp"
    });

    console.log("\n=======================================================");
    console.log(`🔔 [NOTIFICACIÓN UPCLIC] CLIENTE AVANZÓ A COMPRA VÍA WHATSAPP`);
    console.log(`📧 Correo del Cliente: ${trimmedEmail}`);
    if (trimmedName) console.log(`👤 Nombre: ${trimmedName}`);
    if (trimmedPhone) console.log(`📱 Teléfono: ${trimmedPhone}`);
    console.log(`💰 Total: S/ ${Number(total || 0).toFixed(2)}`);
    console.log(`⏰ Fecha: ${new Date().toISOString()}`);
    console.log("=======================================================\n");

    // Trigger automated email notification (customer confirmation + admin alert)
    sendOrderEmails({
      orderId: recorded.id,
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: recorded.total,
      items: recorded.items,
      channel: "whatsapp",
      status: "intent_whatsapp",
      createdAt: recorded.createdAt
    }).catch(err => console.error("Error al despachar correos:", err));

    return res.json({ success: true, order: recorded });
  } catch (err: any) {
    console.error("Error en /api/notify_checkout_intent:", err);
    return res.status(500).json({ error: "Error al registrar notificación de checkout." });
  }
});

// Endpoint to register order details and immediately send confirmation email to customer
app.post("/api/register_customer_order", express.json(), async (req, res) => {
  try {
    const { customerEmail, customerName, customerPhone, items, total, discountAmount, discountReason, channel } = req.body;
    
    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return res.status(400).json({ error: "Correo electrónico no válido." });
    }

    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    const trimmedPhone = typeof customerPhone === "string" ? customerPhone.trim() : "";

    const recorded = saveOrderNotification({
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: Number(total || 0),
      items: Array.isArray(items) ? items.map((it: any) => ({
        name: it.product?.name || it.name || 'Licencia Digital',
        variantName: it.variantName || null,
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.product?.price || it.price || 0,
      })) : [],
      discountAmount: Number(discountAmount || 0),
      discountReason: discountReason || null,
      status: "order_registered",
      channel: channel || "email_registration"
    });

    console.log("\n=======================================================");
    console.log(`📩 [REGISTRO DIRECTO] CLIENTE REGISTRÓ SU CORREO EN CHECKOUT`);
    console.log(`📧 Correo del Cliente: ${trimmedEmail}`);
    if (trimmedName) console.log(`👤 Nombre: ${trimmedName}`);
    if (trimmedPhone) console.log(`📱 Teléfono: ${trimmedPhone}`);
    console.log(`💰 Total: S/ ${Number(total || 0).toFixed(2)}`);
    console.log(`⏰ Fecha: ${new Date().toISOString()}`);
    console.log("=======================================================\n");

    // Send email to customer and notification to admin
    const emailResult = await sendOrderEmails({
      orderId: recorded.id,
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: recorded.total,
      items: recorded.items,
      channel: channel || "email_registration",
      status: "order_registered",
      discountAmount: recorded.discountAmount,
      discountReason: recorded.discountReason,
      createdAt: recorded.createdAt
    });

    return res.json({
      success: true,
      order: recorded,
      emailSentToCustomer: emailResult.customerSent,
      emailSentToAdmin: emailResult.adminSent
    });
  } catch (err: any) {
    console.error("Error en /api/register_customer_order:", err);
    return res.status(500).json({ error: "Error al procesar registro de correo." });
  }
});

// Endpoint called when Mercado Pago redirects with status=approved/success
app.post("/api/confirm_payment_success", express.json(), async (req, res) => {
  try {
    const { orderId, paymentId, customerEmail, customerName, customerPhone, items, total } = req.body;

    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return res.status(400).json({ error: "Correo electrónico no válido." });
    }

    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    const trimmedPhone = typeof customerPhone === "string" ? customerPhone.trim() : "";
    const cleanPaymentId = paymentId ? String(paymentId) : "";
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    // Update existing order in orders.json or record newly confirmed order
    const orders = loadStoredOrders();
    const existingIndex = orders.findIndex((o: any) => o.id === finalOrderId || (cleanPaymentId && o.paymentId === cleanPaymentId));

    let recorded: any;
    if (existingIndex >= 0) {
      orders[existingIndex].status = "paid";
      orders[existingIndex].isPaid = true;
      orders[existingIndex].paymentId = cleanPaymentId || orders[existingIndex].paymentId;
      orders[existingIndex].paidAt = new Date().toISOString();
      if (!orders[existingIndex].customerEmail && trimmedEmail) {
        orders[existingIndex].customerEmail = trimmedEmail;
      }
      recorded = orders[existingIndex];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    } else {
      recorded = saveOrderNotification({
        id: finalOrderId,
        customerEmail: trimmedEmail,
        customerName: trimmedName || null,
        customerPhone: trimmedPhone || null,
        total: Number(total || 0),
        items: Array.isArray(items) ? items.map((it: any) => ({
          name: it.product?.name || it.name || 'Licencia Digital',
          variantName: it.variantName || null,
          quantity: it.quantity || 1,
          unitPrice: it.unitPrice || it.product?.price || it.price || 0,
        })) : [],
        paymentId: cleanPaymentId || null,
        status: "paid",
        isPaid: true,
        channel: "mercado_pago"
      });
    }

    console.log("\n=======================================================");
    console.log(`🎉 [PAGO CONFIRMADO MERCADO PAGO] PAGO APROBADO EXITOSAMENTE`);
    console.log(`🆔 ID Pedido: ${recorded.id}`);
    if (cleanPaymentId) console.log(`💳 Payment ID MP: #${cleanPaymentId}`);
    console.log(`📧 Correo Cliente: ${trimmedEmail}`);
    if (trimmedName) console.log(`👤 Nombre: ${trimmedName}`);
    if (trimmedPhone) console.log(`📱 Teléfono: ${trimmedPhone}`);
    console.log(`💰 Total Pagado: S/ ${Number(recorded.total || 0).toFixed(2)}`);
    console.log(`⏰ Fecha: ${new Date().toISOString()}`);
    console.log("=======================================================\n");

    // Send confirmation email to customer (with 10-30 min notice & Contact button) + admin alert
    const emailResult = await sendOrderEmails({
      orderId: recorded.id,
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: recorded.total,
      items: recorded.items,
      channel: "mercado_pago",
      status: "paid",
      isPaid: true,
      paymentId: cleanPaymentId,
      createdAt: recorded.createdAt
    });

    return res.json({
      success: true,
      order: recorded,
      emailSentToCustomer: emailResult.customerSent,
      emailSentToAdmin: emailResult.adminSent
    });
  } catch (err: any) {
    console.error("Error en /api/confirm_payment_success:", err);
    return res.status(500).json({ error: "Error al confirmar pago de orden." });
  }
});

// Endpoint to view captured customer orders & emails (for administrator)

// Endpoint for users to lookup their orders
app.get("/api/orders/lookup", (req, res) => {
  const email = req.query.email?.toString().toLowerCase().trim();
  const orderId = req.query.id?.toString().trim();
  
  if (!email && !orderId) {
    return res.status(400).json({ success: false, message: "Provide email or order ID" });
  }

  const orders = loadStoredOrders();
  const matchedOrders = orders.filter(o => {
    let match = false;
    if (email && o.customerEmail && o.customerEmail.toLowerCase() === email) match = true;
    if (orderId && o.id === orderId) match = true;
    if (orderId && o.paymentId === orderId) match = true;
    return match;
  });

  res.json({
    success: true,
    orders: matchedOrders
  });
});

app.get("/api/orders", (_req, res) => {
  const orders = loadStoredOrders();
  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// Endpoint to check SMTP / Email readiness
app.get("/api/admin/email_status", (_req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL || "leoch5829@gmail.com";
  const smtpUser = process.env.SMTP_USER || "leoch5829@gmail.com";
  const smtpPass = (process.env.SMTP_PASS || "bwnqzjkjjwbvrtym").replace(/\s+/g, "");
  const isConfigured = Boolean(
    smtpUser &&
    smtpPass &&
    !smtpUser.includes("tu-correo") &&
    !smtpPass.includes("tu-contrasena")
  );

  res.json({
    isConfigured,
    adminEmail,
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpUserConfigured: Boolean(smtpUser),
    message: isConfigured
      ? "Servicio de correo SMTP activo y listo para despachar correos automáticamente."
      : "SMTP no configurado en variables de entorno. Para enviar correos automáticos a clientes y a tu correo de admin, agrega SMTP_USER y SMTP_PASS (Contraseña de aplicación de Google)."
  });
});

// Endpoint to send a direct test email to leoch5829@gmail.com with multi-strategy fallback
app.post("/api/admin/send_test_email", async (_req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "leoch5829@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "upclic@upclic.store";

    const result = await sendEmailWithFallback({
      from: `"UpClic Store" <${fromEmail}>`,
      to: adminEmail,
      replyTo: adminEmail,
      subject: "UpClic - Verificacion de conexion de correo",
      text: `Hola Leo,

Este es un mensaje de confirmacion de envio desde tu servidor web de UpClic Store.

El despacho de correo se encuentra activo y autenticado correctamente.

Fecha: ${new Date().toLocaleString("es-PE")}
UpClic Store - Lima, Peru`,
      html: `
        <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0066FF; margin-top: 0;">Conexión de Correo Verificada</h2>
          <p style="font-size: 14px; color: #334155;">
            Hola Leo, este es un mensaje de confirmación enviado desde el servidor de <strong>UpClic Store</strong>.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #166534; font-size: 13px; font-weight: bold;">
              Servidor conectado correctamente para el despacho de correos.
            </p>
            <p style="margin: 6px 0 0; color: #15803d; font-size: 12px;">
              Los pedidos registrados se despachan con formato multipart (texto y HTML) y encabezados transaccionales.
            </p>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
            Enviado: ${new Date().toLocaleString("es-PE")} • UpClic Store
          </p>
        </div>
      `,
      headers: {
        "X-Priority": "3",
      }
    });

    if (result.success) {
      console.log("✅ [TEST EMAIL] Correo de prueba enviado con éxito vía:", result.strategyUsed);
      return res.json({
        success: true,
        strategyUsed: result.strategyUsed,
        recipient: adminEmail,
        message: `Correo de prueba enviado con éxito usando: ${result.strategyUsed}`
      });
    } else {
      console.error("❌ [TEST EMAIL] Falló envío en todas las estrategias:", result.error);
      return res.status(500).json({
        success: false,
        error: result.error || "No se pudo conectar a ningún transportador SMTP."
      });
    }
  } catch (err: any) {
    console.error("❌ [TEST EMAIL] Error al enviar correo de prueba:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error al autenticar con el servidor de correo."
    });
  }
});

// Endpoint to run full network/SMTP diagnostics on the active host (useful for Sevalla/Cloud)
app.get("/api/admin/diagnose_email", async (_req, res) => {
  try {
    const results = await diagnoseEmailStrategies();
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      user: process.env.SMTP_USER || "leoch5829@gmail.com",
      strategies: results
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Catch-all 404 handler for unmatched /api routes to prevent HTML responses
app.use("/api/*", (_req, res) => {
  res.status(404).json({
    error: "Ruta de API no encontrada. Si estás usando un hosting estático (como GitHub Pages), las funciones de servidor como Mercado Pago requieren que el backend Express esté activo."
  });
});

// Global API error middleware
app.use("/api", (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("API Error caught:", err);
  res.status(err?.status || 500).json({
    error: err?.message || "Error interno en el servidor Express."
  });
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
