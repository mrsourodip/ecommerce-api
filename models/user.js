const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
});

// before saving, we want to hash the password before storing it in DB
UserSchema.pre('save', async function () {
    // console.log('hey there')
    // console.log(this.modifiedPaths())
    // console.log(this.isModified('name'))
    if (this.isModified('password'))
    {
        console.log('Password is modified, proceeding to hashing!');
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

// this is an instance function that only exists after the instance is called in the router
UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);
