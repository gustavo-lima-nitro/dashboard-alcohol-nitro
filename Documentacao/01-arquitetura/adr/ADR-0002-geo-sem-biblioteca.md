---
titulo: ADR-0002 — Geometria hand-rolled (sem biblioteca de mapa)
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0002 — Geometria hand-rolled (sem biblioteca de mapa)

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

O dashboard precisa de um mapa-múndi coroplético, mas a restrição de zero
dependência (ver [ADR-0001](ADR-0001-single-file-zero-dependencia.md)) proíbe
D3-geo, Leaflet ou similar.

## Decisão

Implementar a cartografia à mão: TopoJSON quantizado inline (`const WORLD`),
`topoDecode()` para expandir os arcos delta-encoded, `equalEarth()` como projeção
de área equivalente em forma fechada e `fixAntimeridian()` para anéis que cruzam
os ±180°. Os paths são pré-computados uma vez em `MAP_PATHS`.

## Alternativas consideradas

- **D3-geo + topojson-client**: robusto e testado, mas viola o zero-dependência.
- **Imagem raster do mapa**: sem interatividade nem coroplético por dado.

## Consequências

- ✅ Zero dependência mantida; controle total da projeção e do desempenho.
- ✅ `MAP_PATHS` computado uma vez no load (não a cada render).
- ⚠️ Código geométrico não trivial: quem mexer precisa entender arcos reversos
  (`~i`), a correção de antimeridiano e o `#mapClip`. Ver
  [estatística e geometria](../../02-referencia/estatistica.md#geometria-e-projeção).
- ⚠️ Atlas 110m: ~29 microestados sem polígono (limitação intencional).

## Veja também

- [Índice de ADRs](README.md)
- [Estatística e geometria](../../02-referencia/estatistica.md)
- [Desempenho](../../05-qualidade/desempenho.md)
