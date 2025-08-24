const express = require('express');
const router = express.Router();

const scholarship = require('./scholarship');
const dropdown = require('./dropdown');
const login = require('./login');
const notifications = require('./notifications');

router.use('/api', scholarship);
router.use('/api', dropdown);
router.use('/api', login);
router.use('/api', notifications);

module.exports = router;