const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllEmployees = require('../../functions/other-modules/dropdown/getAllEmployees');
//Models
// const getAllSchema = require('../../models/divChief/competency/getAllByDivision');

router.route('/dropdown/employees')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getAllEmployees(req, res);
})


module.exports = router;