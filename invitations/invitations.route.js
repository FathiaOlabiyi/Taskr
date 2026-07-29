const {createInvitation, sendInvitation, getInvitation, acceptInvitation, rejectInvitation, revokeInvitation, rescheduleInvitation, resendInvitation, getInvitations, getInvitationById, updateInvitation, deleteInvitation} = require("./invitations.controller");
const {validateToken} = require("../auth/auth.middleware");
const {isMember, hasPermission} = require("../middlewares/authorizeMember.middleware");
const express = require("express");

const Router = express.Router();

Router.post("/:id/invitation", validateToken, isMember, hasPermission("Manage Invitation"), createInvitation);
Router.post("/:id/invitation/:invitationId/send", validateToken, isMember, hasPermission("Manage Invitation"), sendInvitation);
Router.get("/:id/invitation", getInvitation);
Router.patch("/:id/invitation/accept", validateToken, acceptInvitation);
Router.patch("/:id/invitation/reject", validateToken, rejectInvitation);
Router.patch("/:id/invitation/:invitationId/revoke", validateToken, isMember, hasPermission("Manage Invitation"), revokeInvitation);
Router.patch("/:id/invitation/:invitationId/reschedule", validateToken, isMember, hasPermission("Manage Invitation"), rescheduleInvitation);
Router.post("/:id/invitation/:invitationId/resend", validateToken, isMember, hasPermission("Manage Invitation"), resendInvitation);
Router.get("/:id/invitation/all", validateToken, isMember, hasPermission("Manage Invitation"), getInvitations);
Router.get(
  "/:id/invitation/:invitationId",
  validateToken,
  isMember,
  hasPermission("Manage Invitation"),
  getInvitationById,
);
Router.patch("/:id/invitation/:invitationId", validateToken, isMember, hasPermission("Manage Invitation"), updateInvitation);
Router.patch("/:id/invitation/:invitationId/delete", validateToken, isMember, hasPermission("Manage Invitation"), deleteInvitation);

module.exports = Router;