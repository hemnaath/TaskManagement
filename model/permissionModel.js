const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    role:{type:String},
    permission:{
    //user
        register:{type:Boolean, default:false},
        login:{type:Boolean, default:false},
        forget_password:{type:Boolean, default:false},
        reset_password:{type:Boolean, default:false},
        send_invite:{type:Boolean, default:false},
        invite_user:{type:Boolean, default:false},
        upload_dp:{type:Boolean, default:false},
        get_dp:{type:Boolean, default:false},
        assign_reporting_person:{type:Boolean, default:false},
        logout:{type:Boolean, default:false},
    //timesheet
        my_timesheet_data:{type:Boolean, default:false},
        team_timesheet_data:{type:Boolean, default:false},
    //org
        create_org:{type:Boolean, default:false},
        get_org:{type:Boolean, default:false},
        update_org:{type:Boolean, default:false},
        delete_org:{type:Boolean, default:false},
    //task
        create_task:{type:Boolean, default:false},
        update_task:{type:Boolean, default:false},
        delete_task:{type:Boolean, default:false},
        get_task:{type:Boolean, default:false},
        task_pagination:{type:Boolean, default:false},
    //project
        create_project:{type:Boolean, default:false},
        get_project:{type:Boolean, default:false},
        get_all_project:{type:Boolean, default:false},
        update_project:{type:Boolean, default:false},
        delete_project:{type:Boolean, default:false},
    //leave
        reset_leave:{type:Boolean, default:false},
        apply_leave:{type:Boolean, default:false},
        leave_request:{type:Boolean, default:false},
        approve_leave:{type:Boolean, default:false},
    //comment
        create_comment:{type:Boolean, default:false},
        update_comment:{type:Boolean, default:false},
        delete_comment:{type:Boolean, default:false},
        get_comment:{type:Boolean, default:false},
    //role
        add_role:{type:Boolean, default:false},
        delete_role:{type:Boolean, default:false},
    //permission
        set_permission:{type:Boolean, default:false},
    }
},
{
    timestamps:true
});

const permission = mongoose.model('permission', permissionSchema);

module.exports = permission;