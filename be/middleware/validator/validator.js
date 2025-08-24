//Import the library
const Validator = require('express-json-validator-middleware');

//our validator function
const { validate } = new Validator.Validator();

//Error handler function if validation fails
const errorHandler = (error, req, res,next) => {
    if(error instanceof Validator.ValidationError) {
        res.status(400).send(error);
        next();
    }
    else {
        next(error);
    }
}

//export the two functions so that we may use them elsewhere
module.exports = {
    validate : validate,
    errorHandler : errorHandler
}