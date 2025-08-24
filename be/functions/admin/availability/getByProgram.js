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
    console.log(event.body);
    console.log(event.params);
    console.log(event.query);


    const query = `call avail_getAvailabilityByProgramID(${pprogID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return callback.send(null, {message: 'Connection error.'});
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
                return callback.status(200).send(results);
            }
        });
    });

}

module.exports = handler;