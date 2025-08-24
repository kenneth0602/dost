const SMEeducSchema =
{
    title: "SME Education Background Schema",
    type: "object",
    required:["degree", "program"],
    properties: {
        degree: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            pattern: "^[a-zA-Z ]+$"
        },
        program: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[a-zA-Z ]+$"
        }
    }
};

module.exports = SMEeducSchema;