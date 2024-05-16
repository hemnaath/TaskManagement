const { ObjectId } = require('mongodb');
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

const getComment = async (req, res) => {
    const taskId = req.params.id;
    try {
        const exists = await Comment.find({ task_id: taskId });
        if(exists){
            for(let key in exists){
                const userId = exists[key].user_id;
                const localId = new ObjectId(res.locals.id);
                if(userId.equals(localId) || res.locals.role === 'admin'){
                    exists[key]._doc.isDeletable = true;
                }else{
                    exists[key]._doc.isDeletable = false;
                }
            }
            return res.status(200).json(exists);
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