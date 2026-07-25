const permissionModel = require("../permissions.model");

const permissions = [
    {name: "View Project"},
    {name: "Edit Project"},
    {name: "Delete Project"},
    {name: "Manage Invitation"},
    {name: "Manage Project Managers"},
    {name: "Manage Members"},
    {name: "View Task"},
    {name: "Manage Task"},
    {name: "Create Task"},
    {name: "Manage Comments"},
    {name: "View Comments"},
    {name: "Create Comment"},
    {name: "Manage Attachements"},
    {name: "View Attachements"},
    {name: "Create Project Attachement"},
    {name: "Create Task Attachement"},
    {name: "Delete Task"},
    {name: "Assign Task"},
];

const seedPermissions = async() => {
    for(const permission of permissions) {
        await permissionModel.updateOne({
            name: permission.name
        }, permission, {upsert: true});
    }
};

module.exports = seedPermissions;