const providerProgramSchema =
{
    title: "Provider Program Schema",
    type: "object",
    required:["programName", "description"],
    properties: {
        programName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        }
    }
};

module.exports = providerProgramSchema;