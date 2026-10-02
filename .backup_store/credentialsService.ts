import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface CredentialRecord {
  id: string;
  servicio: string;
  productSlug: string;
  meses: number;
  correoUsuario: string;
  contrasenaEncriptada: string; // Stored securely encrypted
  perfilPin: string;
  estado: "Disponible" | "Entregado";
  entregadoA?: string | null;
  idPedido?: string | null;
  fechaEntrega?: string | null;
  notas?: string | null;
}

export interface DeliveredCredential {
  id: string;
  serviceName: string;
  productSlug: string;
  email: string;
  password: string; // Decrypted only upon legitimate delivery
  profilePin: string;
  months: number;
  singleDeviceNotice: string;
  loginUrl: string;
  deliveredAt: string;
  notes?: string | null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CREDENTIALS_JSON_FILE = path.join(DATA_DIR, "credentials_inventory.json");
const CREDENTIALS_CSV_FILE = path.join(DATA_DIR, "credentials_inventory.csv");

// Master encryption key for credentials vault
const ENCRYPTION_SECRET = process.env.CREDENTIALS_SECRET_KEY || "upclic-vault-key-2026-peru-sec32";
const ENCRYPTION_KEY = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest(); // 32 bytes key
const IV_LENGTH = 16;

export function encryptText(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptText(encryptedText: string): string {
  if (!encryptedText) return "";
  if (!encryptedText.includes(":")) return encryptedText; // Fallback if plain text
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Error decrypting credential:", err);
    return encryptedText;
  }
}

// Exactly 3 users / 3 profiles for Prime Video & 3 for Crunchyroll as requested
const INITIAL_CREDENTIALS: CredentialRecord[] = [
  // 3 Perfiles Prime Video (Cuenta oficial: premium6672@gmail.com / Pass: Premium26@@)
  {
    id: "PV-01",
    servicio: "Amazon Prime Video",
    productSlug: "amazon-prime-video",
    meses: 1,
    correoUsuario: "premium6672@gmail.com",
    contrasenaEncriptada: encryptText("Premium26@@"),
    perfilPin: "Perfil 1",
    estado: "Disponible",
    entregadoA: null,
    idPedido: null,
    fechaEntrega: null,
    notas: "1 Perfil para 1 dispositivo - Garantía según lo alquilado (1, 3 o 6 meses)",
  },
  {
    id: "PV-02",
    servicio: "Amazon Prime Video",
    productSlug: "amazon-prime-video",
    meses: 1,
    correoUsuario: "premium6672@gmail.com",
    contrasenaEncriptada: encryptText("Premium26@@"),
    perfilPin: "Perfil 2",
    estado: "Disponible",
    entregadoA: null,
    idPedido: null,
    fechaEntrega: null,
    notas: "1 Perfil para 1 dispositivo - Garantía según lo alquilado (1, 3 o 6 meses)",
  },
  {
    id: "PV-03",
    servicio: "Amazon Prime Video",
    productSlug: "amazon-prime-video",
    meses: 1,
    correoUsuario: "premium6672@gmail.com",
    contrasenaEncriptada: encryptText("Premium26@@"),
    perfilPin: "Perfil 3",
    estado: "Disponible",
    entregadoA: null,
    idPedido: null,
    fechaEntrega: null,
    notas: "1 Perfil para 1 dispositivo - Garantía según lo alquilado (1, 3 o 6 meses)",
  },

  // 3 Perfiles Crunchyroll (Cuenta oficial: premiumupcli@gmail.com / Pass: premium2025)
  {
    id: "CR-01",
    servicio: "Crunchyroll Premium",
    productSlug: "crunchyroll-premium",
    meses: 1,
    correoUsuario: "premiumupcli@gmail.com",
    contrasenaEncriptada: encryptText("premium2025"),
    perfilPin: "Perfil 1",
    estado: "Disponible",
    entregadoA: null,
    idPedido: null,
    fechaEntrega: null,
    notas: "1 Perfil para 1 dispositivo - Garantía según lo alquilado (1, 3 o 6 meses)",
  },
  {
    id: "CR-02",
    servicio: "Crunchyroll Premium",
    productSlug: "crunchyroll-premium",
    meses: 1,
    correoUsuario: "premiumupcli@gmail.com",
    contrasenaEncriptada: encryptText("premium2025"),
    perfilPin: "Perfil 2",
    estado: "Disponible",
    entregadoA: null,
    idPedido: null,
    fechaEntrega: null,
    notas: "1 Perfil para 1 dispositivo - Garantía según lo alquilado (1, 3 o 6 meses)",
  },
  {
    id: "CR-03",
    servicio: "Crunchyroll Premium",
    productSlug: "crunchyroll-premium",
    meses: 1,
    correoUsuario: "premiumupcli@gmail.com",
    contrasenaEncriptada: encryptText("premium2025"),
    perfilPin: "Perfil 3",
    estado: "Disponible",
    entregadoA: null,
    idPedido: null,
    fechaEntrega: null,
    notas: "1 Perfil para 1 dispositivo - Garantía según lo alquilado (1, 3 o 6 meses)",
  },
];

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function recordsToCsv(records: CredentialRecord[]): string {
  const headers = [
    "ID",
    "Servicio",
    "ProductoSlug",
    "Meses",
    "Correo_Usuario",
    "Contrasena",
    "Perfil_PIN",
    "Estado",
    "Entregado_A",
    "ID_Pedido",
    "Fecha_Entrega",
    "Dispositivo",
    "Notas",
  ];

  const rows = records.map((r) => {
    // In CSV export for the store admin, decrypt the password so admin can view it in Excel
    const plainPass = decryptText(r.contrasenaEncriptada);
    return [
      `"${(r.id || "").replace(/"/g, '""')}"`,
      `"${(r.servicio || "").replace(/"/g, '""')}"`,
      `"${(r.productSlug || "").replace(/"/g, '""')}"`,
      r.meses || 1,
      `"${(r.correoUsuario || "").replace(/"/g, '""')}"`,
      `"${plainPass.replace(/"/g, '""')}"`,
      `"${(r.perfilPin || "").replace(/"/g, '""')}"`,
      `"${(r.estado || "Disponible").replace(/"/g, '""')}"`,
      `"${(r.entregadoA || "").replace(/"/g, '""')}"`,
      `"${(r.idPedido || "").replace(/"/g, '""')}"`,
      `"${(r.fechaEntrega || "").replace(/"/g, '""')}"`,
      `"1 Dispositivo"`,
      `"${(r.notas || "").replace(/"/g, '""')}"`,
    ];
  });

  // Include UTF-8 Byte Order Mark (BOM) so Excel opens UTF-8 accents smoothly
  return "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

export function saveCredentialsInventory(records: CredentialRecord[]): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(CREDENTIALS_JSON_FILE, JSON.stringify(records, null, 2), "utf-8");
    fs.writeFileSync(CREDENTIALS_CSV_FILE, recordsToCsv(records), "utf-8");
  } catch (err) {
    console.error("Error saving credentials inventory:", err);
  }
}

