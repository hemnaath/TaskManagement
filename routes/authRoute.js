// authRoute.js
const express = require('express');
const passport = require('../helper/authHelper');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
  })
);
router.get('/success', authController.loginSuccess);
router.get('/failure', authController.loginFailure);

module.exports = router;
