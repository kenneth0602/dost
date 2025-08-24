const express = require('express');
const router = express.Router();


//Validation Script
const validator = require('../../../middleware/validator/validator');

//Functions
const register = require('../../../functions/authentication/admin/registration');


//Models
const registerSchema = require('../../../models/admin/authentication/registration');


router.route('/register')
.post((req, res) => {
    register(req, res);
});





module.exports = router;