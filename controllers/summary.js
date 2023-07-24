const Vehicle = require('../models/vehicle')

module.exports.showSummaryForm = (req, res) => {
  res.render('vehicles/summary',{method:req.method})
}

module.exports.getSummary = async (req, res) => {
  const { month, year } = req.body
  const vehicles = await Vehicle.find()
  const filteredVehicles = []

  let sumEnterVehicles = 0
  let sumEnterFourSeat = 0
  let sumEnterSevenSeat = 0
  let sumEnterTruck = 0

  let sumLeaveVehicles = 0
  let sumLeaveFourSeat = 0
  let sumLeaveSevenSeat = 0
  let sumLeaveTruck = 0


  if (month) {
    for (let vehicle of vehicles) {
      let enterDateArr = vehicle.enterTime.toLocaleString('en-US',{timeZone:'Asia/Bangkok'}).slice(0, 10).trim().slice(0, -1).split('/')
      const splitDate = month.split('-')
      for (let i = 0; i < splitDate.length; i++) {
        splitDate[i] = parseInt(splitDate[i])
      }
      for (let i = 0; i < enterDateArr.length; i++) {
        enterDateArr[i] = parseInt(enterDateArr[i])
      }

      if (enterDateArr[0] === splitDate[0] && enterDateArr[2] === splitDate[1]) {
        sumEnterVehicles += 1
        if (vehicle.vehicleType === 'Four Seater') sumEnterFourSeat += 1
        else if (vehicle.vehicleType === 'Seven Seater') sumEnterSevenSeat += 1
        else sumEnterTruck += 1

      }
      if (vehicle.leaveTime) {
        const leaveDateArr = vehicle.leaveTime.toLocaleString('en-US',{timeZone:'Asia/Bangkok'}).slice(0, 10).trim().slice(0, -1).split('/')
        for (let i = 0; i < leaveDateArr.length; i++) {
          leaveDateArr[i] = parseInt(leaveDateArr[i])
        }

        if (leaveDateArr[0] === splitDate[0] && leaveDateArr[2] === splitDate[1]) {
          sumLeaveVehicles += 1
          if (vehicle.vehicleType === 'Four Seater') sumLeaveFourSeat += 1
          else if (vehicle.vehicleType === 'Seven Seater') sumLeaveSevenSeat += 1
          else sumLeaveTruck += 1
        }
      }
    }
  }
  else if (year){
    for (let vehicle of vehicles) {
      let enterDateArr = vehicle.enterTime.toLocaleString('en-US',{timeZone:'Asia/Bangkok'}).slice(0, 10).trim().slice(0, -1).split('/')
      const splitDate = parseInt(year)
      for (let i = 0; i < enterDateArr.length; i++) {
        enterDateArr[i] = parseInt(enterDateArr[i])
      }

      if (enterDateArr[2] === splitDate) {
        sumEnterVehicles += 1
        if (vehicle.vehicleType === 'Four Seater') sumEnterFourSeat += 1
        else if (vehicle.vehicleType === 'Seven Seater') sumEnterSevenSeat += 1
        else sumEnterTruck += 1

      }
      if (vehicle.leaveTime) {
        const leaveDateArr = vehicle.leaveTime.toLocaleString('en-US',{timeZone:'Asia/Bangkok'}).slice(0, 10).trim().slice(0, -1).split('/')
        for (let i = 0; i < leaveDateArr.length; i++) {
          leaveDateArr[i] = parseInt(leaveDateArr[i])
        }

        if (leaveDateArr[2] === splitDate) {
          sumLeaveVehicles += 1
          if (vehicle.vehicleType === 'Four Seater') sumLeaveFourSeat += 1
          else if (vehicle.vehicleType === 'Seven Seater') sumLeaveSevenSeat += 1
          else sumLeaveTruck += 1
        }
      }
    }
  }

  res.render('vehicles/summary',{sumEnterFourSeat,sumEnterSevenSeat,sumEnterTruck,sumEnterVehicles,sumLeaveFourSeat,sumLeaveSevenSeat,sumLeaveTruck,sumLeaveVehicles,month,year,method: req.method})


}