---
titulo: Estado da documentação
area: meta
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Estado da documentação

Controle de cobertura, lacunas e backlog do agente `documentador-site`.

## Sumário

- [Referência](#referência)
- [Cobertura por área](#cobertura-por-área)
- [Lacunas conhecidas](#lacunas-conhecidas)
- [Backlog priorizado](#backlog-priorizado)

## Referência

| Campo | Valor |
| --- | --- |
| Último commit documentado | `94260d7` |
| Data da última execução | 2026-09-10 |
| Modo da execução | **A** (primeira rodada — árvore criada do zero) |
| Total de páginas | 34 |

Commits cobertos até aqui: `113b187`, `cd74467`, `1447ab3`, `f08e7ef`,
`d148764`, `94260d7`.

## Cobertura por área

| Área | Páginas | Estado |
| --- | --- | --- |
| 00 · Visão geral | contexto-e-escopo, stakeholders-e-fluxo, glossario | ✅ completa |
| 01 · Arquitetura | visao-geral, modelo-de-estado, pipeline-de-dados, camada-de-apresentacao, integracoes, 7 ADRs | ✅ completa |
| 02 · Referência | README (índice), funcoes-de-dados, funcoes-de-render, estatistica, configuracao | ✅ boa; ver lacunas |
| 03 · Dados | dicionario-de-dados, qualidade-e-validacao, esquema-supabase | ✅ completa |
| 04 · Operação | ambiente-local, build-e-deploy, runbooks | ✅ completa |
| 05 · Qualidade | estrategia-de-testes, seguranca-e-privacidade, desempenho | ✅ completa |
| _meta | estado, historico-execucoes, convencoes-de-documentacao | ✅ completa |

## Lacunas conhecidas

1. **Detalhamento fino dos painéis SVG**: `renderMap`, `renderScatter`,
   `renderHist`, `renderCorr` estão documentados por assinatura e papel, mas sem o
   passo a passo interno (construção de eixos, zoom/pan em `applyZoom`, tooltips).
   Os corpos completos dessas funções não foram lidos linha a linha nesta rodada.
2. **Controles e interação**: `buildControls`, `buildCountryList`, `syncDual`,
   `onDual`, `initMapInteractions` estão só no índice de símbolos; falta uma página
   dedicada de "controles do rail".
3. **Testes automatizados**: inexistentes; funções puras seriam testáveis.
4. **`renderInsights`**: a lógica das frases automáticas não foi detalhada.
5. **Confirmar números de linha** após qualquer edição futura no `index.html`
   (podem deslocar).

## Backlog priorizado

Para a próxima sexta (Modo B, se não houver novidade — escolher de 2 a 4):

1. **(alta)** Aprofundar `renderMap` e `initMapInteractions`/`applyZoom`: ler os
   corpos, documentar construção do SVG, zoom/pan e `#mapClip`, com trechos
   `arquivo:linha`. Alimenta [funções de render](../02-referencia/funcoes-de-render.md)
   e [desempenho](../05-qualidade/desempenho.md).
2. **(alta)** Criar `02-referencia/controles-e-interacao.md` cobrindo o rail de
   filtros, o slider dual (`syncDual`/`onDual`) e o destaque cruzado (`toggleHi`).
3. **(média)** Detalhar `renderScatter` (eixos, regressão desenhada) e `renderHist`
   (bins de Sturges) com exemplos numéricos.
4. **(média)** Documentar `renderInsights`: quais frases e sob quais condições.
5. **(média)** Expandir [estratégia de testes](../05-qualidade/estrategia-de-testes.md)
   com um roteiro de CSVs de borda versionáveis (delimitador `;`, números pt-BR,
   coluna total ausente, país em português).
6. **(baixa)** Glossário: acrescentar termos de UI (rail, dropzone, hero, dsBadge).
7. **(baixa)** Revisar todos os números de linha citados contra o commit vigente.

## Veja também

- [Histórico de execuções](historico-execucoes.md)
- [Convenções de documentação](convencoes-de-documentacao.md)
- [Hub da documentação](../README.md)
