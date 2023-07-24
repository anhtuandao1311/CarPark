const Vehicle = require('../models/vehicle')
const { calculateFee, getFeeRate } = require('../utilities/utilsFunction')

module.exports.showHomePage = (req, res) => {
  res.render('vehicles/home')
}

module.exports.newVehicle = async (req, res, next) => {
  const currentTime = new Date()
  const { type, license } = req.body
  const vehicle = new Vehicle({ vehicleType: type, licensePlate: license, enterTime: currentTime })
  await vehicle.save()
  req.flash('success', `${vehicle.licensePlate} entered successfuly!`)
  res.redirect('/')
}

module.exports.exitVehicle = async (req, res, next) => {
  const currentTime = new Date()
  const { license } = req.body
  const foundVehicle = await Vehicle.findOne({ licensePlate: license, fee: { $exists: false } })
  if (foundVehicle) {
    const feeRate = await getFeeRate(foundVehicle.vehicleType)
    const { enterTime } = foundVehicle
    const fee = calculateFee(enterTime, currentTime, feeRate)
    const leaveVehicle = await Vehicle.findOneAndUpdate({ licensePlate: license }, { fee: fee, leaveTime: currentTime }, { runValidators: true })
    req.flash('success', `${leaveVehicle.licensePlate} left. Price: $${fee}`)

  } else {
    req.flash('error', `${license} does not exist or left. Please try again.`)
  }
  res.redirect('/')
}