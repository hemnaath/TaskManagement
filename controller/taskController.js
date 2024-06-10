const Task = require('../model/taskModel');
const User = require('../model/userModel');
const Comment = require('../model/commentModel');
const Org = require('../model/orgModel');

const createTask = async (req, res) => {
    const projectId = req.params.id;
    const { taskTitle, taskType } = req.body;
    try{
        const exists = await Task.findOne({task_title:taskTitle});
            if (exists) {
                return res.status(400).json({message:'Task with the same title already exists'});
            } else {
                const newTask = await Task.create({task_title:taskTitle, task_type:taskType, created_by:req.user.id, project_id:projectId});
                return res.status(201).json({message:'Task Created', newTask});
            }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const updateTask = async(req, res) =>{
    const taskId = req.params.id;
    let assignedTo = null;
    let startDate = null;
    const { taskTitle, description, notes, assigned, status, priority, releaseVersion, effortEstimation, parentTask } = req.body;
    try {
        if (!req.file || !req.file.originalname || !req.file.path) {
            return res.status(400).json({ message: 'File not uploaded or invalid file' });
        }
        const exists = await Task.findById(taskId);
        if (exists) {
            if (status === 'Accepted') {
                startDate = new Date().toISOString().split('T')[0];
            }
            const findUser = await User.findOne({ username: assigned });
            assignedTo = findUser.id;
            await exists.updateOne({ $set: { task_title: taskTitle, description, notes, assigned_to: assignedTo, status, created_by: req.user.id, priority, release_version: releaseVersion, start_date: startDate, effort_estimation: effortEstimation, parent_task:parentTask, filename: req.file.originalname, filepath: req.file.path } });
            return res.status(201).json({ message: 'Task Updated' });
        } else {
            return res.status(400).json({ message: 'No task exists' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteTask = async(req, res)=>{
    const taskId = req.params.id;
    try{
        const exists = await Task.findById(taskId);
        if(exists){
            await Comment.deleteMany({task_id:taskId});
            await Task.deleteMany({parent_task:taskId});
            await exists.deleteOne();
            return res.status(200).json({message:'Task Deleted'});
        }else{
            return res.status(404).json({message:'No Tasks Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const taskPagination = async (req, res)=>{
    const projectId = req.params.id;
    const {page, limit} = req.body;
    const skip = (page - 1) * limit;
    try{
        const pagination = await Task.find({project_id:projectId}).skip(skip).limit(limit);
        const totalData = await Task.countDocuments({project_id:projectId});
        const totalPages = Math.ceil(totalData/limit);
        const endIndex = (page * limit);
        const startIndex = endIndex - ((limit - 10) + 9);
        const displayData = [{'startIndex':startIndex, 'endIndex':endIndex}];
        return res.status(200).json({pagination, totalPages, limit, page, totalData, displayData});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const getTask = async(req, res)=>{
    const taskId = req.params.id;
    try{
        const exists = await Task.findById(taskId);
        if(exists){
            const userData = await User.findById(exists.created_by);
            const orgPrefix = await Org.findById(req.user.org);
            return res.status(200).json({
                id:exists.id,
                taskTitle:exists.task_title,
                description:exists.description,
                notes:exists.notes,
                assignedTo:exists.assigned_to,
                status:exists.status,
                createdBy:userData.username,
                priority:exists.priority,
                releaseVersion:exists.release_version,
                startDate:exists.start_date,
                effortEstimation : exists.effort_estimastion,
                filename:exists.filename,
                taskNumber:orgPrefix.org_prefix+'-'+exists.task_number,
            });
        }
    }catch(error){
        return res.status(500).json({error:'Internal server error'});
    }
}

module.exports={
    createTask,
    updateTask,
    deleteTask,
    taskPagination,
    getTask,
}