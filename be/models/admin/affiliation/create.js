const affiliationSchema =
{
    title: "Affiliation Schema",
    type: "object",
    required:["orgName", "memberSince", "role"],
    properties: {
        orgName: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            pattern: "^[a-zA-Z ]+$"
        },
        memberSince: {
            type: "string",
            pattern: "^20[0-9]{2}-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$"
        },
        role: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            pattern: "^[a-zA-Z ]+$"
        }
    }
};

module.exports = affiliationSchema;