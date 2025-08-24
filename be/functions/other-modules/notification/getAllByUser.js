const sql = require('mysql')
const env = require('../../../config/db.config')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_f = {"result":"FAILED","message":"An error occur, please retry"};

const handler = (event, callback) => {
  console.log('Get All Notification Handler')
  
  const { pageNo, pageSize } = event.query
  const { id } = event.user
  console.log("ID: ", id )
  try {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return callback.status(200).send({ message: 'Connection error.' });
        }
        const query = `CALL notifications_getAllByUser("${pageNo}", "${pageSize}", "${id}");`;
        connection.query(query, (err, result) => {
            connection.release();
            if (err) {
                console.error('Error:', err);
                callback.status(200).send(json_f);
      
            } else {
                console.log('Result:', result);
                callback.status(200).send({
                    result: "SUCCESS",
                    message: "Successfully retrieved data",
                    data: result[0] ,
                });
            }
        });
    });
    } catch (error) {
        console.log("Error:", error)
        return callback.status(200).send(json_f);
    }

};
module.exports = handler

