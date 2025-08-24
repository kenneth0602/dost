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
    const sreqID = event.params.sreqID;

    const query = `call usr_scholarship_getByID(${sreqID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            callback.send(null, {message: 'Something went wrong.'});
        }

        connection.query(`select empID from users where username ='${username}'`,(err,result)=>{
            if(err) return err;
            console.log('id:',result[0].empID);
            connection.query(`insert into audit_logs(username, target, action) values('${username}','User scholarship request','View');`,(err1,result1)=>{
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