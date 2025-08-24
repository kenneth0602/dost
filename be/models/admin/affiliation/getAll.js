const affiliationSchema =
{
    title: "Affiliation Schema",
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

module.exports = affiliationSchema;