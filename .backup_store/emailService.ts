import "dotenv/config";
import nodemailer, { type Transporter } from "nodemailer";

// Variable de atención UpClic para WhatsApp oficial (autónomo para evitar dependencias cruzadas con el cliente)
export const WHATSAPP_NUMBER = "51983204384";
export const WHATSAPP_DISPLAY = "+51 983 204 384";

export interface OrderItemPayload {
  name: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  slug?: string;
  id?: string;
  product?: any;
}

export interface DeliveredCredentialsPayload {
  id?: string;
  serviceName: string;
  productSlug: string;
  email: string;
  password?: string;
  profilePin?: string;
  months?: number;
  loginUrl?: string;
  deliveredAt?: string;
}

export interface OrderEmailPayload {
  orderId: string;
  customerEmail: string;
  customerName?: string | null;
  customerPhone?: string | null;
  total: number;
  usdTotal?: number;
  items: OrderItemPayload[];
  channel: "mercado_pago" | "paypal" | "whatsapp" | "email_registration";
  status: string;
  discountAmount?: number;
  discountReason?: string | null;
  paymentId?: string;
  createdAt?: string;
  paymentUrl?: string;
  isPaid?: boolean;
  deliveredCredentials?: DeliveredCredentialsPayload[];
}

export interface EmailSendOptions {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html: string;
  headers?: Record<string, string>;
}

// Helper to create the default transporter (Defaults to port 587 with STARTTLS for maximum cloud compatibility)
export function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "leoch5829@gmail.com";
  const rawPass = process.env.SMTP_PASS || "bwnqzjkjjwbvrtym";
  const pass = rawPass.replace(/\s+/g, "");

  if (!user || !pass || user.includes("tu-correo") || pass.includes("tu-contrasena")) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });
}

// Cache status of Resend API key to prevent repeated 401 attempts
let isResendKeyActive = true;

/**
 * Robust multi-strategy email dispatcher.
 * Handles cloud environments (like Sevalla, AWS, Kinsta) where port 465 or certain SMTP ports may be blocked or reset:
 * 1. Resend REST API (HTTPS port 443 - zero block risk, if valid RESEND_API_KEY is configured)
 * 2. Port 587 with STARTTLS (official submission port RFC 6409)
 * 3. Nodemailer service: 'gmail'
 * 4. Port 465 with direct SSL
 */
export async function sendEmailWithFallback(options: EmailSendOptions): Promise<{
  success: boolean;
  strategyUsed?: string;
  error?: string;
}> {
  const user = process.env.SMTP_USER || "leoch5829@gmail.com";
  const rawPass = process.env.SMTP_PASS || "bwnqzjkjjwbvrtym";
  const pass = rawPass.replace(/\s+/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // Strategy 0: Resend REST API (over HTTPS Port 443 - cannot be blocked by host firewalls)
  if (isResendKeyActive && resendApiKey && resendApiKey.startsWith("re_") && resendApiKey.length > 20) {
    try {
      const cleanFrom = options.from.replace(/"/g, "").trim();
      const fromAddress = cleanFrom.includes("<") ? cleanFrom : `UpClic Store <${cleanFrom}>`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [options.to],
          reply_to: options.replyTo,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        console.log(`✅ [EMAIL] Correo enviado exitosamente vía Resend REST API (HTTPS): ${data.id}`);
        return { success: true, strategyUsed: "resend_api" };
      } else {
        if (res.status === 401) {
          isResendKeyActive = false;
        }
      }
    } catch {
      isResendKeyActive = false;
    }
  }

  // Strategy chain for SMTP
  const strategies = [
    {
      name: "smtp_587_starttls",
      create: () =>
        nodemailer.createTransport({
          host,
          port: 587,
          secure: false, // Standard STARTTLS
          requireTLS: true,
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 12000,
          tls: {
            rejectUnauthorized: false,
            minVersion: "TLSv1.2",
          },
        }),
    },
    {
      name: "smtp_service_gmail",
      create: () =>
        nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 12000,
          tls: {
            rejectUnauthorized: false,
          },
        }),
    },
    {
      name: "smtp_465_ssl",
      create: () =>
        nodemailer.createTransport({
          host,
          port: 465,
          secure: true,
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 12000,
          tls: {
            rejectUnauthorized: false,
          },
        }),
    },
  ];

  let lastError = "";

  for (const s of strategies) {
    try {
      const transporter = s.create();
      await transporter.sendMail({
        from: options.from,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
        headers: options.headers,
      });
      console.log(`✅ [EMAIL] Despachado con éxito usando estrategia: ${s.name}`);
      return { success: true, strategyUsed: s.name };
    } catch (err: any) {
      lastError = err?.message || String(err);
      console.warn(`⚠️ [EMAIL] Estrategia ${s.name} falló: ${lastError}. Probando siguiente método...`);
    }
  }

  return { success: false, error: lastError };
}

