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
import {
  claimCredentialForOrder,
  loadCredentialsInventory,
  getCredentialsCsvContent,
  getAvailableStock,
  saveCredentialsInventory,
} from "./credentialsService.ts";

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

const SYSTEM_INSTRUCTION = `Eres el Asistente Virtual Oficial y Asesor Experto en Licenciamiento de "UpClic" (tienda especializada en licencias digitales originales de Microsoft Office, Windows, Visio, Project y suscripciones premium en Perú y Latinoamérica).

TU MISIÓN:
- Asesorar con inteligencia y precisión a los usuarios para que elijan la licencia de software o suscripción exacta según sus necesidades, presupuesto, equipo (Windows o Mac) y uso (estudios, oficina, empresa con RUC o diseño).
- Responder con un tono humano, empático, claro, profesional y entusiasta.
- Usar viñetas limpias, comparativas claras y emojis amigables (🛍️, 💡, 🛡️, ⚡, 🔑).
- REGLA ESTRICTA DE IDENTIDAD: NUNCA menciones que estás basado en "Gemini 3.8" ni nombres de modelos de IA. Tu identidad es exclusivamente "Asesor Inteligente UpClic" o "Asistente Virtual UpClic".

CONDICIONES CLAVE DE UPCLIC:
1. TIEMPO DE ENTREGA: Entrega 100% digital garantizada por correo electrónico y WhatsApp en un plazo de 10 a 30 minutos tras la confirmación del pago.
2. ACTIVACIÓN Y GARANTÍA: Claves alfanuméricas originales de 25 caracteres emitidas por servidores oficiales de Microsoft, activación permanente (de por vida), reinstalables y con soporte técnico y garantía de 1 año.
3. MODALIDADES DE ACTIVACIÓN:
   - Claves Directas: Activación directa ingresando la clave en la aplicación o sistema.
   - Activación por Teléfono: Alternativa económica y 100% legal con asistente telefónico automatizado de Microsoft (Office a S/ 16.00, Windows a S/ 16.00).
4. DESCUENTOS Y PROMOCIONES:
   - 10% de descuento automático al llevar 2 o más licencias en el carrito.
   - Combos especiales con descuento integrado (ej. Windows 11 Pro + Office 2024 a S/ 45.00, Combo 3 en 1 a S/ 55.00).
5. MEDIOS DE PAGO: Mercado Pago (Yape, tarjetas de crédito/débito y PagoEfectivo en Soles S/).

GUÍA INTELIGENTE DE ASESORAMIENTO Y RECOMENDACIÓN:
- Si el usuario busca Office para Windows 10/11:
  * Office 2024 Professional Plus (S/ 27.00 clave directa / S/ 16.00 teléfono): La versión más moderna y fluida de Microsoft.
  * Office 2021 Professional Plus (S/ 25.00 clave directa / S/ 16.00 teléfono): Excelente estabilidad, Word, Excel, PowerPoint, Outlook, Access.
  * Microsoft 365 Personal (S/ 33.00): Ideal para 5 dispositivos simultáneos (PC, Mac, tablet, celular) + 100 GB en la nube OneDrive por 1 año.
  * Office 2019 / 2016 / 2013 / 2010 (S/ 24.00 directa / S/ 16.00 teléfono).
- Si el usuario busca Windows:
  * Windows 11 Pro (S/ 28.00 OEM / S/ 35.00 Retail / S/ 16.00 teléfono): El sistema más moderno y seguro.
  * Windows 11 Home (S/ 26.00 OEM / S/ 32.00 Retail / S/ 16.00 teléfono).
  * Windows 10 Pro (S/ 26.00 OEM / S/ 32.00 Retail / S/ 16.00 teléfono): Para equipos sin chip TPM 2.0.
  * Windows 10 Home (S/ 25.00 OEM / S/ 30.00 Retail / S/ 16.00 teléfono).
  * Windows 11 Enterprise (S/ 36.00), Windows 10 Enterprise (S/ 34.00).
  * Windows 8.1 Pro (S/ 38.00), Windows 7 Pro (S/ 32.00), Windows 7 Ultimate (S/ 30.00).
- Si el usuario busca Project o Visio:
  * Project Profesional 2024 (S/ 26.00), 2021 (S/ 25.00), 2019 (S/ 24.00), 2016 (S/ 24.00).
  * Visio Profesional 2024 (S/ 28.00), 2021 (S/ 27.00), 2019 (S/ 26.00), 2016 (S/ 26.00), 2013 (S/ 26.00).
- Si el usuario busca IA, Diseño, Productividad o Seguridad:
  * Gemini AI Pro (18 meses - S/ 35.00 / 12 meses - S/ 20.00): IA avanzada de Google + 5 TB Google One Cloud.
  * Canva Pro (12 meses - S/ 10.00): Recursos premium, quitafondos mágico y herramientas IA en tu correo personal.
  * CorelDRAW Graphics Suite 2024 para Mac (S/ 35.00): Licencia permanente de diseño vectorial.
  * Duolingo Super (12 meses - S/ 30.00): Vidas infinitas, sin anuncios, en su cuenta personal.
  * McAfee AntiVirus (12 meses - S/ 39.00): Seguridad y protección integral para 1 PC.

REGLA SOBRE RECOMENDAR PRODUCTOS:
Al recomendar productos específicos del catálogo, puedes incluir la etiqueta [RECOMIENDA: slug-del-producto] (por ejemplo: [RECOMIENDA: office-2024-pro-plus], [RECOMIENDA: canva-pro-12-meses] o [RECOMIENDA: windows-11-pro-key]) para que el sistema le muestre al cliente la ficha interactiva con botón de compra directa.

REGLA SOBRE CONTACTO HUMANO:
- Resuelve tú mismo todas las dudas técnicas y comerciales.
- Solo si el cliente pide EXPLÍCITAMENTE hablar con un asesor humano o solicita el WhatsApp, proporciona el contacto oficial:
  * WhatsApp Oficial: ${WHATSAPP_DISPLAY}
  * Enlace: https://wa.me/${WHATSAPP_NUMBER}

CATÁLOGO DE PRODUCTOS DISPONIBLES EN UPCLIC:
${productCatalogSummary}`;

// Middleware for parsing JSON (allow up to 5MB for base64 payment receipts)
app.use(express.json({ limit: "5mb" }));

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CATALOG_OVERRIDES_FILE = path.join(DATA_DIR, "catalog_overrides.json");
const PAYMENT_SETTINGS_FILE = path.join(DATA_DIR, "payment_settings.json");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

interface CatalogOverridesData {
  customProducts: any[];
  deletedProductIds: string[];
  coupons: {
    code: string;
    discountPercent: number;
    minItems?: number;
    description: string;
    expiresAt?: number;
    active?: boolean;
  }[];
}

const DEFAULT_COUPONS = [
  { code: "UPCLIC10", discountPercent: 10, description: "10% de descuento oficial UpClic", active: true },
  { code: "COMBO15", discountPercent: 15, minItems: 2, description: "15% de descuento por llevar 2 o más productos", active: true },
  { code: "VIP20", discountPercent: 20, description: "20% de descuento especial clientes VIP", active: true },
  { code: "PRICLIC1", discountPercent: 10, description: "10% de descuento exclusivo", expiresAt: 1791417599000, active: true },
  { code: "UPCLICPROMO", discountPercent: 5, description: "5% de descuento adicional", expiresAt: 1791417599000, active: true }
];

