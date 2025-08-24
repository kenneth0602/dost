const express = require('express');
const router = express.Router();
const passport = require('passport');
const {uploadScholarship}  = require('../../config/multer.config');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const add = require('../../functions/other-modules/scholarship/add');
const getAll = require('../../functions/other-modules/scholarship/getAll');
const update = require('../../functions/other-modules/scholarship/update');
const disabled = require('../../functions/other-modules/scholarship/disabled');
const enabled = require('../../functions/other-modules/scholarship/enabled');
const sendToSDU = require('../../functions/other-modules/scholarship/sendToSDU');
const assignEmployeeToScholarship = require('../../functions/other-modules/scholarship/assignEmployeeToScholarship');
//Models
// const getAllSchema = require('../../models/divChief/competency/getAllByDivision');

router.route('/scholarship-upload')
.post(passport.authenticate('jwt', {session : false}), uploadScholarship.single('file'), (req,res) => {
    add(req, res);
})

router.route('/scholarship')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getAll(req, res);
})

router.route('/scholarship/:id')
.put(passport.authenticate('jwt', {session : false}), (req,res) => {
    update(req, res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disabled(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), (req,res) => {
    enabled(req, res);
})

router.route('/send-to-sdu/scholarship/:id')
.put(passport.authenticate('jwt', {session : false}), (req,res) => {
    sendToSDU(req, res);
})

router.route('/assign/scholarship/employees')
.post(passport.authenticate('jwt', {session : false}), (req,res) => {
    assignEmployeeToScholarship(req, res);
})

module.exports = router;