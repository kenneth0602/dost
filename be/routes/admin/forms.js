const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/forms/getAll');
const getFormsByALDPID = require('../../functions/admin/forms/byProgram/getAllByALPD')
const addFormsByALDPID = require('../../functions/admin/forms/byProgram/addForm')
const editFormsByALDPID = require('../../functions/admin/forms/byProgram/editForm')
const getFormsByFormID = require('../../functions/admin/forms/byProgram/getFormByFormID')
const getDetailForGenerateNTP = require('../../functions/admin/forms/ntp/getDetailForGenerateNTP')
const sendAndStoreNTP = require('../../functions/admin/forms/ntp/sendAndStoreNTP')
const getNTPDetails = require('../../functions/admin/forms/ntp/getNTPDetails')
const getUserResponse = require('../../functions/admin/forms/byProgram/getUserResponse')
const getRegistrationData = require('../../functions/admin/forms/registration/getRegistrationData')
const getUserFeedbackResponse = require('../../functions/admin/forms/byProgram/getUserFeedbackResponse')


router.route('/forms/program')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAll(req, res);
});

router.route('/forms')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getFormsByALDPID(req, res);
})
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    addFormsByALDPID(req, res);
});

router.route('/selected/form')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getFormsByFormID(req, res);
})
.put(passport.authenticate('jwt', {session : false}), (req, res) => {
    editFormsByALDPID(req, res);
})
router.route('/selected/form/response')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserResponse(req, res);
})

router.route('/selected/form/ntptemplate')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getDetailForGenerateNTP(req, res);
})
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    sendAndStoreNTP(req, res);
})

router.route('/selected/form/ntp')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getNTPDetails(req, res);
})

router.route('/selected/form/register')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getRegistrationData(req, res);
})

router.route('/selected/form/feedback/response')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserFeedbackResponse(req, res);
})


module.exports = router;