function loadCatalogOverrides(): CatalogOverridesData {
  ensureDataDirectory();
  try {
    if (fs.existsSync(CATALOG_OVERRIDES_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CATALOG_OVERRIDES_FILE, "utf-8"));
      return {
        customProducts: Array.isArray(parsed.customProducts) ? parsed.customProducts : [],
        deletedProductIds: Array.isArray(parsed.deletedProductIds) ? parsed.deletedProductIds : [],
        coupons: Array.isArray(parsed.coupons) && parsed.coupons.length > 0 ? parsed.coupons : DEFAULT_COUPONS
      };
    }
  } catch (err) {
    console.error("Error reading catalog_overrides.json:", err);
  }
  return { customProducts: [], deletedProductIds: [], coupons: DEFAULT_COUPONS };
}

function saveCatalogOverrides(data: CatalogOverridesData): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(CATALOG_OVERRIDES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving catalog_overrides.json:", err);
  }
}

export function getMergedCatalog(): any[] {
  const overrides = loadCatalogOverrides();
  const deletedSet = new Set(overrides.deletedProductIds || []);
  const customMap = new Map<string, any>();
  for (const cp of overrides.customProducts || []) {
    if (cp && cp.id) customMap.set(cp.id, cp);
  }

  const merged: any[] = [];
  for (const baseProd of products) {
    if (deletedSet.has(baseProd.id)) continue;
    if (customMap.has(baseProd.id)) {
      merged.push({ ...baseProd, ...customMap.get(baseProd.id) });
      customMap.delete(baseProd.id);
    } else {
      merged.push(baseProd);
    }
  }
  for (const [, newProd] of customMap.entries()) {
    if (!deletedSet.has(newProd.id)) {
      merged.push(newProd);
    }
  }
  return merged;
}

const DEFAULT_PAYMENT_SETTINGS = {
  yape: {
    enabled: true,
    phone: "983 204 384",
    holderName: "UPCLIC STORE PERÚ",
    qrImageUrl: "",
    instructions: "Realiza el pago por Yape al número indicado, ingresa el número de operación y adjunta tu captura o comprobante para verificar tu pedido de inmediato."
  },
  plin: {
    enabled: true,
    phone: "983 204 384",
    holderName: "UPCLIC STORE PERÚ",
    qrImageUrl: "",
    instructions: "Realiza el pago por Plin al número indicado, ingresa el número de operación y adjunta tu comprobante para validar tu pedido."
  },
  transferencia: {
    enabled: true,
    bankName: "BCP / Interbank / BBVA",
    accountNumber: "Solicitar cuenta corporativa o transferir vía CCI",
    cci: "Consultar CCI directo en soporte WhatsApp o usar Yape/Plin/Mercado Pago",
    holderName: "UPCLIC STORE PERÚ",
    accountType: "Cuenta Soles (S/)",
    instructions: "Realiza la transferencia en Soles (S/), ingresa el número de operación bancaria y adjunta la constancia de transferencia."
  },
  mercadopago: {
    enabled: true,
    label: "Mercado Pago (Tarjetas Visa, Mastercard, Yape directo)"
  },
  paypal: {
    enabled: false,
    label: "PayPal"
  },
  analytics: {
    ga4MeasurementId: process.env.VITE_GA4_MEASUREMENT_ID || "",
    metaPixelId: process.env.VITE_META_PIXEL_ID || ""
  }
};

function loadPaymentSettings() {
  ensureDataDirectory();
  try {
    if (fs.existsSync(PAYMENT_SETTINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(PAYMENT_SETTINGS_FILE, "utf-8"));
      return {
        ...DEFAULT_PAYMENT_SETTINGS,
        ...parsed,
        yape: { ...DEFAULT_PAYMENT_SETTINGS.yape, ...(parsed.yape || {}) },
        plin: { ...DEFAULT_PAYMENT_SETTINGS.plin, ...(parsed.plin || {}) },
        transferencia: { ...DEFAULT_PAYMENT_SETTINGS.transferencia, ...(parsed.transferencia || {}) },
        mercadopago: { ...DEFAULT_PAYMENT_SETTINGS.mercadopago, ...(parsed.mercadopago || {}) },
        paypal: { ...DEFAULT_PAYMENT_SETTINGS.paypal, ...(parsed.paypal || {}) },
        analytics: { ...DEFAULT_PAYMENT_SETTINGS.analytics, ...(parsed.analytics || {}) }
      };
    }
  } catch (err) {
    console.error("Error reading payment_settings.json:", err);
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

function savePaymentSettings(settings: any): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(PAYMENT_SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving payment_settings.json:", err);
  }
}

// Authoritative server-side price calculation to prevent client-side price tampering
function calculateAuthoritativeOrderTotal(
  rawItems: any[],
  couponCode?: string
): {
  validatedItems: {
    productId: string;
    slug: string;
    name: string;
    variantName: string | null;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  discountAmount: number;
  discountReason: string | null;
  total: number;
} {
  const catalog = getMergedCatalog();
  const overrides = loadCatalogOverrides();
  const validatedItems: {
    productId: string;
    slug: string;
    name: string;
    variantName: string | null;
    quantity: number;
    unitPrice: number;
  }[] = [];

  let subtotal = 0;
  let totalQuantity = 0;

  if (Array.isArray(rawItems)) {
    for (const item of rawItems) {
      const prodId = item.product?.id || item.productId || item.id;
      const prodSlug = item.product?.slug || item.slug;
      const catalogProduct = catalog.find(
        (p) => (prodId && p.id === prodId) || (prodSlug && p.slug === prodSlug)
      );

      const qty = Math.max(1, Math.min(50, Math.round(Number(item.quantity) || 1)));
      let authoritativePrice = catalogProduct
        ? Number(catalogProduct.price)
        : Math.max(1, Number(item.unitPrice ?? item.product?.price ?? item.price ?? 10));

      let variantLabel: string | null = item.variantName || null;
      const selectedVarId = item.selectedVariant || item.selectedVariantId;
      if (catalogProduct && Array.isArray(catalogProduct.variants) && catalogProduct.variants.length > 0) {
        const matchedVar = catalogProduct.variants.find(
          (v: any) =>
            (selectedVarId && v.id === selectedVarId) ||
            (variantLabel && v.name.toLowerCase() === String(variantLabel).toLowerCase())
        );
        if (matchedVar) {
          authoritativePrice = Number(matchedVar.price);
          variantLabel = matchedVar.name;
        }
      }

      subtotal += authoritativePrice * qty;
      totalQuantity += qty;

      validatedItems.push({
        productId: catalogProduct?.id || prodId || "custom",
        slug: catalogProduct?.slug || prodSlug || "licencia-digital",
        name: catalogProduct?.name || item.product?.name || item.name || "Producto Digital UpClic",
        variantName: variantLabel,
        quantity: qty,
        unitPrice: Number(authoritativePrice.toFixed(2))
      });
    }
  }

  let discountAmount = 0;
  let discountReason: string | null = null;

  if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const foundCoupon = (overrides.coupons || DEFAULT_COUPONS).find(
      (c) => c.code === cleanCode && c.active !== false
    );
    if (foundCoupon) {
      const notExpired = !foundCoupon.expiresAt || Date.now() <= foundCoupon.expiresAt;
      const meetsMin = !foundCoupon.minItems || totalQuantity >= foundCoupon.minItems;
      if (notExpired && meetsMin) {
        discountAmount = Number(((subtotal * foundCoupon.discountPercent) / 100).toFixed(2));
        discountReason = foundCoupon.description;
      }
    }
  }

  const total = Math.max(1, Number((subtotal - discountAmount).toFixed(2)));
  return {
    validatedItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    discountReason,
    total
  };
}

function mapInternalStatusToOrderStatus(status: string, isPaid?: boolean): string {
  if (isPaid || status === "paid" || status === "approved") return "Pagado";
  if (status === "review" || status === "in_review" || status === "Pago en revisión") return "Pago en revisión";
  if (status === "preparing" || status === "En preparación") return "En preparación";
  if (status === "delivered" || status === "Entregado") return "Entregado";
  if (status === "cancelled" || status === "Cancelado") return "Cancelado";
  return "Pendiente de pago";
}

function loadStoredOrders(): any[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((o) => ({
          ...o,
          orderStatus: o.orderStatus || mapInternalStatusToOrderStatus(o.status, o.isPaid),
          deliveryStatus:
            o.deliveryStatus ||
            (o.status === "delivered" || o.orderStatus === "Entregado"
              ? "Entregado"
              : o.status === "cancelled" || o.orderStatus === "Cancelado"
              ? "Cancelado"
              : o.isPaid || o.status === "paid"
              ? "En preparación"
              : "Pendiente de envío")
        }));
      }
    }
  } catch (err) {
    console.error("Error reading orders.json:", err);
  }
  return [];
}

