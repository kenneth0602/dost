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
    const provID = event.body.provID;
    // const pprogID = event.body.pprogID;
    const cost = event.body.cost;

    const query = `call tprov_createProgramWithProvider('${provID}',  '${cost}')`;
 
    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err)
            callback.send(null,{message: 'Something went wrong.'});
        }

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
                callback.status(200).send({message : 'Successfully created new Provider Program'});
    }
});
});
}
module.exports = handler;