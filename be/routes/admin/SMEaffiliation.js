const express = require('express');
const router = express.Router();
const passport = require('passport');


//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/admin/affiliation/getAll');
const getByID = require('../../functions/admin/affiliation/getByID');
const create = require('../../functions/admin/affiliation/create');
const disableByID = require('../../functions/admin/affiliation/disableByID');
const updateByID = require('../../functions/admin/affiliation/updateByID');

//Models
const getAllSchema = require('../../models/admin/affiliation/getAll');
const createSchema = require('../../models/admin/affiliation/create');
const updateByIDSchema = require('../../models/admin/affiliation/update');


router.route('/SME')
.get(validator.validate({query:getAllSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(validator.validate({body:createSchema}), passport.authenticate('jwt', {session : false}), (req, res) => {
    create(req, res);
});

router.route('/SME/:profileID')
.get(passport.authenticate('jwt', {session : false}), (req,res) => {
    getByID(req, res);
})
.patch(validator.validate({body:updateByIDSchema}), passport.authenticate('jwt', {session : false}), (req,res) => {
    updateByID(req,res);
})
.delete(passport.authenticate('jwt', {session : false}), (req,res) => {
    disableByID(req,res);
})
// .put(passport.authenticate('jwt', {session : false}), (req,res) => {
//     enableByID(req,res);
// })

module.exports = router;