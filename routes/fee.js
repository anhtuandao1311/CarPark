const express = require('express')
const catchAsync = require('../utilities/catchAsync')
const { isAdmin } = require('../middleware.js')
const fee = require('../controllers/fee')
const router = express.Router()

router.get('/', isAdmin, catchAsync(fee.showFeeForm))

router.put('/', isAdmin, catchAsync(fee.updateFee))

module.exports = router