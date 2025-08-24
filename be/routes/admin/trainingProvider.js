const express = require('express');
const router = express.Router();
let {upload} = require('../../config/multer.config.js');
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/trainingProvider/getAll');
const getByID = require('../../functions/admin/trainingProvider/getByID');
const create = require('../../functions/admin/trainingProvider/create');
const disableByID = require('../../functions/admin/trainingProvider/disableByID');
const enableByID = require('../../functions/admin/trainingProvider/enableByID');
const updateByID = require('../../functions/admin/trainingProvider/updateByID');
const uploadCSV = require('../../functions/admin/trainingProvider/upload');
const getAllTP = require('../../functions/admin/trainingProvider/getAllTP');
const getAllTPDD = require('../../functions/admin/aldp/provider/getAllProviderByProgID.js')

//Models
const getAllSchema = require('../../models/admin/trainingProvider/getAll');
const createSchema = require('../../models/admin/trainingProvider/create');
const updateByIDSchema = require('../../models/admin/trainingProvider/updateByID');
const uploadSchema = require('../../models/admin/trainingProvider/upload');


router.route('/trainingProvider')
.get(validator.validate({query:getAllSchema}),passport.authenticate('jwt', {session : false}),(req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}),passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/trainingProvider/dd')
.get(passport.authenticate('jwt', {session : false}),(req,res) => {
    console.log(req.query);
    getAllTP(req,res);
});

router.route('/trainingProvider/:provID')
.get(passport.authenticate('jwt', {session : false}),(req,res) => {
    getByID(req, res);
})
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}),(req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
});

router.route('/trainingProvider/Enable/:provID')
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    enableByID(req,res);
});

router.route('/trainingProvider/upload')
.post(upload.single('file'), passport.authenticate('jwt', {session : false}), (req, res) => {
    uploadCSV(req, res);
})

router.route('/program/trainingProvider/dd')
.get(passport.authenticate('jwt', {session : false}),(req,res) => {
    getAllTPDD(req,res);
});



module.exports = router;