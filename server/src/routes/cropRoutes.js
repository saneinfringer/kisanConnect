const express = require('express');
const { addCrop, getCrops, getCropById } = require('../controllers/cropController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, addCrop);
router.get('/', getCrops);
router.get('/:id', getCropById);

module.exports = router;