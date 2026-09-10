---
titulo: ADR-0004 — Renderização por redraw completo
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0004 — Renderização por redraw completo

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

A cada mudança de filtro, métrica ou seleção, vários painéis precisam refletir o
novo recorte. Sem framework de reatividade (ver
[ADR-0001](ADR-0001-single-file-zero-dependencia.md)), é preciso uma estratégia
simples e previsível de atualização de DOM.

## Decisão

**Redraw completo**: `renderAll()` recalcula `filtered()` e redesenha todos os
painéis do zero. Sem diffing, sem estado intermediário por painel. Cada
`renderX(data)` recebe as linhas já filtradas.

## Alternativas consideradas

- **Virtual DOM / diffing**: menos repaint, mas exige biblioteca ou muito código.
- **Atualização incremental manual por painel**: propensa a estados inconsistentes
  entre painéis.

## Consequências

- ✅ Modelo mental simples: mudou estado → `renderAll()` → tudo consistente.
- ✅ Adicionar painel é local: uma função + uma chamada em `renderAll`.
- ⚠️ Custo de repaint proporcional ao número de países; aceitável para ~193 linhas.
  Ver [desempenho](../../05-qualidade/desempenho.md).
- ⚠️ Animações precisam escrever o valor final direto no atributo para não deixar
  elementos invisíveis se a animação falhar
  ([camada de apresentação](../camada-de-apresentacao.md#animação)).

## Veja também

- [Índice de ADRs](README.md)
- [Camada de apresentação](../camada-de-apresentacao.md)
- [Desempenho](../../05-qualidade/desempenho.md)
