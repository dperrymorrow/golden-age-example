export default {
  path: ["/todo", "/todo/{id}/edit"],
  hooks: {
    afterFirstRender(app, event) {
      const $input = document.querySelector(".edit-title-input");
      if ($input) {
        $input.scrollIntoView({ behavior: "smooth" });
        $input.focus();
      }
    },

    afterRender(app, event) {
      const $input = document.querySelector(".edit-title-input");
      if ($input) $input.focus();
    },
  },

  events: {
    "change input[type=\"checkbox\"]": (app, { target }) => {
      app.sendForm(target.closest("form"), { todo: { complete: target.checked } });
    },

    "keyup input[type='search']": (app, ev) => {
      app.sendForm(ev.target.closest("form"));
    },

    "keydown:Escape input[type='search']": (app, ev) => {
      ev.target.value = "";
      app.sendForm(ev.target.closest("form"));
    },

    "keydown:Enter .new-todo input[type='text']": async (app, ev) => {
      await app.nextRender();
      ev.target.value = "";
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    },

    "keydown:Enter .edit-title-input": (app, { target }) => {
      app.sendForm(target.closest("form"));
    },

    "keydown:Escape .edit-title-input": (app) => app.get("/todo"),
  },
};
