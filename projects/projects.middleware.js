const joi = require("joi");

const createProjectJoi = joi.object({
    title: joi.string().required(),
    description: joi.string(),
    dueDate: joi.date().greater("now")
});

const updateProjectJoi = joi.object({
  title: joi.string(),
  description: joi.string(),
  dueDate: joi.date().greater("now"),

});

const updateStatusJoi = joi.object({
  status: joi.string().required(),
  blocker: joi.when("status", {
    is: "on-hold",
    then: joi.string().required(),
    otherwise: joi.forbidden(),
  }),
  expectedResumeDate: joi.when("status", {
    is: "on-hold",
    then: joi.date().greater("now").required(),
    otherwise: joi.forbidden(),
  }),
});

module.exports = {
    createProjectJoi,
    updateProjectJoi,
    updateStatusJoi
};