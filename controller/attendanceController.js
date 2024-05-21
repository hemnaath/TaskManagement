const Attendance = require('../model/attendanceModel');

const checkIn = async(req, res)=>{
    try{
        const currentDate = new Date().toLocaleDateString();
        await Attendance.create({date:currentDate, user_id:res.locals.id, status:'PRESENT'});
        return res.status(200).json({message:'Attendance recorded'});
    }catch(error){
        return res.status(500).json({error:'Attendance already recorded'});
    }
}


module.exports = {
    checkIn,
}