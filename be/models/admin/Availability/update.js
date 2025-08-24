const availabilitySchema =
{
    title: "Availability Schema",
    type: "object",
    required:["dateFrom", "fromTime", "dateTo", "toTime"],
    properties: {
        
        dateFrom: {
            type: "string",
            pattern: "^20[0-9]{2}-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$"
        },
        fromTime: {
            type: "string",
            pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
        },
        dateTo: {
            type: "string",
            pattern: "^20[0-9]{2}-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$"
        },
        toTime: {
            type: "string",
            pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
        }
    }
};

module.exports = availabilitySchema;