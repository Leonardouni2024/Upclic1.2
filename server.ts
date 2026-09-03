import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { initialReviews } from "./src/initialReviews.ts";

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
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UpClic Server] Backend activo y escuchando en http://0.0.0.0:${PORT}`);
  });
}

startServer();
