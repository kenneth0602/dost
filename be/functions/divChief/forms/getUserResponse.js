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
    const apid = event.query.apID;
    const formtype = event.query.formType;

    const query = `call divchief_form_getUserResponse('${formtype}',${apid});`;
    // const query = `call Forms_admin_getAllPogram();`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            return callback.send(null,{message: 'Connection error.'});
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
                console.log("testttttttttttttttttt: ", results[1])
                return callback.status(200).send({message: 'Successfully retrieved data', "results": results[0]});
            }
        });
    });
}

module.exports = handler;