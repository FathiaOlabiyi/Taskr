# Taskr

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express.js](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

Taskr is a backend application for managing projects and tasks. It provides tools for creating projects, organizing tasks, inviting team members, assigning responsibilities, and controlling access through a robust Role-Based Access Control (RBAC) system.

The application is built using modern backend development practices including JWT authentication, Google OAuth, background job processing with Agenda, structured logging, centralized error handling, and secure API design.

---

## Table of Contents

- [Overview](#overview)
- [Live Deployment](#live-deployment)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

# Overview

Managing projects requires much more than simply creating tasks.

Teams need secure authentication, project organization, invitation workflows, member management, role-based permissions, and reliable communication between users.

Taskr combines these capabilities into a modular backend system that can serve as the foundation of a modern project management platform.

---

# Live Deployment

**Base API URL**

https://taskr-api.up.railway.app

**API Documentation**

https://taskr-api.onrender.com/api-docs

> **Note:** This project is a backend service. Use the base API URL together with the documented endpoints to interact with the application.

---

# Features

## Authentication & Security

- JWT Authentication
- User Registration
- Secure Login
- Email Verification
- Forgot Password
- Password Reset
- Google OAuth Authentication
- Secure Password Hashing
- Request Validation using Joi

---

## Project Management

- Create Projects
- Update Projects
- Delete Projects
- View Project Details
- Manage Project Lifecycle

---

## Team Collaboration

- Invite Members via Email
- Accept Invitations
- Reject Invitations
- Revoke Invitations
- Schedule Invitations
- Member Management
- Role Assignment

---

## Task Management

- Create Tasks
- Update Tasks
- Delete Tasks
- Assign Tasks
- Unassign Tasks
- Search Tasks
- Filter Tasks
- Track Task Progress

---

## Role-Based Access Control (RBAC)

Taskr implements Role-Based Access Control to ensure users only perform actions they are authorized to perform.

Default project roles include:

- Owner
- Project Manager
- Member
- Viewer

Permissions are enforced throughout the application before protected operations are executed.

---

# Technology Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT (JSON Web Tokens)
- Passport.js
- Google OAuth

## Validation

- Joi

## File Storage

- Cloudinary
- Multer

Used for uploading and managing user profile pictures.

## Email

- Nodemailer

Used for:

- Email Verification
- Password Reset
- Project Invitations

## Background Jobs

- Agenda

Used for scheduling invitation emails.

## Logging

- Winston

Used for structured application logging and debugging.

---

# Architecture

Taskr follows a modular, feature-based architecture where each domain manages its own controllers, routes, services, and models.

Core backend practices implemented include:

- JWT Authentication
- Google OAuth
- Role-Based Access Control (RBAC)
- Centralized Error Handling
- Request Validation
- Background Job Processing
- Email Workflows
- Structured Logging

---

# Project Structure

```text
src/

├── Admin/
├── auth/
├── config/
├── invitations/
├── logger/
├── logs/
├── members/
├── middlewares/
├── projects/
├── tasks/
├── uploads/
├── users/
└── utils/
```

---

# Main Functionalities

## User Management

- Register using Email
- Register using Google
- Login
- Google Login
- Verify Email
- Update Profile
- Upload Profile Picture
- Reset Password
- Delete Account

---

## Project Management

- Create Projects
- Update Projects
- Delete Projects
- View Projects
- View Project Details
- Manage Project Status

---

## Invitation Workflow

- Create Invitations
- Send Invitation Emails
- Schedule Invitations
- Accept Invitations
- Reject Invitations
- Revoke Invitations
- Automatic Invitation Expiration
- View Invitations

---

## Task Management

- Create Tasks
- Update Tasks
- Assign Tasks
- Unassign Tasks
- Delete Tasks
- Search Tasks
- Filter Tasks
- Manage Task Status

---

## Member Management

- View Members
- Remove Members
- Leave Projects

---

## Access Control

Every protected operation is validated using project roles and permissions to ensure proper authorization.

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/FathiaOlabiyi/taskr.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file.

```env
PORT=

MONGODB_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

FRONTEND_URL=

APP_URL=

EMAIL_USER=

EMAIL_PASS=

CLOUDINARY_URL=

CLOUD_NAME=

API_KEY=

API_SECRET=
```

---

## Start the Application

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/signin` | Login |
| GET | `/auth/google` | Google OAuth |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password/:token` | Reset password |
| GET | `/auth/verify-email/:token` | Verify email |
| POST | `/auth/resend-verification` | Resend verification email |
| PATCH | `/auth/:userId/delete-account` | Delete account |

---

## Projects

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects` | Fetch user projects |
| GET | `/projects/:id` | Fetch project details |
| PATCH | `/projects/:id` | Update project |
| PATCH | `/projects/:id/status` | Update project status |
| PATCH | `/projects/:id/delete` | Delete project |

---

## Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/projects/:id/task` | Create task |
| GET | `/projects/:id/task` | Fetch project tasks |
| GET | `/task/member/:memberId` | Fetch member tasks |
| GET | `/task/:taskId` | Fetch task |
| PATCH | `/task/:taskId` | Update task |
| PATCH | `/task/:taskId/status` | Update task status |
| PATCH | `/task/:taskId/delete` | Delete task |
| PATCH | `/task/:taskId/assign` | Assign task |
| PATCH | `/task/:taskId/unassign` | Unassign task |

---

## Members

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/projects/:id/member` | Fetch members |
| GET | `/projects/:id/member/:memberId` | Fetch member |
| PATCH | `/projects/:id/member/:memberId/remove` | Remove member |
| PATCH | `/projects/:id/member/leave` | Leave project |

---

## Invitations

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/projects/:id/invitation` | Create invitation |
| POST | `/projects/:id/invitation/:invitationId/send` | Send invitation |
| GET | `/invitation/:token` | Validate invitation |
| GET | `/invitation/all` | Fetch invitations |
| GET | `/invitation/:invitationId` | Fetch invitation |
| PATCH | `/invitation/:token/accept` | Accept invitation |
| PATCH | `/invitation/:token/reject` | Reject invitation |
| PATCH | `/invitation/:invitationId/revoke` | Revoke invitation |
| PATCH | `/invitation/:invitationId/reschedule` | Reschedule invitation |
| PATCH | `/invitation/:invitationId` | Update invitation |
| PATCH | `/invitation/:invitationId/delete` | Delete invitation |

---

## Users

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/user/profile` | Fetch profile |
| GET | `/user/profile-picture` | Fetch profile picture |
| PATCH | `/user/profile-picture` | Update profile picture |
| PATCH | `/user/profile-picture/remove` | Remove profile picture |

---

# Future Improvements

- Project Comments
- Task Comments
- Project Attachments
- Task Attachments
- Real-time Notifications
- Team Activity Logs
---

# Author

**Fathia Olabiyi**

Backend Engineer passionate about building secure, scalable, and maintainable backend applications.

---

# License

This project is licensed under the MIT License.
