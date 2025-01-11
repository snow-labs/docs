---
title: instance.json
sidebar-position: 0
---

# instance.json

The `instance.json` file is used to configure documentation instances, allowing you to manage multiple versions of your documentation (like v1, v2, etc.) or different documentation sections.

## Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | The name that appears in the sidebar dropdown |
| `sidebarPosition` | number | Controls the order in the sidebar dropdown (lower numbers appear first) |

## Example

```json
{
    "name": "V1",
    "sidebarPosition": 0
}
```

## Usage

Place the `instance.json` file in your documentation root folder to define how that instance appears in the version selector dropdown.

For example:
```plaintext
docs/
├── v1/
│   ├── instance.json    # V1 instance config
│   └── ... docs files
└── v2/
    ├── instance.json    # V2 instance config
    └── ... docs files
```


