const getRegisterDataSchema =
{
    title: "Get Register Data Schema",
    type: "object",
    required:["apID", "empID"],
    properties: {
        apID: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        empID: {
            type: "string",
            pattern: `[^<>"']+$`
        }
        
    }
};

module.exports = getRegisterDataSchema;
