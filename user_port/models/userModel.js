const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema({
    email: {
    type: String,
    required: [true, 'Email required'],
    validate: {
        validator: isEmail,
        message: props => `${props.value} is not a valid`
    }
    },
    
    password: {
    type: String,
    required: [true, 'Password required'],
    validate: {
        validator: function (value) {
            return value.length >= 6
    },
        message: () => 'must be at least six characters long'
    }
    }
    })
    
    module.exports = mongoose.model('User', userSchema)