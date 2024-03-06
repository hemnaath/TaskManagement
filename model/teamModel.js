const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    team_name:{type:String, require:true}
});

const Team = mongoose.model('team', teamSchema);

module.exports = Team;