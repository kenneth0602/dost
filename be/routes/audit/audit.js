const express = require('express');
const router = express.Router();
const passport = require('passport');



//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAll = require('../../functions/audit/getAll');


//Models
// const loginSchema = require('../../../models/admin/authentication/login');


router.route('/audit')
.get((req, res) => {
    getAll(req, res);
});





module.exports = router;