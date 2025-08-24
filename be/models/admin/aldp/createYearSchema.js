const createYearSchema =
{
    title: "createYearSchema",
    type: "object",
    required:["aldp_year"],
    properties: {
        aldp_year: {
            type: "string",
            minLength: 1,
            maxLength: 4,
            pattern: "^[0-9]+$"
        },
    }
};

module.exports = createYearSchema;