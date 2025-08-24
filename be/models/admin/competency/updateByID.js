const competencySchema =
{
    title: "Competency Schema",
    type: "object",
    properties: {
        LDintervention: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: `[^<>"']+$`
        },
        supportNeeded: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: `[^<>"']+$`
        },
        budget: {
            type: "string",
            minLength: 1,
            maxLength: 15,
            pattern: "^[0-9]+$"
        },
        sourceOfFunds: {
            type: "string",
            minLength: 7,
            maxLength: 15,
            pattern: `[^<>"']+$`
        },
        targetDate: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: `[^<>"']+$`
        },
        priority: {
            type: "string",
            minLength: 4,
            maxLength: 100,
            pattern: `[^<>"']+$`
        }
    }
};

module.exports = competencySchema;