/**
 * Diagnostic tool to check which email strategies work in the current hosting environment
 */
export async function diagnoseEmailStrategies(): Promise<Record<string, { ok: boolean; message: string }>> {
  const user = process.env.SMTP_USER || "leoch5829@gmail.com";
  const rawPass = process.env.SMTP_PASS || "bwnqzjkjjwbvrtym";
  const pass = rawPass.replace(/\s+/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  const results: Record<string, { ok: boolean; message: string }> = {};

  // Test Resend API
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/api-keys", {
        headers: { Authorization: `Bearer ${resendApiKey}` },
      });
      results["resend_api"] = {
        ok: res.ok,
        message: res.ok ? "Resend API Key válida y conectada vía HTTPS (Port 443)." : `Error status ${res.status}`,
      };
    } catch (e: any) {
      results["resend_api"] = { ok: false, message: e.message };
    }
  } else {
    results["resend_api"] = { ok: false, message: "No configurada (opcional: RESEND_API_KEY)" };
  }

  // Test Port 587
  try {
    const t587 = nodemailer.createTransport({
      host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 10000,
      tls: { rejectUnauthorized: false },
    });
    await t587.verify();
    results["smtp_port_587"] = { ok: true, message: "Conexión exitosa a smtp.gmail.com:587 con STARTTLS." };
  } catch (e: any) {
    results["smtp_port_587"] = { ok: false, message: e.message };
  }

  // Test service: gmail
  try {
    const tService = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 10000,
      tls: { rejectUnauthorized: false },
    });
    await tService.verify();
    results["smtp_service_gmail"] = { ok: true, message: "Conexión exitosa usando nodemailer service: 'gmail'." };
  } catch (e: any) {
    results["smtp_service_gmail"] = { ok: false, message: e.message };
  }

  // Test Port 465
  try {
    const t465 = nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 10000,
      tls: { rejectUnauthorized: false },
    });
    await t465.verify();
    results["smtp_port_465"] = { ok: true, message: "Conexión exitosa a smtp.gmail.com:465 con SSL." };
  } catch (e: any) {
    results["smtp_port_465"] = { ok: false, message: e.message };
  }

  return results;
}

