import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { initialReviews } from "./src/initialReviews.ts";
import { products } from "./src/products.ts";

const app = express();
const PORT = 3000;

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