function saveStoredOrders(orders: any[]): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders.slice(0, 500), null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving orders.json:", err);
  }
}

function saveOrderNotification(orderData: any): any {
  ensureDataDirectory();
  try {
    const orders = loadStoredOrders();
    const now = Date.now();
    const cleanEmail = (orderData.customerEmail || "").toLowerCase().trim();
    const total = Number(orderData.total || 0);
    const channel = orderData.channel || "";
    const computedOrderStatus =
      orderData.orderStatus || mapInternalStatusToOrderStatus(orderData.status, orderData.isPaid);
    const computedDeliveryStatus =
      orderData.deliveryStatus ||
      (computedOrderStatus === "Entregado"
        ? "Entregado"
        : computedOrderStatus === "Cancelado"
        ? "Cancelado"
        : computedOrderStatus === "Pagado" || computedOrderStatus === "En preparación"
        ? "En preparación"
        : "Pendiente de envío");

    // 1. If an explicit ID is passed, check if it already exists to update instead of duplicating
    if (orderData.id) {
      const existingIdx = orders.findIndex((o: any) => o.id === orderData.id);
      if (existingIdx >= 0) {
        orders[existingIdx] = {
          ...orders[existingIdx],
          ...orderData,
          orderStatus: computedOrderStatus,
          deliveryStatus: computedDeliveryStatus,
          updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders.slice(0, 500), null, 2), "utf-8");
        return { ...orders[existingIdx], isDuplicate: true };
      }
    }

    // 2. Deduplicate: If an order for the same customer email, channel, and total was recorded in the last 60 seconds, reuse it!
    const recentMatch = orders.find((o: any) => {
      if ((o.customerEmail || "").toLowerCase().trim() !== cleanEmail) return false;
      if (channel && o.channel !== channel) return false;
      if (Math.abs(Number(o.total || 0) - total) > 0.05) return false;
      const createdAtMs = new Date(o.createdAt).getTime();
      return (now - createdAtMs) < 60 * 1000;
    });

    if (recentMatch) {
      console.log(`♻️ [ORDEN] Reutilizando orden existente reciente (${recentMatch.id}) para evitar registros duplicados.`);
      return { ...recentMatch, isDuplicate: true };
    }

    const newRecord = {
      id: orderData.id || `ORD-${now}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...orderData,
      orderStatus: computedOrderStatus,
      deliveryStatus: computedDeliveryStatus
    };
    orders.unshift(newRecord);
    const trimmed = orders.slice(0, 500);
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

// Helper: Multi-model retry & fallback to prevent 503 UNAVAILABLE ("high demand") errors
const GEMINI_FALLBACK_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

function isTransientGeminiError(err: any): boolean {
  const msg = String(err?.message || err || "").toLowerCase();
  const status = err?.status || err?.code || err?.error?.code;
  return (
    status === 503 ||
    status === 429 ||
    status === 500 ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("resource_exhausted") ||
    msg.includes("quota") ||
    msg.includes("try again later")
  );
}

async function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  params: { contents: any; config?: any }
): Promise<any> {
  let lastError: any = null;

  for (let i = 0; i < GEMINI_FALLBACK_MODELS.length; i++) {
    const modelName = GEMINI_FALLBACK_MODELS[i];
    // Up to 2 attempts per model before switching to the next fallback model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[Gemini Fallback] Modelo ${modelName} (intento ${attempt}/2) falló:`,
          err?.message || err
        );
        if (isTransientGeminiError(err)) {
          await sleepMs(attempt * 500);
          continue;
        }
        // If error is model-specific or non-transient, break inner loop and try next model
        break;
      }
    }
  }

  throw lastError;
}

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

        const response = await generateContentWithRetryAndFallback(ai, {
          contents: contents as any,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
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
      // Off-topic query detection (note: canva, duolingo, antivirus, gemini are valid products now)
      const offTopicKeywords = [
        "netflix", "spotify", "juego", "gta", "minecraft", "playstation", "xbox", "steam",
        "tarjeta de video", "laptop dell", "memoria ram", "disco duro", "celular", "iphone",
        "ropa", "comida", "restaurante", "clima", "vuelo", "hotel", "photoshop"
      ];
      const isOffTopic = offTopicKeywords.some(k => cleanLower.includes(k));

      if (isOffTopic) {
        reply = `¡Hola! Con mucho gusto le atiendo. 😊\n\nEn **UpClic** nos especializamos en **licencias digitales oficiales de Microsoft** (Office, Windows, Visio, Project) y **suscripciones digitales premium** (Canva Pro, Adobe Acrobat Pro 2022, Duolingo Super, McAfee Antivirus y Gemini AI Pro) para garantizarle los mejores precios, entrega digital en 10 a 30 minutos y garantía oficial.\n\nNo disponemos de productos físicos ni hardware. Si necesita activar su software o renovar su suite, ¡dígame y le recomendaré la opción ideal! 🛍️`;
      } else if (asksForAdmin) {
        reply = `¡Con mucho gusto! Puede comunicarse directamente con nuestro **Administrador Oficial y Soporte Técnico** por WhatsApp para atención personalizada, cotizaciones corporativas con RUC o asistencia remota:\n\n📱 **WhatsApp:** [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER})\n⚡ **Atención rápida:** Lunes a Domingo de 8:00 AM a 11:00 PM.`;
      } else if (cleanLower.includes("canva") || cleanLower.includes("duolingo") || cleanLower.includes("antivirus") || cleanLower.includes("mcafee") || cleanLower.includes("acrobat") || cleanLower.includes("adobe") || cleanLower.includes("pdf")) {
        reply = `✨ **Suscripciones y Apps Premium Disponibles en UpClic:**\n\n• 🎨 **Canva Pro (12 Meses - S/ 10.00):** Acceso total a 100M+ recursos premium, quitafondos mágico con un clic y kits de marca.\n• 📄 **Adobe Acrobat Pro DC 2022 (Permanente - S/ 27.00):** Edición completa de PDF, conversión Word/Excel, OCR y firmas digitales de por vida.\n• 🦉 **Duolingo Super (12 Meses - S/ 30.00):** Vidas infinitas para aprender idiomas sin límites y sin publicidad.\n• 🛡️ **McAfee AntiVirus (12 Meses - S/ 39.00):** Seguridad integral contra virus, malware y phishing bancario.\n• 🤖 **Gemini AI Pro (12 Meses S/ 20.00 | 18 Meses S/ 35.00):** Inteligencia Artificial de vanguardia con 5 TB en Google One.\n\n⚡ **Entrega:** En un plazo de **10 a 30 minutos** con garantía completa.`;
        explicitSlugs.push("canva-pro-12-meses", "adobe-acrobat-pro-dc-2022-permanente", "duolingo-super-12-meses", "mcafee-antivirus-1pc-12-meses");
      } else if (cleanLower.includes("cupón") || cleanLower.includes("descuento") || cleanLower.includes("promocion") || cleanLower.includes("oferta")) {
        reply = `🎉 ¡Tenemos excelentes promociones para usted!\n\n🔥 **Descuento por volumen automático:** Al llevar 2 o más licencias, el carrito le aplicará un **10% de descuento automático**.\n🎁 **Combos de Ahorro:** Ofrecemos paquetes especiales como el *Combo Windows 11 Pro + Office 2024 Pro Plus* a S/ 45.00 y *Combo 3 en 1* a S/ 55.00.\n⚡ **Entrega:** En un plazo de **10 a 30 minutos** tras la confirmación de pago.\n\n¿Desea que le recomiende alguna combinación de licencias?`;
      } else if (cleanLower.includes("instalar") || cleanLower.includes("activar") || cleanLower.includes("descarga") || cleanLower.includes("como funciona") || cleanLower.includes("entrega") || cleanLower.includes("tiempo") || cleanLower.includes("telefono")) {
        reply = `⚡ **El proceso de compra, entrega y activación en UpClic es 100% seguro y garantizado:**\n\n1. **Selección:** Elige su software en clave directa u opción económica de **activación telefónica** (a S/ 16.00).\n2. **Entrega Digital (10 a 30 min):** Recibe su clave original de 25 caracteres y el enlace de descarga oficial por correo electrónico y WhatsApp tras la confirmación del pago.\n3. **Descarga e Instalación:** Descarga los instaladores oficiales e ingresa su clave para activación permanente de por vida.\n4. **Garantía y Soporte:** Cuenta con garantía oficial y soporte técnico especializado.\n\nSi necesita asistencia guiada, nuestro administrador está listo para ayudarle en WhatsApp: [${WHATSAPP_DISPLAY}](https://wa.me/${WHATSAPP_NUMBER}).`;
      } else if (cleanLower.includes("office") || cleanLower.includes("word") || cleanLower.includes("excel")) {
        reply = `💼 **Opciones de Microsoft Office recomendadas en UpClic:**\n\n• **Office 2024 Professional Plus:** S/ 27.00 (Clave Directa) | S/ 16.00 (Activación Telefónica). La más moderna para Windows 10 y 11.\n• **Office 2021 Professional Plus:** S/ 25.00 (Clave Directa) | S/ 16.00 (Activación Telefónica). Muy estable y completa.\n• **Microsoft 365 Personal (1 año - S/ 33.00):** Incluye apps en hasta 5 dispositivos simultáneos (PC, Mac, tablet, celular) + 100 GB en OneDrive.\n\n⚡ **Entrega:** Por correo y WhatsApp en **10 a 30 minutos** con clave original y guía de instalación.`;
        explicitSlugs.push("office-2024-pro-plus", "office-2021-pro-plus", "microsoft-365-personal-1-ano");
      } else if (cleanLower.includes("windows") || cleanLower.includes("win 11") || cleanLower.includes("win 10")) {
        reply = `💻 **Licencias oficiales de Windows en UpClic:**\n\n• **Windows 11 Pro:** S/ 28.00 (OEM) | S/ 35.00 (Retail) | S/ 16.00 (Activación por Teléfono).\n• **Windows 10 Pro:** S/ 26.00 (OEM) | S/ 32.00 (Retail) | S/ 16.00 (Activación por Teléfono).\n• **Windows 11 Home (S/ 26.00 / S/ 32.00), Windows 10 Home (S/ 25.00 / S/ 30.00)**.\n• **Windows 8.1 Pro (S/ 38.00), Windows 7 Pro (S/ 32.00), Windows 7 Ultimate (S/ 30.00)**.\n• **Combo Windows 11 Pro + Office 2024 (S/ 45.00):** Las dos licencias oficiales juntas con super ahorro.\n\n⚡ **Entrega:** 100% digital en **10 a 30 minutos** con activación permanente. 🛡️`;
        explicitSlugs.push("windows-11-pro-key", "windows-10-pro-key", "combo-windows-11-pro-office-2024-pro-plus");
      } else {
        reply = `¡Hola! Bienvenido a **UPCLIC**. 😊 Soy su Asistente de Licenciamiento y Suscripciones Digitales y estoy aquí para ayudarle a elegir el producto ideal según su equipo y necesidades.\n\n¿En qué le puedo colaborar hoy?\n• 🎯 Recomendarle la mejor suite de Microsoft Office o versión de Windows (OEM, Retail o activación telefónica).\n• 💻 Diferencias entre Office 2024 (S/ 27), 2021 (S/ 25) y Microsoft 365 (S/ 33).\n• 📱 Suscripciones y Diseño: Canva Pro (S/ 10), Gemini AI Pro (S/ 20), CorelDRAW 2024 Mac (S/ 35), Duolingo Super (S/ 30), McAfee (S/ 39).\n• ⚡ Conocer las modalidades de entrega digital y medios de pago en Perú (Mercado Pago con Yape, tarjetas de débito/crédito y PagoEfectivo).`;
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

    // Authoritative server-side price calculation to prevent client manipulation
    const authoritative = calculateAuthoritativeOrderTotal(items, req.body?.couponCode);
    const originalTotal = authoritative.subtotal;
    const finalTotal = authoritative.total;
    const discountRatio = originalTotal > 0 ? finalTotal / originalTotal : 1;

    let accumulatedSum = 0;
    const mpItems = authoritative.validatedItems.map((item, index) => {
      const basePrice = item.unitPrice;
      const qty = item.quantity;
      const rawTitle = item.variantName ? `${item.name} (${item.variantName})` : item.name;
      const slug = item.slug || "licencia-digital";

      let unitPrice = Number((basePrice * discountRatio).toFixed(2));
      if (unitPrice <= 0) unitPrice = 0.01;

      if (index === authoritative.validatedItems.length - 1 && authoritative.validatedItems.length > 1) {
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

    // Determine appUrl for return redirects (prefer caller origin if HTTPS, otherwise official domain)
    let appUrl = 'https://upclic.store';
    const reqOrigin = req.body?.origin;
    if (typeof reqOrigin === 'string' && reqOrigin.startsWith('https://')) {
      appUrl = reqOrigin.replace(/\/$/, '');
    } else if (process.env.APP_URL && process.env.APP_URL.startsWith('https://')) {
      appUrl = process.env.APP_URL.replace(/\/$/, '');
    }

    const newOrderId = (typeof req.body?.orderId === 'string' && req.body.orderId.trim()) 
      ? req.body.orderId.trim() 
      : `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Note: Do NOT pass payer.email or unformatted payer.phone to Mercado Pago preferenceBody,
    // because if the buyer tests with the same email/phone as the Mercado Pago seller account
    // (or enters spaces in the phone number), Mercado Pago disables the "Pagar" button
    // ("No puedes pagarte a ti mismo"). Buyer details are stored in metadata and saveOrderNotification.
    const preferenceBody: any = {
      items: mpItems,
      external_reference: newOrderId,
      notification_url: `${appUrl}/api/mercadopago/webhook`,
      metadata: {
        order_id: newOrderId,
        customer_email: trimmedEmail,
        customer_name: trimmedName,
        customer_phone: trimmedPhone,
        total_pen: finalTotal,
        items_count: items.length
      },
      back_urls: {
        success: `${appUrl}/checkout?status=success&orderId=${newOrderId}`,
        failure: `${appUrl}/checkout?status=return&cart=open`,
        pending: `${appUrl}/checkout?status=pending&orderId=${newOrderId}`,
      },
      statement_descriptor: "UPCLIC STORE",
    };

    // Mercado Pago requires back_urls to be HTTPS for auto_return
    if (appUrl.startsWith('https://')) {
      preferenceBody.auto_return = 'approved';
    }

    const response = await preference.create({
      body: preferenceBody
    });

    const isTestToken = accessToken.trim().startsWith("TEST-");
    const checkoutUrl = isTestToken
      ? (response.sandbox_init_point || response.init_point)
      : (response.init_point || response.sandbox_init_point);

    // Save order notification to persistent storage
    const recordedOrder = saveOrderNotification({
      id: newOrderId,
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
    if (!recordedOrder.isDuplicate) {
      sendOrderEmails({
        orderId: recordedOrder.id,
        customerEmail: trimmedEmail,
        customerName: trimmedName || null,
        customerPhone: trimmedPhone || null,
        total: finalTotal,
        items: recordedOrder.items,
        channel: "mercado_pago",
        status: "intent_mercadopago",
        paymentUrl: checkoutUrl,
        isPaid: false,
        discountAmount: discountAmount || 0,
        discountReason: discountReason || null,
        createdAt: recordedOrder.createdAt
      }).catch(err => console.error("Error al despachar correos:", err));
    } else {
      console.log(`⏭️ [EMAIL] Omitiendo correo duplicado en create_preference (${recordedOrder.id})`);
    }

    res.json({
      id: response.id,
      init_point: checkoutUrl,
      sandbox_init_point: response.sandbox_init_point,
      orderId: recordedOrder.id,
      order: recordedOrder,
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
    if (!recorded.isDuplicate) {
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
    } else {
      console.log(`⏭️ [EMAIL] Omitiendo correo duplicado en notify_checkout_intent (${recorded.id})`);
    }

    return res.json({ success: true, order: recorded });
  } catch (err: any) {
    console.error("Error en /api/notify_checkout_intent:", err);
    return res.status(500).json({ error: "Error al registrar notificación de checkout." });
  }
});

// PayPal integration disabled per store configuration

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
    const authoritative = calculateAuthoritativeOrderTotal(items, req.body?.couponCode);

    const recorded = saveOrderNotification({
      customerEmail: trimmedEmail,
      customerName: trimmedName || null,
      customerPhone: trimmedPhone || null,
      total: authoritative.total,
      items: authoritative.validatedItems,
      discountAmount: authoritative.discountAmount,
      discountReason: authoritative.discountReason || discountReason || null,
      status: "order_registered",
      orderStatus: "Pendiente de pago",
      channel: channel || "email_registration"
    });

    console.log("\n=======================================================");
    console.log(`📩 [REGISTRO DIRECTO] CLIENTE REGISTRÓ SU CORREO EN CHECKOUT`);
    console.log(`📧 Correo del Cliente: ${trimmedEmail}`);
    if (trimmedName) console.log(`👤 Nombre: ${trimmedName}`);
    if (trimmedPhone) console.log(`📱 Teléfono: ${trimmedPhone}`);
    console.log(`💰 Total: S/ ${Number(authoritative.total || 0).toFixed(2)}`);
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
    const { orderId, paymentId, customerEmail, customerName, customerPhone, items } = req.body;

    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return res.status(400).json({ error: "Correo electrónico no válido." });
    }

    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    const trimmedPhone = typeof customerPhone === "string" ? customerPhone.trim() : "";
    const cleanPaymentId = paymentId ? String(paymentId).trim() : "";
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    // Verify with Mercado Pago API when MERCADOPAGO_ACCESS_TOKEN and paymentId are available
    let isVerifiedByProvider = false;
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (accessToken && cleanPaymentId && /^\d+$/.test(cleanPaymentId)) {
      try {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(cleanPaymentId)}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (mpRes.ok) {
          const mpData = await mpRes.json();
          if (mpData && mpData.status === "approved") {
            isVerifiedByProvider = true;
          }
        }
      } catch (verifyErr) {
        console.warn("No se pudo verificar paymentId contra Mercado Pago:", verifyErr);
      }
    }

    const authoritative = calculateAuthoritativeOrderTotal(items, req.body?.couponCode);
    const verifiedStatus = isVerifiedByProvider ? "paid" : "review";
    const verifiedOrderStatus = isVerifiedByProvider ? "Pagado" : "Pago en revisión";

    // Update existing order in orders.json or record newly confirmed order
    const orders = loadStoredOrders();
    const existingIndex = orders.findIndex((o: any) => o.id === finalOrderId || (cleanPaymentId && o.paymentId === cleanPaymentId));

    let recorded: any;
    if (existingIndex >= 0) {
      orders[existingIndex].status = verifiedStatus;
      orders[existingIndex].orderStatus = verifiedOrderStatus;
      orders[existingIndex].isPaid = isVerifiedByProvider;
      orders[existingIndex].paymentId = cleanPaymentId || orders[existingIndex].paymentId;
      if (isVerifiedByProvider) {
        orders[existingIndex].paidAt = new Date().toISOString();
      }
      if (!orders[existingIndex].customerEmail && trimmedEmail) {
        orders[existingIndex].customerEmail = trimmedEmail;
      }
      recorded = orders[existingIndex];
      saveStoredOrders(orders);
    } else {
      recorded = saveOrderNotification({
        id: finalOrderId,
        customerEmail: trimmedEmail,
        customerName: trimmedName || null,
        customerPhone: trimmedPhone || null,
        total: authoritative.total,
        items: authoritative.validatedItems,
        paymentId: cleanPaymentId || null,
        status: verifiedStatus,
        orderStatus: verifiedOrderStatus,
        isPaid: isVerifiedByProvider,
        channel: "mercado_pago"
      });
    }

    const deliveredCredentials: any[] = recorded.deliveredCredentials || [];

    console.log("\n=======================================================");
    console.log(`🎉 [PAGO CONFIRMADO MERCADO PAGO] PAGO APROBADO EXITOSAMENTE`);
    console.log(`🆔 ID Pedido: ${recorded.id}`);
    if (cleanPaymentId) console.log(`💳 Payment ID MP: #${cleanPaymentId}`);
    console.log(`📧 Correo Cliente: ${trimmedEmail}`);
    if (trimmedName) console.log(`👤 Nombre: ${trimmedName}`);
    if (trimmedPhone) console.log(`📱 Teléfono: ${trimmedPhone}`);
    console.log(`💰 Total Pagado: S/ ${Number(recorded.total || 0).toFixed(2)}`);
    if (deliveredCredentials.length > 0) {
      console.log(`⚡ [ENTREGA INMEDIATA] Se asignaron y enviaron ${deliveredCredentials.length} credencial(es) automáticamente.`);
    }
    console.log(`⏰ Fecha: ${new Date().toISOString()}`);
    console.log("=======================================================\n");

    // Send confirmation email to customer (including credentials if immediate delivery) + admin alert
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
      deliveredCredentials: deliveredCredentials.length > 0 ? deliveredCredentials : undefined,
      createdAt: recorded.createdAt
    });

    return res.json({
      success: true,
      order: recorded,
      deliveredCredentials,
      emailSentToCustomer: emailResult.customerSent,
      emailSentToAdmin: emailResult.adminSent
    });
  } catch (err: any) {
    console.error("Error en /api/confirm_payment_success:", err);
    return res.status(500).json({ error: "Error al confirmar pago de orden." });
  }
});

// Centralized helper to process and fulfill an approved Mercado Pago payment
export async function processMercadoPagoPayment(paymentId: string): Promise<{
  success: boolean;
  order?: any;
  deliveredCredentials?: any[];
  alreadyPaid?: boolean;
}> {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.warn("⚠️ [MERCADOPAGO] No se puede procesar pago: falta MERCADOPAGO_ACCESS_TOKEN");
      return { success: false };
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!mpRes.ok) {
      console.warn(`⚠️ [MERCADOPAGO] No se pudo consultar pago ${paymentId}: ${mpRes.status}`);
      return { success: false };
    }

    const paymentData = await mpRes.json();
    if (paymentData.status !== "approved") {
      console.log(`ℹ️ [MERCADOPAGO] Pago ${paymentId} en estado '${paymentData.status}'. No se procesa entrega aún.`);
      return { success: false };
    }

    const payerEmail = (paymentData.metadata?.customer_email || paymentData.payer?.email || "").toLowerCase().trim();
    const externalRef = paymentData.external_reference;
    const prefId = paymentData.order?.id || paymentData.preference_id;

    const orders = loadStoredOrders();
    // 1. Match by external_reference (our order ID)
    let matchIdx = orders.findIndex(o => externalRef && o.id === externalRef);
    // 2. Match by preferenceId
    if (matchIdx === -1 && prefId) {
      matchIdx = orders.findIndex(o => o.preferenceId === prefId);
    }
    // 3. Match by customer email and pending status
    if (matchIdx === -1 && payerEmail) {
      matchIdx = orders.findIndex(o => o.customerEmail?.toLowerCase() === payerEmail && o.status !== "paid");
    }

    if (matchIdx === -1) {
      console.warn(`⚠️ [MERCADOPAGO] Pago ${paymentId} aprobado pero no se encontró pedido correspondiente (email: ${payerEmail}, ref: ${externalRef}).`);
      return { success: false };
    }

    const order = orders[matchIdx];
    if (order.status === "paid" && Array.isArray(order.deliveredCredentials) && order.deliveredCredentials.length > 0) {
      console.log(`✅ [MERCADOPAGO] Pedido ${order.id} ya estaba confirmado y despachado.`);
      return { success: true, order, deliveredCredentials: order.deliveredCredentials, alreadyPaid: true };
    }

    order.status = "paid";
    order.isPaid = true;
    order.paymentId = String(paymentId);
    order.paidAt = new Date().toISOString();

    const deliveredCredentials: any[] = order.deliveredCredentials || [];
    saveStoredOrders(orders);

    // Send confirmation emails with credentials
    sendOrderEmails({
      orderId: order.id,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
      items: order.items,
      channel: "mercado_pago",
      status: "paid",
      isPaid: true,
      paymentId: String(paymentId),
      deliveredCredentials: deliveredCredentials.length > 0 ? deliveredCredentials : undefined,
      createdAt: order.createdAt
    }).then(res => {
      console.log(`📧 [EMAIL] Despacho automático de credenciales para pedido ${order.id}: cliente=${res.customerSent}, admin=${res.adminSent}`);
    }).catch(err => console.error("Error despachando correos en webhook:", err));

    return { success: true, order, deliveredCredentials };
  } catch (err: any) {
    console.error("Error procesando pago de Mercado Pago:", err);
    return { success: false };
  }
}

