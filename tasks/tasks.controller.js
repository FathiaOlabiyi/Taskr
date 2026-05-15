const Services = require("./tasks.service");
const {createTaskJoi, updateTaskJoi, updateStatusJoi, memberIdJoi} = require("./tasks.middleware");

//joi validations please
const createTask = async(req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        const {value, error} =  createTaskJoi.validate(req.body);

        if(error) {
            return(400).json({
                message: error.message
            });
            console.log(error.message)
        };
        const response = await Services.createTask(userId, projectId, value);

        return res.status(201).json({
            message: "Task created successfully",
            data: response
        });

    }catch(err) {
      if (err && err.message.includes("exists")) {
        return res.status(409).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("not found")) {
        return res.status(404).json({
          message: err.message,
        });
      }

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

        return res.status(200).json({
            message: "Tasks retrived successfully",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("Not a member")) {
            return res.status(409).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const getTasksAssignedToMember = async(req, res) => {
    try {
        const memberId = req.body.memberId;
        const response = await Services.getTaskAssignedToMember(memberId);

        return res.status(200).json({
            message: "Task returned successfully",
            data: response
        });
    }catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

const getTaskById = async(req, res) => {
    try {
        const taskId = res.params.taskId;

        const response = await Services.getTaskById(taskId);

        return res.status(200).json({
            message: "Task returned successfully",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

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
            return res.status(400).json({
                message: error.message
            });
        }
        const response = await Services.updateTask(userId, taskId, value);

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
        return res.status(409).json({
          message: err.message,
        });
      }

      if (err && err.message.includes("not found")) {
        return res.status(404).json({
          message: err.message,
        });
      }

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
            return res.status(400).json({
                message: error.message
            });
        }
        const response = await Services.updateStatus(userId, taskId, value);

        return res.status(201).json({
            message: "Update successful",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && [err.message.includes("is already in this state") || err.message.includes("must") || err.message.includes("allowed")]) {
            return res.status(409).json({
                message: err.message
            });
        };

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

        return res.status(204).json({
            message: "Deleted successfully"
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

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
            return res.status(400).json({
                message: error.message
            });
        };

        const response = await Services.assignTask(taskId, userId, value);

        return res.status(201).json({
            message: "Task successfully assigned",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && err.message.includes("cannot be reassigned")) {
            return res.status(409).json({
                message: err.message
            });
        };

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
        return res.status(201).json({
            message: "Successful",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("not found")) {
            return res.status(404).json({
                message: err.message
            });
        };

        if(err && err.message.includes("unassigned")) {
            return res.status(409).json({
                message: err.message
            });
        };

        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    updateStatus,
    deleteTask,
    assignTask,
    unassignTask
};