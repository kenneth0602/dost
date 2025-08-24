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

    const query = `call admin_login('${username}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log('1');
            console.log(err);
            callback.status(400).send({message: 'Connection error occured.'});
            return
        }

        connection.query(query, (error,results,fields) => {
            connection.release()
            if(error) {
                console.log('2');
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.'});
                return
            }
            else if(results == '') {
                console.log('3');
                callback.status(200).send({message : 'Result is empty or undefined.'});
                return
            }
            else if(results[0].length < 1) {
                console.log('5');
                callback.status(200).send({message : 'No records found.'});
                return
            }
            else {
                console.log(results);
                let hashedPassword = results[0][0].password;
                bcrypt.compare(password, hashedPassword, (err, result) => {
                    console.log(password);
                    console.log(hashedPassword);
                    if(err) return callback.send('Hello');
                    if(result == true){

                        let token = generateAccessToken
                        ({username: username});

                        return callback.json({
                            message: 'Successfully logged in.',
                            token: token
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