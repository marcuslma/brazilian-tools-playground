# brazilian-tools-playground

Playground local em Vite para testar a biblioteca `brazilian-tools` no navegador.

A aplicação consome a biblioteca diretamente do GitHub, sem depender de publicação no npm:

```json
"brazilian-tools": "github:marcuslma/brazilian-tools#main"
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse `http://127.0.0.1:5173`.

## Verificações

```bash
npm run format:check
npm run build
```

O playground é ESM e inclui testes interativos para CPF, CNPJ, RG, telefone brasileiro e consulta de CEP.
