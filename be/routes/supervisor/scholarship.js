const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getEligibleEmployee = require('../../functions/supervisor/scholarships/getEligibleEmployee');

//Models


//routes
router.route('/scholarship/eligible')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getEligibleEmployee(req, res);
});


module.exports = router;