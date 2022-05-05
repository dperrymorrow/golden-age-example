const superagent = require("superagent");
const Todos = require("./todo-model");
const { Octokit } = require("@octokit/core");

function helpers(req) {
  return {
    get id() {
      return parseInt(req.params.id);
    },

    get user() {
      return req.session?.user;
    },

    highlight(string) {
      const search = req.session?.options?.search;
      return search
        ? string.replace(search, `<span class="highlight">${search}</span>`)
        : string;
    },

    get options() {
      if (!req.session.options)
        req.session.options = {
          sortOn: "modified",
          sortDir: "DESC",
          search: null,
        };
      req.session.options = { ...req.session.options, ...(req.query || {}) };
      return req.session.options;
    },
  };
}

module.exports = {
  logout(req, res) {
    req.session = null;
    res.redirect("/todo");
  },

  oauthStart(req, res) {
    const { CLIENT_ID, REDIRECT_URI } = process.env;
    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&amp;redirect_uri=${REDIRECT_URI}`;
    res.render("oauth", { authorizeUrl });
  },

  async oauthFinish(req, res) {
    const { body } = await superagent.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI,
      }
    );

    const octokit = new Octokit({ auth: body.access_token });
    const { data } = await octokit.request("GET /user");
    req.session.user = data;

    res.redirect("/todo");
  },

  async index(req, res, next) {
    const { user, options, highlight } = helpers(req);
    try {
      const todos = await Todos.findAll(user, options);
      res.render("todos", { todos, options, user, highlight });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      // set to order by modified so you see the thing you just added...
      const { user } = helpers(req);
      req.session.options = {
        search: null,
        sortOn: "modified",
        sortDir: "ASC",
      };

      await Todos.create(user, req.body.todo);
      res.redirect("/todo");
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    const { user, id } = helpers(req);
    try {
      const todo = await Todos.find(user, id);
      res.render("todo", { todo, user });
    } catch (err) {
      next(err);
    }
  },

  async edit(req, res, next) {
    try {
      const { user, options, id, highlight } = helpers(req);
      const todos = await Todos.findAll(user, options);
      res.render("todos", { todos, editing: id, options, user, highlight });
    } catch (err) {
      next(err);
    }
  },

  async destroy(req, res, next) {
    const { id, user } = helpers(req);
    try {
      await Todos.destroy(user, id);

      res.redirect("/todo");
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    const { id, user } = helpers(req);

    try {
      const todo = await Todos.find(user, id);
      await Todos.update(user, { ...todo, ...req.body.todo });
      res.redirect("/todo");
    } catch (err) {
      next(err);
    }
  },
};
