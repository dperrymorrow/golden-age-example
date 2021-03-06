const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todos");
const authRoutes = require("./routes/oauth");
const tagRoutes = require("./routes/tags");
const app = (module.exports = express());

require("dotenv").config();

// add req.session cookie support
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({ secret: "who needs a SPA" }));

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.static(path.resolve(__dirname, "node_modules")));

app.engine(".html", require("ejs").__express);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

function hasAuth(req, res, next) {
  if (req.session.user) return next();
  else return res.redirect("/oauth");
}
// ROOT
app.get("/", (req, res) => {
  res.redirect("/todo");
});

app.get("/oauth", authRoutes.oauthStart);
app.get("/oauth-finish", authRoutes.oauthFinish);
app.get("/logout", hasAuth, authRoutes.logout);

app.get("/todo", hasAuth, todoRoutes.index);
app.post("/todo", hasAuth, todoRoutes.create);
app.get("/todo/:id", hasAuth, todoRoutes.show);
app.get("/todo/:id/edit", hasAuth, todoRoutes.index);

app.post("/tag", hasAuth, tagRoutes.create);

// cause HTML forms can only do POST/GET
app.post("/todo/:id", hasAuth, (req, res) => {
  if (req.body._method === "DELETE") todoRoutes.destroy(req, res);
  else todoRoutes.update(req, res);
});

app.listen(3001);
