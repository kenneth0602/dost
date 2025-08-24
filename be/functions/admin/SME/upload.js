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
    console.log(event.headers);
    console.log(event.file.originalname);

    let username = event.user.username;
    const provID = '1';
    const lastname = event.body.lastname;
    const firstname = event.body.firstname;
    const middlename = event.body.middlename;
    const mobileNo = event.body.mobileNo;
    const telNo = event.body.telNo;
    const companyName = event.body.companyName;
    const companyAddress = event.body.companyAddress;
    const companyNo = event.body.companyNo;
    const emailAdd = event.body.emailAdd;
    const fbMessenger = event.body.fbMessenger;
    const viberAccount = event.body.viberAccount;
    const website = event.body.website;
    const areaOfExpertise = event.body.areaOfExpertise;
    const affiliation = event.body.affiliation;
    const resource = event.body.resource;
    const honorariaRate = event.body.honorariaRate;
    const TIN = event.body.TIN;
    const filename = event.file.originalname;
    const filePath = 'uploads/'+filename;
    console.log(filePath); 
    var ctr = 0;
 
    //const try = require('../../uploads/')
    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection Error occured.'});
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
                    // const provID = element;
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
                    const affiliation = element.Affiliation;
                    const resource = element.Resource;
                    const honorariaRate = element.HonorariaRate;
                    const TIN = element.TIN;
                    const query = `call SME_createSME(${provID}, '${lastname}', '${firstname}', '${middlename}', '${mobileNo}', '${telNo}', '${companyName}', '${companyAddress}', '${companyNo}', '${emailAdd}', '${fbMessenger}', '${viberAccount}', '${website}', '${areaOfExpertise}', '${affiliation}', '${resource}', '${honorariaRate}', '${TIN}');`;

                    connection.query(`select empID from admin where username ='${username}'`,(err,result)=>{
                        if(err) return err;
                        console.log('id:',result[0].empID);
                        connection.query(`insert into audit_logs(username, target, action) values('${username}','Subject Matter Expert','Upload');`,(err1,result1)=>{
                            if(err1) return console.log(err1);
                            console.log(result1);
            
            
                    connection.query(query, (error,results,fields) => {
                        if(error) {
                            connection.release();
                            console.log(error);
                            callback.status(400).send({message : 'Something went wrong.'});
                        }
                        else if(results == '') {
                            if(ctr== json.length-1){
                            connection.release();
                            callback.status(204).send({})
                            }
                            ctr++;
                        }
                        else {
                            if(ctr== json.length -1){
                            connection.release();
                            callback.status(200).send({message : 'Successfully Uploaded'});
                        }
                        ctr++;
                    }
                });
            });
        })
    })
       
    
    
       
    
    })
                });
            
        });
    }

module.exports = handler;