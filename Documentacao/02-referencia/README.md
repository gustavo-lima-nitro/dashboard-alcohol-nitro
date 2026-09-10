---
titulo: Índice de símbolos
area: referencia
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Índice de símbolos

Símbolo → `arquivo:linha` (commit `94260d7`). Linhas podem deslocar; confira com
`grep -n` se necessário. `Dashboards/index.html` abreviado como **IH**.

## Sumário

- [Estado e registros](#estado-e-registros)
- [Ingestão e parsing](#ingestão-e-parsing)
- [Estatística](#estatística)
- [Geometria e projeção](#geometria-e-projeção)
- [Filtros e escalas](#filtros-e-escalas)
- [Render](#render)
- [Controles e interação](#controles-e-interação)
- [Integrações (boot)](#integrações-boot)
- [server.mjs](#servermjs)

## Estado e registros

| Símbolo | Local | Ver |
| --- | --- | --- |
| `BRAND` | IH:986 | [config](configuracao.md) |
| `RAMP`, `DIV_MID/NEG/POS`, `NODATA` | IH:990–997 | [estatística](estatistica.md#escalas-de-cor) |
| `CONT_COLOR`, `CONT_ORDER`, `CONT_PT` | IH:999–1007 | — |
| `CONT_RAW` | IH:1010 | [pipeline](../01-arquitetura/pipeline-de-dados.md) |
| `ALIAS_RAW` | IH:1020 | [pipeline](../01-arquitetura/pipeline-de-dados.md) |
| `METRICS`, `M`, `MK` | IH:1135–1146 | [config](configuracao.md) |
| `S` | IH:1149 | [modelo de estado](../01-arquitetura/modelo-de-estado.md) |
| `WORLD` (TopoJSON) | IH:983 | [desempenho](../05-qualidade/desempenho.md) |

## Ingestão e parsing

| Símbolo | Local | Ver |
| --- | --- | --- |
| `norm` | IH:1041 | [funções de dados](funcoes-de-dados.md#norm) |
| `sniff` | IH:1097 | [funções de dados](funcoes-de-dados.md#sniff) |
| `parseCSV` | IH:1103 | [funções de dados](funcoes-de-dados.md#parsecsv) |
| `toNum` | IH:1121 | [funções de dados](funcoes-de-dados.md#tonum) |
| `detectCols` | IH:1243 | [funções de dados](funcoes-de-dados.md#detectcols) |
| `ingest` | IH:1258 | [funções de dados](funcoes-de-dados.md#ingest) |

## Estatística

| Símbolo | Local | Ver |
| --- | --- | --- |
| `stats` | IH:1066 | [estatística](estatistica.md#stats) |
| `pearson` | IH:1076 | [estatística](estatistica.md#pearson) |
| `linreg` | IH:1085 | [estatística](estatistica.md#linreg) |

## Geometria e projeção

| Símbolo | Local | Ver |
| --- | --- | --- |
| `equalEarth` | IH:1164 | [estatística](estatistica.md#geometria-e-projeção) |
| `topoDecode` | IH:1172 | [estatística](estatistica.md#geometria-e-projeção) |
| `fixAntimeridian` | IH:1201 | [estatística](estatistica.md#geometria-e-projeção) |
| `MAP_PATHS` | IH:1210 | [estatística](estatistica.md#geometria-e-projeção) |

## Filtros e escalas

| Símbolo | Local | Ver |
| --- | --- | --- |
| `baseFiltered` | IH:1306 | [funções de dados](funcoes-de-dados.md#filtros) |
| `filtered` | IH:1312 | [funções de dados](funcoes-de-dados.md#filtros) |
| `recomputeBounds` | IH:1320 | [funções de dados](funcoes-de-dados.md#filtros) |
| `rampColor`, `corrColor`, `buildScale` | IH:1332–1346 | [estatística](estatistica.md#escalas-de-cor) |

## Render

| Símbolo | Local |
| --- | --- |
| `renderAll` | IH:1389 |
| `renderStats` | IH:1412 |
| `renderMap` | IH:1456 |
| `renderRank` | IH:1503 |
| `renderCorr` | IH:1538 |
| `renderScatter` | IH:1571 |
| `renderHist` | IH:1634 |
| `renderContTab` | IH:1688 |
| `renderDataTab` | IH:1725 |
| `renderInsights` | IH:1754 |

Detalhe de cada um em [funções de render](funcoes-de-render.md).

## Controles e interação

| Símbolo | Local |
| --- | --- |
| `buildControls` | IH:1829 |
| `buildCountryList` | IH:1873 |
| `syncDual`, `onDual` | IH:1893, 1905 |
| `initMapInteractions` | IH:1912 |
| `loadFile` | IH:1976 |
| `resetAll` | IH:2003 |

## Integrações (boot)

| Símbolo | Local | Ver |
| --- | --- | --- |
| `boot` (IIFE) | IH:2011 | [integrações](../01-arquitetura/integracoes.md) |
| form de suporte | IH:2079 | [esquema Supabase](../03-dados/esquema-supabase.md) |
| `CFG`, `parseEnv`, `bootConfig` | IH:2134–2152 | [config](configuracao.md) |
| `initWeather`, `weatherIcon` | IH:2216, 2206 | [integrações](../01-arquitetura/integracoes.md) |
| `buildContext`, `SYSTEM_PROMPT` | IH:2288, 2325 | [integrações](../01-arquitetura/integracoes.md) |
| `callGeminiDirect`, `callGeminiProxy`, `sendChat` | IH:2374, 2409, 2424 | [integrações](../01-arquitetura/integracoes.md) |

## server.mjs

| Símbolo | Local | Ver |
| --- | --- | --- |
| `loadEnv` | server.mjs:21 | [config](configuracao.md) |
| `SYSTEM_PROMPT` | server.mjs:54 | [integrações](../01-arquitetura/integracoes.md) |
| limites `CHAT_*`, `LIMITS` | server.mjs:70–79 | [segurança](../05-qualidade/seguranca-e-privacidade.md) |
| `originOk`, `rateLimit`, `validateContents` | server.mjs:130, 142, 166 | [segurança](../05-qualidade/seguranca-e-privacidade.md) |
| `askGemini`, `geminiBody` | server.mjs:203, 197 | [integrações](../01-arquitetura/integracoes.md) |

## Veja também

- [Funções de dados](funcoes-de-dados.md)
- [Funções de render](funcoes-de-render.md)
- [Estatística e geometria](estatistica.md)
- [Configuração](configuracao.md)
- [Hub da documentação](../README.md)
