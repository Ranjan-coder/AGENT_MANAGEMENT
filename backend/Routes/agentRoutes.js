const express = require('express');
const router = express.Router();
const { addAgent, getAgents } = require('../Controllers/agentController');


router.post('/add', addAgent);
router.get('/', getAgents);

module.exports = router;
