const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [25, "Name cannot exceed 25 characters"],
        minlength: [3, "Name should have atleast 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [7, "Password should be minimum 8 characters"],
        select: false
    },
    role: {
        type: String,
        default: "user",
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

customerSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

customerSchema.methods.getJWTTOKEN = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


customerSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

customerSchema.methods.getResetPasswordToken = function() {
    //generating token no.
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire =
        Date.now() + 15 * 60 * 1000;
    return resetToken;
}



module.exports = mongoose.model("Customer", customerSchema)