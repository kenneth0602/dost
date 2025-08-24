const express = require('express');
const router = express.Router();
const passport = require('passport');


//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/SMEeduc/getAll');
const getByID = require('../../functions/admin/SMEeduc/getByID');
const create = require('../../functions/admin/SMEeduc/create');
const disableByID = require('../../functions/admin/SMEeduc/disableByID');
const updateByID = require('../../functions/admin/SMEeduc/updateByID');
// const getByTrainingProvider = require('../functions/SMEeduc/getByTrainingProvider');
// const getByProviderProgram = require('../functions/SMEeduc/getByProviderProgram');

//Models
const getAllSchema = require('../../models/admin/SMEeduc/getAll');
const createSchema = require('../../models/admin/SMEeduc/create');
const updateByIDSchema = require('../../models/admin/SMEeduc/updateByID');


router.route('/SME/educ')
.get(validator.validate({query:getAllSchema}),passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/SME/educ/:educID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByID(req, res);
})
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
});
// .put((req,res) => {
//     enableByID(req,res);
// })

// router.route('/SME/trainingProvider/:provID')
// .get((req,res) => {
//     getByTrainingProvider(req, res);
// });

// router.route('/SME/providerProgram/:pprogID')
// .get((req,res)=> {
//     getByProviderProgram(req,res);
// })

module.exports = router;