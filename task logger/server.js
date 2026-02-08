const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tasks.txt");
const indexPath = path.join(__dirname, "public", "index.html");

const server = http.createServer((req, res) => {

    // Modern URL method
    const myUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = myUrl.pathname;

    // Home Page
    if (pathname === "/") {
        fs.readFile(indexPath, (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    // Add Task
    else if (pathname === "/add") {

        const task = myUrl.searchParams.get("task");

        if (!task) {
            res.end("No task provided");
            return;
        }

        fs.appendFile(filePath, task + "\n", (err) => {
            res.writeHead(302, { Location: "/" });
            res.end();
        });
    }

    // Show Tasks
    else if (pathname === "/tasks") {

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err || !data) {
                res.end("No tasks available");
            } else {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Tasks:\n\n" + data);
            }
        });
    }

    // Clear All Tasks
    else if (pathname === "/clear") {

        fs.writeFile(filePath, "", (err) => {
            res.writeHead(302, { Location: "/" });
            res.end();
        });
    }

    else {
        res.writeHead(404);
        res.end("Route Not Found");
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
