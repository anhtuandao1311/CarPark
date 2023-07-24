const Fee = require('../models/fee')

module.exports.showFeeForm = async (req, res) => {
  const fee = await Fee.findOne({})
  res.render('vehicles/fee', { fee })
}

module.exports.updateFee = async (req, res) => {
  const { fourSeaterFee, sevenSeaterFee, truckFee } = req.body
  await Fee.findByIdAndUpdate('64be5b12a2a7b70d41219eff', { fourSeaterFee, sevenSeaterFee, truckFee })
  req.flash('success','Successfully update fee!')
  res.redirect('/fee')
}