const sql = require('mysql')
const env = require('../../../config/db.config')

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_f = {"result":"FAILED","message":"An error occur, please retry"};

exports.notify = (data) => {
    const { notify_role, message, module, division, section } = data;

    if(notify_role == 'DivChief') {
        console.log('Notify Scholarship Module:', message);
        notifyDivChief(data);
    }
    if(notify_role == 'Supervisor') {
        console.log('Notify Supervisor Module:', message);
        notifySupervisor(data);
    }
    if(notify_role == 'User') {
        console.log('Notify User Module:', message);
        notifyUser(data);
    }
    return
};

const notifyDivChief = (data) => {
    const { notify_role, message, module, division, section } = data;

    return new Promise((resolve) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('[DB Connection Error]', err);
                return resolve({ data: {}});
            }

            const query = `CALL scholarships_notifyDivisionChief(${division}, "${message}", "${module}");`;

            connection.query(query, (err, result) => {
                connection.release();

                if (err) {
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
}

const notifySupervisor = (data) => {
    const { notify_role, message, module, division, section } = data;

    return new Promise((resolve) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('[DB Connection Error]', err);
                return resolve({ data: {}});
            }

            const query = `CALL scholarships_notifySupervisor(${section}, "${message}", "${module}");`;
            console.log('Notify Supervisor Query:', query);

            connection.query(query, (err, result) => {
                connection.release();

                if (err) {
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
}

const notifyUser = (data) => {
    const { notify_role, message, module, division, section, empID } = data;

    return new Promise((resolve) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('[DB Connection Error]', err);
                return resolve({ data: {}});
            }

            const query = `CALL scholarships_notifyUser(${empID}, "${message}", "${module}");`;

            connection.query(query, (err, result) => {
                connection.release();

                if (err) {
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
}



