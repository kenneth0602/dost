const competencySchema =
{
    title: "Competency Schema",
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
        }

    }
};

module.exports = competencySchema;