export function loadCredentialsInventory(): CredentialRecord[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(CREDENTIALS_JSON_FILE)) {
      const raw = fs.readFileSync(CREDENTIALS_JSON_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load credentials from JSON, seeding defaults...", err);
  }

  // Fallback to initial seed and write both JSON and CSV
  saveCredentialsInventory(INITIAL_CREDENTIALS);
  return INITIAL_CREDENTIALS;
}

export function getCredentialsCsvContent(): string {
  const records = loadCredentialsInventory();
  return recordsToCsv(records);
}

export function getAvailableStock(productSlug: string): number {
  const records = loadCredentialsInventory();
  return records.filter((r) => r.productSlug === productSlug && r.estado === "Disponible").length;
}

export function claimCredentialForOrder(params: {
  productSlug: string;
  months?: number;
  customerEmail: string;
  orderId: string;
}): DeliveredCredential | null {
  const { productSlug, months = 1, customerEmail, orderId } = params;
  const records = loadCredentialsInventory();

  // Find next available slot for this product (Strict 3 users limit: no fake accounts generated)
  const matchIdx = records.findIndex(
    (r) => r.productSlug === productSlug && r.estado === "Disponible"
  );

  // If no slot available, return null so UI displays the WhatsApp contact button
  if (matchIdx === -1) {
    console.log(`[STOCK AGOTADO] No hay más perfiles disponibles para ${productSlug}. Pedido ${orderId} requerirá asignación manual vía WhatsApp.`);
    return null;
  }

  const nowIso = new Date().toISOString();
  records[matchIdx].estado = "Entregado";
  records[matchIdx].entregadoA = customerEmail;
  records[matchIdx].idPedido = orderId;
  records[matchIdx].fechaEntrega = nowIso;
  records[matchIdx].meses = months || 1;
  records[matchIdx].notas = `1 Perfil para 1 dispositivo - Garantía de ${months || 1}M (según lo alquilado) - Pedido ${orderId}`;

  saveCredentialsInventory(records);

  const assigned = records[matchIdx];
  const loginUrl = productSlug.includes("crunchyroll")
    ? "https://www.crunchyroll.com/"
    : "https://www.primevideo.com/";

  // Decrypt password ONLY upon legitimate purchase confirmation
  const plainPassword = decryptText(assigned.contrasenaEncriptada);

  return {
    id: assigned.id,
    serviceName: assigned.servicio,
    productSlug: assigned.productSlug,
    email: assigned.correoUsuario,
    password: plainPassword,
    profilePin: assigned.perfilPin,
    months: assigned.meses,
    singleDeviceNotice: "IMPORTANTE: Iniciar sesión únicamente en el 1 dispositivo que va a utilizar.",
    loginUrl,
    deliveredAt: nowIso,
    notes: assigned.notas,
  };
}
