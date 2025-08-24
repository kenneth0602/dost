const sql = require('mysql')
const env = require('../../../config/db.config')
const sendNotification = require('../../../functions/other-modules/notification/send').notify;

const pool = sql.createPool({
    host: env.hostname,
    user: env.user,
    password: env.password,
    database: env.db
});

const json_s = {"result":"SUCCESS","message":"User has been Notified!"};
const json_f = {"result":"FAILED","message":"An error occur, please retry"};
const json_invalid = {"result":"INVALID","message":"Invalid Action"};

const handler = (event, callback) => {
  console.log('Notify User Handler')

  const { employeeName, empID } = event.body;
  const { username } = event.user
  try {
    const notifData = {
        "notify_role": "User", 
        "message": `${username} has notified you that you have been assigned a scholarship`,
        "module": 'Scholarship',
        "division": '',
        "section": '',
        "empID": empID,
    }
    sendNotification(notifData);
    return callback.status(200).send(json_s);

    } catch (error) {
        console.log("Error:", error)
        return callback.status(200).send(json_f);
    }

};
module.exports = handler

