const Log = require('../model/logModel');

const createLog = async(req, res)=>{
    const {user_id, task_id, assigned_user_id, log, is_read} = req.body;
    const creator = await Log.create({user_id, task_id, assigned_user_id, log, is_read});
    res.status(200).json({message:'Log Created', creator});
}

const getAllLog = async(req, res)=>{
    const getAll = await Log.find();
    if(getAll){
        return res.status(200).json(getAll);
    }
    return res.status(404).json('NoData');
}

const getLog = async(req, res)=>{
    const logId = req.params.id;
    const getAll = await Log.findOne({_id:logId});
    if(getAll){
        return res.status(200).json(getAll)
    }
    return res.status(404).json('No data');
}

const updateLog = async(req, res)=>{
    const logId = req.params.id;
    const {user_id, task_id, assigned_user_id, log, is_read} = req.body;
    const exists = await Log.findOne({_id:logId});
    if(exists){
        const updater = await exists.updateOne({user_id, task_id, assigned_user_id, log, is_read});
        return res.status(202).json('updated');
    }
    return res.status(404).json('No logs Found');
}

const deleteLog = async(req, res)=>{
    const logId = req.params.id;
    const deleter = await Log.findOneAndDelete({_id:logId});
    if(deleter){
        return res.status(200).json('Deleted');
    }
    return res.status(404).json('Nodata');
}


module.exports={
    createLog,getAllLog,getLog,updateLog,deleteLog
}