const Fee = require('../models/fee')

module.exports.showFeeForm = async (req, res) => {
  const fee = await Fee.findOne({})
  res.render('vehicles/fee', { fee })
}

module.exports.updateFee = async (req, res) => {
  const { fourSeaterFee, sevenSeaterFee, truckFee } = req.body
  await Fee.findByIdAndUpdate('64a284625f2ea50b51433604', { fourSeaterFee, sevenSeaterFee, truckFee })
  req.flash('success','Successfully update fee!')
  res.redirect('/fee')
}