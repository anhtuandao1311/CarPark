const express = require('express')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware.js')
const summary = require('../controllers/summary')
const router = express.Router()

router.get('/', isLoggedIn, summary.showSummaryForm)

router.post('/', isLoggedIn, catchAsync(summary.getSummary))

module.exports = router