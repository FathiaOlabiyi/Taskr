const Model = require("./tasks.model");
const memberModel = require("../members/members.model");
const roleModel = require("../Admin/roles.model");
const projectModel = require("../projects/projects.model");
const mongoose = require("mongoose");

const createTask = async(userId, projectId, {title, description, priority, dueDate}) => {

  const getProjectStatus = await projectModel.findById(projectId);

  if(getProjectStatus.status === "completed" || getProjectStatus.status === "on_hold") {
    throw new Error(`Cannot continue, project ${getProjectStatus.status}`)
  } ;

    const existingTask = await Model.findOne({title});

    if(existingTask) {
        throw new Error(`Task with title ${existingTask.title} already exists`);
    };

    const findMember = await memberModel.findOne({projectId, userId, deletedAt: null});

    if(!findMember) {
      throw new Error("Not a member")
    };

    const createdBy = findMember._id;

        const memberRole = findMember.role;
        const getRole = await roleModel.findById(memberRole);
        const role = getRole.name;

        if (role === "Member") {
            const assignedTo = createdBy;

            const task = await Model.create({
              projectId,
              createdBy,
              assignedTo,
              title,
              description,
              priority,
              dueDate,
              startedAt,
            });

            return task;
        }else {
           const task = await Model.create({
             projectId,
             createdBy,
             title,
             description,
             priority,
             dueDate
           });
           return task;
        };
};

const getAllTasks = async(projectId, userId, status, title, priority, assigned, assignedTo) => {

  let query = {
    projectId,
    deletedAt: null
  };

  if(status) {
    query.status = {$regex: status, $options: "i"};
  };

  if(title) {
    query.title = {$regex: title, $options: "i"};
  };

  if(priority) {
    query.priority = {$regex: priority, $options: "i"}
  };

  if(assigned === "true") {
    query.assignedTo = {$ne: null};
  };

  if(assigned === "false") {
    query.assignedTo = null
  };

  if(assignedTo === "me") {
    const member = await memberModel.find({projectId, userId, deletedAt: null});

    if(!member) {
      throw new Error("Member not found");
    };

    query.assignedTo = member._id;
  };

  if(assignedTo && assignedTo !== "me") {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      throw new Error("Invalid member ID format");
    };
    const member = await memberModel.findOne({
      _id: assignedTo, projectId, deletedAt: null
    });

    if(!member) {
      throw new Error("Member not found");
    };

    query.assignedTo = assignedTo;
  };

    const tasks =  await Model.find(query);
    return tasks;
};

const getTaskAssignedToMember = async (projectId, memberId) => {
  const checkMember = await memberModel.findOne({ _id: memberId, projectId, deletedAt: null});

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    throw new Error("Invalid member ID format");
  };

  if (!checkMember) {
    throw new Error("Not a member");
  }

  const getTasks = await Model.find({ assignedTo: memberId, deletedAt: null });
  return getTasks;
};

const getTaskById = async(taskId) => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid task ID format");
    };

  const getTask = await Model.findById(taskId);

  if (!getTask || getTask.deletedAt !== null) {
    throw new Error("Task not found");
  }
  return getTask;
};

const updateTask = async(projectId, userId, taskId, {title, description, priority, dueDate}) => {

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID format");
  }

  const getProjectStatus = await projectModel.findById(projectId);

  if (
    getProjectStatus.status === "completed" ||
    getProjectStatus.status === "on_hold"
  ) {
    throw new Error(`Cannot continue, project ${getProjectStatus.status}`);
  }

  const getTask = await Model.findById(taskId);

    if (!getTask || getTask.deletedAt !== null) {
      throw new Error("Task not found");
    };

  const getMemberId = await memberModel.find({ userId, projectId, deletedAt: null });
  const memberId = getMemberId._id;
  const getMemberRole = getMemberId.role;

  const getRole = await roleModel.findOne(getMemberRole);
  const roleName = getRole.name;


  if (
    memberId !== getTask.assignedTo &&
    roleName !== "Owner" &&
    roleName !== "Project Manager"
  ) {
    throw new Error("You do not have permission");
  }

  if (getTask.status === "completed" || getTask.status === "review") {
    throw new Error("Task cannot be updated");
  }

  if (title) {
    const existingTask = await Model.findOne({ title });

    if (existingTask) {
      throw new Error(`Task with title ${existingTask.title} exists`);
    }
    getTask.title = title;
  }

  if (description) {
    getTask.description = description;
  }

  if (priority) {
    getTask.priority = priority;
  }

  if (dueDate) {
    getTask.dueDate = dueDate;
  }

  getTask.updatedBy = memberId;
  await getTask.save();
  return getTask;
};

