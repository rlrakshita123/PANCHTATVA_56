const express = require('express');
const router = express.Router();
const medicinesController = require('../controllers/pharmacyController');

// Example route: get medicines by name
router.get('/:name', medicinesController.getMedicinesByName);

module.exports = router;
