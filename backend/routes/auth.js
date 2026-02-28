const express = require('express');
const { body } = require('express-validator');

const { login } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().isLength({ min: 4 }).withMessage('Password is required')
  ],
  login
);

module.exports = router;
