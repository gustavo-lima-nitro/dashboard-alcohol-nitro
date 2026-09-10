---
titulo: ADR-0003 — Dois runtimes para o .env (direto vs proxy)
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0003 — Dois runtimes para o `.env` (direto vs proxy)

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

Chat e clima precisam de chaves guardadas no `.env`. Um navegador em `file://`
**não** lê o `.env` (bloqueio de `fetch` a arquivo local). Além disso, expor a
chave Gemini ao navegador é aceitável em máquina do próprio analista, mas não em
deploy público.

## Decisão

Oferecer **dois runtimes zero-dependência**, e o front detecta o modo:

- `serve.ps1` — HttpListener puro; serve estáticos e o próprio `.env` (modo
  **direto**, chaves chegam ao navegador). Bom para uso local.
- `server.mjs` — Node 18+; serve estáticos e faz **proxy** de `/api/weather` e
  `/api/chat`; as chaves ficam no processo e o `.env` responde 403 (modo
  **proxy**).

`bootConfig()` escolhe proxy → direto → off.

## Alternativas consideradas

- **Só proxy Node**: exige Node instalado; nem todo analista tem.
- **Só estático PowerShell**: simples, mas expõe a chave — inaceitável em deploy.

## Consequências

- ✅ Uso local trivial (PowerShell) e deploy seguro (proxy) cobertos.
- ⚠️ Três caminhos de código para manter e testar
  ([configuração](../../02-referencia/configuracao.md)).
- ⚠️ Regras espelhadas (prompt de sistema, lista de modelos) precisam ficar em
  sincronia entre cliente e `server.mjs`.

## Veja também

- [Índice de ADRs](README.md)
- [Ambiente local](../../04-operacao/ambiente-local.md)
- [Configuração](../../02-referencia/configuracao.md)
