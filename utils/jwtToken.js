const sendToken = (customer, statusCode, res) => {
    const token = customer.getJWTTOKEN();
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      customer,
      token,
    });
  };


  
  module.exports = sendToken;
  