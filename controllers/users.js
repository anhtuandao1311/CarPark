const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
  res.render('users/register')
}

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = new User({ username })
    const registeredUser = await User.register(user, password)
    req.flash('success', 'Successfully create user!')
    res.redirect('/')

  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/register')
  }
}

module.exports.renderLogin = (req, res) => {
  res.render('users/login')
}

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!')
  res.redirect('/')
}

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
  })
  res.redirect('/login')
}