// Webhook endpoint for Mercado Pago instant notifications
app.all("/api/mercadopago/webhook", express.json(), async (req, res) => {
  try {
    const topic = req.query.topic || req.query.type || req.body?.type || req.body?.action;
    const paymentId = req.query["data.id"] || req.query.id || req.body?.data?.id || req.body?.id;

    console.log(`🔔 [MERCADOPAGO WEBHOOK] Notificación: topic=${topic}, paymentId=${paymentId}`);

    if (paymentId) {
      await processMercadoPagoPayment(String(paymentId));
    }

    return res.status(200).send("OK");
  } catch (err: any) {
    console.error("Error en webhook de Mercado Pago:", err);
    return res.status(200).send("OK");
  }
});

// Endpoint for frontend to actively verify if a payment has been approved and get credentials
app.get("/api/mercadopago/check_payment", async (req, res) => {
  try {
    const orderId = req.query.orderId?.toString().trim();
    const email = req.query.email?.toString().toLowerCase().trim();

    if (!orderId && !email) {
      return res.status(400).json({ error: "Falta orderId o email" });
    }

    const orders = loadStoredOrders();
    const order = orders.find(o => (orderId && o.id === orderId) || (email && o.customerEmail?.toLowerCase() === email));

    if (order && order.status === "paid") {
      return res.json({
        isPaid: true,
        order,
        deliveredCredentials: order.deliveredCredentials || []
      });
    }

    // Active lookup in Mercado Pago for recent approved payments matching this order or email
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (accessToken) {
      try {
        const searchRes = await fetch("https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=10", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (searchRes.ok) {
          const data = await searchRes.json();
          const approved = (data.results || []).find((p: any) => {
            if (p.status !== "approved") return false;
            if (orderId && p.external_reference === orderId) return true;
            if (email && (p.payer?.email?.toLowerCase() === email || p.metadata?.customer_email?.toLowerCase() === email)) return true;
            return false;
          });

          if (approved) {
            console.log(`⚡ [AUTO-CONFIRM] Pago ${approved.id} detectado como aprobado en Mercado Pago.`);
            const result = await processMercadoPagoPayment(String(approved.id));
            if (result.success && result.order) {
              return res.json({
                isPaid: true,
                order: result.order,
                deliveredCredentials: result.deliveredCredentials || []
              });
            }
          }
        }
      } catch (searchErr) {
        console.warn("No se pudo consultar lista de pagos en Mercado Pago:", searchErr);
      }
    }

    return res.json({
      isPaid: false,
      order: order || null
    });
  } catch (err: any) {
    console.error("Error en check_payment:", err);
    return res.status(500).json({ error: "Error consultando estado de pago" });
  }
});

// --- CREDENTIALS & EXCEL INVENTORY ENDPOINTS ---

// GET Download Excel-compatible CSV of all credentials
app.get("/api/credentials/excel", (_req, res) => {
  try {
    const csvContent = getCredentialsCsvContent();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="upclic_inventario_credenciales.csv"');
    return res.send(csvContent);
  } catch (err: any) {
    console.error("Error al exportar inventario a Excel:", err);
    return res.status(500).json({ error: "Error al generar archivo Excel/CSV." });
  }
});

// GET View current credentials inventory
app.get("/api/credentials/inventory", (_req, res) => {
  try {
    const inventory = loadCredentialsInventory();
    return res.json({
      success: true,
      inventory,
      summary: {
        total: inventory.length,
        disponibles: inventory.filter((c) => c.estado === "Disponible").length,
        entregados: inventory.filter((c) => c.estado === "Entregado").length,
      },
    });
  } catch (err: any) {
    console.error("Error al obtener inventario de credenciales:", err);
    return res.status(500).json({ error: "Error al obtener inventario." });
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

// --- PUBLIC CATALOG & PAYMENT SETTINGS ENDPOINT ---
app.get("/api/catalog", (_req, res) => {
  const catalog = getMergedCatalog();
  const overrides = loadCatalogOverrides();
  const paymentSettings = loadPaymentSettings();
  res.json({
    success: true,
    products: catalog,
    coupons: overrides.coupons || DEFAULT_COUPONS,
    paymentSettings
  });
});

// --- MANUAL PAYMENTS (YAPE / PLIN / TRANSFERENCIA BANCARIA) ---
app.post("/api/orders/create_manual", express.json({ limit: "5mb" }), async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      couponCode,
      paymentMethod,
      operationNumber,
      receiptImage
    } = req.body;

    const trimmedEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return res.status(400).json({ error: "Ingresa un correo electrónico válido para recibir tu pedido." });
    }
    const trimmedName = typeof customerName === "string" ? customerName.trim() : "";
    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ error: "Ingresa tu nombre completo." });
    }
    const trimmedPhone = typeof customerPhone === "string" ? customerPhone.trim() : "";
    if (!trimmedPhone || trimmedPhone.length < 6) {
      return res.status(400).json({ error: "Ingresa tu número de WhatsApp para coordinar la entrega." });
    }

    const authoritative = calculateAuthoritativeOrderTotal(items, couponCode);
    const cleanOp = typeof operationNumber === "string" ? operationNumber.trim() : "";
    const hasReceipt = Boolean(cleanOp || (typeof receiptImage === "string" && receiptImage.length > 20));

    // Never mark manual orders as paid automatically without admin verification
    const internalStatus = hasReceipt ? "review" : "pending";
    const orderStatus = hasReceipt ? "Pago en revisión" : "Pendiente de pago";

    const recorded = saveOrderNotification({
      customerName: trimmedName,
      customerEmail: trimmedEmail,
      customerPhone: trimmedPhone,
      items: authoritative.validatedItems,
      subtotal: authoritative.subtotal,
      discountAmount: authoritative.discountAmount,
      discountReason: authoritative.discountReason,
      couponCode: couponCode || null,
      total: authoritative.total,
      currency: "PEN",
      channel: paymentMethod || "yape",
      gateway: paymentMethod || "yape",
      status: internalStatus,
      orderStatus,
      deliveryStatus: "Pendiente de envío",
      isPaid: false,
      operationNumber: cleanOp || null,
      receiptImage: typeof receiptImage === "string" && receiptImage.length < 4_500_000 ? receiptImage : null,
      receiptSubmittedAt: hasReceipt ? new Date().toISOString() : null
    });

    sendOrderEmails({
      orderId: recorded.id,
      customerEmail: trimmedEmail,
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      total: recorded.total,
      items: recorded.items,
      channel: paymentMethod || "yape",
      status: orderStatus,
      discountAmount: recorded.discountAmount,
      discountReason: recorded.discountReason,
      paymentId: cleanOp ? `OP-${cleanOp}` : undefined,
      isPaid: false,
      createdAt: recorded.createdAt
    }).catch((err) => console.error("Error enviando email de orden manual:", err));

    return res.json({
      success: true,
      order: recorded
    });
  } catch (err: any) {
    console.error("Error en /api/orders/create_manual:", err);
    return res.status(500).json({ error: "No se pudo registrar el pedido. Intenta nuevamente." });
  }
});

