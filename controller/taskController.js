const db = require('../config/sqlConnector');

const createTask = (req, res) => {
    const projectId = req.params.id;
    let assignedTo = null;
    const { title, description, notes, assigne, status, priority, releaseVersion, taskType, effortEstimation } = req.body;
    try{
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
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}


const updateTask = (req, res) => {
    const taskId = req.params.id;
    let assignedTo = null;
    let startDate = null;
    const { title, description, notes, assigne, status, priority, releaseVersion, taskType, effortEstimation } = req.body;
    try{
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
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const deleteTask = (req, res)=>{
    const taskId = req.params.id;
    try{
        const taskFinderSql = `SELECT * FROM task WHERE id = ?`;
        db.query(taskFinderSql, [taskId], (err, val)=>{
            if(val.length > 0){
                const deleterSql = `DELETE FROM task WHERE id = ?`;
                db.query(deleterSql, [taskId]);
                return res.status(200).json('Task Deleted');
            }else{
                return res.status(404).json('No Tasks Found');
            }
        });
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const taskPagination = (req, res)=>{
    const {page, limit} = req.body;
    const offset = (page - 1) * limit;
    try{
        const paginationSql = `SELECT * FROM task limit ? offset ?`;
        db.query(paginationSql, [limit, offset], (err, val)=>{
            const totalDataSql = `SELECT COUNT(*) AS count FROM task`;
            db.query(totalDataSql, null, (err, vals)=>{
                const totalPages = Math.ceil(vals[0].count/limit);
                const endIndex = (page * limit);
                const startIndex = endIndex - ((limit - 10) + 9);
                const displayData = [{'startIndex':startIndex, 'endIndex':endIndex}];
                return res.status(200).json({val, totalPages, limit, page, 'totalData':vals[0].count, 'displayData':displayData});
            })
        });
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

module.exports={
    createTask,
    updateTask,
    deleteTask,
    taskPagination,
}