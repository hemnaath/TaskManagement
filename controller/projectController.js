const Project = require('../model/projectModel');
const User = require('../model/userModel');
const Task = require('../model/taskModel');
const Comment = require('../model/commentModel');

const createProject = async(req, res)=>{
    const {projectName} = req.body;
    try{
        const exists = await Project.findOne({project_name:projectName});
        if(exists){
            return res.status(409).json({message:'Record exists'});
        }else{
            const orgFinder = await User.findById(res.locals.id);
            const newProject = await Project.create({project_name:projectName, created_by:res.locals.id, org_id:orgFinder.org_id});
            return res.status(200).json({message:'Project Created', newProject});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const getAllProjects = async(req, res) => {
    try{
        const exists = await Project.find({created_by:res.locals.id}).sort({createdAt:-1});
        if(exists){
            return res.status(200).json(exists);
        }else{
            return res.status(404).json({message:'No projects found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    } 
}

const updateProject = async (req, res)=>{
    const projectId = req.params.id;
    const{projectName} = req.body;
    try{
        const exists = await Project.findById(projectId);
        if(exists){
            await exists.updateOne({$set:{project_name:projectName}});
            return res.status(301).json({message:'Project Updated'});
        }else{
            return res.status(404).json({message:'No Projects Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const deleteProject = async (req, res)=>{
    const projectId = req.params.id;
    try{
        const exists = await Project.findById(projectId);
        if(exists){
            await Task.deleteMany({project_id:projectId});
            await Comment.deleteMany({project_id:projectId});
            await exists.deleteOne();
            return res.status(200).json({message:'Project Deleted'});
        }else{
            return res.status(404).json({message:'No Project Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const getProjectById = async (req, res)=>{
    const projectId = req.params.id;
    try{
        const exists = await Project.findById(projectId);
        if(exists){
            return res.status(200).json(exists);
        }else{
            return res.status(404).json({message:'No Projects Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    } 
}



module.exports={
    createProject,getAllProjects,updateProject, deleteProject,getProjectById,
}