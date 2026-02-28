const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { adminListServices } = require('../controllers/serviceController');

const router = express.Router();

router.get('/services', authMiddleware, adminListServices);

module.exports = router;
