const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllByID = require('../../functions/user/competencyRequest/getAllByUser');
const create = require('../../functions/user/competencyRequest/create');
const getByID = require('../../functions/user/competencyRequest/getByID');
const getPlanned = require('../../functions/user/competencyPlanned/getAllAssignedByUser');
const getCompleted = require('../../functions/user/competencyPlanned/getAllCompletedByUser');
const getUnserved = require('../../functions/user/competencyPlanned/getAllUnservedByUser');

//Models
const getAllSchema = require('../../models/user/competencyRequest/getAllByUser');
const createSchema = require('../../models/user/competencyRequest/create');


router.route('/competency/wishlist')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAllByID(req, res);
})
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/competency/ID/:reqID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getByID(req, res);
}); 

router.route('/competency/:empID/assigned')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getPlanned(req, res);
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