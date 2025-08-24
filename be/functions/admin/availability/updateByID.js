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

    const availID = event.params.availID;
    const dateFrom = event.body.dateFrom;
    const fromTime = event.body.fromTime;
    const dateTo = event.body.dateTo;
    const toTime = event.body.toTime;

    const query = `call avail_updateAvailabilityByAvailID('${availID}', '${dateFrom}', '${fromTime}', '${dateTo}', '${toTime}');`;

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
                return callback.status(204).send({})
            }
            else {
                return callback.status(200).send({message : 'Successfully updated availability schedule.'});
            }
        });
    });
}

module.exports = handler;