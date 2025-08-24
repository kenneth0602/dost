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

    const username = event.user.username;
    const providerName = event.body.providerName;
    const pointofContact = event.body.pointofContact;
    const address = event.body.address;
    const website = event.body.website;
    const telNo = event.body.telNo;
    const mobileNo = event.body.mobileNo;
    const emailAdd = event.body.emailAdd;
    const filename = event.file.originalname;
    const filePath = 'uploads/'+filename;
    console.log(filePath);
    var ctr = 0;
 
    //const try = require('../../uploads/')
    
    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Something went wrong.'});
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
                    const providerName = element.Provider;
                    const pointofContact = element.Contact;
                    const address = element.Address;
                    const website = element.Website;
                    const telNo = element.Telephone;
                    const mobileNo = element.Mobile;
                    const emailAdd = element.Emai;
                    const query = `call tprov_createTrainingProvider('${providerName}', '${pointofContact}', '${address}', '${website}', '${telNo}', '${mobileNo}', '${emailAdd}');`;

                    connection.query(`SELECT empID FROM admin WHERE username ='${username}'`, (err, result) => {
                        if(err) return err;
                        console.log('id:', result[0].empID);
                        connection.query(`INSERT INTO audit_logs(username, target, action) VALUES('${username}', 'Training Provider', 'Upload');`, (err1, result1) => {
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