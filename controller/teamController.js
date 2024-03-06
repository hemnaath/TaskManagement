const Team = require('../model/teamModel');

const createTeam = async(req, res)=>{
    const {team_name} = req.body;
    const exists = await Team.findOne({where:{team_name}});
    if(exists){
        res.status(409).json({message:'Record exists'});
    }else{
        const creator = await Team.create({team_name});
        res.status(200).json({message:'Team Created', creator});
    }
}

const updateTeam = async(req, res)=>{
    const userId = req.params.id;
    const {team_name} = req.body;
    const exists = await Team.findOne({_id:userId});
    if(exists){
        const updater = await exists.updateOne({team_name})
        return res.status(200).json('Team Updated');
    }
    return res.status(404).json('No user Found');
}

const deleteTeam = async(req, res)=>{
    const teamId = req.params.id;
    const deleter = await Team.findByIdAndDelete({_id:teamId});
    if(deleter){
        return res.status(200).json('Team Deleted');
    }
    return res.status(404).json('No Team Found');
}

const getAllTeam = async(req, res)=>{
    const getAll = await Team.find();
    if(getAll){
        return res.status(200).json(getAll);
    }
    return res.status(404).json('No Teams Found');
}

const getTeamById = async(req, res)=>{
    const teamId = req.params.id;
    const getAll = await Team.findOne({_id:teamId});
    if(getAll){
        return res.status(200).json(getAll);
    }
    return res.status(404).json('No data');
}



module.exports={
    createTeam,
    updateTeam,
    deleteTeam,
    getAllTeam,
    getTeamById
}