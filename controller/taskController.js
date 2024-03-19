const Task = require('../model/taskModel');

const createTask = async(req, res)=>{
    const {user_id, team_id, project_id, task_type, reference_task_id, task_title, status, priority, effort_estimation, 
    description} = req.body;
    const exists = await Task.findOne({task_title});
    if(exists){
        res.status(409).json({message:'Record exists'});
    }else{
        if(req.body.task_type == 'CR'){
            console.log(req.file);
            const creator = await Task.create({user_id, team_id, project_id, task_type, reference_task_id, task_title, status, 
            priority, effort_estimation, description,
            functional_doc_name: req.file.originalname,
            functional_doc_path: req.file.path
            });
            res.status(200).json({message:'Task Created', creator});
        }else{
            const creator = await Task.create({user_id, team_id, project_id, task_type, reference_task_id, task_title, status, 
            priority, effort_estimation, description});
            res.status(200).json({message:'Task Created', creator});
        }
        
    }
}



module.exports={
    createTask,
}