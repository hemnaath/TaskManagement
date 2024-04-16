const db = require('../config/sqlConnector');

const createOrg = (req, res) => {
    const { orgName, orgType } = req.body;
    const findOrgSql = `SELECT id FROM org WHERE orgName = ?`;
    db.query(findOrgSql, [orgName], (err, value) => {
        if (value.length > 0) {
            return res.status(400).json({ message: 'Org Exists' });
        } else {
            const createOrgSql = `INSERT INTO org (orgName, orgType) VALUES (?, ?)`;
            db.query(createOrgSql, [orgName, orgType], (err, values) => {
                const orgId = values.insertId;
                const userId = res.locals.id;
                const updater = `UPDATE user SET orgId = ? WHERE id = ?`;
                db.query(updater, [orgId, userId], (err, updaterResult) => {
                    return res.status(201).json({ message: 'Org Created' });
                });
            });
        }
    });
}

const getOrg = (req, res)=>{
    const orgGetterSql = `SELECT org.orgName FROM user JOIN org ON org.id = user.orgId WHERE user.id = ?`;
    db.query(orgGetterSql, [res.locals.id], (err, val)=>{
        if(val.length < 0){
            return res.status(404).json('No Organization Found');
        }else{
            return res.status(200).json({'orgName':val[0].orgName})
        }
    });
}

module.exports = {
    createOrg,
    getOrg,
}
