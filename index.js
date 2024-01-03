const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

const PORT = process.env.PORT || 3500;

// Create File
// fs.writeFile(path.join(__dirname, "/views", "404.html"), "Abbouy", (err) => {
//   if (err) throw err;

//   console.log("Flie created");
// });

// Middleware for cors oriGins
app.use(credentials);

// Cors
app.use(cors(corsOptions));

// Built in middleware to handle URL encoded data
app.use(express.urlencoded({ extended: false }));

// Built in middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Built in middleware for Static files
app.use(express.static(path.join(__dirname, "/public")));

// Routing
app.use("/", require("./routes/root"));
app.use("'/subdir", require("./routes/subdir"));
app.use("/register", require("./routes/api/register"));
app.use("/login", require("./routes/api/login"));
app.use("/refresh", require("./routes/api/refreshToken"));
app.use("/logout", require("./routes/api/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

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
