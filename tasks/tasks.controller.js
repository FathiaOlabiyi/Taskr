const Services = require("./tasks.service");
const {createTaskJoi, updateTaskJoi, updateStatusJoi, memberIdJoi} = require("./tasks.middleware");
const logger = require("../logger/winston");

const createTask = async(req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        const {value, error} =  createTaskJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        };
        const response = await Services.createTask(userId, projectId, value);
        logger.info("Task created successfully");

        return res.status(201).json({
            message: "Task created successfully",
            data: response
        });

    }catch(err) {
      if (err && err.message.includes("exists")) {
        logger.warn(err.message);
        return res.status(409).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message,
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    };
};

const getAllTasks = async(req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        const query = req.query;

        const response = await Services.getAllTasks(projectId, userId, query.status, query.title, query.priority, query.assigned, query.assignedTo);
        logger.info("Tasks retrived successfully");

        return res.status(200).json({
            message: "Tasks retrived successfully",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("Invalid")) {
            logger.warn(err.message);
            return res.status(400).json({
                message: err.message
            });
        };

        if(err && err.message.includes("Not a member")) {
            logger.warn(err.message);
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const getTasksAssignedToMember = async(req, res) => {
    try {
        const memberId = req.params.memberId;
        const projectId = req.params.id;

        const response = await Services.getTaskAssignedToMember(projectId, memberId);
        logger.info("Task returned successfully");

        return res.status(200).json({
            message: "Task returned successfully",
            data: response
        });
    }catch(err) {
      if (err && err.message.includes("member")) {
        logger.warn(err.message);
        return res.status(409).json({
          message: err.message,
        });
      }
      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }
      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    };
};

const getTaskById = async(req, res) => {
    try {
        const taskId = req.params.taskId;
        console.log(taskId);

        const response = await Services.getTaskById(taskId);
        logger.info("Task returned successfully");

        return res.status(200).json({
            message: "Task returned successfully",
            data: response
        });
    }catch(err) {
      if (err && err.message.includes("Invalid")) {
        logger.warn(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const updateTask = async(req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;
        const {value, error} = updateTaskJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        };
        
        const response = await Services.updateTask(userId, taskId, value);
        logger.info("Task update successful");

        return res.status(201).json({
            message: "Update successful",
            data: response
        });
    }catch(err) {
      if (
        err && [
          err.message.includes("updated") || err.message.includes("exists"),
        ]
      ) {
        logger.warn(err.message);
        return res.status(409).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("not found")) {
        logger.warn(err.message);
        return res.status(404).json({
          message: err.message,
        });
      }

      logger.error(err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message
      });
    };
};

const updateStatus = async(req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;
        const {value, error} = updateStatusJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        }
        const response = await Services.updateStatus(userId, taskId, value);
        logger.info("Task status update successful");
        return res.status(201).json({
            message: "Update successful",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("is already in this state") || err.message.includes("must") || err.message.includes("allowed")] || err.message.includes("still in todo")) {
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const deleteTask = async(req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;

        logger.info("Task deleted successfully");
        return res.status(204).json({
            message: "Deleted successfully"
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const assignTask = async(req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user.id;
        const {value, error} = memberIdJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        };

        const response = await Services.assignTask(taskId, userId, value);
        logger.info("Task assigned successfully");

        return res.status(201).json({
            message: "Task successfully assigned",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && err.message.includes("cannot be reassigned")) {
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const unassignTask = async(req, res) => {
    try {
        const taskId = re.params.taskId;

        const response = await Services.unassignTask(taskId);
        logger.info("Task unassigned");

        return res.status(201).json({
            message: "Task unassigned",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && err.message.includes("unassigned")) {
            logger.warn(err.message);
            return res.status(409).json({
                message: err.message
            });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

module.exports = {
    createTask,
    getAllTasks,
    getTasksAssignedToMember,
    getTaskById,
    updateTask,
    updateStatus,
    deleteTask,
    assignTask,
    unassignTask
};