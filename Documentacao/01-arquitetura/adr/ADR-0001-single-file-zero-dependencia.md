---
titulo: ADR-0001 — Dashboard single-file, zero dependência
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0001 — Dashboard single-file, zero dependência

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

O produto precisa ser fácil de distribuir e auditar por um analista, rodando até
mesmo sem servidor. Não há pipeline de build nem cultura de gerenciador de pacotes
para este entregável.

## Decisão

Concentrar HTML, CSS e JavaScript em **um único arquivo**
(`Dashboards/index.html`), sem build step, sem `npm`, sem test runner e sem
framework. Tudo roda no navegador, inclusive por `file://`.

## Alternativas consideradas

- **SPA com bundler (Vite/Webpack)**: melhor DX, mas adiciona toolchain, node_modules
  e um passo de build — atrito para distribuir e auditar.
- **Múltiplos arquivos estáticos**: simples, mas perde a portabilidade de "um
  arquivo que abre em qualquer lugar".

## Consequências

- ✅ Portabilidade máxima: abrir o arquivo basta.
- ✅ Superfície de dependência praticamente nula (só Google Fonts).
- ⚠️ O arquivo é grande e contém uma linha de ~100 KB (TopoJSON) — não pode ser
  reescrito por inteiro sem risco de corromper. Ver
  [desempenho](../../05-qualidade/desempenho.md).
- ⚠️ Sem test runner: a verificação é manual/visual
  ([estratégia de testes](../../05-qualidade/estrategia-de-testes.md)).

## Veja também

- [Índice de ADRs](README.md)
- [Contexto e escopo](../../00-visao-geral/contexto-e-escopo.md)
- [Desempenho](../../05-qualidade/desempenho.md)
