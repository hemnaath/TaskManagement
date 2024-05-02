const Project = require('../model/projectModel');
const User = require('../model/userModel');

const createProject = async(req, res)=>{
    const {projectName} = req.body;
    try{
        const exists = await Project.findOne({project_name:projectName});
        if(exists){
            return res.status(409).json({message:'Record exists'});
        }else{
            const orgFinder = await User.findOne({_id:res.locals.id});
            await Project.create({project_name:projectName, created_by:res.locals.id, org_id:orgFinder.org_id});
            return res.status(200).json({message:'Project Created'});
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const getAllProjects = async(req, res) => {
    try{
        const exists = await Project.find({created_by:res.locals.id});
        if(exists){
            return res.status(200).json(exists);
        }else{
            return res.status(404).json('No projects found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    } 
}

const updateProject = async (req, res)=>{
    const projectId = req.params.id;
    const{projectName} = req.body;
    try{
        const exists = await Project.findOne({_id:projectId});
        if(exists){
            await exists.updateOne({$set:{project_name:projectName}});
            return res.status(301).json('Project Updated');
        }else{
            return res.status(404).json('No Projects Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const deleteProject = async (req, res)=>{
    const projectId = req.params.id;
    try{
        const exists = await Project.findOne({_id:projectId});
        if(exists){
            await exists.deleteOne();
            return res.status(200).json('Project Deleted');
        }else{
            return res.status(404).json('No Project Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const getProjectById = async (req, res)=>{
    const projectId = req.params.id;
    try{
        const exists = await Project.findOne({_id:projectId});
        if(exists){
            return res.status(200).json(exists);
        }else{
            return res.status(404).json('No Projects Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    } 
}



module.exports={
    createProject,getAllProjects,updateProject, deleteProject,getProjectById,
}