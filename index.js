const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const bodyParser = require("body-parser");
const routes = require("./routes");
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

app.get("/oauth", routes.oauthStart);
app.get("/oauth-finish", routes.oauthFinish);

app.get("/logout", hasAuth, routes.logout);
app.get("/todo", hasAuth, routes.index);
app.post("/todo", hasAuth, routes.create);
app.get("/todo/:id", hasAuth, routes.show);
app.get("/todo/:id/edit", hasAuth, routes.edit);

app.post("/todo/:id", hasAuth, (req, res) => {
  if (req.body._method === "DELETE") routes.destroy(req, res);
  else routes.update(req, res);
});

app.listen(3001);
