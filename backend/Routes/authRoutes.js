const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authController');


// Registration route
router.post('/register', register);

// Login Routes 
router.post('/login', login);

module.exports = router;
