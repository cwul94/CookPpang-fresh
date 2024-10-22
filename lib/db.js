import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'lmcwul',
    password: '1234',
    database: 'coop_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function getDatabaseConnection() {
    const connection = await pool.getConnection();
    return connection;
}
