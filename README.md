# TaskManagement

# API
---------------------------------------
http://localhost:1731/user/register (POST) //User Registration
http://localhost:1731/user/login (POST) //User Login
http://localhost:1731/user/logout (POST) //User Logout
http://localhost:1731/user/invite (POST) //User Invite
http://localhost:1731/user/dp-upload (POST) //Upload Pic
http://localhost:1731/user/get-dp (GET) //Get Picture

http://localhost:1731/email/send (POST) //Email Send
http://localhost:1731/user/verify-otp (POST) // OTP Verification

http://localhost:1731/org/create (POST) //Create Organization
http://localhost:1731/org/get-org (GET) //Get Organization

http://localhost:1731/project/create (POST) //Create Project
http://localhost:1731/project/get-all (GET) //Get All Projects
http://localhost:1731/project/update/:id (PUT)(project_id) //Update Project
http://localhost:1731/project/delete/:id (DELETE)(project_id) //Delete Project
http://localhost:1731/project/get-project/:id (GET)(project_id) //Get Project By Id

http://localhost:1731/task/create/:id (POST)(project_id) //Create Task
http://localhost:1731/task/update/:id (PUT)(task_id) //Update Task
http://localhost:1731/task/delete/:id (DELETE)(task_id) //Delete Task
http://localhost:1731/task/task-pagination (GET) //Pagination

http://localhost:1731/comment/create/:id (POST)(task_id) //Create Comment
http://localhost:1731/comment/update/:id (PUT)(comment_id) //Update Comment
http://localhost:1731/comment/delete/:id (DELETE)(comment_id) //Delete Comment


# FEATURES

create comment
update comment
delete comment

create org
get org

create project
update project
get project
delete project
get all project

create task
update task
delete task
pagination

login
register
logout
uploadDP
getDP
invite user
verify otp