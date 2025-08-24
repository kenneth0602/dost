const express = require('express');
const router = express.Router();

const competency = require('./competencyRequest');
const loginRoutes = require('../authentication/user/login');
const registerRoute = require('../authentication/user/registration');
const scholarship = require('./scholarship');
const certificate = require('./certificate');
const forms = require('./forms');

router.use('/usr',competency);
router.use('/usr', loginRoutes);
router.use('/usr', registerRoute);
router.use('/usr', scholarship);
router.use('/usr', certificate);
router.use('/usr', forms);


module.exports = router;