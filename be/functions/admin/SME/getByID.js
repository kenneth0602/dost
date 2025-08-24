const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});

const handler = (event, callback) => {

    let username = event.user.username;
    const profileID = event.params.profileID;


    const query = `call SME_getSMEbyID(${profileID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return callback.status(500).send({message: 'Something went wrong.'});
        }

        connection.query(`select empID from admin where username ='${username}'`,(err,result)=>{
            if(err) return err;
            console.log('id:',result[0].empID);
            connection.query(`insert into audit_logs(username, target, action) values('${username}','Subject Matter Expert','View');`,(err1,result1)=>{
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