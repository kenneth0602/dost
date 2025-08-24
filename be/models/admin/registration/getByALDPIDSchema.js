const getAllByAldpIDSchema =
    {
        title: "getAllByAldpIDSchema",
        type: "object",
        required:["aldpID", "pageNo", "pageSize"],
        properties: {
    
            aldpID: {
                type: "string",
                pattern: "^[0-9]+$"
            },
            pageNo: {
                type: "string",
                pattern: "^[0-9]+$"
            },
            pageSize: {
                type: "string",
                pattern: "^[0-9]+$"
            },
            keyword: {
                type: "string",
                pattern: "^[a-zA-Z0-9 ]*$",
                minLength: 0
            }
        }
    };
    
    module.exports = getAllByAldpIDSchema;