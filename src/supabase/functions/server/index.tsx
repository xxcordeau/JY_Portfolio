import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a3d4d756/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin authentication endpoint
app.post("/make-server-a3d4d756/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;

    const adminPassword = Deno.env.get("ADMIN_PASSWORD") || "admin123";

    if (password === adminPassword) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: "Invalid password" }, 401);
    }
  } catch (error) {
    console.log(`Admin login error: ${error}`);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Get all mails endpoint
app.get("/make-server-a3d4d756/admin/mails", async (c) => {
  try {
    const mailKeys = await kv.getByPrefix("mail:");
    const mails = mailKeys.map(item => ({
      key: item.key,
      ...item.value
    }));
    
    // Sort by timestamp descending
    mails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ mails });
  } catch (error) {
    console.log(`Error fetching mails: ${error}`);
    return c.json({ error: "Failed to fetch mails" }, 500);
  }
});

// Delete mail endpoint
app.delete("/make-server-a3d4d756/admin/mails/:key", async (c) => {
  try {
    const key = c.req.param("key");
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting mail: ${error}`);
    return c.json({ error: "Failed to delete mail" }, 500);
  }
});

// Send email endpoint using Gmail SMTP
app.post("/make-server-a3d4d756/send-email", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      console.log("Error: Missing required fields");
      return c.json({ error: "Missing required fields: name, email, or message" }, 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Error: Invalid email format");
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Get environment variables
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    console.log(`Gmail User configured: ${gmailUser ? 'Yes' : 'No'}`);
    console.log(`Gmail App Password configured: ${gmailAppPassword ? 'Yes' : 'No'}`);

    if (!gmailUser || !gmailAppPassword) {
      console.log("Error: Missing Gmail credentials in environment variables");
      return c.json({ 
        error: "Server configuration error: Gmail credentials not set. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables." 
      }, 500);
    }

    console.log(`Attempting to send email from ${email} to qazseeszaq3219@gmail.com`);

    // Save email to KV store for admin panel
    const mailKey = `mail:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(mailKey, {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });
    console.log(`Email saved to KV store with key: ${mailKey}`);

    // Use nodemailer with proper Deno import
    const nodemailer = await import("npm:nodemailer@6.9.7");
    
    // Create transporter with explicit Gmail SMTP settings
    const transporter = nodemailer.default.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    try {
      console.log("Verifying SMTP connection...");
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.log(`SMTP verification failed: ${verifyError}`);
      console.log(`Verify error type: ${typeof verifyError}`);
      console.log(`Verify error details: ${JSON.stringify(verifyError, null, 2)}`);
      throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : String(verifyError)}`);
    }

    const mailOptions = {
      from: `"Portfolio Contact Form" <${gmailUser}>`,
      to: 'qazseeszaq3219@gmail.com',
      replyTo: email,
      subject: `포트폴리오 문의: ${name}`,
      text: `이름: ${name}\n이메일: ${email}\n\n메시지:\n${message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1d1d1f; margin-bottom: 20px;">새로운 문의</h2>
          <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>이름:</strong> ${name}</p>
            <p style="margin: 0;"><strong>이메일:</strong> ${email}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #d2d2d7;">
            <p style="margin: 0 0 10px 0;"><strong>메시지:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);

    return c.json({ 
      success: true, 
      message: "Email sent successfully",
      messageId: info.messageId 
    });

  } catch (error) {
    console.log(`Error sending email: ${error}`);
    console.log(`Error stack: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    return c.json({ 
      error: "Failed to send email",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);
