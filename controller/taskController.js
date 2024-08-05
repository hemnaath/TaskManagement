const Task = require('../model/taskModel');
const Comment = require('../model/commentModel');
const Project = require('../model/projectModel');
const serverFileHelper = require('../helper/serverFileHelper');




const createTask = async (req, res) => {
    const projectId = req.params.id;
    const { taskTitle, taskType } = req.body;
    try{
        const findProject = await Project.findById(projectId);
        if(findProject){
            const exists = await Task.findOne({task_title:taskTitle});
            if (exists)
                return res.status(400).json({message:'Task with the same title already exists'});
            else {
                const newTask = await Task.create({task_title:taskTitle, task_type:taskType, created_by:req.user.id, project_id:projectId});
                const taskIdentifier = taskType + '-' + newTask.task_number;
                await serverFileHelper.createDirectory(taskIdentifier);
                return res.status(201).json({message:'Task Created', newTask});
            }
        }else
            return res.status(404).json({message:'No projects found'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { taskTitle, description, notes, assignedTo, priority, effortEstimation, status, releaseVersion, parentTask } = req.body;
    try {
        const exists = await Task.findById(taskId);
        if (exists) {
            if (req.file) {
                const fileName = Date.now() + '_' + req.file.originalname
                const buffer = req.file.buffer;
                const s3Key = `uploads/task/${exists.task_type}-${exists.task_number}/${fileName}`;
                const s3Url = await serverFileHelper.uploadFileToS3(buffer, s3Key);
                const newAttachment = {filename: fileName, filepath: s3Url};
                const taskUpdate = await exists.updateOne({$set: {task_title: taskTitle, description, notes, assigned_to: assignedTo, 
                priority, effort_estimation: effortEstimation, status, release_version: releaseVersion, parent_task: parentTask}, $push: { attachments: newAttachment },});
                return res.status(200).json({ message: 'Task updated with new attachment', taskUpdate });
            } else {
                const taskUpdate = await exists.updateOne({$set: {task_title: taskTitle, description, notes, assigned_to: assignedTo, 
                priority, effort_estimation: effortEstimation, status, release_version: releaseVersion, parent_task: parentTask}});
                return res.status(200).json({ message: 'Task updated without new attachment', taskUpdate });
            }
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
            const taskIdentifier = exists.task_type + '-' + exists.task_number;
            await Comment.deleteMany({task_id:taskId});
            const childTask = await Task.find({parent_task:taskId});
            for(let key of childTask){
                const childTaskIdentifier = key.task_type + '-' + key.task_number;
                await serverFileHelper.deleteDirectory(childTaskIdentifier);
                await key.deleteOne();
            }
            await exists.deleteOne();
            await serverFileHelper.deleteDirectory(taskIdentifier);
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