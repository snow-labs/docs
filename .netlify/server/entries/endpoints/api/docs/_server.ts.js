import { j as json } from "../../../../chunks/index.js";
import fs from "fs";
import path from "path";
function getFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getFiles(fullPath, baseDir));
    } else if (item.name.endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const firstLine = content.split("\n")[0];
      const title = firstLine.replace(/^#\s+/, "") || item.name.replace(".md", "");
      const relativePath = path.relative(baseDir, fullPath).replace(/\.md$/, "").replace(/\\/g, "/");
      const folderPath = path.relative(baseDir, dir).replace(/\\/g, "/");
      const displayTitle = folderPath && !item.name.startsWith("index") ? `${folderPath}/${title}` : title;
      if (item.name === "index.md") {
        files.unshift({
          path: relativePath,
          title: "Introduction"
        });
      } else {
        files.push({
          path: relativePath,
          title: displayTitle
        });
      }
    }
  }
  return files;
}
async function GET() {
  const files = getFiles("static/docs");
  return json(files);
}
export {
  GET
};
