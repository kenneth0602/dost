const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/employees/getAll');
const getByProgram = require('../../functions/admin/employees/getByProgram');
const create = require('../../functions/admin/employees/create');
const disableByID = require('../../functions/admin/employees/disableByID');
const updateByID = require('../../functions/admin/employees/updateByID');

//Models
const getAllSchema = require('../../models/admin/employees/getAll');
const createSchema = require('../../models/admin/employees/create');
const updateByIDSchema = require('../../models/admin/employees/updateByID');


router.route('/employees')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/employees/:empID')
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
})
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByProgram(req, res);
})

module.exports = router;