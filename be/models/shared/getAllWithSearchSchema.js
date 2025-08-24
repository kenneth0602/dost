const getAllWithSearchSchema =
{
    title: "getAllWithSearchSchema",
    type: "object",
    required:["pageNo", "pageSize"],
    properties: {

        pageNo: {
            type: "string",
            pattern: "^[0-9]+$"
        },
        pageSize: {
            type: "string",
            pattern: "^[0-9]+$"
        },
        keyword: {
            type: "string",
            pattern: "^[a-zA-Z0-9 ]*$",
            minLength: 0
        }
    }
};

module.exports = getAllWithSearchSchema;