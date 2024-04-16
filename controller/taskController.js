const db = require('../config/sqlConnector');

const createTask = (req, res) => {
    const projectId = req.params.id;
    let assignedTo = null;
    const { title, description, notes, assigne, status, priority, releaseVersion, taskType, effortEstimation } = req.body;
    if (!req.file || !req.file.originalname || !req.file.path) {
        return res.status(400).json('File not uploaded or invalid file');
    }
    const existsSql = `SELECT id FROM task WHERE title = ?`;
    db.query(existsSql, [title], (err, val) => {
        if (val.length > 0) {
            return res.status(400).json('Task with the same title already exists');
        } else {
            const findUserSql = `SELECT id FROM user WHERE username LIKE ?`;
            db.query(findUserSql, [`${assigne}%`], (err, values)=>{
                assignedTo = values[0].id;
                const creatorSql = `INSERT INTO task (title, description, notes, assigne, status, createdBy, priority, releaseVersion, effortEstimation, taskType, projectId, filename, filepath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                db.query(creatorSql, [title, description, notes, assignedTo, status, res.locals.id, priority, releaseVersion, effortEstimation, taskType, projectId, req.file.originalname, req.file.path], (err, value) => {
                    const taskNum = taskType + '_' + value.insertId;
                    const taskNumberSql = `UPDATE task SET taskNo = ? WHERE id = ?`;
                    db.query(taskNumberSql, [taskNum, value.insertId], (err) => {
                        return res.status(201).json('Task Created');
                    });
                });
            });
        }
    });
};


const updateTask = (req, res) => {
    const taskId = req.params.id;
    let assignedTo = null;
    let startDate = null;
    const { title, description, notes, assigne, status, priority, releaseVersion, taskType, effortEstimation } = req.body;
    if (!req.file || !req.file.originalname || !req.file.path) {
        return res.status(400).json('File not uploaded or invalid file');
    }
    const existsSql = `SELECT id FROM task WHERE title = ?`;
    db.query(existsSql, [title], (err, val) => {
        if (val.length > 0) {
            return res.status(400).json('Task with the same title already exists');
        } else {
            if(status === 'Accepted'){
                startDate = new Date();
            }
            const findUserSql = `SELECT id FROM user WHERE username LIKE ?`;
            db.query(findUserSql, [`${assigne}%`], (err, values)=>{
                assignedTo = values[0].id;
                const updaterSql = `UPDATE task SET title=?, description = ?, notes = ?, assigne = ?, status = ?, createdBy = ?, priority = ?, releaseVersion = ?, startDate = ?, effortEstimation = ?, taskType = ?, filename = ?, filepath = ? WHERE id = ?`
                db.query(updaterSql, [title, description, notes, assignedTo, status, res.locals.id, priority, releaseVersion, startDate, effortEstimation, taskType, req.file.originalname, req.file.path, taskId]);
                return res.status(201).json('Task Updated');
            });
        }
    });
};

const deleteTask = (req, res)=>{
    const taskId = req.params.id;
    const taskFinderSql = `SELECT * FROM task WHERE id = ?`;
    db.query(taskFinderSql, [taskId], (err, val)=>{
        if(val.length > 0){
            const deleterSql = `DELETE FROM task WHERE id = ?`;
            db.query(deleterSql, [taskId]);
            return res.status(200).json('Task Deleted');
        }
    })
}

module.exports={
    createTask,
    updateTask,
    deleteTask,
}