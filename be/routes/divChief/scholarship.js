const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllLocalRequestByDivision = require('../../functions/divChief/scholarship/getAllLocalRequestByDivision');
const getAllForeignRequestByDivision = require('../../functions/divChief/scholarship/getAllForeignRequestByDivision');
const getByID = require('../../functions/divChief/scholarship/getByID');
const updateByID = require('../../functions/divChief/scholarship/updateStatus');
const getEligibleEmployee = require('../../functions/divChief/scholarship/getEligibleEmployee');

//Models


//routes
router.route('/scholarship/request/local/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllLocalRequestByDivision(req, res);
});
router.route('/scholarship/request/foreign/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllForeignRequestByDivision(req, res);
});
router.route('/scholarship/request/:sreqID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getByID(req, res);
});
router.route('/scholarship/update/:sreqID')
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    updateByID(req, res);
});

router.route('/scholarship/eligible')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getEligibleEmployee(req, res);
});


module.exports = router;