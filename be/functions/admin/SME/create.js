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

    let username = event.user.username;
    console.log(event.body);
    const provID = event.body.provID;
    const lastname = event.body.lastname;
    const firstname = event.body.firstname;
    const middlename = event.body.middlename;
    const telNo = event.body.telNo;
    const mobileNo = event.body.mobileNo;
    const companyName = event.body.companyName;
    const companyAddress = event.body.companyAddress;
    const companyNo = event.body.companyNo;
    const emailAdd = event.body.emailAdd;
    const fbMessenger = event.body.fbMessenger;
    const viberAccount = event.body.viberAccount;
    const website = event.body.website;
    const areaOfExpertise = event.body.areaOfExpertise;
    const affiliation = event.body.affiliation;
    const resource = event.body.source;
    const honorariaRate = event.body.honorariaRate;
    const TIN = event.body.TIN;

    var useAreaOfExp = [areaOfExpertise];
    var useAreaOfExpDetails = useAreaOfExp.toString();

    var useAffiliation = [affiliation];
    var useAffiliationDetails = useAffiliation.toString();

    var useTelNo = [telNo];
    var useTelDetails = useTelNo.toString();
    console.log(useTelDetails);

    var useMobileNo = [mobileNo];
    var useMobDetails = useMobileNo.toString();
    console.log(useMobDetails);

    const query = `call SME_createSME('${provID}','${lastname}', '${firstname}', '${middlename}', '${telNo}', '${mobileNo}', '${companyName}', '${companyAddress}', '${companyNo}', '${emailAdd}', '${fbMessenger}', '${viberAccount}', '${website}', '${areaOfExpertise}','${affiliation}', '${resource}', ${honorariaRate}, '${TIN}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
        }

        connection.query(`select empID from admin where username ='${username}'`,(err,result)=>{
            if(err) return err;
            console.log('id:',result[0].empID);
            connection.query(`insert into audit_logs(username, target, action) values('${username}','Subject Matter Expert','Create');`,(err1,result1)=>{
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
                callback.status(200).send({message : 'Successfully created new Training Provider'});
            }
        });
    })
});

});
}

module.exports = handler;