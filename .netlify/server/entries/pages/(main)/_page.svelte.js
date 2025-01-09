import { c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
import { c as config } from "../../../chunks/config.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="bg-cover justify-center items-center flex-col flex min-h-screen w-full"><h1 class="h1">${escape(config.title)}</h1> <div class="h-4"></div> <p>${escape(config.description)}</p> <div class="h-4"></div> <a class="btn variant-filled-primary" href="/docs" data-svelte-h="svelte-xi9etz">Docs</a></div>`;
});
export {
  Page as default
};
