const Task = require('../model/taskModel');
const User = require('../model/userModel');

const createTask = async (req, res) => {
    const projectId = req.params.id;
    let assignedTo = null;
    const { taskTitle, description, notes, assigned, status, priority, releaseVersion, taskType, effortEstimation } = req.body;
    try{
        if (!req.file || !req.file.originalname || !req.file.path) {
            return res.status(400).json('File not uploaded or invalid file');
        }
        const exists = await Task.findOne({task_title:taskTitle});
            if (exists) {
                return res.status(400).json('Task with the same title already exists');
            } else {
                const findUser = await User.findOne({ username:assigned});
                assignedTo = findUser._id;
                await Task.create({task_title:taskTitle, description, notes, assigned_to:assignedTo, status, created_by:res.locals.id, priority, release_version:releaseVersion, effort_estimation:effortEstimation, task_type:taskType, project_id:projectId, filename:req.file.originalname, filepath:req.file.path});
                return res.status(201).json('Task Created');
            }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}


const updateTask = async (req, res) => {
    const taskId = req.params.id;
    let assignedTo = null;
    let startDate = null;
    const { taskTitle, description, notes, assigned, status, priority, releaseVersion, effortEstimation } = req.body;
    try{
        if (!req.file || !req.file.originalname || !req.file.path) {
            return res.status(400).json('File not uploaded or invalid file');
        }
        const exists = await Task.findOne({_id:taskId});
        if(exists) {
            if(status === 'Accepted'){
                startDate = new Date();
            }
            const findUser = await User.findOne({ username:assigned});
            assignedTo = findUser._id;
            await exists.updateOne({$set:{task_title:taskTitle, description, notes, assigned_to:assignedTo, status, created_by:res.locals.id, priority, release_version:releaseVersion, start_date:startDate, effort_estimation:effortEstimation, filename:req.file.originalname, filepath:req.file.path}});
            return res.status(201).json('Task Updated');
        }else {
            return res.status(400).json('No task exists');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const deleteTask = async(req, res)=>{
    const taskId = req.params.id;
    try{
        const exists = await Task.findOne({_id:taskId});
        if(exists){
            await exists.deleteOne();
            return res.status(200).json('Task Deleted');
        }else{
            return res.status(404).json('No Tasks Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const taskPagination = async (req, res)=>{
    const {page, limit} = req.body;
    const skip = (page - 1) * limit;
    try{
        const pagination = await Task.find().skip(skip).limit(limit);
        const totalData = await Task.countDocuments();
        const totalPages = Math.ceil(totalData/limit);
        const endIndex = (page * limit);
        const startIndex = endIndex - ((limit - 10) + 9);
        const displayData = [{'startIndex':startIndex, 'endIndex':endIndex}];
        return res.status(200).json({pagination, totalPages, limit, page, totalData, displayData});
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

module.exports={
    createTask,
    updateTask,
    deleteTask,
    taskPagination,
}