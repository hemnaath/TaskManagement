const User = require('../model/userModel');
const Leave = require('../model/leaveModel');

const resetLeave = async(req, res)=>{
    const {cl, sl, permission} = req.body;
    try{
        await User.updateMany({}, {$set:{casual_leave:cl, sick_leave:sl, permission:permission}});
        return res.status(200).json({message:'Leave updated'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const applyLeave = async(req, res)=>{
    const {leave_type, applying_on, reason, emergency_contact} = req.body;
    try{
        const finder = await User.findById(res.locals.id);
        if (finder) {
            const finderObj = finder.toObject();
            for(let key in finderObj){
                if(key === leave_type){
                    if(finderObj[key] >=1){
                        const apply = await Leave.create({leave_type, applying_on, status:'pending', reason, emergency_contact, applied_by:res.locals.id});
                        return res.status(200).json({message:'Leave applied', apply});
                    }else{
                        return res.status(400).json({message:'No more' + ' ' + `${leave_type}`});
                    }
                }
            }
        }else{
            return res.status(404).json({message:'User not Found'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const leaveRequest = async (req, res) => {
    try {
        const downLine = await User.find({ reporting_person: res.locals.id });
        const leaveRequests = await Leave.find({ applied_by: { $in: downLine.map(user => user.id) } });
        if(leaveRequests){
            return res.status(200).json(leaveRequests);
        }
        return res.status(404).json({message:'No Leave requests found'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const approveLeave = async(req, res)=>{
    const leaveId = req.params.id;
    try{
        const exists = await Leave.findById(leaveId);
        if(exists){
            const userId = exists.applied_by;
            const leaveType = exists.leave_type;
            exists.status = 'approved';
            await exists.save();
            const userExists = await User.findById(userId);
            if(userExists){
                userExists[leaveType] -= 1;
                await userExists.save();
            }
            return res.status(301).json({message:'Leave Approved'});
        }
        return res.status(404).json({messsage:'User not Found'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}



module.exports = {
    resetLeave,
    applyLeave,
    leaveRequest,
    approveLeave,
}