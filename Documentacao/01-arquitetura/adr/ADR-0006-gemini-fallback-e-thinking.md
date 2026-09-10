---
titulo: ADR-0006 — Cadeia de fallback Gemini e tratamento de "thinking"
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0006 — Cadeia de fallback Gemini e tratamento de "thinking"

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

O chat depende da API Gemini, sujeita a cota (429), indisponibilidade (5xx) e
modelos que vão e vêm (404). Além disso, modelos Gemini 3.x **raciocinam antes de
responder** e o "pensamento" consome o mesmo orçamento de saída: sem cuidado, a
resposta volta **vazia** com `finishReason: MAX_TOKENS` — um HTTP 200 enganoso.

## Decisão

- **Cadeia de fallback**: tentar `MODELS` em ordem. `RETRYABLE = {404,408,409,429,
  500,502,503,504}` cai para o próximo; 400/401/403 param a cadeia (erro de chave
  ou payload — trocar de modelo não ajuda).
- **Thinking**: enviar `thinkingConfig.thinkingLevel:"low"` + `maxOutputTokens:8192`.
  Se um 400 mencionar `thinking`, repetir o **mesmo** modelo sem o campo (modelos
  antigos não o conhecem).

Implementado em duas cópias: `askGemini`/`geminiBody` no `server.mjs:197` e
`callGeminiDirect`/`geminiBody` no cliente (`Dashboards/index.html:2364`).

## Alternativas consideradas

- **Um único modelo fixo**: frágil a cota e à evolução do catálogo.
- **`maxOutputTokens` apertado**: economiza tokens mas causa a resposta vazia.

## Consequências

- ✅ Robustez a erros transitórios e a modelos indisponíveis.
- ⚠️ Três lugares (`.env`, cliente, servidor) precisam da mesma lista de modelos.
- ⚠️ A lógica de fallback está duplicada; alterar uma cópia exige alterar a outra.

## Veja também

- [Índice de ADRs](README.md)
- [Integrações externas](../integracoes.md)
- [Configuração](../../02-referencia/configuracao.md)
