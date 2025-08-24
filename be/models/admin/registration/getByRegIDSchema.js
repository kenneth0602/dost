const getByRegIDSchema =
{
    title: "getByRegIDSchema",
    type: "object",
    required:["formRegID"],
    properties: {
        formRegID: {
            type: "string",
            minLength: 5,
            maxLength: 16,
            pattern: "^[0-9]+$"
        }
    }
};

module.exports = getByRegIDSchema;