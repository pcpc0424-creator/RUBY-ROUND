const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// Connection pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'rubyround',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'rubyround',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Timezone handling
  timezone: '+09:00',
  // Handle date objects properly
  dateStrings: true,
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    return false;
  }
};

// Transaction helper
const withTransaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Query with connection from pool
// Using pool.query instead of pool.execute to handle LIMIT/OFFSET properly
const query = async (sql, params = []) => {
  const [results] = await pool.query(sql, params);
  return results;
};

// Query with specific connection (for transactions)
const queryWithConnection = async (connection, sql, params = []) => {
  const [results] = await connection.execute(sql, params);
  return results;
};

// Get a single row
const queryOne = async (sql, params = []) => {
  const results = await query(sql, params);
  return results[0] || null;
};

// Insert and return insert ID
const insert = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return result.insertId;
};

// Update and return affected rows
const update = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
};

module.exports = {
  pool,
  testConnection,
  withTransaction,
  query,
  queryWithConnection,
  queryOne,
  insert,
  update,
};
