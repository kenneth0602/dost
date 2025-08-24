const env = require('../../../config/db.config');
const sql = require('mysql');

//for hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 12;

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event,callback) => {
    
    const empID = event.body.empID;
    const username = event.body.username;
    const password = event.body.password;

            bcrypt.hash(password,saltRounds,(err, hashedPassword)=> {
            if(err) return callback.send(err);

            const query = `call admin_register('${empID}','${username}', '${hashedPassword}');`; 
            pool.getConnection((err,connection) => {
                if(err) {
                    console.log(err);
                    callback.send(null,{message: 'Connection error occured.'});
                }
                connection.query(query, (error,results) => {
                    connection.release();
                    if(error) {
                        console.log(error);
                        callback.status(400).send({message : 'Something went wrong.'});
                    }
                    else if(results == '') {
                        callback.status(200).send({message : 'Record is empty or undefined.'});
                    }
                    else if(results.affectedRows == 0) {
                        callback.status(200).send({message: 'User already exist.'})
                    }
                    else {
                        console.log(results)
                        callback.status(200).send({message: 'Successfully registered.'})
                    }
                });
            });
        })
    
   

}

module.exports = handler;