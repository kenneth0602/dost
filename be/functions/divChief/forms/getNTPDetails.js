const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event,callback) => {
    const apcID = event.query.apcID;
    const divID = event.query.divID;

    const query = `call divchief_forms_getNTPDetails(${apcID}, ${divID});`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection error.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.', results: "FAILED"});
            }
            else if(results == '') {
                callback.status(204).send({})
            }
            else {
                callback.status(200).send({message: 'Successfully retrieved data', results});
            }
        });
    });
}

module.exports = handler;