const db = require('../config/sqlConnector');

const createComment = (req, res)=>{
    const taskId = req.params.id;
    const {comment} = req.body;
    const commentSql = `INSERT INTO comment (comment, userId, taskId) VALUES (?,?,?)`;
    db.query(commentSql, [comment, res.locals.id, taskId]);
    return res.status(200).json('commented');
}

const updateComment = (req, res)=>{
    const commentId = req.params.id;
    const {comment} = req.body;
    const updaterSql = `UPDATE comment SET comment = ? WHERE id = ?`;
    db.query(updaterSql, [comment, commentId]);
    return res.status(301).json('Comment Updated');
}

const deleteComment = (req, res)=>{
    const commentId = req.params.id;
    const deleterSql = `DELETE FROM comment WHERE id = ?`;
    db.query(deleterSql, [commentId]);
    return res.status(200).json('Comment Deleted');
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
}