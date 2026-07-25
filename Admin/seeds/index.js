const mongoose = require("mongoose");
const seedRoles = require("./role.seed")
const seedPermissions = require("./permission.seed")
const seedRolePermissions = require("./role-permission.seed");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const  seedDatabase = async() => {
  await mongoose.connect(MONGODB_URI);

  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();

  console.log("Seeding complete.");

  await mongoose.disconnect();
}

seedDatabase();
