const env = require('../../../config/db.config');
const sql = require('mysql');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});

const handler = (event, callback) => {
    const data = event.body.data;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return callback.send(null, { message: 'Connection error.' });
        }

        const promises = data.map((entry) => {
            return new Promise((resolve, reject) => {
                const query = `CALL user_forms_submitUserAnswer(?, ?, ?, ?, ?)`;
                
                const optionid = Array.isArray(entry.optionid) ? entry.optionid.join(",") : (entry.optionid || '');
                const option_value = Array.isArray(entry.option_value) ? entry.option_value.join(",") : (entry.option_value || '');
                console.log(optionid, "OptionID")
                console.log(option_value, "Option Value")

                connection.query(query, [entry.userid, entry.formid, entry.contentid, optionid, option_value], (error, results) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        });

        // Execute all the queries and handle the results
        Promise.all(promises)
            .then((results) => {
                connection.release();
                console.log("Results", results)
                if (results[0].affectedRows == 0){
                    return callback.status(200).send({ results: "ALREADY EXIST", message: "Failed to submit: the user's answer is already present."  });
                }
                else{
                    return callback.status(200).send({ results: "SUCCESS", message: 'Successfully Submitted the Answer' });
                }
                
            })
            .catch((error) => {
                connection.release();
                return callback.status(400).send({ message: 'Something went wrong.' });
            });
    });
};

module.exports = handler;
