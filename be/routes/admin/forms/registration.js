const express = require('express');
const router = express.Router();
const passport = require('passport');

//Validation Script
const validator = require('../../../middleware/validator/validator');

//Functions
const getAll = require('../../../functions/admin/forms/registration/getAll');
const getAllRegistrationByAldpID = require('../../../functions/admin/forms/registration/getAllByALDP');
const create = require('../../../functions/admin/forms/registration/create');
// const disableByID = require('../../../functions/admin/paymentOption/disableByID');
// const enabledByID = require('../../../functions/admin/paymentOption/enableByID');
const updateByID = require('../../../functions/admin/forms/registration/updateByID');
const getByID = require('../../../functions/admin/forms/registration/getByID');

// Models
// const getAllSchema = require('../../models/admin/paymentOption/getAll');
// const createSchema = require('../../models/admin/paymentOption/create');
// const updateByIDSchema = require('../../models/admin/paymentOption/updateByID');
const getAllSchema = require('../../../models/shared/getAllSchema');
const getAllWithSearchSchema = require('../../../models/shared/getAllWithSearchSchema');
const createSchema = require('../../../models/admin/registration/createSchema');
const getByRegIDSchema = require('../../../models/admin/registration/getByRegIDSchema');
const updateSchema = require('../../../models/admin/registration/updateSchema');
const getByALDPIDSchema = require('../../../models/admin/registration/getByALDPIDSchema');


router.route('/forms/registration')
.get(passport.authenticate('jwt', {session : false}), validator.validate({query: getAllSchema}), (req, res) => {
    console.log(req.query);
    getAll(req, res);
}) 
.post(passport.authenticate('jwt', {session : false}), validator.validate({body: createSchema}), (req, res) => {
    create(req, res);
});

router.route('/forms/register/:formRegID')
.get(passport.authenticate('jwt', {session : false}),  validator.validate({params: getByRegIDSchema}), (req,res) => {
    getByID(req, res);
})
.patch(passport.authenticate('jwt', {session : false}), validator.validate({params: getByRegIDSchema, body: updateSchema}), (req,res) => {
    updateByID(req,res);
})
// .delete(passport.authenticate('jwt', {session : false}), (req,res) => {
//     disableByID(req,res);
// })
// .put(passport.authenticate('jwt', {session : false}), (req,res) => {
//     enabledByID(req,res);
// });

router.route('/forms/registration/:aldpID')
.get(passport.authenticate('jwt', {session : false}), validator.validate({query: getByALDPIDSchema}),(req,res) => {
    getAllRegistrationByAldpID(req, res);
})

module.exports = router;