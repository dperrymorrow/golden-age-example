const Prisma = require("@prisma/client");
const prisma = new Prisma.PrismaClient();

module.exports = {
  async create(req, res, next) {
    const todoId = Number(req.body.todoId);

    try {
      await prisma.todo.update({
        where: { id: todoId },
        data: {
          tags: {
            create: [
              {
                ...req.body.tag,
                userId: req.session.user.id,
              },
            ],
          },
        },
      });

      res.redirect(`/todo/${todoId}`);
    } catch (err) {
      next(err);
    }
  },
};
