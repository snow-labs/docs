---
title: Folders
sidebar-position: 4
---

# Using Folders in Snow

Folders are a powerful way to organize your documentation into logical sections. Snow automatically converts your folder structure into a nested sidebar navigation.

## Folder Structure

Your documentation can be organized using folders in the `static/docs` directory:

```plaintext
static/docs/
├── index.md                # Main landing page
├── getting-started/        # A section for getting started
│   ├── installation.md    # Installation guide
│   └── configuration.md   # Configuration guide
└── advanced/              # Advanced topics section
    └── features/         # Nested folder for features
        └── api.md        # API documentation
```

## How Folders Work

Each folder becomes a section in your sidebar navigation

## Best Practices

1. **Organize Logically**: Group related documents together
2. **Use Clear Names**: Choose folder names that clearly describe their contents
3. **Keep it Simple**: Avoid deeply nested folders (max 2-3 levels)

## Examples

### Basic Section
```plaintext
guides/
├── quickstart.md     # Quick start guide
└── advanced.md       # Advanced guide
```

### Complex Section
```plaintext
api/
├── authentication/   # Auth subsection
│   ├── oauth.md     # OAuth guide
│   └── jwt.md       # JWT guide
└── endpoints/       # Endpoints subsection
    ├── users.md    # Users API
    └── posts.md    # Posts API
```

## Using folder.json Files

In addition to Markdown files, Snow supports `folder.json` files for documentation. These work exactly like Markdown files but use JSON format instead:

```json
{
    "title": "API Reference",
    "sidebar-position": 3,
}
```

The JSON files follow the same rules as Markdown files:
- Can be placed anywhere in the folder structure
- Support the same frontmatter fields (`title`, `sidebar-position`)


## Tips

- Use lowercase names for folders
- Use hyphens instead of spaces in folder names
- Keep folder names short but descriptive

