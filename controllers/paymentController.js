const catchAsyncError = require("../middleware/catchAsyncError");

const stripe = require("stripe")("sk_test_51LHVGsC4uIJGIUxCV3KG3Pg7VPAEMRntXPn7mAwtBqehKkt1RAA4Oxl5czMphH2lfxnIlgZQWaKpZlf1WL4VKgBa000h5nU8Vx");

//Stripe payment processing
exports.processPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "npr",
    metadata: {
      company: "NabaNepalVegetable",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: "pk_test_51LHVGsC4uIJGIUxCLgn0V0O9DDJqLq55UUo7oGq5RFVpBsqSXyyqDasHp5ZGjoFwZncCkpu0I8BIGoaLgToYnc2500p5khjDqk" });
});