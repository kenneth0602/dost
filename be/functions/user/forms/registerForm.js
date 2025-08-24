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
    const { apcID, empID, email, f_name, m_name, l_name, sex, employment_status, division, photoVideoConsent } = event.body;

    const query = `call user_forms_register(${apcID}, ${empID}, '${email}', '${f_name}', '${m_name}', '${l_name}', '${sex}', '${employment_status}', '${division}', '${photoVideoConsent}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection error.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({"message" : 'Something went wrong.', "results": "FAILED"});
            }
            else if(results == '') {
                callback.status(204).send({})
            }
            else {
                callback.status(200).send({"message": 'Successfully Registered', "results": "SUCCESS"});
            }
        });
    });
}

module.exports = handler;