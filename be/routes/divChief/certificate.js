const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllEmployees = require('../../functions/divChief/certificate/getAllEmployees')
const getAllCertByEmp = require('../../functions/divChief/certificate/getAllCertByEmp')
const getByCertID = require('../../functions/divChief/certificate/getByCertID')


// router.route('/certificates')
// .get(passport.authenticate('jwt', {session : false}), (req, res) => {
//     getAllEmployees(req, res);
// });

router.route('/employees/certificates')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllEmployees(req, res);
});

router.route('/employees/certificates/:empID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllCertByEmp(req, res);
});

router.route('/certificates/:certID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getByCertID(req, res);
});


module.exports = router;