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

O playground é uma aplicação React + Vite em ESM e cobre interativamente os 10 domínios públicos da biblioteca: CPF, CNPJ, RG, telefone, PIS, CNH, placas, valores em reais, estados/regiões e CEP. Cada cartão mantém seu próprio input, status e output, sem painel global. Além dos geradores existentes, o telefone permite gerar celulares e o cartão de placas permite gerar modelos antigo e Mercosul. Toda geração também atualiza automaticamente o input do cartão correspondente. O layout usa duas colunas em telas amplas e uma coluna até 900px para preservar a legibilidade dos controles e outputs.
