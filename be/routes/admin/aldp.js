const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const create = require('../../functions/admin/aldp/year/create');
const getAll = require('../../functions/admin/aldp/year/getAll');
const updateByID = require('../../functions/admin/aldp/year/update');
const getAllALDP = require('../../functions/admin/aldp/competency/getAll');
const getAllProgramDD = require('../../functions/admin/providerProgram/getAllPP');
const getAllParticipants = require('../../functions/admin/aldp/competency/getAllParticipantsByProgram');
const getAllParticipantsApprovedALDP = require('../../functions/admin/aldp/competency/getAllParticipantsByProgramApprovedALDP');
const updateByALDPID = require('../../functions/admin/aldp/competency/updateByALDPID');
const getAllApproved = require('../../functions/admin/aldp/competency/getAllApproved');
const approved = require('../../functions/admin/aldp/competency/approved');
const multipleApprove = require('../../functions/admin/aldp/competency/approvedMultiple');
const createAldpProposed = require('../../functions/admin/aldp/competency/aldp_proposed');

// Models
const getAllSchema = require('../../models/shared/getAllSchema');
const getAllWithSearchSchema = require('../../models/shared/getAllWithSearchSchema');
const createYearSchema = require('../../models/admin/aldp/createYearSchema');
const getByIDSchema = require('../../models/admin/aldp/getByIDSchema');
const updateYearSchema = require('../../models/admin/aldp/updateYearSchema');

router.route('/aldp/year')
.post(passport.authenticate('jwt', {session : false}), validator.validate({body: createYearSchema}), (req, res) => {
    create(req, res);
})
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAll(req, res);
});

router.route('/aldp/year/:aldpID')
.put(passport.authenticate('jwt', {session : false}), validator.validate({query: getByIDSchema, body: updateYearSchema}), (req, res) => {
    updateByID(req, res);
});

router.route('/aldp/proposed')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    createAldpProposed(req, res);
})
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllALDP(req, res);
});

router.route('/aldp/proposed/program')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllParticipants(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    updateByALDPID(req, res);
});

router.route('/aldp/proposed/program/approved')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllParticipantsApprovedALDP(req, res);
})




router.route('/aldp/proposed/program/dd')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllProgramDD(req, res);
});

router.route('/aldp/approved')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllApproved(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    approved(req, res);
});

router.route('/aldp/approved/multiple')
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    multipleApprove(req, res);
});

module.exports = router;