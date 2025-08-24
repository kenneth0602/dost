const sql = require('mysql');
const env = require('../../../config/db.config');
const employee = require('../employee/getEmployeeDetails');
const sendNotification = require('../notification/send').notify;

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_s = { result: "SUCCESS", message: "Successfully Assigned!" };
const json_f = { result: "FAILED", message: "An error occurred, please retry." };

const queryPromise = (connection, query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const handler = async (event, callback) => {
    console.log('Assign Employee to Scholarship Handler');

    const { scholarship_id, employee_ids } = event.body;

    pool.getConnection(async (err, connection) => {
        if (err) {
            console.error('[DB Connection Error]', err);
            return callback.status(200).send({ message: 'Connection error.' });
        }

        try {
            for (const id of employee_ids) {
                const query = `CALL scholarship_assignEmployee(${scholarship_id}, ${id});`;
                await queryPromise(connection, query);

                const employeeDetails = await employee.getEmployeeDetails(id);
                console.log('Employee Details:', employeeDetails);
                const employeeData = {
                    "notify_role": "DivChief", 
                    "message": `${employeeDetails.data.firstname} ${employeeDetails.data.lastname} has been assigned to a scholarship.`,
                    "module": 'Scholarship',
                    "division": employeeDetails.data.divID,
                    "section": employeeDetails.data.sectionID,

                }
                sendNotification(employeeData);
                console.log(`Assigned ID: ${id}`, employeeDetails);
            }

            connection.release();
            return callback.status(200).send(json_s);

        } catch (error) {
            console.error('[Error in Assign Handler]', error);
            connection.release();
            return callback.status(200).send(json_f);
        }
    });
};

module.exports = handler;
