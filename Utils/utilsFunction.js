const Fee = require('../models/fee')

function getFormattedDate(date) {
  let splitDate = date.split('/')
  splitDate = splitDate.map(function (elem) {
    return parseInt(elem)
  })
  return `${splitDate[0]}/${splitDate[1]}/${splitDate[2]}`
}

function calculateFee(enterTime, leaveTime, fee) {
  const parkedHours = (leaveTime - enterTime) / 1000 / 60 / 60
  return Math.ceil(parkedHours / 24) * fee
}

function calculateTotalFee(objectArray) {
  let totalFee = 0
  for (let object of objectArray) {
    if (object.fee) totalFee += object.fee
  }
  return totalFee
}


async function getFeeRate(vehicleType) {
  const parkingFee = await Fee.findOne({})
  if (vehicleType === 'Four Seater') return parkingFee.fourSeaterFee
  else if (vehicleType === 'Seven Seater') return parkingFee.sevenSeaterFee
  return parkingFee.truckFee
}

module.exports ={
  getFormattedDate,
  calculateFee,
  calculateTotalFee,
  getFeeRate
}