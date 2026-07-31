const joi = require("joi");

const createInvitationJoi = joi.object({
    inviteeEmail: joi.string().required(),
    roleId: joi.string().required(),
    scheduleSend: joi.date().greater("now")
});


const rescheduleInvitationJoi = joi.object({
    scheduleSend: joi.date().greater("now").required() 
});

const updateInvitationJoi = joi.object({
    roleId: joi.string(),
    inviteeEmail: joi.string()
});

module.exports = {
    createInvitationJoi,
    rescheduleInvitationJoi,
    updateInvitationJoi
};