const sql = require('mysql')
const env = require('../../../config/db.config')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_s = {"result":"SUCCESS","message":"Successfully Disabled!"};
const json_f = {"result":"FAILED","message":"An error occur, please retry"};
const json_no_result = {"result":"NO_RESULT","message":"Scholarship already sent to SDU and can't be deleted."};

const handler = (event, callback) => {
  console.log('Disable Scholarship Handler')

  const id = event.params.id;
  try {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return callback.status(200).send({ message: 'Connection error.' });
        }
        // return event.file;
        const query = `CALL scholarship_disable(${id});`;
        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error Disabling Scholarship:', err);
                callback.status(200).send(json_f);
      
            } 
            else if (result.affectedRows === 0) {
                callback.status(200).send(json_no_result);
            }
            else {
                console.log('Result:', result);
                console.log('Result:', result.affectedRows);
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

