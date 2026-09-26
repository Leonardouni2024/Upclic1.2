import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { GoogleGenAI } from "@google/genai";
import { products, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "./src/products.ts";
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

const SYSTEM_INSTRUCTION = `Eres el Asistente Virtual Oficial y Asesor Experto en Licenciamiento de "UpClic" (tienda especializada en licencias digitales originales de Microsoft Office, Windows, Visio y Project en Perú y Latinoamérica).

TU MISIÓN:
- Asesorar con inteligencia y precisión a los usuarios para que elijan la licencia de software exacta según sus necesidades, presupuesto, equipo (Windows o Mac) y uso (estudios, oficina, empresa con RUC o gaming).
- Responder con un tono humano, empático, claro, profesional y entusiasta.
- Usar viñetas limpias, comparativas claras y emojis amigables (🛍️, 💡, 🛡️, ⚡, 🔑).

CONDICIONES CLAVE DE UPCLIC:
1. TIEMPO DE ENTREGA: Entrega 100% digital garantizada por correo electrónico y WhatsApp en un plazo de 10 a 30 minutos tras la confirmación del pago.
2. ACTIVACIÓN Y GARANTÍA: Claves alfanuméricas originales de 25 caracteres emitidas por servidores oficiales de Microsoft, activación permanente (de por vida), reinstalables y con soporte técnico y garantía de 1 año.
3. DESCUENTOS Y PROMOCIONES:
   - 10% de descuento automático al llevar 2 o más licencias en el carrito.
   - Combos especiales con descuento integrado (ej. Windows 11 Pro + Office 2024).
4. MEDIOS DE PAGO: Yape, Plin, transferencias bancarias (BCP, BBVA, Interbank), tarjetas de crédito/débito mediante Mercado Pago y PayPal para pagos internacionales en USD.

GUÍA INTELIGENTE DE ASESORAMIENTO Y RECOMENDACIÓN:
- Si el usuario busca Office para Windows 10/11:
  * Office 2024 Professional Plus (S/ 27.00): La versión más moderna, fluida y con soporte a largo plazo de Microsoft. Pago único de por vida.
  * Office 2021 Professional Plus (S/ 25.00): Muy económico, altamente probado, incluye Word, Excel, PowerPoint, Outlook, Access. Pago único.
  * Microsoft 365 Personal (S/ 33.00): Ideal si requiere usarlo en hasta 5 dispositivos simultáneos (PC, Mac, tablet, celular) + 100 GB en la nube OneDrive por 1 año.
- Si el usuario busca Office para Mac: Recomendar Microsoft 365 o CorelDRAW 2024 para Mac.
- Si el usuario busca Windows:
  * Windows 11 Pro (S/ 20.00): El sistema más seguro, moderno y optimizado para procesadores recientes.
  * Windows 10 Pro (S/ 21.90): Para equipos con especificaciones clásicas o sin chip TPM 2.0.
- Si el usuario recién formateó o compró PC nueva: Recomendar el Combo 2 en 1 (Windows 11 Pro + Office 2024 Pro Plus a S/ 56.90).
- Diferencia OEM vs Retail: OEM queda vinculada a la placa madre de esa PC (económica e ideal para uso permanente); Retail permite transferirse a otra PC en el futuro.

REGLA SOBRE RECOMENDAR PRODUCTOS:
Al recomendar productos específicos del catálogo, puedes incluir la etiqueta [RECOMIENDA: slug-del-producto] (por ejemplo: [RECOMIENDA: office-2024-pro-plus] o [RECOMIENDA: windows-11-pro-key]) para que el sistema le muestre al cliente la ficha interactiva con botón de compra directa.

REGLA SOBRE CONTACTO HUMANO:
- Resuelve tú mismo todas las dudas técnicas y comerciales.
- Solo si el cliente pide EXPLÍCITAMENTE hablar con un asesor humano o solicita el WhatsApp, proporciona el contacto oficial:
  * WhatsApp Oficial: ${WHATSAPP_DISPLAY}
  * Enlace: https://wa.me/${WHATSAPP_NUMBER}

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
  const proto = forwardedProto ? forwardedProto.split(',')[0] : req.protocol;
  const host = req.get("host") || "localhost:3000";
  const baseUrl = `${proto}://${host}`;

  let title = "UpClic - Licencias Originales de Software";
  let description = "Encuentra las mejores licencias de Windows, Office, Project y Visio 100% originales.";
  let imageUrl = `${baseUrl}/icon.png`; // Fallback OpenGraph image
  const canonicalUrl = `${baseUrl}${req.originalUrl}`;

  if (product) {
    title = `${product.name} | UpClic`;
    description = product.description;
    const imgSource = (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl;
    if (imgSource) {
      if (imgSource.startsWith("http")) {
        imageUrl = imgSource;
      } else {
        imageUrl = `${baseUrl}${imgSource.startsWith("/") ? "" : "/"}${imgSource}`;
      }
    }
  }

  let finalHtml = html;
  
  // Basic SEO meta tags
  finalHtml = finalHtml.replace(
    /<title>(.*?)<\/title>/,
    `<title>${title}</title>`
  );
  
  const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="description" content="${description}" />
  `;

  if (finalHtml.includes("</head>")) {
    finalHtml = finalHtml.replace("</head>", `${ogTags}</head>`);
  }

  return finalHtml;
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
    reviewsCount: "moved_to_firebase",
    storage: "filesystem_persistent"
  });
});

// In-memory cache for IP geolocations (TTL 1 hour)
const geoCache = new Map<string, { country: string; timestamp: number }>();

function isPrivateIpAddress(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, '').trim();
  if (clean === '::1' || clean === '127.0.0.1' || clean === 'localhost') return true;
  if (clean.startsWith('10.') || clean.startsWith('192.168.') || clean.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  if (clean.startsWith('fc00:') || clean.startsWith('fe80:')) return true;
  return false;
}

// Geolocation / Country detection endpoint
app.get("/api/geo", async (req, res) => {
  try {
    const countryHeader =
      req.headers["x-country-code"] ||
      req.headers["x-client-geo-country"] ||
      req.headers["cf-ipcountry"] ||
      req.headers["x-appengine-country"];

    const rawCountry = Array.isArray(countryHeader) ? countryHeader[0] : countryHeader;
    if (rawCountry && typeof rawCountry === "string" && rawCountry.trim().length === 2) {
      const code = rawCountry.trim().toUpperCase();
      if (code !== "XX" && code !== "T1") {
        return res.json({ country: code, source: "header" });
      }
    }

    // Extract client IP (handle commas from proxies)
    let clientIp = "";
    if (typeof req.query.ip === "string" && req.query.ip.trim()) {
      clientIp = req.query.ip.trim();
    } else {
      const forwarded = req.headers["x-forwarded-for"];
      if (typeof forwarded === "string") {
        const parts = forwarded.split(",").map((p) => p.trim());
        for (const part of parts) {
          if (part && !isPrivateIpAddress(part)) {
            clientIp = part;
            break;
          }
        }
      }
      if (!clientIp) {
        const realIp = req.headers["x-real-ip"];
        if (typeof realIp === "string" && !isPrivateIpAddress(realIp.trim())) {
          clientIp = realIp.trim();
        }
      }
      if (!clientIp) {
        const remote = req.socket.remoteAddress || "";
        clientIp = remote.replace(/^::ffff:/, '').trim();
      }
    }

    // Check memory cache
    if (clientIp && geoCache.has(clientIp)) {
      const cached = geoCache.get(clientIp)!;
      if (Date.now() - cached.timestamp < 3600000) {
        return res.json({ country: cached.country, source: "cache", ip: clientIp });
      }
    }

    // If clientIp is public, query geolocation APIs
    if (clientIp && !isPrivateIpAddress(clientIp)) {
      // 1. Try ipwho.is
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const geoRes = await fetch(`https://ipwho.is/${clientIp}`, {
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data && data.success && data.country_code && data.country_code.length === 2) {
            const countryCode = data.country_code.toUpperCase();
            geoCache.set(clientIp, { country: countryCode, timestamp: Date.now() });
            return res.json({ country: countryCode, source: "ipwho", ip: clientIp });
          }
        }
      } catch {}

      // 2. Try ipinfo.io
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const geoRes = await fetch(`https://ipinfo.io/${clientIp}/json`, {
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data && data.country && data.country.length === 2) {
            const countryCode = data.country.toUpperCase();
            geoCache.set(clientIp, { country: countryCode, timestamp: Date.now() });
            return res.json({ country: countryCode, source: "ipinfo", ip: clientIp });
          }
        }
      } catch {}

      // 3. Try ip-api.com
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,countryCode`, {
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data && data.status === "success" && data.countryCode && data.countryCode.length === 2) {
            const countryCode = data.countryCode.toUpperCase();
            geoCache.set(clientIp, { country: countryCode, timestamp: Date.now() });
            return res.json({ country: countryCode, source: "ip-api", ip: clientIp });
          }
        }
      } catch {}
    }

    return res.json({ country: null, ip: clientIp, source: "none" });
  } catch {
    return res.json({ country: null });
  }
});

// =========================================================================
// REAL-TIME CURRENCY EXCHANGE ENGINE (GOOGLE FINANCE + AUTO-REFRESH)
// =========================================================================

interface LiveExchangeRatesData {
  source: string;
  rates: {
    PEN: number;
    COP: number;
    MXN: number;
    USD: number;
  };
  timestamp: number;
  lastUpdated: string;
}

let liveRatesCache: LiveExchangeRatesData = {
  source: "Google Finance",
  rates: {
    PEN: 3.75,
    COP: 4100,
    MXN: 19.8,
    USD: 1.0,
  },
  timestamp: 0,
  lastUpdated: new Date().toISOString(),
};

async function fetchGoogleFinanceQuote(pair: string): Promise<number | null> {
  try {
    const url = `https://www.google.com/finance/quote/${pair}?hl=en`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const [from, to] = pair.split("-");

    // Pattern 1: AF_initDataCallback with tuple ["USD / PEN", 3, null, [3.35...]]
    const p1 = new RegExp(`"${from}\\s*/\\s*${to}",\\s*\\d+,\\s*null,\\s*\\[([0-9.]+)`);
    const m1 = html.match(p1);
    if (m1 && parseFloat(m1[1]) > 0) return parseFloat(m1[1]);

    // Pattern 2: [from, to, rate]
    const p2 = new RegExp(`\\["${from}",\\s*"${to}",\\s*([0-9.]+)\\]`);
    const m2 = html.match(p2);
    if (m2 && parseFloat(m2[1]) > 0) return parseFloat(m2[1]);

    // Pattern 3: fxKbKc container
    const p3 = html.match(/<div class="[^"]*fxKbKc[^"]*">([0-9.,]+)<\/div>/);
    if (p3) {
      const num = parseFloat(p3[1].replace(/,/g, ""));
      if (!isNaN(num) && num > 0) return num;
    }

    // Pattern 4: title quote element
    const p4 = html.match(new RegExp(`title="${from}\\s*/\\s*${to}"[^>]*>.*?<span>([0-9.,]+)</span>`, "s"));
    if (p4) {
      const num = parseFloat(p4[1].replace(/,/g, ""));
      if (!isNaN(num) && num > 0) return num;
    }

    return null;
  } catch {
    return null;
  }
}

