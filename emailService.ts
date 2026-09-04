import "dotenv/config";
import nodemailer, { Transporter } from "nodemailer";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "./src/products.ts";

export interface OrderItemPayload {
  name: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
}

export interface OrderEmailPayload {
  orderId: string;
  customerEmail: string;
  customerName?: string | null;
  customerPhone?: string | null;
  total: number;
  items: OrderItemPayload[];
  channel: "mercado_pago" | "whatsapp" | "email_registration";
  status: string;
  discountAmount?: number;
  discountReason?: string | null;
  paymentId?: string;
  createdAt?: string;
  paymentUrl?: string;
  isPaid?: boolean;
}

// Helper to create the transporter safely
export function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
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
  });
}

// Generate styled HTML receipt for customer (Deliverability & anti-spam optimized)
function generateCustomerEmailHtml(order: OrderEmailPayload): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 8px; font-size: 13px; color: #1e293b; font-weight: 600;">
          ${item.name} ${item.variantName ? `<span style="color: #64748b; font-size: 12px; font-weight: normal;">(${item.variantName})</span>` : ""}
        </td>
        <td style="padding: 10px 8px; font-size: 13px; color: #475569; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; font-size: 13px; color: #0f172a; text-align: right; font-weight: 700;">
          S/ ${(item.unitPrice * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const isPaid = Boolean(order.isPaid || order.status === "paid" || order.status === "approved");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isPaid ? 'Comprobante de compra UpClic Store' : 'Detalles de pedido UpClic Store'}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; border-top: 4px solid ${isPaid ? '#059669' : '#0066FF'}; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;">
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
              <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; ${isPaid ? 'background-color: #d1fae5; color: #065f46;' : 'background-color: #fef3c7; color: #92400e;'}">
                ${isPaid ? 'Pago aprobado' : 'Pendiente de pago'}
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
            isPaid
              ? 'Te confirmamos que hemos recibido tu pago a través de Mercado Pago. A continuación encuentras los detalles de tu compra:'
              : 'Hemos registrado tu pedido en UpClic Store. Puedes concluir tu pago con Mercado Pago para recibir tus licencias:'
          }
        </p>

        <!-- Order Metadata Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="color: #64748b; padding-bottom: 6px;">Número de pedido:</td>
              <td style="color: #0f172a; font-weight: 700; text-align: right; padding-bottom: 6px; font-family: monospace;">${order.orderId}</td>
            </tr>
            ${order.paymentId ? `
            <tr>
              <td style="color: #64748b; padding-bottom: 6px;">Transacción Mercado Pago:</td>
              <td style="color: #0f172a; font-weight: 600; text-align: right; padding-bottom: 6px; font-family: monospace;">#${order.paymentId}</td>
            </tr>` : ''}
            <tr>
              <td style="color: #64748b; padding-bottom: 6px;">Correo de entrega:</td>
              <td style="color: #0f172a; font-weight: 600; text-align: right; padding-bottom: 6px;">${order.customerEmail}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Estado:</td>
              <td style="color: ${isPaid ? '#059669' : '#d97706'}; font-weight: 700; text-align: right;">
                ${isPaid ? 'Pagado' : 'Pendiente'}
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
                  <td style="padding: 8px 14px; font-size: 13px; color: #16a34a; font-weight: 700; text-align: right;">- S/ ${order.discountAmount.toFixed(2)}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 12px 14px; font-size: 14px; color: #0f172a; font-weight: 700; border-top: 1px solid #e2e8f0;">${isPaid ? 'Total pagado:' : 'Total a pagar:'}</td>
            <td style="padding: 12px 14px; font-size: 16px; color: ${isPaid ? '#059669' : '#0066FF'}; font-weight: 800; text-align: right; border-top: 1px solid #e2e8f0;">S/ ${order.total.toFixed(2)}</td>
          </tr>
        </table>

        ${
          isPaid
            ? `
        <!-- Delivery Notice 10-30 min for Paid Order -->
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
            : `
        <!-- Pending Payment Link Button -->
        ${
          order.paymentUrl
            ? `
        <div style="text-align: center; margin: 22px 0 16px;">
          <a href="${order.paymentUrl}" 
             style="display: inline-block; background-color: #009EE3; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">
            Concluir pago con Mercado Pago
          </a>
        </div>
        `
            : ''
        }
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 18px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.4;">
            Si necesitas pagar con Yape o transferencia bancaria, puedes contactar a nuestro equipo de soporte.
          </p>
        </div>
        `
        }

        <!-- Support CTA Button -->
        <div style="text-align: center; margin: 16px 0 8px;">
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20UpClic,%20mi%20pedido%20es%20${encodeURIComponent(order.orderId)}" 
             style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px;">
            Contactar soporte
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.5;">
        UpClic Store • Lima, Perú • Atención: ${WHATSAPP_DISPLAY}<br/>
        Este mensaje es un comprobante de tu pedido en upclic.store.
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Generate plain-text fallback (clean, no all-caps spam patterns)
function generateCustomerEmailText(order: OrderEmailPayload): string {
  const isPaid = Boolean(order.isPaid || order.status === "paid" || order.status === "approved");

  const itemsText = order.items
    .map((item) => `- ${item.name}${item.variantName ? ` (${item.variantName})` : ''} x${item.quantity} : S/ ${(item.unitPrice * item.quantity).toFixed(2)}`)
    .join('\n');

  if (isPaid) {
    return `Hola${order.customerName ? ` ${order.customerName}` : ''},

Confirmamos la recepción de tu pago en UpClic Store.

Detalles de tu compra:
- Número de pedido: ${order.orderId}
${order.paymentId ? `- Transacción Mercado Pago: #${order.paymentId}\n` : ''}- Correo de entrega: ${order.customerEmail}
- Estado: Pagado
- Fecha: ${new Date().toLocaleDateString('es-PE')}

Productos:
${itemsText}

${order.discountAmount ? `Descuento: - S/ ${order.discountAmount.toFixed(2)}\n` : ''}Total pagado: S/ ${order.total.toFixed(2)}

Entrega de tu licencia:
Tu licencia será enviada a tu correo dentro de 10 a 30 minutos.
Nuestro equipo técnico está preparando tu clave de producto y los enlaces oficiales de descarga.

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
- Estado: Pendiente de pago
- Fecha: ${new Date().toLocaleDateString('es-PE')}

Productos:
${itemsText}

${order.discountAmount ? `Descuento: - S/ ${order.discountAmount.toFixed(2)}\n` : ''}Total a pagar: S/ ${order.total.toFixed(2)}

${order.paymentUrl ? `Concluir pago con Mercado Pago:\nPuedes pagar tu pedido en el siguiente enlace:\n${order.paymentUrl}\n\n` : ''}Soporte:
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

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      Destinatario de entrega: ${order.customerEmail}
    </p>
  </div>
</body>
</html>`;
}

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
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || "leoch5829@gmail.com";

  if (!transporter) {
    console.log(
      `ℹ️ [EMAIL] SMTP no configurado en variables de entorno (SMTP_USER/SMTP_PASS).`
    );
    return {
      customerSent: false,
      adminSent: false,
      reason: "smtp_not_configured",
    };
  }

  let customerSent = false;
  let adminSent = false;

  const senderAddress = process.env.SMTP_USER || "leoch5829@gmail.com";
  const isPaid = Boolean(order.isPaid || order.status === "paid" || order.status === "approved");

  // 1. Send confirmation email to customer
  try {
    if (order.customerEmail && order.customerEmail.includes("@")) {
      await transporter.sendMail({
        from: `"UpClic Store" <${senderAddress}>`,
        to: order.customerEmail,
        replyTo: `"UpClic Soporte" <${senderAddress}>`,
        subject: isPaid
          ? `Comprobante de compra UpClic Store (Pedido ${order.orderId})`
          : `Detalles de tu pedido en UpClic Store (Pedido ${order.orderId})`,
        text: generateCustomerEmailText(order),
        html: generateCustomerEmailHtml(order),
        headers: {
          "X-Entity-Ref-ID": order.orderId,
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
          "Importance": "Normal",
          "List-Unsubscribe": `<mailto:${senderAddress}?subject=desuscribir>`,
        },
      });
      customerSent = true;
      console.log(`✅ [EMAIL] Correo enviado exitosamente al cliente (${isPaid ? 'PAGADO' : 'PENDIENTE'}): ${order.customerEmail}`);
    }
  } catch (err: any) {
    console.error(`❌ [EMAIL] Error al enviar correo al cliente (${order.customerEmail}):`, err?.message || err);
  }

  // 2. Send notification email to admin
  try {
    if (adminEmail && adminEmail.includes("@")) {
      await transporter.sendMail({
        from: `"UpClic Notificaciones" <${senderAddress}>`,
        to: adminEmail,
        replyTo: order.customerEmail,
        subject: isPaid
          ? `[UpClic Pagado] ${order.orderId} - S/ ${order.total.toFixed(2)} - ${order.customerEmail}`
          : `[UpClic Pedido] ${order.orderId} - S/ ${order.total.toFixed(2)} - ${order.customerEmail}`,
        text: `Nuevo evento registrado en UpClic:
Estado: ${isPaid ? "PAGADO" : "PENDIENTE"}
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
      adminSent = true;
      console.log(`✅ [EMAIL] Alerta enviada al administrador: ${adminEmail}`);
    }
  } catch (err: any) {
    console.error(`❌ [EMAIL] Error al enviar alerta al admin (${adminEmail}):`, err?.message || err);
  }

  return { customerSent, adminSent };
}
