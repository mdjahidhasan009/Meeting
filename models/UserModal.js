const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: 'Name is required!'
        },
        username: {
            type: String,
            require: 'Username is required!',
            unique: true
        },
        email: {
            type: String,
            require: 'Email is required!'
        },
        password: {
            type: String,
            require: 'Password is required!'
        }
    }
);

module.exports = mongoose.model('User', userSchema);
