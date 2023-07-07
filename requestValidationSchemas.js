const Joi = require('joi')

const vehicleSchema = Joi.object({
  license: Joi.string().required(),
  type: Joi.string().valid('Four Seater', 'Seven Seater', 'Truck').required()
})

module.exports = {
  vehicleSchema
}