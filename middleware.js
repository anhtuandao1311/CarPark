const { vehicleSchema } = require('./schemas.js');
const ExpressError = require('./utils/expressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

module.exports.validateVehicle = (req,res,next)=>{
    const {error}=vehicleSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}


module.exports.isAdmin = async (req, res, next) => {
    if (!req.user || (req.user && !req.user.isAdmin)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/`);
    }
    next();
}
