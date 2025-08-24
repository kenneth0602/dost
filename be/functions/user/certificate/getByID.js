const env = require('../../../config/db.config');
const sql = require('mysql');
const fs = require('fs')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event, callback) => {
    let username = event.user.username;
    const certID = event.params.certID;

    const query = `CALL admin_certificate_getByID(${certID})`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback.send(null, { message: 'Something went wrong.' });
        }

        connection.query(`SELECT empID FROM users WHERE username ='${username}'`, (err, result) => {
            if (err) {
                connection.release();
                return console.error(err);
            }

            const userId = result[0].empID;

            connection.query(`INSERT INTO audit_logs(username, target, action) VALUES('${username}', 'All Certificates', 'View');`, (err1, result1) => {
                if (err1) {
                    connection.release();
                    return console.error(err1);
                }

                console.log(result1);

                connection.query(query, (error, results, fields) => {
                    connection.release();

                    if (error) {
                        console.log(error);
                        callback.status(400).send({ message: 'Something went wrong.' });
                        return
                    } else {
                        const filename = results[0][0].filename;
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
        });
    });
}

module.exports = handler;
