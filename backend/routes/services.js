const express = require('express');
const { body } = require('express-validator');

const authMiddleware = require('../middleware/authMiddleware');
const {
  listServices,
  listNearby,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const router = express.Router();

router.get('/', listServices);
router.get('/nearby', listNearby);

router.post(
  '/',
  authMiddleware,
  [
    body('name').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('lat').isNumeric(),
    body('lng').isNumeric(),
    body('rating').optional().isNumeric()
  ],
  createService
);

router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;
