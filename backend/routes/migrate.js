const express = require('express');
const { getMigrateOldData } = require('../controllers/migrate.controller');
const router = express.Router();


// routes for the migrateOldData actions
router.get('/migrateOldData', getMigrateOldData);

module.exports = router;
