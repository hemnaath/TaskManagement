const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, require:true},
    username:{type: String, require:true, unique:true},
    password:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    filename:{type:String},
    filepath:{type:String},
    filetype:{type:String},
    filesize:{type:String}
});

const user = mongoose.model('user', userSchema);

module.exports = user;