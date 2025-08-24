const express = require('express');
const router = express.Router();

const trainingProviderRoutes = require('./trainingProvider.js');
const SMEroutes = require('./SME.js');
const providerProgramRoutes = require('./providerProgram.js');
const availability = require('./availability.js');
const paymentOption = require('./paymentOption.js');
const competency = require('./competencyRequest.js');
const SMEeduc = require('./SMEeduc.js');
const loginRoutes = require('../authentication/admin/login.js');
const registerRoute = require('../authentication/admin/registration.js');
const audit = require('../audit/audit.js');
const registration = require('../admin/forms/registration.js');
const scholarship = require('./scholarship.js');
const aldp = require('./aldp.js');
const certificates = require('./certificates.js');
const forms = require('./forms.js');
const wishlist = require('./wishlist.js');

router.use('/admin',trainingProviderRoutes);
router.use('/admin', SMEroutes);
router.use('/admin', providerProgramRoutes);
router.use('/admin', availability);
router.use('/admin', paymentOption);
router.use('/admin', competency);
router.use('/admin', SMEeduc);
router.use('/admin', loginRoutes);
router.use('/admin', registerRoute);
router.use('/admin', audit);
router.use('/admin', registration);
router.use('/admin', scholarship);
router.use('/admin', aldp);
router.use('/admin', certificates);
router.use('/admin', forms);
router.use('/admin', wishlist);

module.exports = router;