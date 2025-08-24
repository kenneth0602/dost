const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host : env.hostname,
    user : env.user,
    password : env.password,
    database : env.db
});

const handler = (event, callback) => {

    const pprogID = event.params.pprogID;


    const query = `call pprog_getPProgByID(${pprogID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            callback.send(null, {message: 'Connection error.'});
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