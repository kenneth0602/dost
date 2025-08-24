const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const notifyUser = require('../../functions/supervisor/notification/notifyUser');
//Models
// const getAllSchema = require('../../models/divChief/competency/getAllByDivision');

router.route('/notify/user')
.post(passport.authenticate('jwt', {session : false}), (req,res) => {
    notifyUser(req, res);
})

module.exports = router;