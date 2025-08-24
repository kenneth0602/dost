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
    try {
        const formID = event.query.formID;

    const query = `call divchief_forms_getFormByFormID(${formID});`;

    pool.getConnection((err,connection) => {
        if(err) {
            console.log(err);
            callback.send(null,{message: 'Connection error.'});
        }

        connection.query(query, (error,results,fields) => {
            connection.release();
            if(error) {
                console.log(error);
                callback.status(400).send({message : 'Something went wrong.', results: "FAILED"});
            }
            else if(results == '') {
                callback.status(204).send({})
            }
            else {
                console.log("resulttttsssss", results[0][0])
                let response = results[0][0]
                if (response && typeof response === "object") {
                    for (let key in response) {
                        if (key === "contents" && response[key] !== null) {
                            response[key] = JSON.parse(response[key]);
                            console.log(key, response[key])
                            response[key].forEach(contentItem => {
                                if (contentItem.type === 'checkbox') {
                                    console.log('Checkbox item:', contentItem);
                                    if (contentItem.correct_answer) {
                                        contentItem.correct_answer = parseCorrectAnswer(contentItem.correct_answer, contentItem.options);
                                    }
                                }
                            })
                        }
                    }
                }
                callback.status(200).json({message: 'Successfully retrieved data', "results": response});
            }
        });
    });
    }
    catch (error) {
        console.log(error);
        callback.status(400).send({message : 'Something went wrong.'});
    }
}

function convertCorrectAnswerToArray(questions) {
    return questions.map(question => {
        return {
            ...question,
            correct_answer: parseCorrectAnswer(question.correct_answer, question.options)
        };
    });
}

function parseCorrectAnswer(answer, options) {
    const regex = new RegExp(options.map(opt => opt.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")).join('|'), 'g');
    return answer.match(regex) || [];
}


module.exports = handler;