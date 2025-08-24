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
//console.log(event);
    
    let username = event.user.username;
    const reqID = event.params.reqID;
    const reqRemarks = event.body.reqRemarks;
    const compID = event.body.compID;
    
    const status = event.body.status;
    let query = '';

    if(status == 'Rejected'){
      query = `call divChief_updateDivStatusReject('${reqID}','${reqRemarks}');`;
     }
     else if(status == 'Approved') {
      query = `call divChief_mergeRequestToCompetency('${compID}','${reqID}');`;
     }
     else {
        callback.status(200).send({message : 'Invalid request.'});
     }
          
    // const query = `call divChief_updateCompetencyByID('${compID}','${competencyName}', '${KPItoSupport}', '${levelOfPriority}', '${targetDate}', '${remarks}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }

        connection.query(`SELECT empID FROM users WHERE username ='${username}'`, (error, results) => {
            if(error) return error;
            console.log('id:', results[0].empID);
            connection.query(`INSERT INTO audit_logs(username, target, action) VALUES ('${username}', 'Update Competency Request', 'Modify');`,(error2, result2) => {
                if (error2) return console.log(error2);
                connection.query(query, (error3, result3) => {
                    connection.release();
                    console.log(result3);
                    if(error3) {
                        console.log(error3);
                        callback.status(400).send({message : 'An error occured upon updating of information.'});
                    }
                    else if(result3 == '') {
                        callback.status(204).send({message : 'Invalid action.'});
                    }
                    else {
                        callback.status(200).send({message : 'Successfully updated.'});
                    }
                })
            }) 
                });
            });
        }
module.exports = handler;

