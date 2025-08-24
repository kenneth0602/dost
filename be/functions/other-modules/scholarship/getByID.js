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
  console.log('Get All Scholarship Handler')
  // In Progress: 
  
  const { pageNo, pageSize, keyword } = event.query
  const role = 'HRDP' // event.user.role;
  try {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return callback.status(200).send({ message: 'Connection error.' });
        }
        const query = `CALL scholarship_getAll("${pageNo}", "${pageSize}", "${keyword}", "${role}");`;
        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error inserting into Scholarship table:', err);
                callback.status(200).send(json_f);
      
            } else {
                console.log('Inserted into Sub Competency table:', result);
                callback.status(200).send({
                    result: "SUCCESS",
                    message: "Successfully retrieved data",
                    data: result[0] ,
                    total: result[1][0].total
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

