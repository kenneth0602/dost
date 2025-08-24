const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/availability/getAll');
const getByProgram = require('../../functions/admin/availability/getByProgram');
const create = require('../../functions/admin/availability/create');
const disableByID = require('../../functions/admin/availability/disableByID');
const updateByID = require('../../functions/admin/availability/updateByID');
const getAllAvailabilityByProviderandProgram = require('../../functions/admin/availability/getAllAvailabilityByProgramandProvider');

//Models
const getAllSchema = require('../../models/admin/Availability/getAll');
const createSchema = require('../../models/admin/Availability/create');
const updateByIDSchema = require('../../models/admin/Availability/update');
const { authenticate } = require('passport');


router.route('/availability')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/availability/:availID')
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
})
router.route('/availability/:pprogID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByProgram(req, res);
});
router.route('/program/provider/availability')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getAllAvailabilityByProviderandProgram(req,res);
});
module.exports = router;