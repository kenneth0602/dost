const env = require('../../../config/db.config');
const sql = require('mysql');
const multer = require('multer');

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    port: env.port,
    password: env.password,
    database: env.db
});
const handler = (event,callback) => {
    
    // console.log(event.user);
    // let username = event.user.username;
    // console.log(username);
    
    const empID = event.params.empID;
    const programName = event.body.programName;
    const description = event.body.description;
    const trainingProvider = event.body.trainingProvider;
    let startDate = event.body.startDate;
    let endDate = event.body.endDate;
    const pdf_content = event.file;
    const pdf_filename = pdf_content.originalname;
    console.log(pdf_filename, "pdf_filename");
    console.log(startDate, "startDate");
    console.log(endDate, "endDate");
    startDate = new Date(startDate);
    startDate = startDate.toISOString().split('T')[0];
    endDate = new Date(endDate);
    endDate = endDate.toISOString().split('T')[0];
    console.log(startDate, "startDate");
    console.log(endDate, "endDate")

    const pdfBlob = new Blob([pdf_content], { type: 'application/pdf' });

    const query = `call all_certificate_uploadCertificate('${programName}', '${description}', '${trainingProvider}', '${startDate}', '${endDate}', '${pdf_content}', ${empID}, '${pdf_filename}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection error occured.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.'});
            }
            else if(results == '') {
                callback.status(204).send({message : 'Please fill out required fields'});
            }
            else {
                callback.status(200).send({message : 'Successfully uploaded certificate.'});
            }
        });
    });
}

module.exports = handler;