const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    org_name:{type:String, require:true},
    org_type:{type: String, require:true},

},
{
    timestamps:true
});

const org = mongoose.model('org', orgSchema);

module.exports = org;