const mongoose = require('mongoose')
const Schema  = mongoose.Schema


const FeeSchema = new Schema({
  fourSeaterFee:{
    type:Number,
    required:true,
    default:5
  },
  sevenSeaterFee:{
    type:Number,
    required:true,
    default:7
  },
  truckFee:{
    type:Number,
    required:true,
    default:9
  }
})


module.exports = mongoose.model('Fee',FeeSchema)

