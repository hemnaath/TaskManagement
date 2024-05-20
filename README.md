# TaskManagement

# API
---------------------------------------
http://localhost:1731/user/register (POST)
http://localhost:1731/account/verification (GET)
http://localhost:1731/user/login (POST)
http://localhost:1731/user/forget-password (POST)
http://localhost:1731/user/reset-password (PUT)
http://localhost:1731/user/logout (POST)

http://localhost:1731/org/create (POST)
http://localhost:1731/org/get-org (GET)
http://localhost:1731/org/update/:orgId (PUT)
http://localhost:1731/org/delete/:orgId (DELETE)

http://localhost:1731/project/create (POST)
http://localhost:1731/project/update/:projectId (PUT)
http://localhost:1731/project/delete/:projectId (DELETE)

http://localhost:1731/task/create/:projectID (POST)
http://localhost:1731/task/task-pagination/:projectId (GET)
http://localhost:1731/task/update/:taskId (PUT)
http://localhost:1731/task/delete/:taskId (DELETE)


# FEATURES

Login
Register
Account verification
Forget password
Reset password
Logout

Create organization
Get organization details
Update organization
Delete organization

Create project
Update project
Delete project

Create task
Update task
Delete task
Get task with pagination