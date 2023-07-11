const express = require('express')
const catchAsync = require('../utils/catchAsync')
const Vehicle = require('../models/vehicle')
const { calculateTotalFee, getFormattedDate } = require('../utils/utilsFunction')

const router = express.Router({mergeParams:true})



router.get('/', catchAsync(async (req, res, next) => {
  let vehicles = []
  const currentDate = new Date()
  const tempVehicles = await Vehicle.find({})
  for (let tempVehicle of tempVehicles) {
    if (tempVehicle.enterTime.toLocaleDateString() === currentDate.toLocaleDateString()) {
      vehicles.push(tempVehicle)
    }
  }
  res.render('vehicles/index', { vehicles, method: req.method, totalFee: calculateTotalFee(vehicles) })
}))

router.post('/', catchAsync(async (req, res, next) => {
  const { type, status, enterdate: enterDate, leavedate: leaveDate } = req.body
  let vehicles = []
  const tempVehicles = await Vehicle.find({})
  if (enterDate || leaveDate) {
    if (enterDate && leaveDate) {
      for (let tempVehicle of tempVehicles) {
        if (tempVehicle.leaveTime) {
          if (tempVehicle.enterTime.toLocaleDateString() === getFormattedDate(enterDate) && tempVehicle.leaveTime.toLocaleDateString() === getFormattedDate(leaveDate)) {
            vehicles.push(tempVehicle)
          }
        }
      }
    }
    else if (enterDate) {
      for (let tempVehicle of tempVehicles) {
        if (tempVehicle.enterTime.toLocaleDateString() === getFormattedDate(enterDate)) {
          vehicles.push(tempVehicle)
        }
      }
    }
    else if (leaveDate) {
      for (let tempVehicle of tempVehicles) {
        if (tempVehicle.leaveTime) {
          if (tempVehicle.leaveTime.toLocaleDateString() === getFormattedDate(leaveDate)) {
            vehicles.push(tempVehicle)
          }
        }
      }
    }
  }

  if (type) {
    if (vehicles.length === 0) vehicles = vehicles.concat(await Vehicle.find({ vehicleType: type }))
    else vehicles = vehicles.filter(vehicle => vehicle.vehicleType === type)
  }

  if (status) {
    if (status === 'in') {
      if (vehicles.length === 0) vehicles = vehicles.concat(await Vehicle.find({ fee: { $exists: false } }))
      else vehicles = vehicles.filter(vehicle => !vehicle.fee)
    }
    else if (status === 'out') {
      if (vehicles.length === 0) vehicles = vehicles.concat(await Vehicle.find({ fee: { $exists: true } }))
      else vehicles = vehicles.filter(vehicle => vehicle.fee)
    }

  }


  if (!type && !enterDate && !leaveDate && !status) vehicles = vehicles.concat(await Vehicle.find({}))


  res.render('vehicles/index', { vehicles, method: req.method, vehicleType: type, status, totalFee: calculateTotalFee(vehicles) })
}))

module.exports = router