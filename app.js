// Require libraries and frameworks
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

// Require modules
const Vehicle = require('./models/vehicle')
const catchAsync = require('./Utils/catchAsync')
const ExpressError = require('./Utils/expressError')
const { calculateFee, calculateTotalFee, getFeeRate, getFormattedDate } = require('./Utils/utilsFunction')
const { vehicleSchema } = require('./requestValidationSchemas')

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

const validateVehicle = (req, res, next) => {
  const { error } = vehicleSchema.validate(req.body)
  if (error) {
    const message = error.details.map(ele => ele.message).join(',')
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}

app.get('/', (req, res) => {
  res.render('vehicles/home')
})


app.post('/', validateVehicle, catchAsync(async (req, res, next) => {
  const currentTime = new Date()
  const { type, license } = req.body
  const vehicle = new Vehicle({ vehicleType: type, licensePlate: license, enterTime: currentTime })
  await vehicle.save()
  res.redirect('/')
}))


app.patch('/', catchAsync(async (req, res, next) => {
  const currentTime = new Date()
  const { license } = req.body
  const foundVehicle = await Vehicle.findOne({ licensePlate: license, fee: { $exists: false } })
  const feeRate = await getFeeRate(foundVehicle.vehicleType)
  const { enterTime } = foundVehicle
  const fee = calculateFee(enterTime, currentTime, feeRate)
  const leaveVehicle = await Vehicle.findOneAndUpdate({ licensePlate: license }, { fee: fee, leaveTime: currentTime }, { runValidators: true })
  res.redirect('/')
}))



app.get('/vehicles', catchAsync(async (req, res, next) => {
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

app.post('/vehicles', catchAsync(async (req, res, next) => {
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

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Something Went Wrong'
  res.status(statusCode).render('errors/error', { err })
})

app.listen(3000, () => {
  console.log('on port 3000')
})





