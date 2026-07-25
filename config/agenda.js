require("dotenv").config();

const { Agenda } = require("agenda");
const { MongoBackend } = require("@agendajs/mongo-backend");

const agenda = new Agenda({
  backend: new MongoBackend({ address: process.env.MONGODB_URI }),
});

agenda.on("ready", () => {
  console.log("Agenda connected to MongoDB and ready to schedule jobs.");
});

module.exports = agenda;