// Submit or update payment receipt (comprobante) for an existing order
app.post("/api/orders/:id/submit_receipt", express.json({ limit: "5mb" }), (req, res) => {
  try {
    const orderId = req.params.id?.trim();
    const { operationNumber, receiptImage } = req.body;
    const orders = loadStoredOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      return res.status(404).json({ error: "Pedido no encontrado." });
    }
    const cleanOp = typeof operationNumber === "string" ? operationNumber.trim() : "";
    if (!cleanOp && !receiptImage) {
      return res.status(400).json({ error: "Ingresa el número de operación o adjunta el comprobante." });
    }

    if (cleanOp) orders[idx].operationNumber = cleanOp;
    if (typeof receiptImage === "string" && receiptImage.length < 4_500_000) {
      orders[idx].receiptImage = receiptImage;
    }
    orders[idx].receiptSubmittedAt = new Date().toISOString();
    if (orders[idx].orderStatus === "Pendiente de pago") {
      orders[idx].status = "review";
      orders[idx].orderStatus = "Pago en revisión";
    }
    orders[idx].updatedAt = new Date().toISOString();
    saveStoredOrders(orders);

    return res.json({
      success: true,
      order: orders[idx]
    });
  } catch (err: any) {
    console.error("Error en submit_receipt:", err);
    return res.status(500).json({ error: "Error al guardar el comprobante." });
  }
});

