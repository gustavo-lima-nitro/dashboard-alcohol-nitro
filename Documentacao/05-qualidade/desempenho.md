---
titulo: Desempenho
area: qualidade
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Desempenho

Custos e gargalos do NitroDash. Para ~193 países, o dashboard é confortável; os
pontos abaixo importam ao evoluir o código ou usar datasets maiores.

## Sumário

- [TopoJSON inline](#topojson-inline)
- [Custo do load](#custo-do-load)
- [Custo do render](#custo-do-render)
- [Limites de contexto do chat](#limites-de-contexto-do-chat)
- [Recomendações](#recomendações)

## TopoJSON inline

`const WORLD` (`Dashboards/index.html:983`) é uma **única linha de ~100 KB** com o
atlas Natural Earth 110m quantizado.

> [!WARNING]
> Consequências práticas:
> - **Nunca reescrever o arquivo inteiro** com uma ferramenta de Write — a linha
>   gigante é dropada ou corrompida. Use edições pontuais.
> - Para ler como texto, filtre a linha: `awk 'length($0)<600' Dashboards/index.html`.
> - Greps por linha ainda funcionam; espere uma linha monstruosa.

Manter o atlas inline é o preço do single-file/zero-dependência (ver
[ADR-0002](../01-arquitetura/adr/ADR-0002-geo-sem-biblioteca.md)).

## Custo do load

No carregamento, uma vez só:

| Etapa | Custo |
| --- | --- |
| `topoDecode(WORLD)` | expande todos os arcos (`:1172`) |
| `MAP_PATHS` (IIFE) | **duas passadas** sobre todos os anéis: extensão + projeção (`:1210`) |

Ambos rodam no boot, não por render — decisão intencional para o redraw ficar
barato.

## Custo do render

`renderAll()` faz **redraw completo** de 9 painéis a cada mudança de estado (ver
[ADR-0004](../01-arquitetura/adr/ADR-0004-render-full-redraw.md)). O mapa recria o
SVG (`svg.innerHTML=""` em `renderMap`, `:1457`). Para ~193 países é imperceptível;
para dezenas de milhares de linhas, o redraw total do mapa e das tabelas seria o
primeiro gargalo.

## Limites de contexto do chat

Cada envio remonta `buildContext()` com até `MAX_ROWS_CTX` (220) linhas — teto
alinhado ao dataset de referência (193). Isso mantém o payload na casa de ~20 KB,
com folga sob os `CHAT_MAX_*` do `server.mjs`. Aumentar o dataset **não** aumenta o
contexto além de 220 linhas (as demais são omitidas com aviso, `:2321`).

## Recomendações

- Datasets grandes: considerar paginação/virtualização na tabela de dados e um
  render incremental do mapa antes de remover o redraw total.
- Se o atlas crescer, avaliar mover `WORLD` para arquivo separado carregado por
  `fetch` (custo: perde o single-file puro; ganho: arquivo editável).
- Medir com o performance profiler do navegador antes de otimizar — hoje não há
  gargalo observado no uso previsto.

## Veja também

- [ADR-0002 — Geometria sem biblioteca](../01-arquitetura/adr/ADR-0002-geo-sem-biblioteca.md)
- [ADR-0004 — Redraw completo](../01-arquitetura/adr/ADR-0004-render-full-redraw.md)
- [Camada de apresentação](../01-arquitetura/camada-de-apresentacao.md)
- [Estatística e geometria](../02-referencia/estatistica.md)
- [Hub da documentação](../README.md)
