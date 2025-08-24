const competencySchema =
{
    title: "Competency Schema",
    type: "object",
    required:["specificLDNeeds"],
    properties: {
        specificLDNeeds: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        }
    }
};

module.exports = competencySchema;