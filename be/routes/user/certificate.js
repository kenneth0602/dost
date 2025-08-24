const express = require('express');
const router = express.Router();
let {upload, uploadCert} = require('../../config/multer.config.js');
const passport = require('passport');

//Validation Script
const validator = require('../../middleware/validator/validator');

//Functions
const uploadPDF = require('../../functions/user/certificate/upload');
const getAll = require('../../functions/user/certificate/getAllByUser.js');
const getByID = require('../../functions/user/certificate/getByID.js')

router.route('/certificate/:empID')
.post(uploadCert.single('file'), passport.authenticate('jwt', {session : false}), (req, res) => {
    uploadPDF(req, res);
})
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getAll(req, res);
});

router.route('/view/certificate/:certID')
.get(passport.authenticate('jwt', {session : false}), (req, res) => {
    getByID(req, res);
})

module.exports = router;