const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllLocalRequest = require('../../functions/admin/scholarship/getAllLocalRequest');
const getAllForeignRequest = require('../../functions/admin/scholarship/getAllForeignRequest');
const getByID = require('../../functions/admin/scholarship/getByID');
const updateByID = require('../../functions/admin/scholarship/updateStatus');

//Models


router.route('/scholarship/local')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAllLocalRequest(req, res);
});
router.route('/scholarship/foreign')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAllForeignRequest(req, res);
});
router.route('/scholarship/:sreqID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getByID(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    updateByID(req, res);
});

module.exports = router;