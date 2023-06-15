const ErrorHandler = require("../utils/error_handler")
const catchAsyncError = require("../middleware/catchAsyncError");
const Customer = require("../models/customerModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

//Register a user
exports.registerUser=catchAsyncError( async(req,res,next)=>{
    const {name,email,password} = req.body;
   
    const customer = await Customer.create(
        {
            name,email,password
        }
    )

   sendToken(customer,201,res);
})

// Login a user
exports.loginCustomer = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400));
    }
    const customer =await Customer.findOne({email}).select("+password");

    if(!customer){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    const passwordMatch = await customer.comparePassword(password);
   
    if(!passwordMatch){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    sendToken(customer,200,res);
});


exports.logout = catchAsyncError(async (req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//     const user = await Customer.findOne({ email: req.body.email });
  
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }
  
//     // Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();
    
//     await user.save({ validateBeforeSave: false });
  
//     const resetPasswordUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/api/v1/reset/password/${resetToken}`;

  
//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} `;
  
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: `Password Recovery`,
//         message,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${user.email} successfully`,
//       });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
  
//       await user.save({ validateBeforeSave: false });
  
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await Customer.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

  exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = Customer.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user){
      return next(new ErrorHandler("Reset password token is invalid or expired",404))
    }
    if(req.body.password!=req.body.confirmPassword){
      return next(new ErrorHandler("Password does not match",404))
    }
    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);
  })

  exports.getAllCustomers = catchAsyncError(async (req, res, next) => {
    const users = await Customer.findById(req.customer.id);
  
    res.status(200).json({
      success: true,
      "customer":users,
    });
  });

  exports.changePassword = catchAsyncError(async (req, res, next) => {
    const customer = await Customer.findById(req.customer.id).select("+password");
    console.log(customer)
  
    const isPasswordMatched = await customer.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
  
    customer.password = req.body.newPassword;
  
    await customer.save();
  
    sendToken(customer, 200, res);
  });

  exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await Customer.findByIdAndUpdate(req.customer.id,newUserData,{
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    res.status(200).json({
      success: true,
      user
    })
  })
  
  exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await Customer.find();
    res.status(200).json({
      succcess:true,
      users

    })
  })

  exports.getParticularUser = catchAsyncError(async(req,res,next)=>{
    const user = await Customer.findById(req.params.id);
    if(!user){
      return next(new Error(`User does not exist with id: ${req.params.body}`))
    }
    res.status(200).json({
      succcess: true,
      user
    })
  })

// Updating the user role
  exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await Customer.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });

  // Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await Customer.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});