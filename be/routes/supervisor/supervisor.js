const express = require('express');
const router = express.Router();

const competency = require('./competency.js');
const loginRoutes = require('../authentication/supervisor/login.js');
const registerRoute = require('../authentication/supervisor/registration.js');
const scholarship = require('./scholarship.js');
const certificateRoutes = require('./certificate.js');
const notification = require('./notification.js');

router.use('/supervisor',competency);
router.use('/supervisor', loginRoutes);
router.use('/supervisor', registerRoute);
router.use('/supervisor', scholarship);
router.use('/supervisor', certificateRoutes);
router.use('/supervisor', notification);

module.exports = router;