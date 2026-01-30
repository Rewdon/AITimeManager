const express = require('express');
const router = express.Router();
const { getDailyPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plan', protect, getDailyPlan);

module.exports = router;