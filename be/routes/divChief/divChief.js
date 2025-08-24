const express = require('express');
const router = express.Router();

const competency = require('./competency.js');
const loginRoutes = require('../authentication/divChief/login.js');
const registerRoute = require('../authentication/divChief/registration.js');
const scholarship = require('./scholarship.js');
const forms = require('./forms.js');
const certificate = require('./certificate.js');
const notification = require('./notification.js');

router.use('/divChief',competency);
router.use('/divChief', loginRoutes);
router.use('/divChief', registerRoute);
router.use('/divChief', scholarship);
router.use('/divChief', forms);
router.use('/divChief', certificate);
router.use('/divChief', notification);

module.exports = router;