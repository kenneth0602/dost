const registerFormSchema =
{
    title: "Register Form Schema",
    type: "object",
    required:["apID", "empID", "email", "f_name", "l_name", "sex", "employment_status", "division", "consent"],
    properties: {
        apID: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        empID: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        email: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        f_name: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        m_name: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        l_name: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        sex: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        employment_status: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        division: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        employment_status: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        consent: {
            type: "string",
            pattern: `[^<>"']+$`
        },
        
    }
};

module.exports = registerFormSchema;
