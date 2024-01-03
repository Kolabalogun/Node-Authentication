const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 3500;

// Create File
// fs.writeFile(path.join(__dirname, "/views", "404.html"), "Abbouy", (err) => {
//   if (err) throw err;

//   console.log("Flie created");
// });

// Cors

app.use(cors(corsOptions));

// Built in middleware to handle URL encoded data
app.use(express.urlencoded({ extended: false }));

// Built in middleware for JSON
app.use(express.json());

// Built in middleware for Static files
app.use(express.static(path.join(__dirname, "/public")));

// Routing
app.use("/", require("./routes/root"));
app.use("'/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));
app.use("/register", require("./routes/api/register"));
app.use("/login", require("./routes/api/login"));

// app.get("/", (req, res) => {
//   res.sendFile("./views/index.html", { root: __dirname });
// });

app.get("/about(.html)?", (req, res) => {
  res.sendFile("./views/about.html", { root: __dirname });
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/");
});

// Route Handlers
app.get(
  "/",
  (req, res, next) => {
    console.log("Attempting to load HelloPage");
    next();
  },
  (req, res) => {
    res.send("Hello World");
  }
);

app.get("/*", (req, res) => {
  res.status(404).sendFile("./views/404.html", { root: __dirname });
});

// Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`listening on port ${PORT} `));
