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

    let username = event.user.username;
    
    const provID = event.params.provID;

    const query = `call tprov_disableTrainingProviderByID(${provID});`;
    const secQuery = `call tp_disableProgramsByTrainingProviderID(${provID});`;
    const thirdQuery = `call pprog_disableProviderProgramAvailabilityByID(${provID});`;
    const forthQuery = `call payment_disablePaymentOptByTrainingProvider(${provID});`;
    const fifthQuery = `call SME_disableSMEbyTrainingProvider(${provID});`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection error.'});
        }

        
        connection.query(`SELECT empID FROM admin WHERE username ='${username}'`, (err, result) => {
            if(err) return err;
            console.log('id:', result[0].empID);
            connection.query(`INSERT INTO audit_logs(username, target, action) VALUES('${username}', 'Training Provider', 'Deactivate');`, (err1, result1) => {
                if(err1) return console.log(err1);
                connection.query(query, (error,results,fields) => {
                    connection.release();
                    if(error) {
                        console.log(error);
                        callback.status(400).send({message : 'Something went wrong.'});
                    }
                    else if(results == '') {
                        callback.status(204).send({message : 'Please fill out allrequired fields.'})
                    }
                    else {
                        connection.query(secQuery, (error2, result2) => {
                            if(error2) {
                                console.log(error2);
                                callback.status(400).send({message : 'Error occured.'});
                            }
                            else {
                                connection.query(thirdQuery, (error3, result3) => {
                                    if(error3) {
                                        console.log(error3);
                                        callback.status(400).send({message : 'Error processing request'});
                                    }
                                    else {
                                        connection.query(forthQuery, (error4, result4) => {
                                            if(error4) {
                                                console.log(error4);
                                                callback.status(400).send({message : 'Error encountered during process'});
                                            }
                                            else {
                                                connection.query(fifthQuery, (error5, result5) => {
                                                    if(error5) {
                                                        console.log(error5);
                                                        callback.status(400).send({message: 'Error processing.'});
                                                    }
                                                    else{
                                                        callback.status(200).send({message : 'Successfully deactivated Training Provider'});
                                                    }
                                            })
                                        
                                    }
                                })
                                        
                            
                            }
                        })
                        
                    }
                })
            }
        });
    })
        });
    });
}

module.exports = handler;