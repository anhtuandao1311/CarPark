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

app.engine('ejs', ejsMate)

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
  const foundVehicle = await Vehicle.findOne({ licensePlate: license, fee: { $exists: false } })
  const feeRate = await getFeeRate(foundVehicle.vehicleType)
  const { enterTime } = foundVehicle
  const fee = calculateFee(enterTime, currentTime, feeRate)
  const leaveVehicle = await Vehicle.findOneAndUpdate({ licensePlate: license }, { fee: fee, leaveTime: currentTime }, { runValidators: true })
  res.redirect('/')
})



app.get('/vehicles', async (req, res) => {
  // const { fourseater: fourSeater, sevenseater: sevenSeater, truck } = req.query
  // let vehicles = []
  // if (fourSeater) {
  //   vehicles = vehicles.concat(await Vehicle.find({ vehicleType: 'Four Seater' }))
  // }
  // if (sevenSeater) {
  //   vehicles = vehicles.concat(await Vehicle.find({ vehicleType: 'Seven Seater' }))
  // }
  // if (truck) {
  //   vehicles = vehicles.concat(await Vehicle.find({ vehicleType: 'Truck' }))
  // }

  // if (!fourSeater && !sevenSeater && !truck) {
  //   const foundVehicles = await Vehicle.find({})
  //   vehicles = vehicles.concat(foundVehicles)
  // }
  let vehicles = []
  const currentDate = new Date()
  const tempVehicles = await Vehicle.find({})
  for (let tempVehicle of tempVehicles) {
      if (tempVehicle.enterTime.toLocaleDateString() === currentDate.toLocaleDateString()) {
        vehicles.push(tempVehicle)
      }
    }
  res.render('vehicles/index', { vehicles, method: req.method, totalFee: calculateTotalFee(vehicles) })
})

app.post('/vehicles', async (req, res) => {
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
})

app.listen(3000, () => {
  console.log('on port 3000')
})








// Utils


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


