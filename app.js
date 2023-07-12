// Require libraries and frameworks
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// Require modules
const Vehicle = require('./models/vehicle')
const User = require('./models/user')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const { calculateTotalFee, getFormattedDate } = require('./utils/utilsFunction')

const homeRoutes = require('./routes/home')
const vehiclesRoutes = require('./routes/vehicles')
const userRoutes = require('./routes/user')

// Connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/netpower-car-park')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

// make Express app
const app = express()

//  Set engine to make layouts
app.engine('ejs', ejsMate)

// Set view engine to open from different location
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// Parse request body
app.use(express.urlencoded({ extended: true }))

// Use method override
app.use(methodOverride('_method'))

// Config session
const sessionConfig = {
  secret: 'anhtuan1311',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

// Passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// Use required routes
app.use('/', homeRoutes)
app.use('/', userRoutes)
app.use('/vehicles', vehiclesRoutes)

// 404
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Something Went Wrong'
  res.status(statusCode).render('errors/error', { err })
})


// App start up
app.listen(3000, () => {
  console.log('on port 3000')
})





