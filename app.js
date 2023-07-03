// Require libraries and frameworks
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

// Require modules
const Car = require('./models/car')

// Connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/netpower-car-park')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection error:'))
db.once('open',()=>{
  console.log('Database connected')
})


const app = express()

// Set view engine to open from different location
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


// Parse request body
app.use(express.urlencoded({extended:true}))



app.get('/',(req,res)=>{
  res.render('cars/home')
})


app.post('/',async(req,res)=>{
  res.send(req.body)
  const currentDate = new Date();
  currentDate.setHours(dt1.getHours()+20)
  currentDate.setMinutes(dt1.getMinutes()+40)
  const {type,license} = req.body
  if (type === '4'){
    const fourSeater = new Car({licensePlate:license,enterTime:currentDate})
  }
})

app.listen(3000,()=>{
  console.log('on port 3000')
})








