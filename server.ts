import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== "YOUR_SUPABASE_URL" && 
  supabaseAnonKey && 
  supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY";

const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for admin authentication (secure server-side verification with Supabase Auth)
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "E-mail e senha são obrigatórios."
      });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.trim(),
          password: password,
        });

        if (error) {
          return res.status(401).json({
            success: false,
            message: `Erro na autenticação: ${error.message}`
          });
        }

        return res.json({
          success: true,
          token: data.session?.access_token || "session_token_bosque_encantado_2026_melissa",
          username: data.user?.email || username
        });
      } catch (err: any) {
        console.error("Supabase sign in error:", err);
        return res.status(500).json({
          success: false,
          message: `Erro ao conectar ao Supabase: ${err.message || err}`
        });
      }
    } else {
      // Local fallback for testing/initial setup
      const masterAdminUser = process.env.ADMIN_USER || "admin";
      const masterAdminPass = process.env.ADMIN_PASS || "admin123";

      if (username === masterAdminUser && password === masterAdminPass) {
        return res.json({
          success: true,
          token: "session_token_local_dev",
          username: masterAdminUser
        });
      }

      return res.status(401).json({
        success: false,
        message: "O Supabase não está configurado neste ambiente ou as credenciais locais estão incorretas."
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`숲 Real-time server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup error:", err);
});
