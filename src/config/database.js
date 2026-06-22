const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  // pool.execute() já usa prepared statements com '?' automaticamente
});

/**
 * Testa a conexão com o MySQL assim que o servidor sobe.
 * Se a senha/usuário/host estiverem errados, o erro aparece AQUI,
 * no terminal, em vez de só no primeiro request da API.
 */
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado com sucesso');
    conn.release();
  } catch (error) {
    console.error('❌ Erro na conexão MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = pool;
module.exports.testConnection = testConnection;