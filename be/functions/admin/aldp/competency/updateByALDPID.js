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
    const apcID = event.body.apcID
    // const type = event.body.type;
    // const classification = event.body.classification;
    // const noOfProgram = event.body.noOfProgram;
    // const perSession = event.body.perSession;
    // const totalPax = event.body.totalPax;
    // const estimatedCost = event.body.estimatedCost;
    // const division = event.body.division;
    const provID = event.body.provID;
    const pprogID = event.body.pprogID;
    const tentative_schedules = event.body.tentative_schedule;
    console.log(tentative_schedules)

    const new_tentative_schedules = tentative_schedules.map(dateStr => {
        const date = new Date(dateStr);
        date.setUTCDate(date.getUTCDate() + 1);
        return date.toISOString().split('T')[0];
      });

    console.log(new_tentative_schedules, "asasasaasaasasasa")

    const query = `call admin_aldp_program_updateProgramDetails(${apcID}, ${apID},${pprogID},  ${provID}, '${new_tentative_schedules}');`;
    // const query = `call admin_aldp_program_updateProgramDetails(${apID},${pprogID},  ${provID}, '${type}', '${classification}', '${noOfProgram}', '${perSession}', '${totalPax}', '${estimatedCost}', '${division}', '${tentative_schedules}');`;
    console.log(query);

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
                return callback.status(200).send({message : 'Successfully updated program details.', results});
            }
        });
    });
}

module.exports = handler;