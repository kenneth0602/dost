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
console.log(event.body);
    const compID = event.params.compID;
    const LDremarks = event.body.remarks;
    const LDintervention = event.body.LDintervention;
    const supportNeeded = event.body.supportNeeded;
    const budget = event.body.budget;
    const sourceOfFunds = event.body.sourceOfFunds;
    const targetDate = event.body.targetDate;
    const priority = '';
    const compStatus = event.body.compStatus;
    
    const query = `call competency_updateCompetency(${compID},'${LDremarks}', 'Intervention', 'supportNeeded', 'budget', 'sourceOfFunds', '2022-12-21', '${priority}', '${compStatus}' );`;

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
                return callback.status(200).send({message: 'Successfully updated data', results});
            }
        });
    });
}

module.exports = handler;