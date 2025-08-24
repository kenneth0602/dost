const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/paymentOption/getAll');
const getByTrainingProvider = require('../../functions/admin/paymentOption/getByTrainingProvider');
const create = require('../../functions/admin/paymentOption/create');
const disableByID = require('../../functions/admin/paymentOption/disableByID');
const enabledByID = require('../../functions/admin/paymentOption/enableByID');
const updateByID = require('../../functions/admin/paymentOption/updateByID');
const getByID = require('../../functions/admin/paymentOption/getByID');
const getAllInactiveByProvider = require('../../functions/admin/paymentOption/getAllInactiveByProvider')

//Models
const getAllSchema = require('../../models/admin/paymentOption/getAll');
const createSchema = require('../../models/admin/paymentOption/create');
const updateByIDSchema = require('../../models/admin/paymentOption/updateByID');


router.route('/paymentOption')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/paymentOption/:paymentOptID')
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
    enabledByID(req,res);
});

router.route('/paymentOption/inactive/:provID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getAllInactiveByProvider(req, res);
});

router.route('/paymentOption/trainingProvider/:provID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByTrainingProvider(req, res);
})

module.exports = router;