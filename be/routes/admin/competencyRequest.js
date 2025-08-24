const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/competency/new_getAll');
const getByID = require('../../functions/admin/competency/getByID')
const updateByID = require('../../functions/admin/competency/updateByID');
const getAllRequestByCompetency = require('../../functions/admin/competency/getAllRequestByCompetency');
const getAllDropDown = require('../../functions/admin/competency/dropdown');
const addCompetency = require('../../functions/admin/competency/new_add');
const submit = require('../../functions/admin/competency/submit');

//Models
const getAllSchema = require('../../models/admin/competency/getAll');
const updateByIDSchema = require('../../models/admin/competency/updateByID');


router.route('/competency/planned')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
})
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    addCompetency(req, res);
});

router.route('/competency/planned/submit')
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    submit(req, res);
});

router.route('/dropdown/competency/planned')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAllDropDown(req, res);
});

router.route('/competency/planned/request')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllRequestByCompetency(req, res);
});

router.route('/competency/planned/:compID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByID(req, res);
})
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})


module.exports = router;