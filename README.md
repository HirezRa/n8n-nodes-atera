# n8n-nodes-atera

`n8n-nodes-atera` is an n8n community node package for working with the Atera API (`/api/v3`).

## Features

- API key authentication using `X-API-KEY`
- Base URL override support (default: `https://app.atera.com`)
- Resource/operation support:
  - `Account`: `Get`
  - `Agent`: `Get Many`, `Get`, `Delete`
  - `Alert`: `Get Many`, `Get`, `Create`, `Update`, `Delete`
  - `Customer`: `Get Many`, `Get`, `Create`, `Update`, `Delete`
  - `Ticket`: `Get Many`, `Get`, `Create`, `Update`, `Delete`
- Pagination controls for list operations (`Return All`, `Limit`, `Page`)

## Installation

In your n8n environment:

```bash
npm install n8n-nodes-atera
```

For local n8n custom nodes:

```bash
cd ~/.n8n/custom
npm install n8n-nodes-atera
```

Restart n8n after installation.

## Credentials

Create **Atera API** credentials in n8n:

- **API Key**: from `Atera Admin > Data management > API`
- **Base URL**: `https://app.atera.com` (default)

Credential test endpoint: `GET /api/v3/account`.

## Usage Notes

- For `Create`/`Update` operations, pass request data through the `Payload` JSON field.
- Operation payload schemas follow Atera official documentation.
- Use list operation pagination options for large datasets.

## Links

- npm package: [https://www.npmjs.com/package/n8n-nodes-atera](https://www.npmjs.com/package/n8n-nodes-atera)
- Atera API docs: [https://app.atera.com/apidocs](https://app.atera.com/apidocs)
- Atera API support article: [https://support.atera.com/hc/en-us/articles/219083397-API](https://support.atera.com/hc/en-us/articles/219083397-API)
- Repository: [https://github.com/hirez10/n8n-nodes-atera](https://github.com/hirez10/n8n-nodes-atera)
- Issues: [https://github.com/hirez10/n8n-nodes-atera/issues](https://github.com/hirez10/n8n-nodes-atera/issues)

## Development

```bash
npm install
npm run lint
npm run build
```

## Contributor

- [Erez Rahamim](https://github.com/hirez10)

## License

MIT
