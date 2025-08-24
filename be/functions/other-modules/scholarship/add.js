const sql = require('mysql')
const env = require('../../../config/db.config')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_s = {"result":"SUCCESS","message":"Successfully Uploaded!"};
const json_f = {"result":"FAILED","message":"An error occur, please retry"};

const handler = (event, callback) => {
  console.log('upload Scholarship Handler')
  const file = event.file
  console.log(event.file, "file")
  
  if (file == undefined) {
    console.log("Please upload a file!")
    return callback.status(200).send({ message: "Please upload a file!" });
  } 
  const filename = file.filename
  console.log('User ID:', event.user);
  const {title, category, sponsor, participation_fee, venue } = event.body 
  try {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return callback.status(200).send({ message: 'Connection error.' });
        }
        // return event.file;
        const query = `CALL scholarships_add("${title}", "${category}", "${filename}", "${sponsor}","${participation_fee}","${venue}");`;
        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error inserting into Scholarship table:', err);
                callback.status(200).send(json_f);
      
            } else {
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

