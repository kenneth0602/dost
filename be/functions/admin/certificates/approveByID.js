const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host : env.hostname,
    user : env.user,
    password : env.password,
    database : env.db
});

const handler = (event, callback) => {

    const certID = event.query.certID;


    const query = `call admin_certificate_approve(${certID});`;

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
            else if(results == '') {
                return callback.status(204).send({})
            }
            else {
                return callback.status(200).send({message : 'Certificate Verified!'});
            }
        });
    });

}

module.exports = handler;