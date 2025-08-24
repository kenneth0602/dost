const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});

const handler = (event, callback) => {

    const query = `call admin_aldp_program_getAllProgramDD();`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return callback.status(200).send({message: 'Connection error.'});
        }

        connection.query(query, (error, results, fields) => {
            connection.release();
            console.log(results);
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                callback.status(204).send({})
            }
            else {
                callback.status(200).send(results);
            }
        });
    });

}

module.exports = handler;