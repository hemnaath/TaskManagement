const Comment = require('../model/commentModel');

const createComment = async(req, res)=>{
    const taskId = req.params.id;
    const {comment} = req.body;
    try{
        const newComment = await Comment.create({comment, user_id:res.locals.id, task_id:taskId});
        return res.status(200).json({message:'commented', newComment});
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const updateComment = async (req, res)=>{
    const commentId = req.params.id;
    const {comment} = req.body;
    try{
        const exists = await Comment.findOne({_id:commentId});
        if(exists){
            await exists.updateOne({$set:{comment}});
            return res.status(301).json('Comment Updated');
        }else{
            return res.status(404).json('No Comments Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const deleteComment = async (req, res)=>{
    const commentId = req.params.id;
    try{
        const exists = await Comment.findOne({_id:commentId});
        if(exists){
            await exists.deleteOne();
            return res.status(200).json('Comment Deleted');
        }else{
            return res.status(404).json('No Comments Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const getComment = async(req, res)=>{
    const taskId = req.params.id;
    let isDeletable = false;
    try{
        const exists = await Comment.findOne({task_id:taskId});
        if(exists){
            if(exists.user_id === res.locals.id || res.locals.role === 'admin'){
                isDeletable = true;
            }
            return res.status(200).json({exists, isDeletable});
        }else{
            return res.status(404).json('No comments found');
        }
    }catch(error){
        return res.status(500).json('Internal server error');
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment,
}