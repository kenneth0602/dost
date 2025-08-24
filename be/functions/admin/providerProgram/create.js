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
    const programName = event.body.programName;
    const description = event.body.description;

    const query = `call pprog_createProviderProgram('${programName}', '${description}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err)
            return callback.send(null,{message: 'Something went wrong.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                return callback.status(204).send({})
            }
            else {
                
                  return callback.status(200).send(results);
            }
        });
    })
}
module.exports = handler;