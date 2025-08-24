const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const notifySectionChief = require('../../functions/divChief/notification/notifySectionChief');
//Models
// const getAllSchema = require('../../models/divChief/competency/getAllByDivision');

router.route('/notify/supervisor')
.post(passport.authenticate('jwt', {session : false}), (req,res) => {
    notifySectionChief(req, res);
})


module.exports = router;