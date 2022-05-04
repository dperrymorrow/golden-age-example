import { parse } from "https://unpkg.com/marked@4.0.14/lib/marked.esm.js";

function _updatePreview() {
  const $preview = document.querySelector("#markdown-preview");
  const $description = document.querySelector("textarea");
  $preview.innerHTML = parse($description.value);
}

export default {
  path: "/todo/{id}",

  hooks: {
    afterFirstRender: _updatePreview,
  },

  events: {
    "keyup textarea": _updatePreview,

    "input input": (app, ev) => {
      document.querySelector("h1").innerHTML = ev.target.value;
    },
  },
};
