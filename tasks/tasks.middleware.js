const joi = require("joi");

const createTaskJoi = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    priority: joi.string(),
    dueDate: joi.date().greater("now")
});

const updateTaskJoi = joi.object({
  title: joi.string(),
  description: joi.string(),
  priority: joi.string(),
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
    createTaskJoi,
    updateTaskJoi,
    updateStatusJoi
};
