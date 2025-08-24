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

    const provID = event.query.provID;
    const pprogID = event.body.pprogID;
    const dateFrom = event.body.dateFrom;
    const fromTime = event.body.fromTime;
    const dateTo = event.body.dateTo;
    const toTime = event.body.toTime;
    console.log(event.body, "Payload")
    const newStartDate = dateFrom.split('T')
    const newEndDate = dateTo.split('T')
    console.log(newStartDate)
    console.log(newEndDate)


    const query = `call avail_createAvailability('${provID}', '${pprogID}', '${dateFrom}', '${fromTime}', '${dateTo}', '${toTime}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            return callback.send(null,{message: 'Connection error occured.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                return callback.status(204).send({message : 'Please fill out required fields'});
            }
            else {
                return callback.status(200).send({ results: "SUCCESS", message : 'Successfully created new Availability Schedule'});
            }
        });
    });
}

module.exports = handler;