const joi = require("joi");

const createInvitationJoi = joi.object({
  inviteeEmail: joi.string().required(),
  role: joi.string().valid("Project Manager", "Member", "Viewer").required(),
  scheduleSend: joi.date().greater("now"),
});


const rescheduleInvitationJoi = joi.object({
    scheduleSend: joi.date().greater("now").required() 
});

const updateInvitationJoi = joi.object({
    role: joi.string().valid("Project Manager", "Member", "Viewer"),
    inviteeEmail: joi.string()
});

module.exports = {
    createInvitationJoi,
    rescheduleInvitationJoi,
    updateInvitationJoi
};