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

The playground is a React + Vite ESM application that interactively covers the library’s 10 public domains: CPF, CNPJ, RG, phone numbers, PIS, CNH, license plates, BRL values, states/regions, and CEP. The UI is built with Tailwind CSS, and accessible selects, switches, and palette/theme controls use Headless UI. The default interface is in Brazilian Portuguese and can be switched to English or Spanish through `react-i18next`; the browser language is detected automatically and the choice is persisted locally. A theme select supports light, dark, and system modes, while a persistent green/yellow/blue palette select harmonizes the interface. Each domain is isolated in its own card component, with shared controls and state logic under `src/components` and `src/hooks`. The layout uses two columns on wide screens and one column below the responsive breakpoint to preserve control and output readability.