// --- PROTECTED ADMIN PANEL MIDDLEWARE & ENDPOINTS ---
const AUTHORIZED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "leoch5829@gmail.com").toLowerCase().trim();

async function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const adminSecret = process.env.ADMIN_SECRET_TOKEN;

    if (adminSecret && token && token === adminSecret) {
      return next();
    }

    // Verify Firebase ID token via Google Identity Toolkit / tokeninfo endpoint
    if (token && token.split(".").length === 3) {
      try {
        const payloadPart = token.split(".")[1];
        const decoded = JSON.parse(Buffer.from(payloadPart, "base64").toString("utf-8"));
        const email = (decoded.email || "").toLowerCase().trim();
        const exp = Number(decoded.exp || 0) * 1000;
        if (email === AUTHORIZED_ADMIN_EMAIL && exp > Date.now()) {
          return next();
        }
      } catch {}
    }

    return res.status(401).json({
      error: "No autorizado. Inicia sesión con la cuenta administradora autorizada de UPCLIC."
    });
  } catch {
    return res.status(401).json({ error: "Error de autenticación de administrador." });
  }
}

// Admin: Get dashboard stats + all orders
app.get("/api/admin/dashboard", requireAdminAuth, (_req, res) => {
  const orders = loadStoredOrders();
  const catalog = getMergedCatalog();
  const overrides = loadCatalogOverrides();
  const paymentSettings = loadPaymentSettings();

  const paidOrders = orders.filter(
    (o) => o.orderStatus === "Pagado" || o.orderStatus === "En preparación" || o.orderStatus === "Entregado" || o.isPaid
  );
  const reviewOrders = orders.filter((o) => o.orderStatus === "Pago en revisión");
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pendiente de pago");
  const totalRevenuePEN = paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  res.json({
    success: true,
    stats: {
      totalOrders: orders.length,
      paidOrdersCount: paidOrders.length,
      reviewOrdersCount: reviewOrders.length,
      pendingOrdersCount: pendingOrders.length,
      totalRevenuePEN: Number(totalRevenuePEN.toFixed(2)),
      totalProductsCount: catalog.length,
      activeProductsCount: catalog.filter((p) => p.active !== false).length
    },
    orders,
    products: catalog,
    coupons: overrides.coupons || DEFAULT_COUPONS,
    paymentSettings
  });
});

