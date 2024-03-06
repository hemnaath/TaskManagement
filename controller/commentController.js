const Comment = require('../model/commentModel');

const createComment = async(req, res)=>{
    const {user_id, task_id, comment} = req.body;
    const creator = await Comment.create({user_id, task_id, comment});
    res.status(200).json({message:'Comment Created', creator});
}

const getAllComment = async(req, res)=>{
    const getAll = await Comment.find();
    if(getAll){
        return res.status(200).json(getAll);
    }
    return res.status(404).json('NoData');
}

const getComment = async(req, res)=>{
    const commentId = req.params.id;
    const getAll = await Comment.findOne({_id:commentId});
    if(getAll){
        return res.status(200).json(getAll)
    }
    return res.status(404).json('No data');
}

const updateComment = async(req, res)=>{
    const commentId = req.params.id;
    const {user_id, task_id, comment} = req.body;
    const exists = await Comment.findOne({_id:commentId});
    if(exists){
        const updater = await exists.updateOne({user_id, task_id, comment});
        return res.status(202).json('updated');
    }
    return res.status(404).json('No comments Found');
}

const deleteComment = async(req, res)=>{
    const commentId = req.params.id;
    const deleter = await Comment.findOneAndDelete({_id:commentId});
    if(deleter){
        return res.status(200).json('Deleted');
    }
    return res.status(404).json('Nodata');
}



module.exports={
    createComment,
    getAllComment,
    getComment,
    updateComment,
    deleteComment
}