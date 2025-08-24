const env = require('../../../config/db.config');
const sql = require('mysql');
const { fields } = require('../../../config/multer.config');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event,callback) => {
    console.log(event.query)
    const pageNo = event.query.pageNo;
    const pageSize = event.query.pageSize;
    const keyword = event.query.keyword;
    // const reqStatus = event.query.reqStatus;

    const query = `call usr_compReq_getAllRequestByUser(${pageNo},${pageSize}, '${keyword}');`;
    // const queryPending = `call usr_compReq_getAllPendingRequest(${empID},${pageNo},${pageSize}, '${keyword}');`;
    // const queryApproved = `call usr_compReq_getAllApprovedRequest(${empID},${pageNo},${pageSize}, '${keyword}');`;
    // const queryRejected = `call usr_compReq_getAllRejectedRequest(${empID},${pageNo},${pageSize}, '${keyword}');`;
// console.log(query)
    pool.getConnection((err,connection) => {
        if(err) {

            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }
        connection.query(query, (error, results, fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong'});
            } 
            else {
                callback.status(200).send({message: 'Successfully retrieved all requested competencies.', results});
            }
        });
    })
}

module.exports = handler;