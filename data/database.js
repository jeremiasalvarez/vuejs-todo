const db = require("mysql");
const { promisify } = require("util");

const keys = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
}

//
const pool = db.createPool(keys);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TOO MANY CONNECTION");
    }
    if (err.code === "ECONNREFUSED") {
      //error de conexion rechazada
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }

  if (connection) connection.release();
  if (connection) {
    console.log("La base de datos esta conectada");
  }

  return;
});

//convertir en promesas los callbacks
pool.query = promisify(pool.query);

module.exports = pool;