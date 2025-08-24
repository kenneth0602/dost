const express = require('express');
const router = express.Router();
let upload = require('../../config/multer.config.js');
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const getAllCertificateByEmpIDBySection = require('../../functions/supervisor/certificates/getAllCertificatesByEmpIDBySection.js');

router.route('/certificate/:sectionID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAllCertificateByEmpIDBySection(req, res);
});

module.exports = router;