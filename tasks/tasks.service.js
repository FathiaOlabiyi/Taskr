const Model = require("./tasks.model");
const memberModel = require("../members/members.model");
const roleModel = require("../Admin/roles.model");

const createTask = async(userId, projectId, title, description, priority, dueDate) => {

    const existingTask = await Model.findOne({title});

    if(existingTask) {
        throw new Error(`Task with title ${existingTask.title} already exists`);
    };

    const findMember = await memberModel.findOne({projectId, userId, deletedAt: null});

    const createdBy = findMember._id;
    console.log(createdBy);

        const memberRole = findMember.role;
        const getRole = await roleModel.findById(memberRole).name;

        if (getRole == "Member") {
            const assignedTo = createdBy;
            const startedAt = Date.now();
        };

    const task = await Model.create({projectId, createdBy, assignedTo, title, description, priority, dueDate, startedAt});


    return task;
};

const getAllTasks = async(projectId, userId, status, title, priority, assigned, assignedTo) => {

    query = {};
    if (status) {
        query.status = {$regex: status, $options: "i"}
    };

    if(title) {
        query.title = { $regex: title, $options: "i" };
    };
    if(priority) {
        query.priority = { $regex: priority, $options: "i" };
    };

    if(assigned) {
        if(assigned == "true") {
            return await Model.find({projectId, assignedTo: {$ne: null}});
        };

        if(assigned == "false") {
            return await Model.find({projectId, assignedTo: null})
        };
    };

    if(assignedTo) {
        if(assignedTo == "me") {
            query.assignedTo = assignedTo;
            const getMember = await memberModel.findOne({projectId, userId});
            const memberId = getMember._id;

            const getTasks = await Model.find({projectId, assignedTo: memberId, deletedAt: null});
            return getTasks;
        }else {
            query.assignedTo = assignedTo;
            const checkMember = await memberModel.findOne({projectId, _id: assignedTo});
            console.log(checkMember);

            if(!checkMember || checkMember.deletedAt != null) {
                throw new Error("Not a member")
            };

            const getTasks = await Model.find({projectId, assignedTo: assignedTo});
            return getTasks;
        }
    }

    const getTasks = await Model.find({projectId, query, deletedAt: null});
    return getTasks;
};

const getTaskAssignedToMember = async (memberId) => {
  const getTasks = await Model.find({assignedTo: memberId, deletedAt: null});

  return getTasks;
};

const getTaskById = async(taskId) => {
    const getTask = await Model.findById(taskId);

    if (!getTask || getTask.deletedAt != null) {
      throw new Error("Task not found");
    };
    return getTask;
};

const updateTask = async(userId, taskId, title, description, priority, dueDate) => {
    const getTask = await Model.findById(taskId);
    const getMemberId = await memberModel.find({ userId });
    const memberId = getMemberId._id;

    if(memberId != getTask.assignedTo) {
        throw new Error("You do not have permission")
    };

    if(!getTask || getTask.deletedAt != null) {
        throw new Error("Task not found")
    };

    if(getTask.status == "completed" || getTask.status == "review") {
        throw new Error("Task cannot be updated")
    }

    if(title) {
        const existingTask = await Model.findOne({title});
        
            if (existingTask) {
              throw new Error(`Task with title ${existingTask.title} exists`);
            }
        getTask.title = title;
    };

    if(description) {
        getTask.description = description;
    };

    if(priority) {
        getTask.priority = priority;
    };

    if(dueDate) {
        getTask.dueDate = dueDate;
    };

    getTask.updatedBy = memberId;
    await getTask.save();
};

const updateStatus = async(userId, taskId, status, blocker, expectedResumeDate) => {
  const fetchTask = await Model.findById(taskId);
  const fetchStatus = fetchTask.status;

  const getMemberId = await memberModel.find({ userId });
  const memberId = getMemberId._id;

  if (memberId != getTask.assignedTo) {
    throw new Error("You do not have permission");
  }

  if (!fetchTask || fetchTask.deletedAt !== null) {
    throw new Error("Task not found");
  }

  if (status == fetchStatus) {
    throw new Error("Task is already in this state");
  }

  //todo to in-progress
  if (fetchStatus == "todo" && status == "in-progress") {
    if (fetchTask.assignedTo == null) {
      throw new Error("Task must be assigned");
    }

    if (fetchTask.dueDate == null) {
      throw new Error("Task must have a due date");
    }
    fetchStatus = status;
    fetchTask.startedAt = Date.now();
  }

  //in-progress to on-hold
  else if (fetchStatus == "in-progress" && status == "on-hold") {
    fetchTask.blocker = blocker;
    fetchTask.expectedResumeDate = expectedResumeDate;
    fetchStatus = status;
  }

  //on-hold to in-progress
  else if (fetchStatus == "on-hold" && status == "in-progress") {
    fetchTask.blocker = null;
    fetchStatus = status;
  }

  //in-progress to review
  else if (fetchStatus == "in-progress" && status == "review") {
    fetchStatus = status;
  }

  //review to in-progress
  else if (fetchStatus == "review" && status == "in-progress") {
    fetchStatus = status;
  }

  //in-progress to completed
  else if (fetchStatus == "review" && status == "completed") {
    if (completeTask) {
      throw new Error("All task must be completed");
    }

    fetchStatus = status;
    fetchTask.completedAt = Date.now();
  } else {
    throw new Error("Not allowed");
  }

  fetchTask.updatedBy = memberId;
  await fetchTask.save();
};

const deleteTask = async(userId, taskId) => {
    const deleteTask = await Model.findById(taskId);

    if (!deleteTask || deleteTask.deletedAt != null) {
        throw new Error("Task not found");
    };
    
    deleteTask.deletedAt = Date.now();
    
    const getMemberId = await memberModel.find({ userId });
    const memberId = getMemberId._id;
    getTask.deletedBy = memberId;
    await deleteTask.save();
};

const assignTask = async(taskId, userId, memberId) => {
    const getTask = await Model.findById(taskId);
    const getMemberToAssign = await memberModel.findById(memberId);

    const memberRole = getMemberToAssign.role;
    const getRoleName = await roleModel.findById(memberRole);
    const roleName = getRoleName.name;

    if (!getTask || getTask.deletedAt != null) {
        throw new Error("Task not found");
    };

    if (getTask.status == "completed" || getTask.status == "review") {
        throw new Error("Task cannot be reassigned");
    };

    if (!getMemberToAssign || getMemberToAssign.deletedAt != null) {
      throw new Error("Member not found");
    };

    if(roleName != "Member") {
      throw new Error(`A ${roleName} cannot be assigned tasks`)
    };

    const getId = await memberModel.find({ userId });
    const id = getId._id;

  getTask.assignedTo = memberId;
  getTask.updatedBy = id;
  getTask.save();
};

const unassignTask = async(taskId) => {
  const getTask = await Model.findById(taskId);

  if (!getTask || getTask.deletedAt != null) {
    throw new Error("Task not found");
  };

  if (getTask.status == "completed" || getTask.status == "review" || getTask.status == "in-progress") {
    throw new Error("Task cannot be unassigned");
  };

  if (getTask.assignedTo == null) {
    throw new Error("Task already unassigned");
  };

    const getId = await memberModel.find({ userId });
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


