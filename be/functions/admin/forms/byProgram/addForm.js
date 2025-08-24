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
    const apID = event.body.apID;
    const typeValue = event.body.typeValue
    const contents = event.body.contents
    let formID

    const formQuery = `call admin_forms_addForm(${apID}, '${typeValue}');`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            return callback.send(null,{message: 'Connection error.'});
        }

        connection.query(formQuery, (err, result) => {
            if (err) {
              console.error('Error inserting into FORM table:', err);
              callback.status(200).send({ "results": "FAILED", "message": "Error has been occured"})
              return;
            }
            console.log('Inserted into FORM table:', result);
            console.log('kyahhhhhhhhhhhhhhhhhhhhhhh', result[0][0].assigned_id)
            const formID  = result[0][0].assigned_id
         
            contents.forEach(content => {
            //   const contentQuery = 'INSERT INTO content (formID, type, label, required, correct_answer) VALUES (?, ?, ?, ?, ?)';
              const contentQuery = `call admin_forms_addContentByFormID(${formID}, '${content.type}',"${content.label}", '${content.required}', "${content.correct_answer}", '${content.points}')`;
            //   const contentValues = [formID, content.type, content.label, content.required, content.correct_answer];
        
              connection.query(contentQuery, (err, result) => {
                if (err) {
                  console.error('Error inserting into CONTENT table:', err);
                  callback.status(200).send({ "results": "FAILED", "message": "Error has been occured"})
                  return;
                }
                console.log('Inserted into CONTENT table:', result[0][0].content_id);
                const contentID = result[0][0].content_id
        
                if (content.options && content.options.length > 0) {
                  content.options.forEach(option => {
                    // const optionQuery = 'INSERT INTO options (contentID, option) VALUES (?, ?)';
                    const optionQuery = `call admin_form_addOptionByContentID(${contentID}, '${option}')`
                    // const optionValues = [result.insertId, option];
        
                    connection.query(optionQuery, (err, result) => {
                      if (err) {
                        console.error('Error inserting into OPTIONS table:', err);
                        callback.status(200).send({ "results": "FAILED", "message": "Error has been occured"})
                        return;
                      }
                      console.log('Inserted into OPTIONS table:', result,  result.insertId);
                    });
                  });
                }
              });
            });
            callback.status(200).send({ "results": "SUCCESS", "message": "Successfully Created"})
          });
    });
}

module.exports = handler;

  