const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host : env.hostname,
    user : env.user,
    password : env.password,
    database : env.db
});

const handler = (event, res) => {

    let username = event.user.username;
    const provID = event.params.provID;


    const query = `call tprov_getTrainingProviderByID(${provID});`;

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).send(err, {message: 'Something went wrong.'});
        }

        connection.query(`select empID from admin where username ='${username}'`,(err,result)=>{
            if(err) return err;
            console.log('id:',result[0].empID);
            connection.query(`insert into audit_logs(username, target, action) values('${username}','All Training Providers','View');`,(err1,result1)=>{
                if(err1) return console.log(err1);
                console.log(result1);
                connection.query(query, (error, results, fields) => {
                    connection.release();
                    console.log(results);
                    if(error) {
                        console.log(error);
                        res.status(400).send({message : 'Something went wrong.'});
                    }
                    else if(results == '') {
                        res.status(204).send({})
                    }
                    else {
                        res.status(200).send(results);
                    }
        });
    })
});

});
}

module.exports = handler;