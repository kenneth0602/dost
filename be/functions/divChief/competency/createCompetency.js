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

    const divID = event.params.divID;
    const competencyName = event.body.competencyName;
    const KPItoSupport = event.body.KPItoSupport;
    const levelOfPriority = event.body.levelOfPriority;
    const targetDate = event.body.targetDate;
    const remarks = event.body.remarks;

    const query = `call divChief_createCompetencyByDivision('${divID}','${competencyName}', '${KPItoSupport}', '${levelOfPriority}', '${targetDate}', '${remarks}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
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
                callback.status(200).send({message : 'Successfully created new Competency'});
            }
        });
    });
}

module.exports = handler;