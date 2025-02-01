const express = require('express');
const router = express.Router();
const { uploadCSV, processCSV } = require('../Controllers/uploadController');

router.post('/upload-csv', uploadCSV, processCSV);

module.exports = router;
