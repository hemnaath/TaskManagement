const Task = require('../model/taskModel');

const createTask = async(req, res)=>{
    const {user_id, team_id, project_id, task_type, reference_task_id, dependencies, task_title, status, priority, timeline, 
    effort_estimation, effort_spent, completion_date,  release_version} = req.body;
    const exists = await Task.findOne({where:{task_title}});
    if(exists){
        res.status(409).json({message:'Record exists'});
    }else{
        const creator = await Task.create({user_id, team_id, project_id, task_type, reference_task_id, dependencies, task_title, status, priority, timeline, 
        effort_estimation, effort_spent, completion_date,  release_version});
        res.status(200).json({message:'Task Created', creator});
    }
}

const getAlltask = async(req, res)=>{
    const getAll = await Task.find();
    if(getAll){
        return res.status(200).json(getAll);
    }
    return res.status(404).json('NoData');
}

const getTask = async(req, res)=>{
    const taskId = req.params.id;
    const getAll = await Task.findOne({_id:taskId});
    if(getAll){
        return res.status(200).json(getAll)
    }
    return res.status(404).json('No data');
}

const updateTask = async(req, res)=>{
    const taskId = req.params.id;
    const {user_id, team_id, project_id, task_type, reference_task_id, dependencies, task_title, status, priority, timeline, 
        effort_estimation, effort_spent, completion_date,  release_version} = req.body;
    const exists = await Task.findOne({_id:taskId});
    if(exists){
        const updater = await exists.updateOne({user_id, team_id, project_id, task_type, reference_task_id, dependencies, 
        task_title, status, priority, timeline, effort_estimation, effort_spent, completion_date,  release_version});
        return res.status(202).json('updated');
    }
    return res.status(404).json('No Tasks Found');
}

const deleteTask = async(req, res)=>{
    const taskId = req.params.id;
    const deleter = await Task.findOneAndDelete({_id:taskId});
    if(deleter){
        return res.status(200).json('Deleted');
    }
    return res.status(404).json('Nodata');
}



module.exports={
    createTask,getAlltask,getTask,updateTask,deleteTask,
}