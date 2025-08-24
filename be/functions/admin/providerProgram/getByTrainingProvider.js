const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host : env.hostname,
    user : env.user,
    password : env.password,
    database : env.db
});

const handler = (event, res) => {

    const provID = event.params.provID;


    const query = `call tprov_getProgramAvailabilityCostByTrainingProvider(${provID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).send(null, {message: 'Connection error.'});
        }

        connection.query(query, (error, results, fields) => {
            connection.release();
            console.log(results);
            if(error) {
                console.log(error);
                res.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                res.status(204).send({})
            }
            else {
                res.status(200).send(results);
            }
        });
    });

}

module.exports = handler;