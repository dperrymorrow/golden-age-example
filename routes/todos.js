const Prisma = require("@prisma/client");
const viewHelpers = require("../views/helpers.js");
const helpers = require("./helpers");
const prisma = new Prisma.PrismaClient();

const perPage = 10;

module.exports = {
  async index(req, res, next) {
    const { options } = helpers(req);

    const user = req.session.user;
    const editing = req.params.id ? Number(req.params.id) : null;
    const highlight = req.query.highlight ? Number(req.query.highlight) : null;

    const where = options.search
      ? { userId: user.id, title: { contains: options.search } }
      : { userId: user.id };

    try {
      const todos = await prisma.todo.findMany({
        where,
        skip: options.page * perPage,
        take: perPage,
        include: { tags: true },
        orderBy: { [options.sortOn]: options.sortDir },
      });

      const {
        _count: { id: total },
      } = await prisma.todo.aggregate({ where, _count: { id: true } });

      res.render("todos", {
        total,
        numPages: Math.floor(total / perPage),
        todos,
        options,
        editing,
        highlight,
        user,
        helpers: viewHelpers(req),
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { id } = await prisma.todo.create({
        data: {
          ...req.body.todo,
          userId: req.session.user.id,
        },
      });

      req.session.options = {
        ...req.session.options,
        page: 0,
        search: null,
        sortOn: "modified",
        sortDir: "desc",
      };

      res.redirect(`/todo?highlight=${id}`);
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    const id = Number(req.params.id);
    const user = req.session.user;

    try {
      const tags = await prisma.tag.findMany({
        where: { userId: req.session.user.id },
      });
      const todo = await prisma.todo.findUnique({
        where: { id },
        include: { tags: true },
      });
      res.render("todo", { tags, todo, user, helpers: viewHelpers(req) });
    } catch (err) {
      next(err);
    }
  },

  async destroy(req, res, next) {
    const id = Number(req.params.id);

    try {
      await prisma.todo.delete({ where: { id } });
      res.redirect("/todo");
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    const id = Number(req.params.id);

    try {
      await prisma.todo.update({
        where: { id },
        data: req.body.todo,
      });
      res.redirect("/todo");
    } catch (err) {
      next(err);
    }
  },
};
