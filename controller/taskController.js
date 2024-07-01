const Task = require('../model/taskModel');
const Comment = require('../model/commentModel');

const createTask = async (req, res) => {
    const projectId = req.params.id;
    const { taskTitle, taskType } = req.body;
    try{
        const exists = await Task.findOne({task_title:taskTitle});
            if (exists)
                return res.status(400).json({message:'Task with the same title already exists'});
            else {
                const newTask = await Task.create({task_title:taskTitle, task_type:taskType, created_by:req.user.id, project_id:projectId});
                return res.status(201).json({message:'Task Created', newTask});
            }
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const updateTask = async(req, res) =>{
    const taskId = req.params.id;
    const { taskTitle, description, notes, filename, filepath, createdBy, assignedTo, priority, effortEstimation, status, releaseVersion, parentTask} = req.body;
    try {
        const exists = await Task.findById(taskId);
        if (exists) {
            if(status === 'accepted'){
                const startDate = new Date().toISOString().split('T')[0];
                await exists.updateOne({start_date:startDate});
            }
            const taskUpdates = await exists.updateOne({task_title:taskTitle, description:description, notes:notes, filename:req.file.originalname, filepath:req.file.path, created_by:req.user.id, assigned_to:assignedTo, priority:priority, effort_estimastion:effortEstimation, status:status, release_version:releaseVersion, parent_task:parentTask});
            return res.status(301).json({message:'Task updated', taskUpdates});
        } else {
            return res.status(400).json({ message: 'No task exists' });
        }
    } catch (error) {
        console.error(error);
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
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const getTask = async(req, res)=>{
    const taskId = req.params.id;
    try{
        const exists = await Task.findById(taskId);
        if(exists)
            return res.status(200).json(exists);
        else
            return res.status(404).json({message:'No task exists'});
    }catch(error){
        return res.status(500).json({error:'Internal server error'});
    }
}

module.exports={
    createTask,
    updateTask,
    deleteTask,
    getTask,
}