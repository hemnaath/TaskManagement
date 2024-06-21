const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, require:true},
    username:{type: String, require:true, unique:true},
    password:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    role:{type:String, require:true},
    org_id:{type:mongoose.Schema.Types.ObjectId, default:null},
    reporting_person:{type:mongoose.Schema.Types.ObjectId, default:null},
    filename:{type:String, default:null},
    filepath:{type:String, default:null},
    casual_leave:{type:Number, default:null},
    sick_leave:{type:Number, default:null},
    permission:{type:Number, default:null},
    isVerified: { type: Boolean, default: false },
},
{
    timestamps:true
});

const user = mongoose.model('user', userSchema);

module.exports = user;