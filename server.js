require("dotenv").config();
const app = require("./src/app");
const http = require("http");
const connectDb = require("./src/db/db");

connectDb();
const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
