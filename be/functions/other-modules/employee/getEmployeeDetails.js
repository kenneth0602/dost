const sql = require('mysql')
const env = require('../../../config/db.config')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_f = {"result":"FAILED","message":"An error occur, please retry"};

exports.getEmployeeDetails = (id) => {
    const employee_id = id;
    console.log('Get Employee Details Handler for ID:', employee_id);

    return new Promise((resolve) => {
        pool.getConnection((err, connection) => {
            if (err) {
                // Silent error handling
                console.error('[DB Connection Error]', err);
                return resolve({ data: {}});
            }

            const query = `CALL emp_getEmployeeDetails(?);`;

            connection.query(query, [employee_id], (err, result) => {
                connection.release();

                if (err) {
                    // Silent query error
                    console.error('[Query Error]', err);
                    return resolve({ data: {}});
                }
                console.log('Query Result:', result);

                if (result && result.length >= 2) {
                    resolve({
                        data: result[0][0]
                    });
                } else {
                    resolve({ data: {} });
                }
            });
        });
    });
};


