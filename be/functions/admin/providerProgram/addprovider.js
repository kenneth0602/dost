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

    const pprogID = event.params.pprogID
    const provID = event.body.provID
    const cost_val = parseFloat(event.body.cost)
    console.log(cost_val , "cost")
      

    const query = `call pprog_putProvBypprogID(${pprogID}, ${provID}, ${cost_val});`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            return callback.send(null,{message: 'Connection error.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            // console.log(results[0][0].result)
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results[0][0].result == 'Already exists') {
                return callback.status(200).send({ results: 'EXISTING', message : 'Provider Already Exists.'})
            }
            else {
                return callback.status(200).send({ results: 'SUCCESS', message : 'Successfully updated Provider Program details.'});
            }
        });
    });
}

module.exports = handler;