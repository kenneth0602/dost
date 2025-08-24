const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getRequestAllByDivision = require('../../functions/divChief/competency/getRequestAllByDivision');
const getByID = require('../../functions/divChief/competency/getRequestByID');
const updateReqByID = require('../../functions/divChief/competency/updateReqStatusByID');
const create = require('../../functions/divChief/competency/createCompetency');
const getCompetencyByID = require('../../functions/divChief/competency/getCompetencyByID');
const updateDivStatusByID = require('../../functions/divChief/competency/updateDivStatusByID');
const getAllPendingRequestByDivID = require('../../functions/divChief/competency/getAllPendingRequestByID');
const getAllPendingRequestFromDChief = require('../../functions/divChief/competency/getAllPendingRequestFromDChiefByDivID');
const getAllPendingRequestFromAdmin = require('../../functions/divChief/competency/getAllPendingRequestFromAdminByDivID');
const getAllApprovedRequestByDivID = require('../../functions/divChief/competency/getAllApprovedRequestByDivID');
const getAllRejectedRequestByDivID = require('../../functions/divChief/competency/getAllRejectedRequestByDivID');
const getAllRejectedRequestByDChief = require('../../functions/divChief/competency/getAllRejectedRequestByDChief');
const getAllRejectedRequestByAdmin = require('../../functions/divChief/competency/getAllRejectedRequestByAdmin');
const getAllCompetencyDropdown = require('../../functions/divChief/competency/getAllCompetencyDropdown');
const getAllCreatedCompetencyByDivChief = require('../../functions/divChief/competency/getAllCreatedCompetencyByDivChief');
const getAllMergedRequestWithCompetencyByCompID = require('../../functions/divChief/competency/getAllMergedRequestWithCompetencybyCompID');
const getAssigned = require('../../functions/divChief/competency/Planned/getAllAssignedByUser');
const getCompleted = require('../../functions/divChief/competency/Planned/getAllCompletedByUser');
const getUnserved = require('../../functions/divChief/competency/Planned/getAllUnservedByUser');
const getPlanned = require('../../functions/divChief/competency/Planned/getAllPlannedBySection');
//Models
const getAllSchema = require('../../models/divChief/competency/getAllByDivision');
const createSchema = require('../../models/divChief/competency/create');
const updateByIDSchema = require('../../models/divChief/competency/updateByID');

router.route('/competency/planned/:divID')
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

router.route('/competency/request/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getRequestAllByDivision(req, res);
})
.post(passport.authenticate('jwt', {session : false}),(req,res) => {
    create(req, res);
});

router.route('/competency/competencies/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllCompetencyDropdown(req, res);
});

router.route('/competency/req/:reqID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByID(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    updateReqByID(req,res);
});

router.route('/competency/request/pending/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllPendingRequestByDivID(req, res);
});

router.route('/competency/request/pending/chief/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllPendingRequestFromDChief(req, res);
});

router.route('/competency/request/pending/admin/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllPendingRequestFromAdmin(req, res)
})

router.route('/competency/request/approved/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllApprovedRequestByDivID(req, res);
});

router.route('/competency/request/rejected/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllRejectedRequestByDivID(req, res);
});

router.route('/competency/request/rejected/chief/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllRejectedRequestByDChief(req, res);
});

router.route('/competency/request/rejected/admin/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllRejectedRequestByAdmin(req, res);
});


router.route('/competency/approved/:compID')
.get(passport.authenticate('jwt', {session : false}),(req,res) => {
    getCompetencyByID(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req,res) => {
    updateDivStatusByID(req,res);
});

router.route('/competency/pending/:divID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllPendingCompetencyByDivID(req,res);
});

router.route('/competencies/:divID')
.get(passport.authenticate('jwt', {session : false}),(req,res) => {
    getAllCreatedCompetencyByDivChief(req, res);
});

router.route('/competencies/merged/:compID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllMergedRequestWithCompetencyByCompID(req, res);
});
// .patch(passport.authenticate('jwt', {session : false}), (req,res) => {
//     updateReqByID(req,res);
// });

module.exports = router;