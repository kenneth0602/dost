const paymentOptionSchema =
{
    title: "Payment Option Schema",
    type: "object",
    required:["payee", "accountNo", "provID", "ddPaymentOpt", "bankName", "TIN"],
    properties: {
        payee: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[a-zA-Z ,.]+$"
        },
        accountNo: {
            type: "string",
            minLength: 5,
            maxLength: 16,
            pattern: "^[0-9]+$"
        },
        provID: {
            type: "string",
            minLength: 1,
            maxLength: 10,
            pattern: "^[0-9]+$"
        },
        ddPaymentOpt: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        },
        bankName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,.]+$"
        },
        TIN: {
            type: "string",
            minLength: 10,
            maxLength: 12,
            pattern: "^[0-9]+$"
        }
    }
};

module.exports = paymentOptionSchema;