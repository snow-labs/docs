---
title: Frontmatter
sidebar-position: 3 
---

# Frontmatter

Frontmatter is a way to add metadata to your Markdown files. It must be placed at the very beginning of the file between two sets of triple dashes (`---`).

## Fields

These are the basic frontmatter fields supported:

```yaml
---
title: Frontmatter          # The title shown in the sidebar and page heading
sidebar-position: 3         # Controls the order in pages appear in the sidebar
---
```

The `title` field is required and determines how your page will be displayed in the navigation sidebar and as the main heading.

The `sidebar-position` field controls the order of pages in the sidebar navigation. Lower numbers appear higher in the list. This field is optional for `index.md` files, which have default values.

## Example Usage

This is the frontmatter used on this current page:

```yaml
---
title: Frontmatter
sidebar-position: 3
---
```

## Notes

- Frontmatter must be in valid YAML format
- The opening `---` must be the first line of the file
- There must be a space after the colon in each field (e.g., `title: My Page` not `title:My Page`)
- No frontmatter is needed for `index.md` files as they have default values
