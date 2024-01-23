require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const route = require("./routes");
const constants = require("./constants");
const cors = require("cors");
const app = express();

//io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  transports: ["websocket"],
});
require("./io")(io);

//MIDDLEWARE
// static files
app.use(express.static(path.join(__dirname, "public")));
//cors
app.use(cors());

//body parsing
app.set(express.json());
app.set(express.urlencoded({ extended: true }));
//nunjucks
nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
});

// set route prefix

//session
app.set(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

//logging
app.use(morgan("dev"));

//ROUTES
app.use(constants.MESSAGING_URL, route.MESSAGING_ROUTE);

//listen
app.listen(process.env.PORT, process.env.HOST, () => {
  const message = `Example app listening at http://${process.env.HOST}:${process.env.PORT}`;
  console.log(message);
});
