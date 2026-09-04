const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const mpImport = `import { MercadoPagoConfig, Preference } from "mercadopago";\n`;

// Insert after other imports
code = code.replace(/import \{ GoogleGenAI \} from "@google\/genai";/, mpImport + `import { GoogleGenAI } from "@google/genai";`);

const mpEndpoint = `
// --- MERCADO PAGO INTEGRATION ---
app.post("/api/create_preference", express.json(), async (req, res) => {
  try {
    const { items, discountAmount, discountReason, total } = req.body;
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ error: "MERCADOPAGO_ACCESS_TOKEN no configurado en el servidor." });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Calculate total original price
    const originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountRatio = discountAmount > 0 ? (originalTotal - discountAmount) / originalTotal : 1;

    const mpItems = items.map(item => ({
      id: item.slug || item.id,
      title: item.name,
      description: item.name,
      unit_price: Number((item.price * discountRatio).toFixed(2)),
      quantity: Number(item.quantity),
      currency_id: 'PEN',
    }));

    const response = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: \`\${process.env.APP_URL || 'http://localhost:3000'}/checkout/success\`,
          failure: \`\${process.env.APP_URL || 'http://localhost:3000'}/checkout/failure\`,
          pending: \`\${process.env.APP_URL || 'http://localhost:3000'}/checkout/pending\`,
        },
        auto_return: "approved",
      }
    });

    res.json({ id: response.id, init_point: response.init_point });
  } catch (error) {
    console.error("Error MercadoPago:", error);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
});
`;

code = code.replace(/\/\/ --- VITE & STATIC MIDDLEWARE ---/, mpEndpoint + '\n// --- VITE & STATIC MIDDLEWARE ---');

fs.writeFileSync('server.ts', code);
