const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

router.delete('/test-cleanup', deleteUser);

module.exports = router;