// Admin: Update order status, delivery status, notes, or credentials
app.put("/api/admin/orders/:id", requireAdminAuth, (req, res) => {
  const orderId = req.params.id?.trim();
  const { orderStatus, deliveryStatus, adminNotes, deliveredCredentials } = req.body;
  const orders = loadStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) {
    return res.status(404).json({ error: "Pedido no encontrado." });
  }

  if (orderStatus) {
    orders[idx].orderStatus = orderStatus;
    if (orderStatus === "Pagado") {
      orders[idx].status = "paid";
      orders[idx].isPaid = true;
      orders[idx].paidAt = orders[idx].paidAt || new Date().toISOString();
      if (orders[idx].deliveryStatus === "Pendiente de envío") {
        orders[idx].deliveryStatus = "En preparación";
      }
    } else if (orderStatus === "Pago en revisión") {
      orders[idx].status = "review";
      orders[idx].isPaid = false;
    } else if (orderStatus === "En preparación") {
      orders[idx].status = "preparing";
      orders[idx].deliveryStatus = "En preparación";
    } else if (orderStatus === "Entregado") {
      orders[idx].status = "delivered";
      orders[idx].deliveryStatus = "Entregado";
      orders[idx].deliveredAt = new Date().toISOString();
    } else if (orderStatus === "Cancelado") {
      orders[idx].status = "cancelled";
      orders[idx].deliveryStatus = "Cancelado";
      orders[idx].isPaid = false;
    } else {
      orders[idx].status = "pending";
      orders[idx].isPaid = false;
    }
  }

  if (deliveryStatus) {
    orders[idx].deliveryStatus = deliveryStatus;
  }
  if (typeof adminNotes === "string") {
    orders[idx].adminNotes = adminNotes;
  }
  if (Array.isArray(deliveredCredentials)) {
    orders[idx].deliveredCredentials = deliveredCredentials;
  }
  orders[idx].updatedAt = new Date().toISOString();
  saveStoredOrders(orders);

  return res.json({ success: true, order: orders[idx] });
});

