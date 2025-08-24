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
    const pageNo = event.query.pageNo;
    const pageSize = event.query.pageSize;
    const keyword = event.query.keyword;
    const ffrom = event.query.startDate;
    const fto = event.query.endDate;

    const query = `call competency_getAllCompetency(${pageNo},${pageSize}, '${keyword}');`;
    const query2 = `call competency_getAllCompetencyWfilter(${pageNo},${pageSize}, '${keyword}', '${ffrom}', '${fto}')`;

    pool.getConnection((err,connection) => {
        if(err) {

            console.log(err);
            return callback.send(null,{message: 'Something went wrong.'});
        }
        else if (ffrom && tto) {
            connection.query(query2, (error, results, fields) => {
                connection.release();
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                return callback.status(204).send({})
            }
            else {
                return callback.status(200).send({message: 'Successfully retrieved data', results});
            }
            })
        }
        else {
            connection.query(query, (error, results, fields) => {
                connection.release();
            if(error) {
                console.log(error);
                return callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                return callback.status(204).send({})
            }
            else {
                return callback.status(200).send({message: 'Successfully retrieved data', results});
            }
            })
        }

        });
}

module.exports = handler;