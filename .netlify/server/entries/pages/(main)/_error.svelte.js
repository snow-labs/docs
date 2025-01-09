import { g as getContext, c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
import { u as updated, s as stores } from "../../../chunks/client.js";
({
  get current() {
    return updated.current;
  },
  check: stores.updated.check
});
function context() {
  return getContext("__request__");
}
const page$1 = {
  get data() {
    return context().page.data;
  },
  get error() {
    return context().page.error;
  },
  get form() {
    return context().page.form;
  },
  get params() {
    return context().page.params;
  },
  get route() {
    return context().page.route;
  },
  get state() {
    return context().page.state;
  },
  get status() {
    return context().page.status;
  },
  get url() {
    return context().page.url;
  }
};
const page = page$1;
const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div><h1 class="h1">${escape(page.status)}</h1> <p>${escape(page.error?.message)}</p></div>`;
});
export {
  Error$1 as default
};
