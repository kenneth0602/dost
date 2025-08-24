const sql = require('mysql')
const env = require('../../../config/db.config')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_s = {"result":"SUCCESS","message":"Successfully Enable!"};
const json_f = {"result":"FAILED","message":"An error occur, please retry"};
const json_invalid = {"result":"INVALID","message":"Invalid Action"};

const handler = (event, callback) => {
  console.log('Enable Scholarship Handler')

  const id = event.params.id;
  try {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return callback.status(200).send({ message: 'Connection error.' });
        }
        // return event.file;
        const query = `CALL scholarship_enable(${id});`;
        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error Enabling Scholarship:', err);
                callback.status(200).send(json_f);
      
            } 
            else if (result.affectedRows === 0) {
                callback.status(200).send(json_invalid);
            }else {
                console.log('Result:', result);
                callback.status(200).send(json_s);
            }
        });
    });
    } catch (error) {
        console.log("Error:", error)
        return callback.status(200).send(json_f);
    }

};
module.exports = handler

