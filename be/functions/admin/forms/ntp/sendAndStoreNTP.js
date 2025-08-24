// const env = require('../../../../config/db.config');
// const sql = require('mysql');

// const pool = sql.createPool({
//     host: env.hostname,
//     user: env.user,
//     port: env.port,
//     password: env.password,
//     database: env.db
// });
// const handler = (event,callback) => {
//     const apcID = event.query.apcID;
//     const data = event.body

//     const query = `call admin_forms_insertNTPRecord(${apcID}, ${empID}, ${divID}, '${dueDate}');`;

//     pool.getConnection((err,connection) => {
//         if(err) {
//             console.log(err);
//             callback.send(null,{message: 'Connection error.'});
//         }

//         connection.query(query, (error,results,fields) => {
//             connection.release();
//             if(error) {
//                 console.log(error);
//                 callback.status(400).send({message : 'Something went wrong.', results: "FAILED"});
//             }
//             else if(results == '') {
//                 callback.status(204).send({})
//             }
//             else {
//                 callback.status(200).send({message: 'Successfully added data', results});
//             }
//         });
//     });
// }

// module.exports = handler;

const env = require('../../../../config/db.config');
const sql = require('mysql');
const sendEmail = require("./sendEmail")

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});

const handler = (event, callback) => {
    const apcID = event.query.apcID;  
    const data = event.body;           
    const dueDate = event.query.dueDate; 
    // const email = "kim@sitesphil.com";  
    console.log(dueDate)

    const queries = data.map(record => {
        const empID = record.empID;
        const divID = record.divID;

        return `CALL admin_forms_insertNTPRecord(${apcID}, ${empID}, ${divID}, '${dueDate}');`;
    });

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback.send(null, { message: 'Connection error.' });
            return;
        }

        const queryPromises = queries.map(query => {
            return new Promise((resolve, reject) => {
                console.log(query)
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(results)
                        console.log("Email: ", results[0][0].emailAddress)
                        let email = results[0][0].emailAddress
                        sendEmail(email);
                        resolve(results);
                    }
                });
            });
        });

        Promise.all(queryPromises)
            .then(results => {
                connection.release();
                callback.status(200).send({ "message": 'Successfully added NTP. Email notifications have been sent to participants.', "results": "SUCCESS" });
            })
            .catch(error => {
                connection.release();
                console.log(error);
                callback.status(400).send({ "message": 'Something went wrong.', "results": 'FAILED' });
                return
            });
    });
}

module.exports = handler;
