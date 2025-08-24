const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllByID = require('../../functions/user/scholarship/getAll');
const create = require('../../functions/user/scholarship/create');
const withdraw = require('../../functions/user/scholarship/withdrawRequest');
const getByID = require('../../functions/user/scholarship/getByID');
//const getByID = require('../../functions/user/competencyRequest/getByID');


//Models
// const getAllSchema = require('../../models/user/competencyRequest/getAllByUser');
// const createSchema = require('../../models/user/competencyRequest/create');


router.route('/scholarship/:empID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAllByID(req, res);
})
.post(passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});
router.route('/scholarship/:empID/:sreqID')
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    withdraw(req, res);
});
router.route('/scholarship/request/:sreqID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getByID(req, res);
});

// router.route('/competency/ID/:reqID')
// .get(passport.authenticate('jwt', {session : false}), (req, res) => {
//     getByID(req, res);
// }); 
module.exports = router;