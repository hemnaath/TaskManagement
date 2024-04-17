const db = require('../config/sqlConnector');


const createProject = async(req, res)=>{
    const {projectName} = req.body;
    const finderSql = `SELECT id FROM project WHERE projectName = ?`;
    db.query(finderSql, [projectName], (err, exists)=>{
        if(exists.length > 0){
            return res.status(409).json({message:'Record exists'});
        }else{
            const creatorSql = `INSERT INTO project (projectName, createdBy, orgId) VALUES (?,?,?)`;
            db.query(creatorSql, [projectName, res.locals.id, res.locals.orgId]);
            return res.status(200).json({message:'Project Created'});
        }
    });
}

const getAllProjects = async(req, res) => {
    const finderSql = `SELECT id, projectName FROM project WHERE createdBy = ?`;
    db.query(finderSql, [res.locals.id], (err, val)=>{
        if(val.length > 0){
            return res.status(200).json(val);
        }else{
            return res.status(404).json('No projects found');
        }
    });
}

const updateProject = (req, res)=>{
    const projectId = req.params.id;
    const{projectName} = req.body;
    const finderSql = `SELECT * FROM project WHERE id = ?`;
    db.query(finderSql, [projectId], (err, val)=>{
        if(val.length > 0){
            const updaterSql = `UPDATE project SET projectName = ? WHERE id = ?`;
            db.query(updaterSql, [projectName, projectId]);
            return res.status(301).json('Project Updated');
        }
    });
}

const deleteProject = (req, res)=>{
    const projectId = req.params.id;
    const finderSql = `SELECT * FROM project WHERE id = ?`;
    db.query(finderSql, [projectId], (err, val)=>{
        if(val.length > 0){
            const deleterSql = `DELETE FROM project WHERE id = ?`;
            db.query(deleterSql, [projectId]);
            return res.status(200).json('Project Deleted');
        }
    });
}



module.exports={
    createProject,getAllProjects,updateProject, deleteProject,
}