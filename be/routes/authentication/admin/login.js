const express = require('express');
const router = express.Router();
const passport = require('passport');



//Validation Script
const validator = require('../../../middleware/validator/validator');

//Functions
const login = require('../../../functions/authentication/admin/login');


//Models
const loginSchema = require('../../../models/admin/authentication/login');


router.route('/login')
.post(validator.validate({body:loginSchema}), (req, res) => {
    login(req, res);
});





module.exports = router;