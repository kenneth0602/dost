const express = require('express');
const router = express.Router();
let {upload} = require('../../config/multer.config.js');
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/SME/getAll');
const getByID = require('../../functions/admin/SME/getByID');
const create = require('../../functions/admin/SME/create');
const disableByID = require('../../functions/admin/SME/disableByID');
const enableByID = require('../../functions/admin/SME/enableByID');
const updateByID = require('../../functions/admin/SME/updateByID');
const getByTrainingProvider = require('../../functions/admin/SME/getByTrainingProvider');
const getByProviderProgram = require('../../functions/admin/SME/getByProviderProgram');
const uploadCSV = require('../../functions/admin/SME/upload');

//Models
const getAllSchema = require('../../models/admin/SME/getAll');
const createSchema = require('../../models/admin/SME/create');
const updateByIDSchema = require('../../models/admin/SME/updateByID');
const uploadSchema = require('../../models/admin/SME/upload');


router.route('/SME')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/SME/:profileID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByID(req, res);
})
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
})
.put((req,res) => {
    enableByID(req,res);
});

router.route('/SME/trainingProvider/:provID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByTrainingProvider(req, res);
});

router.route('/SME/providerProgram/:pprogID')
.get(passport.authenticate('jwt', {session : false}), (req,res)=> {
    getByProviderProgram(req,res);
});

router.route('/SME/upload')
.post(upload.single('file'), passport.authenticate('jwt', {session : false}), (req, res) => {
    uploadCSV(req, res);
})

module.exports = router;