const competency = event.body.competency;
    const description = event.body.description;
    const type = event.body.type;
    const classification = event.body.classification;
    const noOfProgram = event.body.noOfProgram;
    const perSession = event.body.perSession;
    const totalPax = event.body.totalPax;
    const estimatedCost = event.body.estimatedCost;
    const divisions = event.body.divisions;
    // const tentative_schedules = event.body.tentative_schedules;
    const proposed_year = event.body.proposed_year;

const createProposedSchema =
{
    title: "createProposedSchema",
    type: "object",
    required:["description", "type", "classification", "noOfProgram", "perSession", "totalPax", "estimatedCost", "divisions", "proposed_year"],
    properties: {
        description: {
            type: "string",
            minLength: 3,
            maxLength: 255,
            pattern: "^[#.0-9a-zA-Z ,-]+$"
        },
        type: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,.]+$"
        },
        classification: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            pattern: "^[#.0-9a-zA-Z ,.]+$"
        }
    }
};

module.exports = createProposedSchema;