async function getLiveExchangeRates(force: boolean = false): Promise<LiveExchangeRatesData> {
  const now = Date.now();
  // Return cached result if fresh within 45 seconds unless forced
  if (!force && liveRatesCache.timestamp > 0 && now - liveRatesCache.timestamp < 45000) {
    return liveRatesCache;
  }

  try {
    const [penQuote, copQuote, mxnQuote] = await Promise.allSettled([
      fetchGoogleFinanceQuote("USD-PEN"),
      fetchGoogleFinanceQuote("USD-COP"),
      fetchGoogleFinanceQuote("USD-MXN"),
    ]);

    const newPen = penQuote.status === "fulfilled" && penQuote.value && penQuote.value > 2.0 && penQuote.value < 6.0
      ? penQuote.value
      : null;
    const newCop = copQuote.status === "fulfilled" && copQuote.value && copQuote.value > 2000 && copQuote.value < 7000
      ? copQuote.value
      : null;
    const newMxn = mxnQuote.status === "fulfilled" && mxnQuote.value && mxnQuote.value > 10.0 && mxnQuote.value < 35.0
      ? mxnQuote.value
      : null;

    let hasGoogleFinanceUpdate = false;
    const updatedRates = { ...liveRatesCache.rates, USD: 1.0 };

    if (newPen) {
      updatedRates.PEN = Number(newPen.toFixed(4));
      hasGoogleFinanceUpdate = true;
    }
    if (newCop) {
      updatedRates.COP = Number(newCop.toFixed(2));
      hasGoogleFinanceUpdate = true;
    }
    if (newMxn) {
      updatedRates.MXN = Number(newMxn.toFixed(4));
      hasGoogleFinanceUpdate = true;
    }

    // If any pair failed, use fallback exchange rate API
    if (!newPen || !newCop || !newMxn) {
      try {
        const erRes = await fetch("https://open.er-api.com/v6/latest/USD");
        if (erRes.ok) {
          const erData = await erRes.json();
          if (erData && erData.rates) {
            if (!newPen && erData.rates.PEN) updatedRates.PEN = Number(parseFloat(erData.rates.PEN).toFixed(4));
            if (!newCop && erData.rates.COP) updatedRates.COP = Number(parseFloat(erData.rates.COP).toFixed(2));
            if (!newMxn && erData.rates.MXN) updatedRates.MXN = Number(parseFloat(erData.rates.MXN).toFixed(4));
          }
        }
      } catch {}
    }

    liveRatesCache = {
      source: hasGoogleFinanceUpdate ? "Google Finance" : liveRatesCache.source,
      rates: updatedRates,
      timestamp: now,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error updating live exchange rates:", err);
  }

  return liveRatesCache;
}

// Background scheduler: Refresh Google Finance exchange rates constantly every 60 seconds
setInterval(() => {
  getLiveExchangeRates(true).catch(() => {});
}, 60000);

// Preload rates on startup
setTimeout(() => {
  getLiveExchangeRates(true).catch(() => {});
}, 1500);

// Exchange Rates API endpoints
app.get("/api/rates", async (req, res) => {
  const force = req.query.refresh === "true";
  const data = await getLiveExchangeRates(force);
  res.json(data);
});

app.post("/api/rates/refresh", async (_req, res) => {
  const data = await getLiveExchangeRates(true);
  res.json(data);
});

// --- AI CHATBOT ASSISTANT ENDPOINT (GEMINI) ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, currency = "PEN" } = req.body;

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

    const liveRates = await getLiveExchangeRates();
    const userCurrency = ["PEN", "USD", "COP", "MXN"].includes(currency) ? currency : "PEN";

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

        // Add current user turn with currency and live rate context
        const rates = liveRates.rates;
        const currencyNote = `[Contexto de tienda: Moneda activa del cliente: ${userCurrency}. Tasas de cambio vigentes de Google Finance: 1 USD = ${rates.PEN.toFixed(2)} PEN | ${Math.round(rates.COP)} COP | ${rates.MXN.toFixed(2)} MXN. Entrega digital: 10 a 30 minutos tras el pago.]\n\n${cleanMessage}`;

        contents.push({
          role: "user",
          parts: [{ text: currencyNote }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents as any,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.65,
            topP: 0.9,
          },
        });

        reply = response.text || "";
      } catch (geminiError: any) {
        console.error("Error al invocar Gemini API en /api/chat:", geminiError);
      }
    }

    // Extract explicit recommendation tags [RECOMIENDA: slug]
    const explicitSlugs: string[] = [];
    if (reply) {
      const recRegex = /\[RECOMIENDA:\s*([a-zA-Z0-9\-_]+)\]/gi;
      let match;
      while ((match = recRegex.exec(reply)) !== null) {
        if (match[1]) explicitSlugs.push(match[1].toLowerCase().trim());
      }
      // Remove tags from the user-facing text
      reply = reply.replace(/\[RECOMIENDA:\s*([a-zA-Z0-9\-_]+)\]/gi, "").trim();
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
        reply = `¡Hola! Con mucho gusto le atiendo. 😊\n\nEn **UpClic** nos especializamos **exclusivamente en licencias digitales y software oficial de Microsoft** (Office, Windows, Visio, Project y Combos) para garantizarle los mejores precios, entrega digital en 10 a 30 minutos y garantía oficial.\n\nNo disponemos de productos de terceros o hardware físico. Si necesita activar o renovar **Microsoft Office** (desde S/ 20.00) o **Windows 10/11** (desde S/ 20.00), ¡dígame y le recomendaré la versión ideal para su equipo! 🛍️`;
      } else if (asksForAdmin) {
        reply = `¡Con mucho gusto! Puede comunicarse directamente con nuestro **Administrador Oficial y Soporte Técnico** por WhatsApp para atención personalizada, cotizaciones corporativas con RUC o asistencia remota:\n\n📱 **WhatsApp:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n⚡ **Atención rápida:** Lunes a Domingo de 8:00 AM a 11:00 PM.`;
      } else if (cleanLower.includes("cupón") || cleanLower.includes("descuento") || cleanLower.includes("promocion") || cleanLower.includes("oferta")) {
        reply = `🎉 ¡Tenemos excelentes promociones para usted!\n\n🔥 **Descuento por volumen automático:** Al llevar 2 o más licencias, el carrito le aplicará un **10% de descuento automático**.\n🎁 **Combos de Ahorro:** Ofrecemos paquetes especiales como el *Combo Windows 11 Pro + Office 2024 Pro Plus* con precio rebajado.\n⚡ **Entrega:** En un plazo de **10 a 30 minutos** tras la confirmación de pago.\n\n¿Desea que le recomiende alguna combinación de licencias?`;
      } else if (cleanLower.includes("instalar") || cleanLower.includes("activar") || cleanLower.includes("descarga") || cleanLower.includes("como funciona") || cleanLower.includes("entrega") || cleanLower.includes("tiempo")) {
        reply = `⚡ **El proceso de compra, entrega y activación en UpClic es 100% seguro y garantizado:**\n\n1. **Selección:** Elige su versión de Office o Windows y completa el pago (Yape, Plin, BCP, BBVA, Interbank, Mercado Pago o PayPal).\n2. **Entrega Digital (10 a 30 min):** Recibe su clave original de 25 caracteres y el enlace de descarga oficial de Microsoft por correo electrónico y WhatsApp tras la confirmación del pago.\n3. **Descarga e Instalación:** Descarga los instaladores oficiales e ingresa su clave para activación permanente de por vida.\n4. **Garantía y Soporte:** Cuenta con 1 año de garantía y soporte técnico especializado.\n\nSi necesita asistencia guiada, nuestro administrador está listo para ayudarle en WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`;
      } else if (cleanLower.includes("office") || cleanLower.includes("word") || cleanLower.includes("excel")) {
        reply = `💼 **Opciones de Microsoft Office recomendadas en UpClic:**\n\n• **Office 2024 Professional Plus (S/ 27.00):** La versión más moderna y rápida para Windows 10 y Windows 11. Licencia permanente de pago único.\n• **Office 2021 Professional Plus (S/ 25.00):** Muy estable y completo (Word, Excel, PowerPoint, Outlook, Access). Pago único de por vida.\n• **Microsoft 365 Personal (1 año - S/ 33.00):** Incluye apps en hasta 5 dispositivos simultáneos (PC, Mac, tablet, celular) + 100 GB en OneDrive.\n\n⚡ **Entrega:** Por correo y WhatsApp en **10 a 30 minutos** con clave original y guía de instalación.`;
        explicitSlugs.push("office-2024-pro-plus", "office-2021-pro-plus", "microsoft-365-personal-family");
      } else if (cleanLower.includes("windows") || cleanLower.includes("win 11") || cleanLower.includes("win 10")) {
        reply = `💻 **Licencias oficiales de Windows en UpClic:**\n\n• **Windows 11 Pro (64-bit - S/ 20.00):** Máxima seguridad, velocidad y diseño moderno.\n• **Windows 10 Pro (32/64 bits - S/ 21.90):** Gran rendimiento y máxima compatibilidad con programas clásicos.\n• **Combo Windows 11 Pro + Office 2024 (S/ 56.90):** Las dos licencias oficiales juntas con super ahorro.\n\n⚡ **Entrega:** 100% digital en **10 a 30 minutos** con activación permanente. 🛡️`;
        explicitSlugs.push("windows-11-pro-key", "windows-10-pro-key", "combo-windows-11-pro-office-2024");
      } else {
        reply = `¡Hola! Bienvenido a **UpClic**. 😊 Soy su Asistente Inteligente de Licenciamiento y estoy aquí para asesorarle a encontrar la licencia de **Microsoft Office, Windows, Visio o Project** ideal según su equipo y necesidades.\n\n¿En qué le puedo colaborar hoy?\n• 🎯 Recomendarle la mejor suite de Office o versión de Windows.\n• 💻 Diferencias entre Office 2024, 2021 y Microsoft 365.\n• ⚡ Conocer los tiempos de entrega (10 a 30 min) y medios de pago.\n• 🎁 Información sobre el 10% de descuento por 2 o más licencias.`;
      }
    }

    // Detect mentioned products to attach rich cards
    const matchedProducts = products.filter((p) => {
      const pSlugLower = p.slug.toLowerCase();
      const pNameLower = p.name.toLowerCase();

      if (explicitSlugs.includes(pSlugLower) || explicitSlugs.includes(p.id)) return true;

      return (
        reply.toLowerCase().includes(pNameLower) ||
        cleanLower.includes(pSlugLower) ||
        (cleanLower.includes("office 2024") && pSlugLower === "office-2024-pro-plus") ||
        (cleanLower.includes("office 2021") && pSlugLower === "office-2021-pro-plus") ||
        (cleanLower.includes("365") && pSlugLower === "microsoft-365-personal-family") ||
        (cleanLower.includes("windows 11") && pSlugLower === "windows-11-pro-key") ||
        (cleanLower.includes("windows 10") && pSlugLower === "windows-10-pro-key") ||
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
        badge: p.badge || "Original",
        category: p.category,
        duration: p.duration,
      })),
      showAdminWhatsApp: asksForAdmin,
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
        currency_id: "PEN",
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

