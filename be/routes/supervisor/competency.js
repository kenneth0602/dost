const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getPlanned = require('../../functions/supervisor/competency/getAllPlannedBySection')
const getAssigned = require('../../functions/supervisor/competency/getAllAssignedByEmpID');
const getCompleted = require('../../functions/supervisor/competency/getAllCompletedByUser');
const getUnserved = require('../../functions/supervisor/competency/getAllUnservedByUser');

// //Models
// const getAllSchema = require('../../models/user/competencyRequest/getAllByUser');
// const createSchema = require('../../models/user/competencyRequest/create');


router.route('/competency/planned/:sectionID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getPlanned(req, res);
});

router.route('/competency/:empID/assigned')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAssigned(req, res);
}); 

router.route('/competency/:empID/completed')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getCompleted(req, res);
}); 

router.route('/competency/:empID/unserved')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getUnserved(req, res);
}); 

module.exports = router;