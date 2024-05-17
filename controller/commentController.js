const { ObjectId } = require('mongodb');
const Comment = require('../model/commentModel');

const createComment = async(req, res)=>{
    const taskId = req.params.id;
    const {comment} = req.body;
    try{
        const newComment = await Comment.create({comment, user_id:res.locals.id, task_id:taskId});
        return res.status(200).json({message:'commented', newComment});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const updateComment = async (req, res)=>{
    const commentId = req.params.id;
    const {comment} = req.body;
    try{
        const exists = await Comment.findById(commentId);
        if(exists){
            await exists.updateOne({$set:{comment}});
            return res.status(301).json({message:'Comment Updated'});
        }else{
            return res.status(404).json({message:'No Comments Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const deleteComment = async (req, res)=>{
    const commentId = req.params.id;
    try{
        const exists = await Comment.findById(commentId);
        if(exists){
            await exists.deleteOne();
            return res.status(200).json({message:'Comment Deleted'});
        }else{
            return res.status(404).json({message:'No Comments Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const getComment = async (req, res) => {
    const taskId = req.params.id;
    try {
        const exists = await Comment.find({ task_id: taskId });
        if(exists){
            const localId = ObjectId.createFromHexString(res.locals.id);
            exists.forEach(element => {
                const userId = element.user_id;
                if(userId.equals(localId) || res.locals.role === 'admin'){
                    element._doc.isDeletable = true;
                }else{
                    element._doc.isDeletable = false;
                }
            });
            return res.status(200).json(exists);
        }else{
            return res.status(404).json({message:'No comments found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal server error'});
    }
}




module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment,
}