const updateStatus = async(projectId, userId, taskId, {status, blocker, expectedResumeDate}) => {

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid task ID format");
    }

    const getProjectStatus = await projectModel.findById(projectId);

    if (
      getProjectStatus.status === "completed" ||
      getProjectStatus.status === "on_hold"
    ) {
      throw new Error(`Cannot continue, project ${getProjectStatus.status}`);
    }
  

  const fetchTask = await Model.findById(taskId);

  if (!fetchTask || fetchTask.deletedAt !== null) {
    throw new Error("Task not found");
  }
  const fetchStatus = fetchTask.status;

  const getMemberId = await memberModel.find({ userId, projectId, deletedAt: null });
  const memberId = getMemberId._id;
  const getMemberRole = getMemberId.role;

  const getRole = await roleModel.findOne(getMemberRole);
  const roleName = getRole.name;

  if (
    memberId != fetchTask.assignedTo &&
    roleName !== "Owner" &&
    roleName !== "Project Manager"
  ) {
    throw new Error("You do not have permission");
  }

  if (status === fetchStatus) {
    throw new Error("Task is already in this state");
  }

  //todo to in-progress
  if (fetchStatus === "todo" && status === "in-progress") {
    if (fetchTask.assignedTo === null) {
      throw new Error("Task must be assigned");
    }

    if (fetchTask.dueDate == null) {
      throw new Error("Task must have a due date");
    }
    fetchTask.status = status;
    fetchTask.startedAt = Date.now();
  }

  //in-progress to on-hold
  else if (fetchStatus == "in-progress" && status == "on-hold") {
    fetchTask.blocker = blocker;
    fetchTask.expectedResumeDate = expectedResumeDate;
    fetchTask.status = status;
  }

  //on-hold to in-progress
  else if (fetchStatus == "on-hold" && status == "in-progress") {
    fetchTask.blocker = null;
    fetchTask.status = status;
  }

  //in-progress to review
  else if (fetchStatus == "in-progress" && status == "review") {
    fetchTask.status = status;
  }

  //review to in-progress
  else if (fetchStatus == "review" && status == "in-progress") {
    fetchTask.status = status;
  }

  //in-progress to completed
  else if (fetchStatus == "review" && status == "completed") {

    fetchTask.status = status;
    fetchTask.completedAt = Date.now();
  } else if (fetchStatus === "todo" && status !== "in-progress") {
    throw new Error("Task still in todo, not in progress yet");
  } else {
    throw new Error("Not allowed");
  }

  fetchTask.updatedBy = memberId;
  await fetchTask.save();

  return fetchTask;
};

const deleteTask = async(projectId, userId, taskId) => {

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid task ID format");
    }

    const getProjectStatus = await projectModel.findById(projectId);

    if (
      getProjectStatus.status === "completed" ||
      getProjectStatus.status === "on_hold"
    ) {
      throw new Error(`Cannot continue, project ${getProjectStatus.status}`);
    }
    const deleteTask = await Model.findById(taskId);

    if (!deleteTask || deleteTask.deletedAt != null) {
        throw new Error("Task not found");
    };
    
    deleteTask.deletedAt = Date.now();
    
    const getMemberId = await memberModel.find({ userId, projectId, deletedAt: null });
    const memberId = getMemberId._id;
    deleteTask.deletedBy = memberId;
    await deleteTask.save();
};

const assignTask = async(projectId, taskId, userId, memberId) => {

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID format");
  };

    const getProjectStatus = await projectModel.findById(projectId);

    if (
      getProjectStatus.status === "completed" ||
      getProjectStatus.status === "on_hold"
    ) {
      throw new Error(`Cannot continue, project ${getProjectStatus.status}`);
    }

  const getTask = await Model.findById(taskId);

    if (!getTask || getTask.deletedAt !== null) {
      throw new Error("Task not found");
    }

  const getMemberToAssign = await memberModel.findById(memberId);

    if (!getMemberToAssign || getMemberToAssign.deletedAt !== null) {
      throw new Error("Member not found");
    }

  const memberRole = getMemberToAssign.role;
  const getRoleName = await roleModel.findById(memberRole);
  const roleName = getRoleName.name;

  if (getTask.status === "completed" || getTask.status === "review") {
    throw new Error("Task cannot be reassigned");
  }

  if (roleName !== "Member") {
    throw new Error(`${roleName} cannot be assigned tasks`);
  }

  const getId = await memberModel.findOne({
    projectId,
    userId,
    deletedAt: null,
  });
  const id = getId._id;

  getTask.assignedTo = memberId;
  getTask.updatedBy = id;
  getTask.save();
};

const unassignTask = async(projectId, taskId) => {

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid task ID format");
    }

    const getProjectStatus = await projectModel.findById(projectId);

    if (
      getProjectStatus.status === "completed" ||
      getProjectStatus.status === "on_hold"
    ) {
      throw new Error(`Cannot continue, project ${getProjectStatus.status}`);
    }

  const getTask = await Model.findById(taskId);

  if (!getTask || getTask.deletedAt !== null) {
    throw new Error("Task not found");
  };

  if (getTask.status === "completed" || getTask.status === "review" || getTask.status === "in-progress") {
    throw new Error("Task cannot be unassigned");
  };

  if (getTask.assignedTo === null) {
    throw new Error("Task already unassigned");
  };

    const getId = await memberModel.findOne({userId, projectId, deletedAt: null});
    const id = getId._id;

  getTask.assignedTo = null;
  getTask.updatedBy = id;
  getTask.save();
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskAssignedToMember,
    getTaskById,
    updateTask,
    updateStatus,
    deleteTask,
    assignTask,
    unassignTask
};


