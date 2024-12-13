const express = require('express');
const router = express.Router();
const rateLimitter = require('../middleware/rateLimitter');
const verifyToken = require('../middleware/verifyToken');
const userController = require('../controllers/user');


router.post('/login', rateLimitter.loginRateLimitter, userController.login);
router.post('/signup',rateLimitter.registerLimitter,  userController.signup);
router.get('/getUserDetails',userController.getUserDetails);
router.get('/getUsersData',userController.getUsersData);

module.exports = router;