const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    orgName:{type:String, require:true},
    orgType:{type:String, require:true}
});

const org = mongoose.model('org', orgSchema);

module.exports=org;