const ErrorHandler = require("../utils/error_handler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken")

const Customer = require("../models/customerModel")

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to continue",401))
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.customer = await Customer.findById(decodedData.id);

    next();
})

exports.authorizedRole = (...roles) =>{
    return (req,res,next) => {
        if(!roles.includes(req.customer.role)){
           return next( new ErrorHandler(
                `Role: ${req.customer.role} do not have permission to access this resource`,403
            ));
        };
        console.log('as')
        next();
    }
}

exports.auth = async (req, res, next) => {

    // check header
  
    console.log("---------------------------------------------------");
  
   
  
    const authHeader = req.headers.authorization;
  
    console.log(authHeader);
  
  
  
    if (!authHeader || !authHeader.startsWith("Bearer")) {
  
   
  
      return next(new ErrorHandler("Please login to access the data", 400));
  
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
  
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);

        req.customer = await Customer.findById(decodedData.id);
  
       next();
  
     
  
    } catch (error) {
  
      console.log(error);
  
      throw next(new ErrorHandler("Please login to access the data", 400));
  
    }
  
   
  
  };