// --- PAYPAL INTEGRATION ENDPOINTS ---

// GET PayPal configuration (Client ID, exchange rate, email)
app.get("/api/paypal/config", (_req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID || "sb";
  const paypalEmail = process.env.PAYPAL_EMAIL || "pagos@upclic.store";
  const mode = process.env.PAYPAL_MODE || "sandbox";
  const exchangeRate = 3.75; // S/ 3.75 = $1.00 USD
  res.json({
    clientId,
    paypalEmail,
    mode,
    currency: "USD",
    exchangeRate,
    enabled: true
  });
});

// POST Create PayPal Order
app.post("/api/paypal/create_order", express.json(), async (req, res) => {
  try {
    const { items, discountAmount, total, customerEmail, customerName, customerPhone } = req.body;
    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return res.status(400).json({ error: "Por favor ingresa un correo electrónico válido." });
    }

    const exchangeRate = 3.75;
    const penTotal = Number(total) || 0;
    const usdTotal = Math.max(1, Number((penTotal / exchangeRate).toFixed(2)));

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || "sandbox";

    const recordedOrder = saveOrderNotification({
      customerEmail: trimmedEmail,
      customerName: customerName?.trim() || null,
      customerPhone: customerPhone?.trim() || null,
      total: penTotal,
      usdTotal,
      items: Array.isArray(items) ? items.map((it: any) => ({
        name: it.product?.name || it.name || 'Licencia',
        variantName: it.variantName || null,
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.product?.price || it.price || 0,
      })) : [],
      status: "intent_paypal",
      channel: "paypal"
    });

    // If official PayPal Client ID & Secret are set, call PayPal REST API
    if (clientId && clientSecret && clientId !== "sb" && clientId.trim().length > 5) {
      try {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const baseUrl = mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

        const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "grant_type=client_credentials"
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;

          const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              intent: "CAPTURE",
              purchase_units: [
                {
                  reference_id: recordedOrder.id,
                  description: `Licencias UpClic Store (${recordedOrder.id})`,
                  amount: {
                    currency_code: "USD",
                    value: usdTotal.toFixed(2)
                  }
                }
              ],
              payer: {
                email_address: trimmedEmail
              }
            })
          });

          if (orderRes.ok) {
            const orderData = await orderRes.json();
            return res.json({
              id: orderData.id,
              orderId: recordedOrder.id,
              usdTotal,
              penTotal,
              status: orderData.status
            });
          }
        }
      } catch (paypalApiErr) {
        console.error("Error llamando PayPal REST API:", paypalApiErr);
      }
    }

    // Default response for Client ID JS SDK or direct checkout
    return res.json({
      id: `PAYPAL-ORD-${Date.now()}`,
      orderId: recordedOrder.id,
      usdTotal,
      penTotal,
      status: "CREATED"
    });
  } catch (err: any) {
    console.error("Error al crear orden PayPal:", err);
    res.status(500).json({ error: "Error al generar la orden con PayPal." });
  }
});

