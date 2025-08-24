const env = require('../../../config/db.config');
const sql = require('mysql');
const passport = require('../../../config/authToken');
//for signing tokens
const jwt = require('jsonwebtoken');

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
    
    const username = event.body.username;
    const password = event.body.password;

    const query = `call supervisor_login('${username}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.status(400).send(null,{message: 'Connection error occured.'});
        }

        connection.query(query, (error,results,fields) => {
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                callback.status(200).send({message : 'Invalid Credentials'});
            }
            else if(results[0].length < 1) {
                callback.status(200).send({message : 'Invalid Credentials'});
            }
            else {
                console.log('id:', results[0]);
                let hashedPassword = results[0][0].password;
                let id = results[0][0].empID;
                bcrypt.compare(password, hashedPassword, (err, result) => {
                    console.log(password);
                    console.log(hashedPassword);
                    // console.log(i);
                  //  console.log(empID);
                    if(err) return callback.send('Hello');
                    if(result == true){

                        let token = generateAccessToken
                        ({username: username, id: id});

                        return callback.json({
                            message: 'Successfully logged in.',
                            token: token,
                            empID : id
                        });
                    }
                    callback.send('Invalid Credentials');
                })
            }
        });
    });
}

const generateAccessToken = (username) => {
    return jwt.sign(username, 'mysecret', {expiresIn:10800});
}
module.exports = handler;