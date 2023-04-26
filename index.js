const server = require("./server");
const dbConn = require("./dbConn");

// Set port to 5000
const port = 5000;

// Start the server and listen on port 5000
const server_instance = server.listen(port, async () => {
  // Print a message to the console to indicate that the server is running
  console.log(`Example app listening at http://localhost:${port}`);
});

// Once the server is listening, test the database connection and sync the relations
server_instance.once("listening", async () => {
  // Test the database connection
  await dbConn.testConn();
});
