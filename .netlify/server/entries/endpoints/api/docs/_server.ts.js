import { j as json } from "../../../../chunks/index.js";
const __vite_glob_0_0 = "# Snow Docs\r\n\r\n- Welcome to the Snow Docs, the docs for the docs generator!\r\n\r\n## This website will teach you:\r\n\r\n- How to use Snow!\r\n\r\n";
const __vite_glob_0_1 = "# Installation\r\n\r\nTo install Snow, use this command:\r\n\r\n```\r\ngit clone https://github.com/snow-labs/make-docs\r\n```\r\n\r\nSometimes, you might have to do\r\n```\r\nnpm install\r\n```\r\nSince this is a SvelteKit project, to run the dev server, use:\r\n```\r\nnpm run dev\r\n```\r\nTo build the project, you can try using the adapter-auto, but you can use other adapters as well, as long as they are compatible with SvelteKit.\r\n";
const __vite_glob_0_2 = "# Setup\r\n\r\nTo setup Snow, all you have to do is navigate to `src/lib/config.ts` and change the values to your own.\r\n\r\nThen, to edit the docs, go to `static/docs` and add markdown files.\r\n\r\nTo add custom svelte pages, go to `src/routes/(docs)/docs` then add the custom path.";
async function GET() {
  const markdownFiles = /* @__PURE__ */ Object.assign({ "/static/docs/index.md": __vite_glob_0_0, "/static/docs/installation.md": __vite_glob_0_1, "/static/docs/setup.md": __vite_glob_0_2 });
  const files = [];
  for (const [path, content] of Object.entries(markdownFiles)) {
    const relativePath = path.replace("/static/docs/", "").replace(".md", "");
    const firstLine = content.split("\n")[0];
    const title = firstLine.replace(/^#\s+/, "") || relativePath;
    if (path.endsWith("index.md")) {
      files.unshift({
        path: "index",
        title: "Introduction"
      });
    } else {
      files.push({
        path: relativePath,
        title
      });
    }
  }
  return json(files);
}
export {
  GET
};