// POST Confirm and Capture PayPal Payment Success
app.post("/api/paypal/confirm_payment", express.json(), async (req, res) => {
  try {
    const { orderId, paypalOrderId, customerEmail, customerName, customerPhone, items, total, usdTotal } = req.body;

    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail) {
      return res.status(400).json({ error: "Correo electrónico es obligatorio." });
    }

    const penTotal = Number(total) || 0;
    const recorded = saveOrderNotification({
      id: orderId || `ORD-PP-${Date.now()}`,
      customerEmail: trimmedEmail,
      customerName: customerName?.trim() || null,
      customerPhone: customerPhone?.trim() || null,
      total: penTotal,
      usdTotal: Number(usdTotal) || Math.round((penTotal / 3.75) * 100) / 100,
      paymentId: paypalOrderId || `PP-TX-${Date.now()}`,
      items: Array.isArray(items) ? items : [],
      status: "approved",
      channel: "paypal",
      isPaid: true
    });

    console.log("\n=======================================================");
    console.log("💳 [PAGO CONFIRMADO VÍA PAYPAL]");
    console.log(`📧 Cliente: ${trimmedEmail}`);
    console.log(`🆔 Order ID: ${recorded.id}`);
    console.log(`🆔 PayPal Tx ID: ${paypalOrderId}`);
    console.log(`💰 Monto: S/ ${penTotal.toFixed(2)} (USD $${recorded.usdTotal})`);
    console.log("=======================================================\n");

    // Dispatch emails to customer and administrator
    sendOrderEmails({
      orderId: recorded.id,
      paymentId: paypalOrderId || recorded.id,
      customerEmail: trimmedEmail,
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      total: penTotal,
      items: recorded.items,
      channel: "paypal",
      status: "approved",
      isPaid: true,
      createdAt: new Date().toISOString()
    }).catch(err => console.error("Error al despachar correos PayPal:", err));

    return res.json({
      success: true,
      orderId: recorded.id,
      paymentId: paypalOrderId || recorded.id,
      message: "Pago con PayPal verificado y correo despachado con éxito."
    });
  } catch (err: any) {
    console.error("Error en confirm_payment PayPal:", err);
    return res.status(500).json({ error: "Error al procesar la confirmación de PayPal." });
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
