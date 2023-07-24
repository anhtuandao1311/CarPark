const express = require('express');
const User = require('../models/user');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { isAdmin } = require('../middleware.js')

router.get('/register', isAdmin, users.renderRegister)

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin)

router.post('/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;