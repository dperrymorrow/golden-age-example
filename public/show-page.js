import { parse } from "https://unpkg.com/marked@4.0.14/lib/marked.esm.js";

function renderMarkdown($) {
  $.mdPreview.innerHTML = parse($.mdTextarea.value);
}

export default {
  path: "/todo/{id}",

  hooks: {
    afterRender: ({ $ }) => renderMarkdown($),
  },

  events: {
    "input $.mdTextarea": ({ $ }) => renderMarkdown($),
    "input $.titleInput": ({ $ }) => ($.header.innerHTML = $.titleInput.value),

    "submit $.tagForm": async ({ $, nextRender }) => {
      await nextRender();
      $.tagInput.focus();
    },
  },
};
