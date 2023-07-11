const express = require('express')
const catchAsync = require('../utils/catchAsync')
const { calculateFee, getFeeRate } = require('../utils/utilsFunction')
const { vehicleSchema } = require('../requestValidationSchemas')
const Vehicle = require('../models/vehicle')

const router = express.Router()




const validateVehicle = (req, res, next) => {
  const { error } = vehicleSchema.validate(req.body)
  if (error) {
    const message = error.details.map(ele => ele.message).join(',')
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}

router.get('/', (req, res) => {
  res.render('vehicles/home')
})


router.post('/', validateVehicle, catchAsync(async (req, res, next) => {
  const currentTime = new Date()
  const { type, license } = req.body
  const vehicle = new Vehicle({ vehicleType: type, licensePlate: license, enterTime: currentTime })
  await vehicle.save()
  req.flash('success', `${vehicle.licensePlate} entered successfuly!`)
  res.redirect('/')
}))


router.patch('/', catchAsync(async (req, res, next) => {
  const currentTime = new Date()
  const { license } = req.body
  const foundVehicle = await Vehicle.findOne({ licensePlate: license, fee: { $exists: false } })
  if (foundVehicle) {
    const feeRate = await getFeeRate(foundVehicle.vehicleType)
    const { enterTime } = foundVehicle
    const fee = calculateFee(enterTime, currentTime, feeRate)
    const leaveVehicle = await Vehicle.findOneAndUpdate({ licensePlate: license }, { fee: fee, leaveTime: currentTime }, { runValidators: true })
    req.flash('success', `${leaveVehicle.licensePlate} left. Price: ${leaveVehicle.fee}`)

  } else {  
    req.flash('error', `${license} does not exist or left. Please try again.`)
  }
  res.redirect('/')

}))


module.exports = router