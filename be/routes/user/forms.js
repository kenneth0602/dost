const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getUserFormsByALDPID = require('../../functions/user/forms/getUserFormsByALDPID');
const getUserTraining = require('../../functions/user/forms/getAllTrainings');
const getFormByFormID = require('../../functions/user/forms/getFormByFormID');
const submitUserAnswer = require('../../functions/user/forms/submitUserAnswer');
const getUserResponseAndScore = require('../../functions/user/forms/getUserResponseAndScore');
const getNTP = require('../../functions/user/forms/getNTP');
const approveNTP = require('../../functions/user/forms/approveNTP');
const declineNTP = require('../../functions/user/forms/declineNTP');
const registerForm = require('../../functions/user/forms/registerForm');
const getRegisterData = require('../../functions/user/forms/getRegisterData');

//Models
const registerFormSchema = require('../../models/user/forms/register') 
const getRegisterDataSchema = require('../../models/user/forms/getRegisterData') 


router.route('/forms')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserFormsByALDPID(req, res);
})

router.route('/training')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserTraining(req, res);
})

router.route('/selected/form')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getFormByFormID(req, res);
})

router.route('/selected/form/submit')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    submitUserAnswer(req, res);
})

router.route('/selected/form/response')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserResponseAndScore(req, res);
})

router.route('/selected/form/feedback/response')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUserResponseAndScore(req, res);
})

router.route('/selected/form/ntp')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getNTP(req, res);
})

router.route('/selected/form/ntp/approve')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    approveNTP(req, res);
})

router.route('/selected/form/ntp/decline')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    declineNTP(req, res);
})

router.route('/selected/form/register')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    registerForm(req, res);
})
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getRegisterData(req, res);
})

module.exports = router;