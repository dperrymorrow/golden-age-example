import debounce from "https://unpkg.com/p-debounce@4.0.0/index.js";

export default {
  path: ["/todo", "/todo/{id}/edit"],
  hooks: {
    afterFirstRender({ $root }) {
      const $input = $root.querySelector(".edit-title-input");
      if ($input) {
        $input.scrollIntoView({ behavior: "smooth" });
        $input.focus();
      }
    },

    afterRender({ $root }) {
      const $input = $root.querySelector(".edit-title-input");
      if ($input) $input.focus();
    },
  },

  events: {
    "change input[type='checkbox']": ({ sendForm }, { target }) => {
      sendForm(target, {
        todo: { complete: target.checked },
      });
    },

    "input input[type='search']": debounce(({ sendForm }, ev) => {
      sendForm(ev.target);
    }, 300),

    "keydown:Escape input[type='search']": ({ sendForm }, { target }) => {
      target.value = "";
      sendForm(target);
    },

    "keydown:Enter .new-todo input[type='text']": async (app, { target }) => {
      await app.nextRender();
      target.value = "";
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    },

    "keydown:Escape .edit-title-input": (app) => app.get("/todo"),
  },
};
