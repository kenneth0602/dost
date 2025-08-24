const getByIDSchema =
{
    title: "getByIDSchema",
    type: "object",
    required:["aldpID"],
    properties: {
        aldpID: {
            type: "string",
            minLength: 1,
            maxLength: 30,
            pattern: "^[0-9]+$"
        },
    }
};

module.exports = getByIDSchema;