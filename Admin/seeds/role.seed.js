const roleModel = require("../roles.model");

const roles = [
        {name: "Owner"},
        {name: "Project Manager"},
        {name: "Member"},
        {name: "Viewer"}
];

const seedRoles = async() => {
    for(const role of roles) {
        await roleModel.updateOne(
            {name: role.name},
            role,
            {upsert: true}
        );
    }
};

module.exports = seedRoles;



