---
title: Setup
sidebar-position: 2
---

# Setup

This guide will help you configure your Snow documentation site after installation.

## Configuration

Navigate to `src/lib/config.ts` to customize your site's configuratio

## Adding Documentation

### Markdown Files

Your documentation lives in the `static/docs` directory. Here's an example of how to organize it:

```plaintext
static/docs/
├── index.md          # Landing page
├── getting-started/
│   ├── index.md      # Section landing page
│   └── quickstart.md # Sub-page
└── advanced/
    └── features.md   # Another page
```

Each markdown file can have [frontmatter](./frontmatter) to define its title and position in the sidebar.

*TIP: Each markdown file can also be in a folder on the sidebar and will use the folder name.*

## Next Steps

- Add your first documentation page
- Customize the theme
- Deploy your site using one of the [supported adapters](./installation#deployment-adapters)