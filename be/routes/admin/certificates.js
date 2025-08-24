const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/certificates/getAll');
const approve = require('../../functions/admin/certificates/approveByID');
const reject = require('../../functions/admin/certificates/rejectByID');
const getEmployees = require('../../functions/admin/certificates/getAllEmp');
const getByID = require('../../functions/admin/certificates/getByID');
const getAllCertByEmp = require('../../functions/admin/certificates/getAllCertByEmp');


router.route('/certificates')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAll(req, res);
});

router.route('/certificates/:certID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getByID(req, res);
});

router.route('/approve/certificates')
.post((req, res) => {
    approve(req, res);
});

router.route('/reject/certificates')
.post((req, res) => {
    reject(req, res);
});

router.route('/employees/certificates')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getEmployees(req, res);
});

router.route('/employees/certificates/:empID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllCertByEmp(req, res);
});

module.exports = router;