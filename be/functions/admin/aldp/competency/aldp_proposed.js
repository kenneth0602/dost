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
  
    const competency = event.body.competency;
    const description = event.body.description;
    const type = event.body.type;
    const classification = event.body.classification;
    const noOfProgram = event.body.noOfProgram;
    const perSession = event.body.perSession;
    const totalPax = event.body.totalPax;
    const estimatedCost = event.body.estimatedCost;
    const divisions = event.body.divisions;
    // const tentative_schedules = event.body.tentative_schedules;
    const proposed_year = event.body.proposed_year;

    const query = `call admin_aldp_proposed_create('${competency}', '${description}', '${type}', '${classification}', '${noOfProgram}', '${perSession}', '${totalPax}', '${estimatedCost}', '${divisions}', '${proposed_year}' );`;

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
                return callback.status(200).send({message: 'Successfully created proposed aldp.', results});
            }
        });
    });
}

module.exports = handler;