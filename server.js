const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT;
const logger = require("./logger/winston");

app.listen(PORT, () => {
    console.log("Server connected successfully");
    logger.info("Server is running successfully on port" + " " + PORT);
});