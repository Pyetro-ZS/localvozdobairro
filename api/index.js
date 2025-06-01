// api/index.js
import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";   // importa o pool que criamos em api/db.js
import bcrypt from "bcrypt";

dotenv.config(); // garante carregar .env em dev; em produção, usa as vars do Vercel

const app = express();
app.use(express.json());

// ---- Rota de health-check ----
app.get("/api/health", async (req, res) => {
  try {
    // testa se o pool consegue executar um SELECT simples
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    if (rows[0].result === 2) {
      return res.status(200).json({ db: "ok" });
    } else {
      return res.status(500).json({ db: "erro" });
    }
  } catch (err) {
    console.error("Erro no health-check:", err);
    return res.status(500).json({ db: "erro", message: err.message });
  }
});

// ---- Rota de cadastro de usuário ----
app.post("/api/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios." });
  }

  try {
    // 1) Verifica se já existe usuário com esse e-mail
    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Já existe um usuário com este e-mail." });
    }

    // 2) Faz hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // 3) Insere no banco
    const [insertResult] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hashedPassword]
    );

    return res
      .status(201)
      .json({ message: "Usuário cadastrado com sucesso!", userId: insertResult.insertId });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    return res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
  }
});

// ---- (exemplo) rota básica ----
app.get("/", (req, res) => {
  res.send("API do Voz do Bairro está no ar!");
});

// Em “Serverless” (Vercel), o framework detecta todas as rotas dentro de /api/* automaticamente.
// Ainda assim, deixamos o app.listen para testes locais:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
