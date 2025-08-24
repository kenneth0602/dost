const paymentOptionSchema =
{
    title: "Payment Option Schema",
    type: "object",
    required:["pageNo", "pageSize"],
    properties: {
        // providerName: {
        // //     type: "string",
        //     minLength: 2,
        //     maxLength: 100,
        //     pattern: "^[a-zA-Z0-9!@#$%^&]+@[a-z.]+.[a-z]{2,3}$"
        // },
        // pointofContact: {
        //     type: "string",
        //     minLength: 2,
        //     maxLength: 100,
        //     pattern: "^[a-zA-Z]+$"
        // },
        // address: {
        //     type: "string",
        //     minLength: 10,
        //     maxLength: 100,
        //     pattern: "^[#.0-9a-zA-Z ,-]+$"
        // },
        // website: {
        //     type: "string",
        //     minLength: 10,
        //     maxLength: 100,
        //     pattern: "^[#.0-9a-zA-Z ,-]+$"
        // },
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
        // email: {
        //     type: "string",
        //     minLength: 10,
        //     maxLength: 100,
        //     pattern: "^[a-zA-Z0-9!@#$%^&]+@[a-z.]+.[a-z]{2,3}$"
        // },
        pageNo: {
            type: "string",
            pattern: "^[0-9]+$"
        },
        pageSize: {
            type: "string",
            pattern: "^[0-9]+$"
        }
    }
};

module.exports = paymentOptionSchema;