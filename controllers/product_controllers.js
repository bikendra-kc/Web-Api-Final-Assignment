const Product=require("../models/productModel");
const ErrorHandler = require("../utils/error_handler");
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apifeatures");
const sendTokenReview = require("../utils/jwtToken");
const cloudinary = require("cloudinary")



//Create product for admin
exports.createproduct = catchAsyncError(async(req,res,next)=>{
    let images= [];
    if(typeof req.body.images == "string"){
        images.push(req.body.images)
    }
    else{
        images = req.body.images;
    }
    const imagesLink = [];
    for (let i = 0; i <images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder: "products"
        });
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLink;
    req.body.user = req.customer.id;
    
    const product = await Product.create(req.body);
        res.status(201).json({
            success:true,
            product
})
});


exports.getAllProducts= catchAsyncError(async(req,res,next)=>{
    // return next(new ErrorHandler("this is my error",500))
    const resultPerPage = 5;
    const productCount = await Product.countDocuments()
    const apifeatures = new ApiFeatures(Product.find(),req.query)
    .search().
    filter();

    let products = await apifeatures.query;
    let filteredProductsCount = products.length
    apifeatures.pagination(resultPerPage)
    products = await apifeatures.query.clone();
    
    res.status(200).json({
        success:true,
        products,
        resultPerPage,
        productCount,
        filteredProductsCount
    });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });


exports.getProductDetails=catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        status:true,
        product
    })
    
});
// Update Product
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message: "Product not found"
        })
    }
    let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify: false
    })
    res.status(200).json({
        success:true,
        product
    })
});

exports.deleteProduct =catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            status: false,
            message: "Product not found"
        })
    }
    //Delete Product From Cloudinary
    for(let i=0; i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.remove();
    res.status(200).json({
        status:true,
        message:"Product Deleted Successfully"
    })
});

//Creating the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    console.log(productId)
  
    const review = {
      user: req.customer._id,
      name: req.customer.name,
      rating: Number(rating),
      comment,
    };
    console.log(review)
  
    const product = await Product.findById(productId);
   
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.customer._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.customer._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
      console.log(isReviewed)
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
        success:true,
        review
    })
  });

  exports.getProductReviews = (async(req,res,next)=> {
      const product = await Product.findById(req.query.id);

      if(!product){
          return next(new Error("Product not found",404))
      }
      res.status(200).json({
          success: true,
          reviews: product.reviews
      })
  })

 // Delete Review
exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});