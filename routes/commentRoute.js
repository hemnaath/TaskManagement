const commentController = require('../controller/commentController');
const express = require('express');
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


router.post('/create-comment/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), commentController.createComment);
router.patch('/update-comment/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), commentController.updateComment);
router.delete('/delete-comment/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), commentController.deleteComment);
router.get('/get-comment/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), commentController.getComment);

module.exports = router;