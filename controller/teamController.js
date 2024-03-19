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



module.exports={
    createTeam,
}