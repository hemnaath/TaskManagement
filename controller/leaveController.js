const User = require('../model/userModel');
const Leave = require('../model/leaveModel');

const resetLeave = async(req, res)=>{
    const {cl, sl, permission} = req.body;
    try{
        await User.updateMany({}, {$set:{casual_leave:cl, sick_leave:sl, permission:permission}});
        return res.status(200).json('Leave updated');
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const applyLeave = async(req, res)=>{
    const {leave_type, applied_on, reason, emergency_contact} = req.body;
    try{
        const finder = await User.findOne({_id:res.locals.id});
        if (finder) {
            const finderObj = finder.toObject();
            for(let key in finderObj){
                if(key === leave_type){
                    if(finderObj[key] >=1){
                        const apply = await Leave.create({leave_type, applied_on, status:'pending', reason, emergency_contact, applied_by:res.locals.id});
                        return res.status(200).json({message:'Leave applied', apply});
                    }else{
                        return res.status(400).json('No more' + ' ' + `${leave_type}`);
                    }
                }
            }
        }else{
            return res.status(404).json('User not Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const approveLeave = async(req, res)=>{
    const leaveId = req.params.id;
    const {status} = req.body;
    try{
        let approvalFlag = false;
        if(status === 'approved' || status === 'Approved'){
            approvalFlag = true;
        }
        const exists = await Leave.findOne({_id:leaveId});
        if(exists && approvalFlag){
            const userId = exists.applied_by;
            const leave_type = exists.leave_type;
            const userExists = await User.findOne({_id:userId})
            if(userExists){
                userExists[leave_type] -=1;
                await userExists.save();
            }
            exists[status] = status;
            await exists.save();
            return res.status(200).json('Leave approved');
        }else{
            return res.status(404).json('Leave does not exists');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}


module.exports = {
    resetLeave,
    applyLeave,
    approveLeave,
}