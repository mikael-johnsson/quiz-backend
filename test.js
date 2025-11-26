// const logger = require("./logger");

// logger.logMessage("hejsan");

// const path = require("path");
// const pathobj = path.parse(__filename);
// console.log(pathobj);

// const EventEmitter = require("events");

// const emitter = new EventEmitter();
// emitter.on("messagedLogged", () => {
//   console.log("messaged logged");
// });
// emitter.emit("messagedLogged");

// emitter.on("logging", (arg) => {
//   console.log(arg.message);
// });
// emitter.emit("logging", { id: 1, message: "hej hopp" });

const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("hello world");
    res.end();
  }
  if (req.url === "/object") {
    res.write(
      JSON.stringify({
        id: 1,
        name: "micke",
        fruits: ["apple", "orange", "lemon"],
      })
    );
    res.end();
  }
});

server.listen(3000);
console.log("listening on port 3000...");
