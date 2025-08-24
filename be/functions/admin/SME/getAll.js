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
    const pageNo = event.query.pageNo;
    const pageSize = event.query.pageSize;
    const keyword = event.query.keyword;

    const query = `call SME_getAllSME(${pageNo},${pageSize}, '${keyword}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }

        connection.query(`select empID from admin where username ='${username}'`,(err,result)=>{
            if(err) return err;
            console.log('id:',result[0].empID);
            connection.query(`insert into audit_logs(username, target, action) values('${username}','Subject Matter Expert','View');`,(err1,result1)=>{
                if(err1) return console.log(err1);
                console.log(result1);

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
    })
});

});
}

module.exports = handler;