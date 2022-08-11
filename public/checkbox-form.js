import { ActionClass } from "/golden-age/dist/index.js";

export default class CheckboxForm extends ActionClass {
  static selector = ".checkbox-form";
  actions = {};

  mount() {
    // console.log("+ mounted", this.constructor.name, this.$root);
  }

  unmount() {
    // console.log("- unmount", this.constructor.name, this.$root);
  }
}
