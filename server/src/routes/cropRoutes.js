const express = require('express');
const { addCrop, getCrops } = require('../controllers/cropController');

const router = express.Router();

router.post('/', addCrop);
router.get('/', getCrops);

module.exports = router;