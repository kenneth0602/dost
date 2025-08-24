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

    const reqID = event.body.reqID;
    const reqRemarks = event.body.remarks;
    const compID = event.body.compID;
    
    const reqStatus = event.query.status;
    let query='';

    if(reqStatus == 'Rejected'){
        query = `call divChief_updateDivStatus('${reqID}','${reqRemarks}');`;
    }else{
        query = `call divChief_mergeRequestToCompetency('${compID}','${reqID}');`;
    }



    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                callback.status(204).send({})
            }
            else {
                callback.status(200).send({message: 'Successfully updated data', results});
            }
        });
    });
}

module.exports = handler;