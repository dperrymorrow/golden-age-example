import { parse } from "https://unpkg.com/marked@4.0.14/lib/marked.esm.js";

export default {
  path: "/todo/{id}",

  hooks: {
    afterFirstRender({ $root }) {
      $root.querySelector("#markdown-preview").innerHTML = parse(
        $root.querySelector("textarea").value
      );
    },

    afterRender({ $bind }) {
      $bind(".title-input", "h1");
      $bind("textarea", "#markdown-preview", (val) => parse(val));
    },
  },
};
