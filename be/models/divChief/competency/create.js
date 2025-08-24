const competencySchema =
{
    title: "Competency Schema",
    type: "object",
    required:["competencyName", "KPItoSupport"],
    properties: {
        competencyName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: `[^<>"']+$`
        },
            KPItoSupport: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[a-zA-Z ]+$"
        }
    }
};

module.exports = competencySchema;