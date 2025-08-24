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
    const profileID = event.body.profileID;
    const degree = event.body.degree;
    const program = event.body.program;
    const SYstart = event.body.SYstart;
    const SYend = event.body.SYend;

    const query = `call SMEBE_createSMEBE('${profileID}', '${degree}', '${program}', '${SYstart}', '${SYend}');`;


    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }

        connection.query(`select empID from admin where username ='${username}'`,(err,result)=>{
            if(err) return err;
            console.log('id:',result[0].empID);
            connection.query(`insert into audit_logs(username, target, action) values('${username}','SME Educational Background','Modify');`,(err1,result1)=>{
                if(err1) return console.log(err1);
                console.log(result1);

                connection.query(query, (error,results,fields) => {
                    console.log('asdfghj');
                    connection.release();
                    if(error) {
                        console.log(error);
                        callback.status(400).send({message : 'Something went wrong.'});
                    }
                    else if(results == '') {
                        callback.status(204).send({})
                    }
                    else {
                        callback.status(200).send({message : 'Successfully updated new SME Education Background.'});
                    }
                });
            })
        });

    });
}
module.exports = handler;