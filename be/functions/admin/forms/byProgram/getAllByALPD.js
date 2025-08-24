const env = require('../../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event,callback) => {
    const apID = event.query.apID;

    const query = `call admin_forms_getAllFormsByALDPID(${apID});`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection error.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.', results: "FAILED"});
            }
            else if(results == '') {
                callback.status(204).send({})
            }
            else {
                console.log("ditoooooooooooooooooooooo: ", results)
                const pretest_response_count = results[1][0].total_pretest_count || 0 
                const posttest_response_count = results[2][0].total_posttest_count || 0 
                const feedback_response_count = results[3][0].total_feedback_count || 0
                callback.status(200).send({
                    "message": 'Successfully retrieved data', 
                    "results": results[0], 
                    pretest_response_count, 
                    posttest_response_count, 
                    feedback_response_count
                });
            }
        });
    });
}

module.exports = handler;