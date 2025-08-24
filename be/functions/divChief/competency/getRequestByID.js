const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host : env.hostname,
    user : env.user,
    password : env.password,
    database : env.db
});

const handler = (event, callback) => {

    let username = event.user.username;
    const reqID = event.params.reqID;
    const reqRemarks = event.body.reqRemarks;


    const query = `call divChief_getRequestByID(${reqID});`;
    // const rejQuery = `call divChief_updateDivStatusReject(${reqID}, ${reqRemarks});`;
    // const appQuery = `call divChief_updateDivStatusApproved(${reqID}, ${reqRemarks});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            callback.send(null, {message: 'Something went wrong.'});
        }
        connection.query(`SELECT empID FROM users WHERE username ='${username}'`, (err, result) => {
            if(err) return err;
            console.log('id:', result[0].empID);
            connection.query(`INSERT INTO audit_logs(username, target, action) VALUES('${username}', 'Competency Request', 'View');`, (err1, result1) => {
                if(err1) return console.log(err1);
                console.log(result1);
                connection.query(query, (error, results, fields) => {
                    connection.release();
                    console.log(results);
                    if(error) {
                        console.log(error);
                        callback.status(400).send({message : 'Something went wrong.'});
                    }
                    else if(results == '') {
                        callback.status(204).send({})
                    }
                    else {
                        callback.status(200).send(results);
                    }
                });
            })
        });
    });
}

module.exports = handler;