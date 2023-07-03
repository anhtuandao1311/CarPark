const mongoose = require('mongoose')
const Schema  = mongoose.Schema


const FourSeaterCarSchema = new Schema({
  feePerDay: Number,
  totalFee: Number,
  licensePlate: Number,
  enterTime:Date,
  leaveTime:Date
})


module.exports = mongoose.model('FourSeaterCar',FourSeaterCarSchema)