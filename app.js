// Require libraries and frameworks
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

// Require modules
const Vehicle = require('./models/vehicle')
const Fee = require('./models/fee')

// Connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/netpower-car-park')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
  console.log('Database connected')
})


const app = express()

app.engine('ejs',ejsMate)

// Set view engine to open from different location
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))


// Parse request body
app.use(express.urlencoded({ extended: true }))

// Use method override
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  res.render('vehicles/home')
})


app.post('/', async (req, res) => {
  const currentTime = new Date()
  const { type, license } = req.body
  const vehicle = new Vehicle({ vehicleType: type, licensePlate: license, enterTime: currentTime })
  await vehicle.save()
  res.redirect('/')
})


app.patch('/', async (req, res) => {
  const currentTime = new Date()
  const { license } = req.body
  const foundVehicle = await Vehicle.findOne({ licensePlate: license, totalFee: { $exists: false } })
  const feeRate = await getFeeRate(foundVehicle.vehicleType)
  const { enterTime } = foundVehicle
  const totalFee = calculateTotalFee(enterTime, currentTime, feeRate)
  const leaveVehicle = await Vehicle.findOneAndUpdate({ licensePlate: license }, { totalFee: totalFee, leaveTime: currentTime }, { runValidators: true })
  res.redirect('/')
})



app.get('/vehicles', async (req, res) => {
  const { fourseater: fourSeater, sevenseater: sevenSeater, truck } = req.query
  const vehicles = []
  if (fourSeater) {
    vehicles.concat(await Vehicle.find({ vehicleType: 'Four Seater' }))
  }
  if (sevenSeater) {
    vehicles.concat(await Vehicle.find({ vehicleType: 'Seven Seater' }))
  }
  if (truck) {
    vehicles.concat(await Vehicle.find({ vehicleType: 'Truck' }))
  }

  if (!fourSeater && !sevenSeater && !truck) {
    const foundVehicles = await Vehicle.find({})
    vehicles.concat(foundVehicles)
  }
  res.render('vehicles/index', {vehicles})
})

app.listen(3000, () => {
  console.log('on port 3000')
})








// Utils


function calculateTotalFee(enterTime, leaveTime, fee) {
  const parkedHours = (leaveTime - enterTime) / 1000 / 60 / 60
  return Math.ceil(parkedHours / 24) * fee
}

async function getFeeRate(vehicleType) {
  const parkingFee = await Fee.findOne({})
  if (vehicleType === 'Four Seater') return parkingFee.fourSeaterFee
  else if (vehicleType === 'Seven Seater') return parkingFee.sevenSeaterFee
  return parkingFee.truckFee
}