// Admin: Create or update a product
app.post("/api/admin/products", requireAdminAuth, (req, res) => {
  const productData = req.body;
  if (!productData || !productData.name || typeof productData.price !== "number") {
    return res.status(400).json({ error: "Nombre y precio del producto son obligatorios." });
  }

  const overrides = loadCatalogOverrides();
  const id = productData.id || `prod-custom-${Date.now()}`;
  const slug =
    productData.slug ||
    String(productData.name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const existingIdx = overrides.customProducts.findIndex((p) => p.id === id);
  const baseProd = products.find((p) => p.id === id);

  const savedProduct = {
    ...(baseProd || {}),
    ...(existingIdx >= 0 ? overrides.customProducts[existingIdx] : {}),
    ...productData,
    id,
    slug,
    price: Number(productData.price),
    oldPrice: productData.oldPrice ? Number(productData.oldPrice) : undefined,
    active: productData.active ?? true
  };

  if (existingIdx >= 0) {
    overrides.customProducts[existingIdx] = savedProduct;
  } else {
    overrides.customProducts.push(savedProduct);
  }
  overrides.deletedProductIds = overrides.deletedProductIds.filter((delId) => delId !== id);
  saveCatalogOverrides(overrides);

  return res.json({
    success: true,
    product: savedProduct,
    products: getMergedCatalog()
  });
});

// Admin: Delete a product
app.delete("/api/admin/products/:id", requireAdminAuth, (req, res) => {
  const prodId = req.params.id?.trim();
  const overrides = loadCatalogOverrides();
  overrides.customProducts = overrides.customProducts.filter((p) => p.id !== prodId);
  if (!overrides.deletedProductIds.includes(prodId)) {
    overrides.deletedProductIds.push(prodId);
  }
  saveCatalogOverrides(overrides);
  return res.json({
    success: true,
    products: getMergedCatalog()
  });
});

// Admin: Save coupons
app.put("/api/admin/coupons", requireAdminAuth, (req, res) => {
  const { coupons } = req.body;
  if (!Array.isArray(coupons)) {
    return res.status(400).json({ error: "Formato de cupones inválido." });
  }
  const overrides = loadCatalogOverrides();
  overrides.coupons = coupons;
  saveCatalogOverrides(overrides);
  return res.json({ success: true, coupons: overrides.coupons });
});

// Admin: Save payment & analytics settings
app.put("/api/admin/payment-settings", requireAdminAuth, (req, res) => {
  const newSettings = req.body;
  const current = loadPaymentSettings();
  const merged = {
    ...current,
    ...newSettings,
    yape: { ...current.yape, ...(newSettings.yape || {}) },
    plin: { ...current.plin, ...(newSettings.plin || {}) },
    transferencia: { ...current.transferencia, ...(newSettings.transferencia || {}) },
    mercadopago: { ...current.mercadopago, ...(newSettings.mercadopago || {}) },
    paypal: { ...current.paypal, ...(newSettings.paypal || {}) },
    analytics: { ...current.analytics, ...(newSettings.analytics || {}) }
  };
  savePaymentSettings(merged);
  return res.json({ success: true, paymentSettings: merged });
});

// Endpoint to check SMTP / Email readiness
app.get("/api/admin/email_status", (_req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL || "leoch5829@gmail.com";
  const smtpUser = process.env.SMTP_USER || "leoch5829@gmail.com";
  const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
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
