const express = require('express');
const router = express.Router();
const passport = require('passport');


//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/providerProgram/getAll');
const getByTrainingProvider = require('../../functions/admin/providerProgram/getByTrainingProvider');
const getByID = require('../../functions/admin/providerProgram/getByID');
const create = require('../../functions/admin/providerProgram/create');
const disableByID = require('../../functions/admin/providerProgram/disableByID');
const enabledByID = require('../../functions/admin/providerProgram/enabledByID');
const updateByID = require('../../functions/admin/providerProgram/updateByID');
const insertToTP = require('../../functions/admin/providerProgram/insertToTP');
const getallTrainingProviderByProgram = require('../../functions/admin/providerProgram/getAllTrainingProviderByProgID');
const getAllAvailedProgram = require('../../functions/admin/providerProgram/getAllAvailed');
const addNewProvider = require('../../functions/admin/providerProgram/addprovider')

//Models
const getAllSchema = require('../../models/admin/providerProgram/getAll');
const createSchema = require('../../models/admin/providerProgram/create');
const updateByIDSchema = require('../../models/admin/providerProgram/updateByID');


router.route('/providerProgram')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    insertToTP(req, res);
});
router.route('/providerProgram/availed')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getallTrainingProviderByProgram(req,res);
});
router.route('/providerProgram/details/:pprogID') // change the endpoints from /providerProgram/:pprogID to /providerProgram/:pprogID
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByID(req, res);
})
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
})
.put(passport.authenticate('jwt', {session : false}), (req,res) => {
    enabledByID(req,res);
});


router.route('/providerProgram/provider/:pprogID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getallTrainingProviderByProgram(req,res);
})
.put(passport.authenticate('jwt', {session : false}), (req,res) => {
    addNewProvider(req,res);
});

router.route('/providerProgram/trainingProvider/:provID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByTrainingProvider(req, res);
})

module.exports = router;