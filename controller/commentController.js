const db = require('../config/sqlConnector');

const createComment = (req, res)=>{
    const taskId = req.params.id;
    const {comment} = req.body;
    try{
        const commentSql = `INSERT INTO comment (comment, userId, taskId) VALUES (?,?,?)`;
        db.query(commentSql, [comment, res.locals.id, taskId]);
        return res.status(200).json('commented');
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const updateComment = (req, res)=>{
    const commentId = req.params.id;
    const {comment} = req.body;
    try{
        const finderSql = `SELECT * FROM comment WHERE id = ?`;
        db.query(finderSql, [commentId], (err, val)=>{
            if(val.length > 0){
                const updaterSql = `UPDATE comment SET comment = ? WHERE id = ?`;
                db.query(updaterSql, [comment, commentId]);
                return res.status(301).json('Comment Updated');
            }else{
                return res.status(404).json('No Comments Found');
            }
        })
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const deleteComment = (req, res)=>{
    const commentId = req.params.id;
    try{
        const finderSql = `SELECT * FROM comment WHERE id = ?`;
        db.query(finderSql, [commentId], (err, val)=>{
            if(val.length > 0){
                const deleterSql = `DELETE FROM comment WHERE id = ?`;
                db.query(deleterSql, [commentId]);
                return res.status(200).json('Comment Deleted');
            }else{
                return res.status(404).json('No Comments Found');
            }
        }); 
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
}