---
titulo: ADR-0005 — METRICS como registro único
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0005 — `METRICS` como registro único

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

Cada tipo de bebida (total, cerveja, destilados, vinho) aparece em muitos lugares:
controle segmentado, unidades e casas decimais dos cartões, títulos de eixos, cores
de série e regex de detecção de coluna. Espalhar isso convida a inconsistências.

## Decisão

Centralizar tudo em **um registro `METRICS`** (`Dashboards/index.html:1135`). Cada
entrada tem `key`, `label`, `short`, `unit`, `dec`, `color` e `re` (regex de
cabeçalho). Adicionar um tipo de bebida se faz **lá**, não em cada painel.

```js
const METRICS = [
  {key:"total",  label:"Total", short:"Total álcool puro", unit:"L", dec:1, color:"#B9DA00",
   re:/(total.*(lit|alcohol))|(pure.*alcohol)|(litr)|(total_?alcohol)/i},
  {key:"beer",   label:"Cerveja", short:"Cerveja", unit:"doses", dec:0, color:"#B9DA00", re:/beer|cerveja|bier/i},
  // ...
];
```

## Alternativas consideradas

- **Constantes soltas por painel**: rápido no início, caótico na manutenção.
- **Config externa (JSON)**: desnecessário para 4 métricas e violaria o
  single-file.

## Consequências

- ✅ Uma fonte de verdade para bebida; painéis leem de `M(key)`.
- ✅ `detectCols` percorre `METRICS` ao contrário para `total` não roubar
  `beer_servings` (ver [pipeline](../pipeline-de-dados.md#detecção-de-colunas)).
- ⚠️ A ordem importa: `total` deve permanecer o primeiro na lista mas casado por
  último na detecção.

## Veja também

- [Índice de ADRs](README.md)
- [Pipeline de dados](../pipeline-de-dados.md)
- [Configuração](../../02-referencia/configuracao.md)
