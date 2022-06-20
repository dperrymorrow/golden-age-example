import debounce from "https://unpkg.com/p-debounce@4.0.0/index.js";

export default {
  path: ["/todo", "/todo/{id}/edit"],
  hooks: {
    afterFirstRender({ $ }) {
      if ($.editInput) {
        $.editInput.scrollIntoView({ behavior: "smooth" });
        $.editInput.focus();
      }
    },

    afterRender({ $ }) {
      if ($.editInput) $.editInput.focus();
    },
  },

  events: {
    // "change $.doneCheckbox": ({ sendForm }, { target }) => {
    //   sendForm(target, {
    //     todo: { complete: target.checked },
    //   });
    // },

    "input $.searchInput": debounce(async ({ sendForm }, ev) => {
      sendForm(ev.target);
    }, 300),

    "keydown:Escape $.searchInput": ({ $, sendForm }) => {
      $.searchInput.value = "";
      sendForm($.searchInput);
    },

    "keydown:Enter $.newInput": async ({ $, nextRender }) => {
      await nextRender();
      $.newInput.scrollIntoView({ behavior: "smooth" });
    },

    // "click $.pencil": async ({ $, nextRender }) => {
    //   debugger;
    //   await nextRender();
    //   $.editInput.focus();
    // },

    "keydown:Escape $.editInput": (app) => app.get("/todo"),
  },
};
