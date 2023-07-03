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

vehicleSchema.methods.getEnterTimeString = function () {
  const enterTime = this.enterTime;
  return enterTime.getDate() + "/"
    + (enterTime.getMonth() + 1) + "/"
    + enterTime.getFullYear() + " @ "
    + enterTime.getHours() + ":"
    + enterTime.getMinutes() + ":"
    + enterTime.getSeconds();
}

vehicleSchema.methods.getLeaveTimeString = function () {
  const leaveTime = this.enterTime;
  return leaveTime.getDate() + "/"
    + (leaveTime.getMonth() + 1) + "/"
    + leaveTime.getFullYear() + " @ "
    + leaveTime.getHours() + ":"
    + leaveTime.getMinutes() + ":"
    + leaveTime.getSeconds();
}

module.exports = mongoose.model('Vehicle', vehicleSchema) 
