# brazilian-tools-playground

A Vite playground for testing the `brazilian-tools` library in the browser.

The application consumes the library directly from GitHub without requiring an npm publication:

```json
"brazilian-tools": "github:marcuslma/brazilian-tools#main"
```

## Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Checks

```bash
npm run format:check
npm run build
```

The playground is a React + Vite ESM application that interactively covers the library’s 10 public domains: CPF, CNPJ, RG, phone numbers, PIS, CNH, license plates, BRL values, states/regions, and CEP. Each card keeps its own input, status, and output without a global panel. The default interface is in Brazilian Portuguese and can be switched to English or Spanish. A light/dark theme toggle is also available, with both preferences persisted locally. In addition to the existing generators, the phone card can generate mobile numbers and the license plate card can generate old and Mercosur models. Every generation also updates the corresponding card input automatically. The layout uses two columns on wide screens and one column below 900px to preserve control and output readability.
