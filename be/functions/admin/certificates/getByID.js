const env = require('../../../config/db.config');
const sql = require('mysql');
const fs = require('fs')

const pool = sql.createPool({
    host : env.hostname,
    user : env.user,
    password : env.password,
    database : env.db
});

const handler = (event, callback) => {

    const certID = event.params.certID;


    const query = `call admin_certificate_getByID(${certID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return callback.send(null, {message: 'Something went wrong.'});
        }

        connection.query(query, (error, results, fields) => {
            connection.release();
            console.log(results);
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else {
                const filename = results[0][0].filename || '';
                const uid = results[0][0].empID;
                    fs.readFile(`uploads/certificate/${uid}/${filename}`, 'utf8', (err, data) => {
                        if (err) {
                            callback.writeHead(404, { 'Content-Type': 'text/html' });
                            callback.write('404 Not Found');
                            return callback.end();
                        } else {
                            callback.writeHead(200, { 'Content-Type': 'application/pdf' })
                            const fileStream = fs.createReadStream(`uploads/certificate/${uid}/${filename}`);
                            fileStream.pipe(callback);
                            return
                        }
                }) 
            }
        });
    });

}

module.exports = handler;