const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllPrograms = require('../../functions/divChief/forms/getAllPrograms');
const getFormByFormID = require('../../functions/divChief/forms/getFormByFormID');
const getAllByALDP = require('../../functions/divChief/forms/getAllByALDP');
const getUserResponse = require('../../functions/divChief/forms/getUserResponse');
const getNTPDetails = require('../../functions/divChief/forms/getNTPDetails');
const approvedNTP = require('../../functions/divChief/forms/approvedNTP');
const disapprovedNTP = require('../../functions/divChief/forms/disapprovedNTP');
const getUserFeedbackResponse = require('../../functions/divChief/forms/getUserFeedbackResponse');


router.route('/forms/program')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllPrograms(req, res);
});

router.route('/forms')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllByALDP(req, res);
})

router.route('/selected/form')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getFormByFormID(req, res);
})

router.route('/selected/form/response')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserResponse(req, res);
})

router.route('/selected/form/ntp')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getNTPDetails(req, res);
})

router.route('/selected/form/ntp/approve')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    approvedNTP(req, res);
})

router.route('/selected/form/ntp/decline')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    disapprovedNTP(req, res);
})

router.route('/selected/form/feedback/response')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserFeedbackResponse(req, res);
})

module.exports = router;