// api/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Em desenvolvimento local, ele carrega o .env
// Em produção (Vercel), o dotenv não encontra .env (e nem precisa, pois as vars vêm do próprio Vercel)
dotenv.config();

const connectionURL = process.env.DATABASE_URL;
if (!connectionURL) {
  console.error("❌ Erro: a variável DATABASE_URL não está definida em process.env");
  // Se quiser forçar a parada caso não haja variável, remova o comentário da linha abaixo:
  // throw new Error("DATABASE_URL não encontrada em process.env");
}

const pool = mysql.createPool({
  // “uri” é compreendido pelo mysql2/promise para separar host/user/pass/database
  uri: connectionURL,

  // Opcional: limite de conexões simultâneas. Em serverless, costuma-se usar algo em torno de 5 a 10:
  connectionLimit: 5,
  waitForConnections: true,
});

export default pool;
