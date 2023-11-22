import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USER_NOME_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.USER_NOME_BANCO,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0
});

export {
    connection
}