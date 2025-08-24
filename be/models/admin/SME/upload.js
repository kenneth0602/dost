const SMESchema =
{
    title: "SME Schema",
    type: "object",
    required:["lastname", "firstname", "mobileNo", "telNo", "website", "areaOfExpertise"],
    properties: {
        lastname: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            pattern: "^[a-zA-Z ]+$"
        },
        firstname: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            pattern: "^[a-zA-Z ]+$"
        },
        // telNo: {
        //     type: "string",
        //     minLength: 7,
        //     maxLength: 15,
        //     pattern: "^[0-9]+$"
        // },
        // mobileNo: {
        //     type: "string",
        //     minLength: 7,
        //     maxLength: 15,
        //     pattern: "^[0-9]+$"
        // },
        companyName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        },
        companyAddress: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        }, 
        companyNo: {
            type: "string",
            minLength: 7,
            maxLength: 15,
            pattern: "^[0-9]+$"
        },
        emailAdd: {
            type: "string",
            minLength: 10,
            maxLength: 100,
            pattern: "^[a-zA-Z0-9!@#$%^&]+@[a-z.]+.[a-z]{2,3}$"
        },
        fbMessenger: {
            type: "string",
            minLength: 5,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-/]+$"
        },
        viberAccount: {
            type: "string",
            minLength: 7,
            maxLength: 15,
            pattern: "^[0-9]+$"
        },
        // areaOfExpertise: {
        //     type: "string",
        //     minLength: 2,
        //     maxLength: 50,
        //     pattern: "^[#.0-9a-zA-Z ,-]+$"
        // },
        honorariaRate: {
            type: "string",
            minLength: 1,
            maxLength: 12,
            pattern: "^[0-9]+$"
        },
        TIN: {
            type: "string",
            minLength: 10,
            maxLength: 12,
            pattern: "^[0-9]+$"
        }
    }
};

module.exports = SMESchema;