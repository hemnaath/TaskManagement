const express = require('express');
const orgController = require('../controller/orgController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const sessionStatus = require('../middleware/session');


const checkSession = async(req, res, next) =>{
    try{
        const sessionFlag = await sessionStatus(req, res);
        if(sessionFlag)
            next();
        else
            return res.status(401).json({error:'Unauthorized'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });


router.post('/create-org', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), orgController.createOrg);
router.get('/get-org', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), orgController.getOrg);
router.patch('/update-org/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), orgController.updateOrg);
router.delete('/delete-org/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), orgController.deleteOrg);

module.exports = router;