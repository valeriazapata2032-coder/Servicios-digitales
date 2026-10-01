import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const useSsl = process.env.MYSQL_SSL === 'true'

export const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  port: Number(process.env.MYSQL_ADDON_PORT || 3306),
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_POOL_LIMIT || 5),
  queueLimit: 0,
  connectTimeout: 15000,
  enableKeepAlive: true,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
})
