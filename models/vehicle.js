const mongoose = require('mongoose')
const Schema = mongoose.Schema


const vehicleSchema = new Schema({
  vehicleType: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  enterTime: {
    type: Date,
    required: true
  },
  totalFee: Number,
  leaveTime: Date
})

module.exports = mongoose.model('Vehicle', vehicleSchema) 
