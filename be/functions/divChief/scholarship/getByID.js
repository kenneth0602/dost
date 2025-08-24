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
    console.log(event.query)

    let username = event.user.username;
    const sreqID = event.params.sreqID;

    const query = `call divChief_scholarship_getByID(${sreqID});`;

    pool.getConnection((err,connection) => {
        if(err) {

            console.log(err);
            callback.send(null,{message: 'Connection error occured.'});
        }
        connection.query(`SELECT empID FROM users WHERE username ='${username}'`, (err, result) => {
            if(err) return err;
            console.log('id:', result[0].empID);
            connection.query(`INSERT INTO audit_logs(username, target, action) VALUES('${username}', 'Request for Scholarship', 'View');`, (err1, result1) => {
                if(err1) {
                    console.log(err1);
                    callback.status(400).send({message: 'Issue Encoutered'});
                }
                else {
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
                        callback.status(200).send({message: 'Successfully retrieved data', results});
                    }
                });
            }
            })
        });
    });
}

module.exports = handler;