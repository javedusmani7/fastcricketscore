const express = require('express');
const router = express.Router();
const rateLimitter = require('../middleware/rateLimitter');
const verifyToken = require('../middleware/verifyToken');
const userController = require('../controllers/user');


router.post('/login', rateLimitter.loginRateLimitter, userController.login);
router.post('/signup',rateLimitter.registerLimitter,verifyToken.verifyToken, userController.signup);
router.get('/getUserDetails',verifyToken.verifyToken,userController.getUserDetails);
router.get('/getUsersData',verifyToken.verifyToken,userController.getUsersData);
router.put('/updateUser/:id',verifyToken.verifyToken,userController.updateUser);

module.exports = router;