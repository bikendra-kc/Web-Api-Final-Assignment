const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter the product name"],
        trim: true
    },
    description:{
        type: String
    },
    price: {
        type: Number,
        required: [true,"Please enter the product price"],
        maxLength: [8,"Price cannot exceed 8 characters"]
    },
    ratings:{
        type: Number,
        default: 0
    },
    Stock: {
        type: Number,
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
      },
    numOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            user: {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Customer",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    images:[{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type:String,
            required: true
        }
    }
],
    category:{
        type:String,
        required:true
    },

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required: true
    }

})

module.exports = mongoose.model("Product",productSchema)