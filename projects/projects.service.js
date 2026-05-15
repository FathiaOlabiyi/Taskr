const Model = require("./projects.model");
const memberModel = require("../members/members.model");
const taskModel = require("../tasks/tasks.model");
const roleModel = require("../Admin/roles.model");
const mongoose = require("mongoose");
let session;

const createProject = async(ownerId, title, description, dueDate) => {
  const existingProject = await Model.findOne({ title });

  if (existingProject) {
    throw new Error(`Project with title ${existingProject.title} exists`);
  };

  session = await mongoose.startSession();
  
  const projectTransaction = await session.withTransaction(async () => {
    const project = await Model.create(
      [{ ownerId, title, description, dueDate}],
      { session },
    );

    console.log(`StartedAt: ${startedAt}`);
    const getRole = await roleModel.find({name: "Owner"});
    const roleId = getRole._id;

    const addMember = await memberModel.create(
      [
        {
          projectId: project[0]._id,
          userId: ownerId,
          role: roleId,
        },
      ],
      { session },
    );

    return {project};
  });
  session.endSession();
  return projectTransaction;
};

const getAllProjects = async(userId, status, type, title)  => {
  
  let query = {};
  

  let populate = {
    path: "projectId",
    match: {deletedAt: null}
  };
  if(status) {
    query.status = { $regex: status, $options: "i" };
    populate.match.status = query.status;
  };

  if(type == "mine") {
    query.type = type
    populate.match.ownerId = userId;
  };

  if(type == "member") {
    query.type = type
    populate.match.ownerId = { $ne: userId };
  };

  if(title) {
    query.title = { $regex: title, $options: "i" };
    populate.match.title = query.title
  };

  const getProjects = await memberModel.find({userId: userId}).populate(populate);
  if(status || type || title) {

    return getProjects.filter(a => a.projectId !== null).map(a => a.projectId);
  };
  return getProjects.map(a => a.projectId);
};


const getProjectById = async(projectId) => {
   const getProject = await Model.findById(projectId);

  if(!getProject ||getProject.deletedAt != null) {
    throw new Error("Project not found")
  };
  return getProject;

};


// give this a different joi validation
const updateProject = async(projectId, title, description, dueDate) => {
  const updateProject = await Model.findById(projectId);


  if(!updateProject || updateProject.deletedAt != null ) {
    throw new Error("Project not found")
  };

  if(updateProject.status == "completed") {
    throw new Error("Project cannot be updated")
  };

  if(title) {
    const existingProject = await Model.findOne({ title });

    if (existingProject) {
      throw new Error(`Project with title ${existingProject.title} exists`);
    }
    updateProject.title = title;
  };

  if(description) {
    updateProject.description = description;
  };

  if(dueDate) {
    updateProject.dueDate = dueDate;
  }

  await updateProject.save();
};

//create a joi validation for this
const updateStatus = async(projectId, status, blocker, expectedResumeDate) => {

  const fetchProject = await Model.findById(projectId);
  const fetchStatus = fetchProject.status;
  const checkMember = await memberModel.find({projectId});
  const checkTask = await taskModel.find({projectId});

  const completeTask = await taskModel.exists({
    projectId,
    status: { $ne: "completed" },
  });
  console.log(checkMember);
  console.log(checkTask)

  if(!fetchProject || fetchProject.deletedAt !== null) {
    throw new Error("Project not found")
  };

  if(status == fetchStatus) {
    throw new Error("Project is already in this state")
  };

  //planning to active
  if(fetchStatus == "planning" && status == "active") {
    if(checkMember.length < 2) {
      throw new Error("Project has to have more than 1 member");
    };

    if(checkTask.length < 1) {
      throw new Error("Project must have at least 1 task");
    };

    if(fetchProject.dueDate == null) {
      throw new Error("Project must have a due date");
    };

      fetchStatus = status;
      fetchProject.startedAt = Date.now();
  }

  //active to on-hold
   else if(fetchStatus == "active" && status == "on-hold") {
    fetchProject.blocker = blocker;
    fetchProject.expectedResumeDate = expectedResumeDate;
    fetchStatus = status;
   }

   //on-hold to active
   else if(fetchStatus == "on-hold" && status == "active") {
    fetchProject.blocker = null
    fetchStatus = status;
   }

   //active to completed
   else if(fetchStatus == "active" && status == "completed") {
    if(completeTask) {
      throw new Error("All task must be completed")
    };

    fetchStatus = status;
    fetchProject.completedAt = Date.now()
   } else {
    throw new Error("Not allowed")
   };
  await fetchProject.save();
};

const deleteProject = async(projectId) => {
  session = await mongoose.startSession();
  await session.withTransaction(async () => {

      const deleteProject = await Model.findById(projectId, null, {session});
      if (deleteProject.deletedAt != null) {
        throw new Error("Project not found");
      };

      deleteProject.deletedAt = Date.now();

      await deleteProject.save({session});

      await memberModel.updateMany({projectId: projectId, deletedAt: null}, {$set: {deletedAt: Date.now()}}, {session});
      //check if the task of a project can be accessed if a project has been deleted, if yes, delete task here too
  });
  session.endSession();
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    updateStatus,
    deleteProject
};