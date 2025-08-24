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
    
    console.log(event.user);
    let username = event.user.username;
    console.log(username);
    
    const empID = event.params.empID;
    const type = event.body.type;
    const degree = event.body.degree;
    const fieldOfStudy = event.body.fieldOfStudy;
    const preferredSchool = event.body.preferredSchool;
    const academicYear = event.body.academicYear;

    const query = `call usr_scholarship_create('${empID}', '${type}', '${degree}', '${fieldOfStudy}', '${preferredSchool}', '${academicYear}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }
        connection.query(`SELECT empID FROM users WHERE username ='${username}'`, (err, result) => {
            if(err) return err;
            console.log('id:', result[0].empID);
            connection.query(`INSERT INTO audit_logs(username, target, action) VALUES('${username}', 'Request for Scholarship', 'Create');`, (err1, result1) => {
                if(err1) return console.log(err1);
                console.log(result1);
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
                    callback.status(200).send({message : 'Successfully requested Scholarship.'});
                }
        });
    })
    });
});
}

module.exports = handler;