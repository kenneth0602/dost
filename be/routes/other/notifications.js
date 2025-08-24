const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllByUser = require('../../functions/other-modules/notification/getAllByUser');
//Models
// const getAllSchema = require('../../models/divChief/competency/getAllByDivision');

router.route('/notifications')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getAllByUser(req, res);
})


module.exports = router;