// Generate styled HTML receipt for customer (Deliverability & anti-spam optimized)
export function generateCustomerEmailHtml(order: OrderEmailPayload): string {
  const isPayPal = order.channel === "paypal";
  const penRate = 3.75;
  const usdTotal = order.usdTotal || Number((order.total / penRate).toFixed(2));

  const itemsHtml = order.items
    .map(
      (item) => {
        const itemUnitPrice = isPayPal ? Number((item.unitPrice / penRate).toFixed(2)) : item.unitPrice;
        const itemSubtotal = isPayPal
          ? `$ ${(itemUnitPrice * item.quantity).toFixed(2)} USD`
          : `S/ ${(item.unitPrice * item.quantity).toFixed(2)}`;

        return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 8px; font-size: 13px; color: #1e293b; font-weight: 600;">
          ${item.name} ${item.variantName ? `<span style="color: #64748b; font-size: 12px; font-weight: normal;">(${item.variantName})</span>` : ""}
        </td>
        <td style="padding: 10px 8px; font-size: 13px; color: #475569; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; font-size: 13px; color: #0f172a; text-align: right; font-weight: 700;">
          ${itemSubtotal}
        </td>
      </tr>`;
      }
    )
    .join("");

  const isPaid = Boolean(order.isPaid || order.status === "paid" || order.status === "approved");
  const formattedTotal = isPayPal ? `$ ${usdTotal.toFixed(2)} USD` : `S/ ${order.total.toFixed(2)}`;
  const waPaymentUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20acabo%20de%20realizar%20mi%20pago%20por%20PayPal%20para%20mi%20licencia.%20Mi%20correo%20es:%20${encodeURIComponent(order.customerEmail)}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isPaid ? '¡Pago Aprobado! Se completó su compra - UpClic Store' : 'Pedido Registrado (Pendiente de Pago) - UpClic Store'}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; border-top: 4px solid ${isPayPal ? '#0070ba' : (isPaid ? '#059669' : '#f59e0b')}; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;">
    <!-- Top Header -->
    <tr>
      <td style="padding: 24px 24px 16px; text-align: left; border-bottom: 1px solid #f1f5f9;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">UpClic Store</span>
              <span style="display: block; font-size: 12px; color: #64748b; margin-top: 2px;">Software y Licencias Digitales</span>
            </td>
            <td style="text-align: right;">
              <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; ${isPayPal ? 'background-color: #e0f2fe; color: #0369a1;' : (isPaid ? 'background-color: #d1fae5; color: #065f46;' : 'background-color: #fef3c7; color: #92400e;')}">
                ${isPayPal ? 'PayPal (USD)' : (isPaid ? 'Pago aprobado' : 'Pendiente de pago')}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body Greeting & Summary -->
    <tr>
      <td style="padding: 24px;">
        <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
          Hola${order.customerName ? ` <strong>${order.customerName}</strong>` : ''},
        </p>
        <p style="font-size: 14px; margin: 0 0 20px; color: #475569; line-height: 1.5;">
          ${
            isPayPal
              ? 'Hemos registrado tu solicitud de compra a través de la pasarela internacional de <strong>PayPal</strong>. A continuación encuentras los detalles de tu pedido:'
              : (isPaid
                  ? '¡Se completó tu compra con éxito! Te confirmamos que tu pago ha sido recibido y <strong>aprobado</strong> a través de Mercado Pago. A continuación encuentras los detalles de tu compra y tus credenciales de acceso:'
                  : 'Hemos registrado tu pedido en UpClic Store. Tu orden se encuentra <strong>pendiente de pago</strong>. Por favor completa tu pago ingresando en el enlace de Mercado Pago para procesar y entregar tus accesos:')
          }
        </p>

        <!-- Order Metadata Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px;">
            ${!isPayPal ? `
            <tr>
              <td style="color: #64748b; padding-bottom: 6px;">Número de pedido:</td>
              <td style="color: #0f172a; font-weight: 700; text-align: right; padding-bottom: 6px; font-family: monospace;">${order.orderId}</td>
            </tr>` : ''}
            <tr>
              <td style="color: #64748b; padding-bottom: 6px;">Correo de entrega:</td>
              <td style="color: #0f172a; font-weight: 600; text-align: right; padding-bottom: 6px;">${order.customerEmail}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-bottom: 6px;">Método de pago:</td>
              <td style="color: #0f172a; font-weight: 600; text-align: right; padding-bottom: 6px;">
                ${isPayPal ? 'PayPal ($ USD)' : 'Mercado Pago'}
              </td>
            </tr>
            <tr>
              <td style="color: #64748b;">Estado:</td>
              <td style="color: ${isPaid ? '#059669' : '#d97706'}; font-weight: 700; text-align: right;">
                ${isPaid ? 'Pago aprobado' : (isPayPal ? 'Registrado para entrega' : 'Pendiente de pago')}
              </td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h2 style="font-size: 14px; font-weight: 700; margin: 0 0 10px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
          Productos solicitados
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
          <thead>
            <tr style="border-bottom: 1px solid #cbd5e1; color: #64748b; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px; text-align: left;">Descripción</th>
              <th style="padding: 8px; text-align: center; width: 60px;">Cant.</th>
              <th style="padding: 8px; text-align: right; width: 90px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #f8fafc; border-radius: 8px;">
          ${
            order.discountAmount && order.discountAmount > 0
              ? `<tr>
                  <td style="padding: 8px 14px; font-size: 13px; color: #16a34a; font-weight: 600;">Descuento aplicado:</td>
                  <td style="padding: 8px 14px; font-size: 13px; color: #16a34a; font-weight: 700; text-align: right;">- ${isPayPal ? `$ ${(order.discountAmount / penRate).toFixed(2)} USD` : `S/ ${order.discountAmount.toFixed(2)}`}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 12px 14px; font-size: 14px; color: #0f172a; font-weight: 700; border-top: 1px solid #e2e8f0;">${isPaid ? 'Total pagado:' : 'Total a pagar:'}</td>
            <td style="padding: 12px 14px; font-size: 16px; color: ${isPayPal ? '#0070ba' : (isPaid ? '#059669' : '#0066FF')}; font-weight: 800; text-align: right; border-top: 1px solid #e2e8f0;">${formattedTotal}</td>
          </tr>
        </table>

        <!-- Section: Credentials if PAID vs Payment Link if PENDING -->
        ${isPaid ? (
          order.deliveredCredentials && order.deliveredCredentials.length > 0 ? `
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);">
            <div style="margin-bottom: 12px;">
              <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 6px;">
                ⚡ Entrega Inmediata Completada (Pago Aprobado)
              </span>
              <h3 style="margin: 4px 0 0; color: #065f46; font-size: 16px; font-weight: 800;">
                Tus Credenciales de Acceso Oficiales:
              </h3>
            </div>
            ${order.deliveredCredentials.map(c => `
            <div style="background-color: #ffffff; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px;">
              <p style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #065f46;">
                📺 ${c.serviceName} (${c.months || 1} ${(c.months || 1) === 1 ? 'Mes' : 'Meses'}) • 1 Perfil (1 Dispositivo)
              </p>

              <!-- Important single device warning -->
              <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; font-size: 12px; color: #92400e;">
                <strong>⚠️ REGLA OBLIGATORIA:</strong> Iniciar sesión únicamente en el 1 dispositivo que va a utilizar.<br/>
                Este perfil es para 1 solo dispositivo y cuenta con garantía según lo alquilado (${c.months || 1} ${(c.months || 1) === 1 ? 'Mes' : 'Meses'}). No abras la cuenta en múltiples pantallas en simultáneo para preservar la garantía.
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #1e293b;">
                <tr>
                  <td style="color: #64748b; padding: 4px 0; width: 130px;"><strong>Usuario / Correo:</strong></td>
                  <td style="padding: 4px 0; font-family: monospace; font-weight: 700; color: #0f172a;">${c.email}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 4px 0;"><strong>Contraseña:</strong></td>
                  <td style="padding: 4px 0; font-family: monospace; font-weight: 700; color: #059669;">${c.password || 'Asignada'}</td>
                </tr>
                ${c.profilePin ? `
                <tr>
                  <td style="color: #64748b; padding: 4px 0;"><strong>Perfil / PIN:</strong></td>
                  <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${c.profilePin}</td>
                </tr>` : ''}
                <tr>
                  <td style="color: #64748b; padding: 4px 0;"><strong>Dispositivo:</strong></td>
                  <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">1 Dispositivo (uso personal)</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 4px 0;"><strong>Garantía:</strong></td>
                  <td style="padding: 4px 0; font-weight: 700; color: #059669;">${c.months || 1} ${(c.months || 1) === 1 ? 'Mes' : 'Meses'} (según lo alquilado)</td>
                </tr>
              </table>
              ${c.loginUrl ? `
              <div style="margin-top: 12px; text-align: right;">
                <a href="${c.loginUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 12px; font-weight: 700; text-decoration: none; padding: 7px 16px; border-radius: 6px;">
                  Iniciar Sesión en ${c.serviceName} →
                </a>
              </div>` : ''}
            </div>
            `).join('')}
            <p style="margin: 0; font-size: 12px; color: #047857; line-height: 1.4;">
              * Inicia sesión con estos datos en la aplicación oficial o sitio web y selecciona tu perfil asignado.
            </p>
          </div>
          ` : (order.items && order.items.some(it => {
              const slug = (it.slug || it.id || (it as any).product?.slug || (it as any).product?.id || it.name || '').toLowerCase();
              return slug.includes('prime-video') || slug.includes('crunchyroll') || slug.includes('prime video') || slug.includes('crunchy');
            })) ? `
          <!-- Out-of-Stock Profile WhatsApp Notice ONLY when payment was approved -->
          <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <span style="display: inline-block; background-color: #d97706; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 6px;">
              Pago Aprobado • Coordinar Entrega de Perfil
            </span>
            <h3 style="margin: 4px 0 6px; font-size: 16px; font-weight: 800; color: #78350f;">
              Solicita tu Perfil Adquirido al Administrador
            </h3>
            <p style="margin: 0 0 14px; font-size: 13.5px; color: #92400e; line-height: 1.5;">
              Confirmamos tu pago exitosamente. Debido a la gran demanda, los perfiles de entrega automática inmediata de este lote ya fueron asignados. Por favor presiona el botón a continuación para hablar directamente con el Administrador por WhatsApp y recibir tu perfil para 1 dispositivo con tu garantía según lo alquilado.
            </p>
            <div style="text-align: center;">
              <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Administrador de UpClic, realicé mi pago con éxito para el pedido #${order.orderId}. Solicito por favor la entrega de mi perfil para 1 dispositivo que adquirí.`)}"
                 style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 800; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
                💬 Solicitar mi Perfil al Administrador por WhatsApp
              </a>
            </div>
          </div>
          ` : `
          <!-- Delivery Notice 10-30 min when payment was approved -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 18px; margin-bottom: 22px;">
            <h3 style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #166534;">
              Entrega de tu licencia digital:
            </h3>
            <p style="margin: 0; font-size: 13.5px; color: #15803d; line-height: 1.5;">
              <strong>Tu licencia será enviada a tu correo dentro de 10 a 30 minutos.</strong><br/>
              Nuestro equipo técnico está preparando tu clave de producto y los enlaces oficiales de descarga.
            </p>
          </div>
          `
        ) : `
        <!-- Box when payment is PENDING (initial email when clicking Finalizar compra) -->
        <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <span style="display: inline-block; background-color: #d97706; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 8px;">
            ⏳ Pedido Registrado • Pendiente de Pago
          </span>
          <h3 style="margin: 4px 0 8px; font-size: 16px; font-weight: 800; color: #78350f;">
            Completa tu pago para recibir tus accesos
          </h3>
          <p style="margin: 0 0 16px; font-size: 13.5px; color: #92400e; line-height: 1.5;">
            Tu pedido está registrado pero <strong>aún no ha sido pagado</strong>. Para completar tu compra y recibir tus accesos oficiales de forma inmediata, por favor haz clic en el botón de pago seguro de Mercado Pago:
          </p>
          ${order.paymentUrl ? `
          <div style="margin: 16px 0 12px;">
            <a href="${order.paymentUrl}" 
               style="display: inline-block; background-color: #009EE3; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; box-shadow: 0 2px 5px rgba(0,158,227,0.3);">
              👉 Pagar ahora en Mercado Pago (S/ ${order.total.toFixed(2)})
            </a>
          </div>
          <p style="margin: 0; font-size: 12px; color: #b45309;">
            * Tus credenciales de acceso oficiales y confirmación se entregarán automáticamente una vez que ingreses al link de pago y concluyas tu compra en Mercado Pago.
          </p>
          ` : ''}
        </div>
        `}

        ${
          isPayPal
            ? `
        <!-- Direct WhatsApp button for PayPal Buyer -->
        <div style="text-align: center; margin: 24px 0 16px;">
          <a href="${waPaymentUrl}" 
             style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
            💬 Notificar al vendedor por WhatsApp que ya pagué
          </a>
          <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">
            Haz clic en el botón verde para avisar al vendedor por WhatsApp y agilizar la entrega inmediata.
          </p>
        </div>
        `
            : (
              !isPaid && order.paymentUrl
                ? `
        <div style="text-align: center; margin: 22px 0 16px;">
          <a href="${order.paymentUrl}" 
             style="display: inline-block; background-color: #009EE3; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">
            Concluir pago con Mercado Pago
          </a>
        </div>
        `
                : `
        <!-- Support CTA Button -->
        <div style="text-align: center; margin: 16px 0 8px;">
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20mi%20pedido%20es%20${encodeURIComponent(order.orderId)}" 
             style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px;">
            Contactar soporte
          </a>
        </div>
        `
            )
        }
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.5;">
        UpClic Store • Lima, Perú • Atención: ${WHATSAPP_DISPLAY}<br/>
        ${isPaid ? 'Este mensaje es un comprobante oficial de tu compra con pago aprobado en upclic.store.' : 'Este mensaje es una notificación de tu pedido pendiente de pago en upclic.store.'}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Generate plain-text fallback (clean, no all-caps spam patterns)
export function generateCustomerEmailText(order: OrderEmailPayload): string {
  const isPaid = Boolean(order.isPaid || order.status === "paid" || order.status === "approved");
  const isPayPal = order.channel === "paypal";
  const penRate = 3.75;
  const usdTotal = order.usdTotal || Number((order.total / penRate).toFixed(2));

  const itemsText = order.items
    .map((item) => {
      const price = isPayPal ? `$ ${(item.unitPrice / penRate).toFixed(2)} USD` : `S/ ${(item.unitPrice * item.quantity).toFixed(2)}`;
      return `- ${item.name}${item.variantName ? ` (${item.variantName})` : ''} x${item.quantity} : ${price}`;
    })
    .join('\n');

  const formattedTotal = isPayPal ? `$ ${usdTotal.toFixed(2)} USD` : `S/ ${order.total.toFixed(2)}`;
  const waPaymentUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20acabo%20de%20realizar%20mi%20pago%20por%20PayPal%20para%20mi%20licencia.%20Mi%20correo%20es:%20${encodeURIComponent(order.customerEmail)}`;

  if (isPayPal) {
    return `Hola${order.customerName ? ` ${order.customerName}` : ''},

Hemos registrado tu compra por PayPal en UpClic Store.

Detalles de tu compra:
- Correo de entrega: ${order.customerEmail}
- Método de pago: PayPal ($ USD)
- Estado: Registrado para entrega
- Fecha: ${new Date().toLocaleDateString('es-PE')}

Productos:
${itemsText}

Total: ${formattedTotal}

Entrega de tu licencia:
Tu licencia será enviada a tu correo dentro de 10 a 30 minutos.
Nuestro equipo técnico está preparando tu clave de producto y los enlaces oficiales de descarga.

Notificar al vendedor por WhatsApp que ya pagué:
${waPaymentUrl}

Atentamente,
UpClic Store
Lima, Perú`;
  }

  if (isPaid) {
    const credsText = order.deliveredCredentials && order.deliveredCredentials.length > 0
      ? `\n⚡ TUS CREDENCIALES DE ACCESO ENTREGADAS AL INSTANTE:\n` +
        order.deliveredCredentials.map(c => 
          `- Servicio: ${c.serviceName} (${c.months || 1} ${(c.months || 1) === 1 ? 'Mes' : 'Meses'})\n  Usuario / Correo: ${c.email}\n  Contraseña: ${c.password || 'Asignada'}${c.profilePin ? `\n  Perfil / PIN: ${c.profilePin}` : ''}\n  Dispositivo: 1 solo dispositivo (uso personal)\n  Garantía: ${c.months || 1} ${(c.months || 1) === 1 ? 'Mes' : 'Meses'} (según lo alquilado)\n  ⚠️ REGLA OBLIGATORIA: Iniciar sesión únicamente en el 1 dispositivo que va a utilizar.\n  (No abrir en múltiples pantallas para no anular la garantía)${c.loginUrl ? `\n  Iniciar sesión: ${c.loginUrl}` : ''}`
        ).join('\n\n') + '\n\n'
      : '';

    const hasImmediateWithoutCreds = (!order.deliveredCredentials || order.deliveredCredentials.length === 0) &&
      (order.items || []).some(it => {
        const slug = (it.slug || it.id || (it as any).product?.slug || (it as any).product?.id || it.name || '').toLowerCase();
        return slug.includes('prime-video') || slug.includes('crunchyroll') || slug.includes('prime video') || slug.includes('crunchy');
      });

    return `Hola${order.customerName ? ` ${order.customerName}` : ''},

¡Se completó su compra con éxito! Te confirmamos que tu pago ha sido recibido y aprobado a través de Mercado Pago en UpClic Store.

Detalles de tu compra:
- Correo de entrega: ${order.customerEmail}
- Estado: Pago Aprobado
- Fecha: ${new Date().toLocaleDateString('es-PE')}
${credsText}
Productos:
${itemsText}

${order.discountAmount ? `Descuento: - S/ ${order.discountAmount.toFixed(2)}\n` : ''}Total pagado: S/ ${order.total.toFixed(2)}

${order.deliveredCredentials && order.deliveredCredentials.length > 0 
  ? 'Tus credenciales ya se encuentran activas y listas para usar. Recuerda iniciar sesión en un solo dispositivo.' 
  : hasImmediateWithoutCreds
    ? `COORDINACIÓN DE ENTREGA DE PERFIL CON EL ADMINISTRADOR:
Tu pago ha sido confirmado exitosamente. Debido a la gran demanda, los perfiles de entrega automática inmediata de este lote ya fueron asignados. Por favor presiona el siguiente enlace para hablar directamente con el Administrador por WhatsApp y recibir tu perfil adquirido para 1 dispositivo con tu garantía según lo alquilado:
https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Administrador de UpClic, realicé mi pago con éxito para el pedido #${order.orderId}. Solicito por favor la entrega de mi perfil para 1 dispositivo que adquirí.`)}`
    : `Entrega de tu licencia:
Tu licencia será enviada a tu correo dentro de 10 a 30 minutos.
Nuestro equipo técnico está preparando tu clave de producto y los enlaces oficiales de descarga.`}

Soporte y atención al cliente:
Para contactar soporte por WhatsApp: https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20mi%20pedido%20es%20${encodeURIComponent(order.orderId)}
Teléfono: ${WHATSAPP_DISPLAY}

Atentamente,
UpClic Store
Lima, Perú`;
  }

  return `Hola${order.customerName ? ` ${order.customerName}` : ''},

Hemos registrado tu pedido en UpClic Store.

Detalles del pedido:
- Número de pedido: ${order.orderId}
- Correo: ${order.customerEmail}
- Estado: PENDIENTE DE PAGO (Aún no pagado)
- Fecha: ${new Date().toLocaleDateString('es-PE')}

Productos solicitados:
${itemsText}

${order.discountAmount ? `Descuento: - S/ ${order.discountAmount.toFixed(2)}\n` : ''}Total a pagar: S/ ${order.total.toFixed(2)}

${order.paymentUrl ? `👉 Para completar tu pago con Mercado Pago y recibir tus credenciales oficiales de acceso, ingresa al siguiente enlace de pago:\n${order.paymentUrl}\n\nNota: Tus credenciales oficiales de acceso se emitirán automáticamente una vez que ingreses al link de pago y concluyas tu compra.\n\n` : ''}Soporte:
Para contactar soporte por WhatsApp: https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20mi%20pedido%20es%20${encodeURIComponent(order.orderId)}
Teléfono: ${WHATSAPP_DISPLAY}

Atentamente,
UpClic Store
Lima, Perú`;
}

// Generate Admin Notification HTML
function generateAdminEmailHtml(order: OrderEmailPayload): string {
  const itemsList = order.items
    .map(
      (item) =>
        `<li><strong>${item.name}</strong> ${item.variantName ? `(${item.variantName})` : ""} - Cantidad: ${item.quantity} - Precio: S/ ${item.unitPrice.toFixed(2)}</li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 10px; border: 1px solid #e2e8f0;">
    <h2 style="color: #0f172a; margin-top: 0;">Registro de Pedido en UpClic</h2>
    <p style="font-size: 14px;">Detalles del pedido registrado en la plataforma:</p>
    
    <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
      <p style="margin: 4px 0;"><strong>ID Pedido:</strong> ${order.orderId}</p>
      <p style="margin: 4px 0;"><strong>Correo cliente:</strong> <span style="color: #0066FF; font-weight: bold;">${order.customerEmail}</span></p>
      ${order.customerName ? `<p style="margin: 4px 0;"><strong>Nombre:</strong> ${order.customerName}</p>` : ""}
      ${order.customerPhone ? `<p style="margin: 4px 0;"><strong>Teléfono:</strong> ${order.customerPhone}</p>` : ""}
      <p style="margin: 4px 0;"><strong>Canal:</strong> ${order.channel === "mercado_pago" ? "Mercado Pago" : "Directo"}</p>
      <p style="margin: 4px 0;"><strong>Estado:</strong> ${order.status}</p>
      <p style="margin: 4px 0;"><strong>Monto Total:</strong> <span style="color: #16a34a; font-size: 16px; font-weight: bold;">S/ ${order.total.toFixed(2)}</span></p>
      ${order.paymentId ? `<p style="margin: 4px 0;"><strong>Payment ID:</strong> ${order.paymentId}</p>` : ""}
    </div>

    <h3 style="font-size: 14px;">Licencias:</h3>
    <ul style="line-height: 1.6; font-size: 13px;">
      ${itemsList}
    </ul>

    ${order.deliveredCredentials && order.deliveredCredentials.length > 0 ? `
    <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 12px; margin-top: 14px; font-size: 13px;">
      <h4 style="margin: 0 0 6px; color: #065f46;">⚡ Credenciales Entregadas Automáticamente (Stock Excel):</h4>
      ${order.deliveredCredentials.map(c => `
      <p style="margin: 4px 0;"><strong>${c.serviceName} (${c.months || 1}M):</strong> User: <code>${c.email}</code> | Pass: <code>${c.password}</code> ${c.profilePin ? `| Pin: ${c.profilePin}` : ''}</p>
      `).join('')}
    </div>
    ` : ''}

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      Destinatario de entrega: ${order.customerEmail}
    </p>
  </div>
</body>
</html>`;
}

// Deduplication tracker to prevent duplicate emails for the same sale/order
const recentEmailDispatches = new Map<string, number>();
const inFlightDispatches = new Map<string, Promise<{ customerSent: boolean; adminSent: boolean; reason?: string }>>();

// Clean up entries older than 20 minutes periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentEmailDispatches.entries()) {
    if (now - timestamp > 20 * 60 * 1000) {
      recentEmailDispatches.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Dispatches transactional emails:
 * 1. Confirmation to Customer (optimizado para bandeja principal)
 * 2. Alert to Administrator (leoch5829@gmail.com)
 */
export async function sendOrderEmails(order: OrderEmailPayload): Promise<{
  customerSent: boolean;
  adminSent: boolean;
  reason?: string;
}> {
  const adminEmail = (process.env.ADMIN_EMAIL || "leoch5829@gmail.com").toLowerCase().trim();
  const fromEmail = process.env.FROM_EMAIL || "upclic@upclic.store";
  const isPaid = Boolean(order.isPaid || order.status === "paid" || order.status === "approved");

  const cleanEmail = (order.customerEmail || "").toLowerCase().trim();
  const now = Date.now();

  // Deduplication check: Prevent multiple duplicate emails for the exact same order or customer transaction
  const orderIdKey = order.orderId ? `order_id_${order.orderId}` : null;
  const contentKey = `client_${cleanEmail}_${order.channel}_${Math.round((order.total || 0) * 100)}_${isPaid ? "paid" : "intent"}`;
  const generalClientKey = `client_${cleanEmail}_${order.channel}_${isPaid ? "paid" : "intent"}`;

  // 1. Check if dispatch already finished recently
  if (orderIdKey && recentEmailDispatches.has(orderIdKey)) {
    const lastSent = recentEmailDispatches.get(orderIdKey)!;
    if (now - lastSent < 20 * 60 * 1000) {
      console.log(`⏭️ [EMAIL] Omitiendo correo duplicado por orderId: ${order.orderId}`);
      return { customerSent: true, adminSent: true, reason: "duplicate_order_id_skipped" };
    }
  }

  if (recentEmailDispatches.has(contentKey)) {
    const lastSent = recentEmailDispatches.get(contentKey)!;
    if (now - lastSent < 10 * 60 * 1000) {
      console.log(`⏭️ [EMAIL] Omitiendo correo duplicado por contenido/cliente: ${cleanEmail} (${order.channel})`);
      return { customerSent: true, adminSent: true, reason: "duplicate_content_skipped" };
    }
  }

  if (recentEmailDispatches.has(generalClientKey)) {
    const lastSent = recentEmailDispatches.get(generalClientKey)!;
    // Allow maximum 1 intent email per 3 minutes for the same customer and channel
    if (now - lastSent < 3 * 60 * 1000) {
      console.log(`⏭️ [EMAIL] Omitiendo correo duplicado de intención para el mismo cliente en ventana corta: ${cleanEmail}`);
      return { customerSent: true, adminSent: true, reason: "duplicate_short_window_skipped" };
    }
  }

  // 2. Check if a dispatch with the same key is currently IN-FLIGHT (parallel concurrent requests)
  const lockKey = orderIdKey || contentKey;
  if (inFlightDispatches.has(lockKey)) {
    console.log(`⏳ [EMAIL] Ya hay un despacho de correo en curso para esta orden/cliente (${lockKey}). Esperando resultado sin duplicar...`);
    try {
      return await inFlightDispatches.get(lockKey)!;
    } catch {
      return { customerSent: false, adminSent: false, reason: "in_flight_error" };
    }
  }

  // Register in deduplication map immediately to block parallel duplicate invocations
  if (orderIdKey) recentEmailDispatches.set(orderIdKey, now);
  recentEmailDispatches.set(contentKey, now);
  recentEmailDispatches.set(generalClientKey, now);

  const dispatchPromise = (async () => {
    let customerSent = false;
    let adminSent = false;
    const isSameRecipient = cleanEmail.length > 0 && cleanEmail === adminEmail;

    // 1. Send confirmation email to customer
    const isPayPal = order.channel === "paypal";
    if (order.customerEmail && order.customerEmail.includes("@")) {
      const custResult = await sendEmailWithFallback({
        from: `"UpClic Store" <${fromEmail}>`,
        to: order.customerEmail,
        replyTo: `"UpClic Soporte" <${adminEmail}>`,
        subject: isPayPal
          ? `Confirmación de compra en UpClic Store (PayPal USD)`
          : (isPaid
              ? `¡Pago Aprobado! Se completó su compra en UpClic Store (Pedido #${order.orderId})`
              : `Pedido registrado - Pendiente de pago en UpClic Store (Pedido #${order.orderId})`),
        text: generateCustomerEmailText(order),
        html: generateCustomerEmailHtml(order),
        headers: {
          "X-Entity-Ref-ID": order.orderId,
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
          "Importance": "Normal",
          "List-Unsubscribe": `<mailto:${adminEmail}?subject=desuscribir>`,
        },
      });

      if (custResult.success) {
        customerSent = true;
        console.log(`✅ [EMAIL] Correo único enviado exitosamente al cliente (${isPaid ? 'PAGO APROBADO' : 'PENDIENTE DE PAGO'} vía ${custResult.strategyUsed}): ${order.customerEmail}`);
      } else {
        console.error(`❌ [EMAIL] Error al enviar correo al cliente (${order.customerEmail}):`, custResult.error);
      }
    }

    // 2. Send notification email to admin ONLY IF admin is not the exact same recipient who already received the customer receipt
    if (adminEmail && adminEmail.includes("@") && !isSameRecipient) {
      const adminResult = await sendEmailWithFallback({
        from: `"UpClic Notificaciones" <${fromEmail}>`,
        to: adminEmail,
        replyTo: order.customerEmail,
        subject: isPaid
          ? `[UpClic Pago Aprobado] Se completó la compra #${order.orderId} - S/ ${order.total.toFixed(2)} - ${order.customerEmail}`
          : `[UpClic Pendiente de Pago] Pedido #${order.orderId} registrado - S/ ${order.total.toFixed(2)} - ${order.customerEmail}`,
        text: `Nuevo evento registrado en UpClic:
Estado: ${isPaid ? "PAGO APROBADO (COMPRA COMPLETADA)" : "PENDIENTE DE PAGO (Aún no pagado)"}
Pedido: ${order.orderId}
Cliente: ${order.customerName || "No especificado"}
Correo: ${order.customerEmail}
Telefono: ${order.customerPhone || "No especificado"}
Monto: S/ ${order.total.toFixed(2)}
Canal: ${order.channel}
${order.paymentId ? `Payment ID: ${order.paymentId}\n` : ''}`,
        html: generateAdminEmailHtml(order),
        headers: {
          "X-Entity-Ref-ID": order.orderId,
          "X-Priority": "3",
        },
      });

      if (adminResult.success) {
        adminSent = true;
        console.log(`✅ [EMAIL] Alerta enviada al administrador vía ${adminResult.strategyUsed}: ${adminEmail}`);
      } else {
        console.error(`❌ [EMAIL] Error al enviar alerta al admin (${adminEmail}):`, adminResult.error);
      }
    } else if (isSameRecipient) {
      console.log(`ℹ️ [EMAIL] El comprador es el mismo administrador (${cleanEmail}). Se omite alerta duplicada para enviar exactamente 1 solo correo a la bandeja.`);
      adminSent = true;
    }

    return { customerSent, adminSent };
  })();

  inFlightDispatches.set(lockKey, dispatchPromise);
  try {
    const result = await dispatchPromise;
    return result;
  } finally {
    inFlightDispatches.delete(lockKey);
  }
}
