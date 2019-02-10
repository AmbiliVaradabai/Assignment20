const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    FirstName :String,
    LastName :String,
    SSINo:Number,
    Email:String
})
    
module.exports = mongoose.model('user', userSchema, 'users');
