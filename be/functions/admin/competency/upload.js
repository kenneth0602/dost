const env = require('../../../config/db.config');
const sql = require('mysql');
const multer = require('multer');
const csvtojson = require('csvtojson');
const fs= require('fs');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event,callback) => {
    console.log(event.file.originalname);

    const empID = event.body.empID;
    const developmentGoals = event.body.developmentGoals;
    const specificLDNeeds = event.body.specificLDNeeds;
    const existingLevel = event.body.existingLevel;
    
    const filename = event.file.originalname;
    const filePath = 'uploads/'+filename;
    console.log(filePath);
    var ctr = 0;
 
    //const try = require('../../uploads/')
    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            return callback.send(null,{message: 'Connection Error occured.'});
        }
        fs.exists(filePath,()=>{
            csvtojson()
            .fromFile(filePath)
            .then((json) => {
                fs.unlink(filePath,()=>{
                    console.log('Deleted Successfully')
                })
                console.log(json)
                json.forEach(element => {
                    //console.log(element)
                    const provID = element.provID;
                    const lastname = element.LastName;
                    const firstname = element.FirstName;
                    const middlename = element.MiddleName;
                    const mobileNo = element.Mobile;
                    const telNo = element.Telephone;
                    const companyName = element.CompanyName;
                    const companyAddress = element.CompanyAddress;
                    const companyNo = element.CompanyNo;
                    const emailAdd = element.EmailAdd;
                    const fbMessenger = element.Messenger;
                    const viberAccount = element.Viber;
                    const website = element.Website;
                    const areaOfExpertise = element.Expertise;
                    const resource = element.Resource;
                    const honorariaRate = element.HonorariaRate;
                    const TIN = element.TIN;
                    const query = `call SME_createSME(${provID}, '${lastname}', '${firstname}', '${middlename}', '${mobileNo}', '${telNo}', '${companyName}', '${companyAddress}', '${companyNo}', '${emailAdd}', '${fbMessenger}', '${viberAccount}', '${website}', '${areaOfExpertise}', '${resource}', '${honorariaRate}', '${TIN}');`;

                    connection.query(query, (error,results,fields) => {
                        if(error) {
                            connection.release();
                            console.log(error);
                            return callback.status(400).send({message : 'Something went wrong.'});
                        }
                        else if(results == '') {
                            if(ctr== json.length-1){
                            connection.release();
                            return callback.status(204).send({})
                            }
                            ctr++;
                        }
                        else {
                            if(ctr== json.length -1){
                            connection.release();
                            return callback.status(200).send({message : 'Successfully Uploaded'});
                        }
                        ctr++;
                    }
                    });
        });
    })
})
   


   

    

        
    });
}

module.exports = handler;