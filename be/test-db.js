const mysql = require('mysql');
const dbConfig = require('./config/db.config');

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.db,
  port:dbConfig.port
});

// Attempt to connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

// Close the database connection after testing
connection.end();
