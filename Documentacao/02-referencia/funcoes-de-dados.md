---
titulo: Funções de dados
area: referencia
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Funções de dados

Referência das funções de ingestão, parsing, normalização e filtragem em
`Dashboards/index.html`.

## Sumário

- [norm](#norm)
- [sniff](#sniff)
- [parseCSV](#parsecsv)
- [toNum](#tonum)
- [detectCols](#detectcols)
- [ingest](#ingest)
- [Filtros](#filtros)

## norm

`Dashboards/index.html:1041` — normaliza um nome para uso como chave de
reconciliação.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `norm(s) → string` |
| Faz | NFD + strip de diacríticos, minúsculas, `&`→` and `, `st.`→`saint`, `[^a-z0-9]+`→espaço, `trim` |
| Usado por | `CONT_MAP`, `ALIAS`, `topoDecode`, `ingest` |

Exemplo: `norm("Côte d'Ivoire")` → `"cote d ivoire"`;
`norm("Bosnia & Herzegovina")` → `"bosnia and herzegovina"`.

## sniff

`Dashboards/index.html:1097` — detecta o delimitador da primeira linha.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `sniff(line) → "," \| ";" \| "\t" \| "\|"` |
| Como | conta candidatos fora de aspas; devolve o mais frequente (empate → `,`) |

## parseCSV

`Dashboards/index.html:1103` — tokeniza o texto em matriz de células.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `parseCSV(text) → string[][]` |
| Trata | BOM (`﻿`), CRLF/CR→LF, aspas com escape `""`, delimitador de `sniff` |
| Descarta | linhas totalmente vazias |

```js
text = text.replace(/^﻿/,"").replace(/\r\n?/g,"\n");
const D = sniff(first);           // delimitador da 1ª linha
// máquina de estados com flag de aspas (q)
return rows.filter(r=>r.some(c=>String(c).trim()!==""));
```

## toNum

`Dashboards/index.html:1121` — converte texto em número tolerando formatos.

| Entrada | Saída |
| --- | --- |
| `"1.234,5"` (pt-BR) | `1234.5` |
| `"1,234.5"` (en) | `1234.5` |
| `"NA"`, `"n/a"`, `"null"`, `"-"`, `"—"`, vazio | `NaN` |
| `"12%"`, `"12 kg"` | `12` (remove `%` e sufixo alfabético) |

Heurística de milhar/decimal: com `,` **e** `.`, o último a aparecer é o separador
decimal.

## detectCols

`Dashboards/index.html:1243` — casa índices de coluna por regex de `METRICS`.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `detectCols(header) → {country, total?, beer?, spirit?, wine?}` |
| País | primeiro cabeçalho que casa `^(country\|pais\|país\|nation\|nome\|name\|territor)`; senão índice 0 |
| Métricas | percorre `METRICS` **ao contrário** (total por último) para não roubar `beer_servings` |

## ingest

`Dashboards/index.html:1258` — transforma o texto do CSV em `S.rows` e reconfigura
`S`.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `ingest(text, name) → {n, unmapped}` |
| Erros | "Arquivo vazio ou sem linhas de dados." / "Nenhuma coluna de consumo reconhecida…" / "Nenhuma linha válida encontrada." |
| Efeitos colaterais | escreve `S.rows, cols, fileName, metric, conts, countries, sx, sy, sortKey, sortDir, hi` |

Passos: deduplica por `norm(country)`; resolve `geoKey` via `ALIAS` e `continent`
via `CONT_MAP`; converte cada métrica com `toNum`; **deriva `total`** se ausente
(`_derived`); mantém só linhas com ao menos um valor.

Retorno:

| Campo | Significado |
| --- | --- |
| `n` | linhas válidas ingeridas |
| `unmapped` | quantos ficaram com `continent === "—"` |

## Filtros

| Função | Linha | Papel |
| --- | --- | --- |
| `baseFiltered()` | `:1306` | continente + país (sem o corte de faixa); alimenta os limites do slider |
| `filtered()` | `:1312` | `baseFiltered()` + corte numérico `S.range`; descarta valor `null` |
| `recomputeBounds(keepRange)` | `:1320` | recalcula `S.bounds`; se `keepRange`, reprojeta `S.range` por `clamp`, senão iguala aos bounds; chama `syncDual()` |

```js
function filtered(){
  const m = S.metric, [lo,hi] = S.range || [-Infinity,Infinity];
  return baseFiltered().filter(r=>{
    const v = r[m];
    if(v==null) return false;
    return v>=lo-1e-9 && v<=hi+1e-9;   // tolerância a ponto flutuante
  });
}
```

## Veja também

- [Pipeline de dados](../01-arquitetura/pipeline-de-dados.md)
- [Modelo de estado](../01-arquitetura/modelo-de-estado.md)
- [Qualidade e validação](../03-dados/qualidade-e-validacao.md)
- [Índice de símbolos](README.md)
- [Hub da documentação](../README.md)
