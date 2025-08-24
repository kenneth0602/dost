const trainingProviderSchema =
{
    title: "Training Provider Schema",
    type: "object",
    required:["pointofContact", "address", "website", "telNo", "mobileNo", "emailAdd"],
    properties: {
        providerName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: `[^<>"']+$`
        },
            pointofContact: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[a-zA-Z ]+$"
        },
        address: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        },
        website: {
            type: "string",
            minLength: 5,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        }
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
        // emailAdd: {
        //     type: "string",
        //     minLength: 10,
        //     maxLength: 100,
        //     pattern: "^[a-zA-Z0-9!@#$%^&]+@[a-z.]+.[a-z]{2,3}$"
        // }
    }
};

module.exports = trainingProviderSchema;