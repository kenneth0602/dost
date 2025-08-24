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

    const paymentOptID = event.params.paymentOptID;
    const payee = event.body.payee;
    const accountNo = event.body.accountNo;
    const ddPaymentOpt = event.body.ddPaymentOpt;
    const bankName = event.body.bankName;
    const TIN = event.body.TIN;

    const query = `call payment_updatePaymentOptByID('${paymentOptID}','${payee}', '${accountNo}', '${ddPaymentOpt}', '${bankName}', '${TIN}');`;


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
                return callback.status(200).send({message : 'Successfully updated payment option.'});
            }
        });
    });
}

module.exports = handler;