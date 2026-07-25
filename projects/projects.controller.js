const Services = require("./projects.service");
const {createProjectJoi, updateProjectJoi, updateStatusJoi} = require("./projects.middleware");
const logger = require("../logger/winston");

//when you are done creating members and invitations, make sure to test these endpoints again, do not forget testing them when a project has been deleted
const createProject = async(req, res) => {
    try {
        const ownerId = req.user.id;
        const {value, error} = createProjectJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        };
        
        const response = await Services.createProject(ownerId, value);
        logger.info("Project created successfully");
        return res.status(201).json({
            message: "Project created successfully",
            data: response
        });
    }catch(err) {
        if(err && err.message.includes("exists")) {
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

const getAllProjects = async(req, res) => {
    try {
        const userId = req.user.id;
        const query = req.query;

        const response = await Services.getAllProjects(userId, query.status, query.type, query.title);
        logger.info("Projects returned successfully");
        return res.status(200).json({message: "Projects returned successfully", data: response})
    }catch(err) {
        logger.error(err.message);
        res.status(500).json({message: "Internal server error", error: err.message});
    };
};

const getProjectById = async(req, res) => {
    try {
        const id = req.params.id;

        const response = await Services.getProjectById(id);
        logger.info("Project returned successfully");
        return res.status(200).json({
            message: "Project returned successfully",
            data: response
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
    }
};

const updateProject = async(req, res) => {
   try { 
        const id = req.params.id;
        const {value, error} = updateProjectJoi.validate(req.body);
        
        if (error) {
            logger.warn(error.message);
          return res.status(400).json({
            message: error.message,
          });
        }
    
        const response = await Services.updateProject(id, value);
        logger.info("Project update successful");
        return res.status(201).json({
            message: "Update successful",
            data: response
        });

    }catch(err) {
      if (err && [err.message.includes("exists") || err.message.includes("updated")]) {
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
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    };
};

const updateStatus = async(req, res) => {
    try{
        const id = req.params.id;
        const {value, error} = updateStatusJoi.validate(req.body);

        if(error) {
            logger.warn(error.message);
            return res.status(400).json({
                message: error.message
            });
        }

        const response = await Services.updateStatus(id, value);
        logger.info("Project status update successful");
        return res.status(201).json({
            message: "Update successful",
            data: response
        });
    }catch(err) {
        if (err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
            message: err.message,
            });
        };

        if (
          err && [
            err.message.includes("state") ||
              err.message.includes("member") ||
              err.message.includes("task") ||
              err.message.includes("date") ||
              err.message.includes("completed") ||
              err.message.includes("allowed") ||
              err.message.includes("have")
          ]
        ) {
            logger.warn(err.message);
          return res.status(409).json({
            message: err.message,
          });
        };

        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }

};

const deleteProject = async(req, res) => {
    const id = req.params.id;
    try {
        const response = await Services.deleteProject(id);
        logger.info("Project deleted successfully");
        res.status(200).json({
            message: "Project deleted successfully"
        });
    }catch(err){
        if(err && err.message.includes("not found")) {
            logger.warn(err.message);
            return res.status(404).json({
                message: err.message
            });
        }
        logger.error(err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    };
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    updateStatus,
    deleteProject
};