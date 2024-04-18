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
http://localhost:1731/project/get-project/:id (GET)(project_id) //Get Project By Id

http://localhost:1731/task/create/:id (POST)(project_id) //Create Task
http://localhost:1731/task/update/:id (PUT)(task_id) //Update Task
http://localhost:1731/task/delete/:id (DELETE)(task_id) //Delete Task
http://localhost:1731/task/task-pagination (GET) //Pagination

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
13.Pagination

# SQL

CREATE DATABASE TaskManagement;
CREATE TABLE org (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orgName VARCHAR(255) NOT NULL,
    orgType VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectName VARCHAR(255) NOT NULL,
    createdBy INT NOT NULL,
    orgId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(projectName)
);
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    orgId INT,
    filename VARCHAR(255),
    filepath VARCHAR(255),
    filetype VARCHAR(255),
    filesize VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(username),
    UNIQUE(email)
);
CREATE TABLE otp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    otp INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE ip (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ipAddress VARCHAR(255) NOT NULL,
    userId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    notes VARCHAR(255),
    assigne INT,
    status VARCHAR(255),
    createdBy INT,
    priority VARCHAR(255),
    releaseVersion VARCHAR(255),
	startDate TIMESTAMP,
    effortEstimation INT,
    taskNo VARCHAR(255),
    taskType VARCHAR(255),
    projectId INT,
    filename VARCHAR(255),
    filepath VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE comment (
	id INT AUTO_INCREMENT PRIMARY KEY,
    comment VARCHAR(255),
    userId INT,
    taskId INT
);
