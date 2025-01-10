---
title: Installation
sidebar-position: 1
---

# Installation

This guide will help you set up Snow, a documentation site generator built with SvelteKit.

## Prerequisites

Before installing Snow, ensure you have:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Git](https://git-scm.com/) installed on your system
- A code editor (we recommend [Cursor](https://www.cursor.com/))

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/snow-labs/make-docs
cd make-docs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Your site should now be running at `http://localhost:5173`

## Building for Production

Snow uses SvelteKit's adapter system for deployment. By default, it uses `@sveltejs/adapter-auto` which automatically chooses the right adapter based on your deployment platform.

To build your site:
```bash
npm run build
```

### Deployment Adapters

You can use different adapters depending on your deployment target:

- `adapter-auto`: Automatic platform detection (default)
- `adapter-static`: Static site generation
- `adapter-node`: Node.js server
- `adapter-netlify`: Netlify deployment
- `adapter-vercel`: Vercel deployment

To use a different adapter:

1. Install the adapter:
```bash
npm install -D @sveltejs/adapter-static # example for static adapter
```

2. Update your `svelte.config.js` to use the new adapter.

## Next Steps

After installation, check out the [Setup Guide](./setup) to learn how to configure your documentation site.
