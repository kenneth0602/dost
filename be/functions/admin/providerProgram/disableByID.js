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

    const pprogID = event.params.pprogID;

    const query = `call pprog_disableProviderProgramByID(${pprogID});`;
    const secQuery = `call pprog_disableProviderProgramAvailabilityByID(${pprogID});`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            return callback.send(null,{message: 'Connection error.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                return callback.status(204).send({message: 'Please fill out all required fields.'})
            }
            else {
                connection.query(secQuery, (error2, result2) => {
                    if(error2) {
                        console.log(error2);
                        return callback.status(400).send({message: 'Error occured.'});
                    }
                    else {
                        return callback.status(200).send({message: 'Successfully disabled Provider Program'})
                    }
                })
            }
        });
    });
}

module.exports = handler;