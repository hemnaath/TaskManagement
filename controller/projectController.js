const Project = require('../model/projectModel');

const createProject = async(req, res)=>{
    const {projectName, projectManager, projectLead, projectMembers, status, timeline, effortEstimation, effortSpent, 
    completionDate} = req.body;
    const exists = await Project.findOne({where:{projectName}});
    if(exists){
        res.status(409).json({message:'Record exists'});
    }else{
        const creator = await Project.create({projectName, projectManager, projectLead, projectMembers, status, timeline, 
        effortEstimation, effortSpent, completionDate});
        res.status(200).json({message:'Project Created', creator});
    }
}

const getAllProject = async(req, res)=>{
    const getAll = await Project.find();
    if(getAll){
        return res.status(200).json(getAll);
    }
    return res.status(404).json('NoData');
}

const getProject = async(req, res)=>{
    const projectId = req.params.id;
    const getAll = await Project.findOne({_id:projectId});
    if(getAll){
        return res.status(200).json(getAll)
    }
    return res.status(404).json('No data');
}

const updateProject = async(req, res)=>{
    const projectId = req.params.id;
    const {projectName, projectManager, projectLead, projectMembers, status, timeline, effortEstimation, effortSpent, 
        completionDate} = req.body;
    const exists = await Project.findOne({_id:projectId});
    if(exists){
        const updater = await exists.updateOne({projectName, projectManager, projectLead, projectMembers, status, timeline, 
        effortEstimation, effortSpent, completionDate});
        return res.status(202).json('updated');
    }
    return res.status(404).json('No projects Found');
}

const deleteProject = async(req, res)=>{
    const projectId = req.params.id;
    const deleter = await Project.findOneAndDelete({_id:projectId});
    if(deleter){
        return res.status(200).json('Deleted');
    }
    return res.status(404).json('Nodata');
}



module.exports={
    createProject,getAllProject,getProject,updateProject,deleteProject,
}