# TaskManagement

# API
---------------------------------------
http://localhost:1731/user/register (POST) //User Registration
http://localhost:1731/user/login (POST) //User Login
http://localhost:1731/user/logout (POST) //User Logout
http://localhost:1731/user/invite (POST) //User Invite

http://localhost:1731/email/send (POST) //Email Send
http://localhost:1731/user/verify-otp (POST) // OTP Verification

http://localhost:1731/org/create (POST) //Create Organization

http://localhost:1731/project/create (POST) //Create Project
http://localhost:1731/project/get-all (GET) //Get All Projects
http://localhost:1731/project/update/:id (PUT)(project_id) //Update Project
http://localhost:1731/project/delete/:id (DELETE)(project_id) //Delete Project

http://localhost:1731/task/create/:id (POST)(project_id) //Create Task
http://localhost:1731/task/update/:id (PUT)(task_id) //Update Task
http://localhost:1731/task/delete/:id (DELETE)(task_id) //Delete Task

http://localhost:1731/comment/create/:id (POST)(task_id) //Create Comment
http://localhost:1731/comment/update/:id (PUT)(comment_id) //Update Comment
http://localhost:1731/comment/delete/:id (DELETE)(comment_id) //Delete Comment


# FEATURES

1.Login
2.Register
3.Org
4.Project
5.Image
6.Invite User
7.Logout
8.Two-Factor Auth for Untrusted Devices
9.Oauth
10.IP Recording
11.Task
12.Comments
