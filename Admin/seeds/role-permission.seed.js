const roleModel = require("../roles.model");
const permissionModel = require("../permissions.model");
const rolePermissionModel = require("../role-permission.model");

const rolePermissions = {
    "Owner": [
        "View Project",
        "Edit Project",
        "Delete Project",
        "Manage Invitation",
        "Manage Project Managers",
        "Manage Members",
        "View Task",
        "Create Task",
        "Manage Task",
        "Assign Task",
        "Delete Task",
        "View Comments",
        "Create Comment",
        "Manage Comments",
        "View Attachements",
        "Create Project Attachement",
        "Create Task Attachement",
        "Manage Attachements"
    ],

    "Project Manager": [
        "View Project",
        "Edit Project",
        "Manage Invitation",
        "Manage Members",
        "View Task",
        "Create Task",
        "Manage Task",
        "Assign Task",
        "Delete Task",
        "View Comments",
        "Create Comment",
        "Manage Comments",
        "View Attachements",
        "Create Project Attachement",
        "Create Task Attachement",
        "Manage Attachements",
    ],

    "Member": [
        "View Project",
        "View Task",
        "Create Task",
        "Manage Task",
        "View Comments",
        "Create Comment",
        "View Attachements",
        "Create Project Attachement"
    ],

    "Viewer": [
        "View Project",
        "View Task",
        "View Comments",
        "Create Comment",
        "View Attavhements"
    ]
};

const seedRolePermission = async() => {
    for(const roleName in rolePermissions) {
        const role = await roleModel.findOne({name: roleName});

        if(!role) {
            continue;
        };

        for(const permissionName of rolePermissions[roleName]) {
            const permission = await permissionModel.findOne({name: permissionName});

            if(!permission) {
                continue;
            };

            await rolePermissionModel.updateOne(
                {
                role: role._id,
                permission: permission._id
            },
            {
                role: role._id,
                permission: permission._id
            },
            {
                upsert: true
            }
            );
        }
    }
}

module.exports = seedRolePermission;
