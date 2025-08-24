const updateSchema =
    {
        title: "updateSchema",
        type: "object",
        required:["aldpID", "empID", "consent"],
        properties: {
            aldpID: {
                type: "string",
                minLength: 5,
                maxLength: 16,
                pattern: "^[0-9]+$"
            },
            empID: {
                type: "string",
                minLength: 1,
                maxLength: 10,
                pattern: "^[0-9]+$"
            },
            consent: {
                type: "string",
                minLength: 3,
                maxLength: 100,
                pattern: "^[#.0-9a-zA-Z ,-]+$"
            }
        }
    };
    
    module.exports = updateSchema;