const env = require('../../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
  host: env.hostname,
  user: env.user,
  port: env.port,
  password: env.password,
  database: env.db
});

const handler = (event, callback) => {
  const payload = event.body; // Assuming payload is in the body

  if (!payload || !Array.isArray(payload) || payload.length === 0) {
    return callback.status(400).send({ message: 'Invalid or empty payload' });
  }
  const aldpStatus = 'Approved'
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      return callback.send(null, { message: 'Connection error.' });
    }

    payload.forEach(data => {
      const query = `call admin_aldp_approved(${data.apcID}, '${aldpStatus}');`;
  
      connection.query(query, (error, results) => {
        if (error) {
          console.log(error);
          return callback.status(400).send({ message: 'Something went wrong.' });
        }
      });
    });
  
    connection.release();
    return callback.status(200).send({ message: 'Successfully Approved!' });
  });
};

module.exports = handler;
