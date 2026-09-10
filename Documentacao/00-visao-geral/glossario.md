---
titulo: Glossário
area: visao-geral
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Glossário

Termos de negócio e técnicos usados no código e nesta documentação.

## Negócio e dados

| Termo | Significado |
| --- | --- |
| **Dose (serving)** | Unidade de consumo por bebida no dataset (`beer_servings`, `spirit_servings`, `wine_servings`) — número de doses per capita/ano. |
| **Total de álcool puro** | Litros de álcool puro per capita/ano (`total_litres_of_pure_alcohol`). Derivado quando ausente (ver [pipeline](../01-arquitetura/pipeline-de-dados.md)). |
| **Métrica ativa** | A dimensão selecionada no controle segmentado: `total`, `beer`, `spirit` ou `wine`. Campo `S.metric`. |
| **Recorte / filtro** | Subconjunto de linhas após aplicar continente + país + faixa numérica. Ver `filtered()`. |
| **Microestado sem polígono** | ~29 países que existem nos dados mas não têm geometria no atlas 110m; entram nas estatísticas, não no mapa desenhado. |
| **Sem mapeamento** | País cujo nome não casou com o gazetteer de continente (continente `"—"`). |

## Técnicos

| Termo | Significado |
| --- | --- |
| **`S`** | Objeto único de estado global do dashboard. Ver [modelo de estado](../01-arquitetura/modelo-de-estado.md). |
| **`METRICS`** | Registro único que dirige controle de bebida, unidades, cores e regex de detecção de coluna. |
| **TopoJSON** | Formato de geometria com arcos compartilhados e coordenadas quantizadas/delta-encoded. Inline em `const WORLD`. |
| **Equal Earth** | Projeção cartográfica de área equivalente (Šavrič, Patterson & Jenny 2018), em forma fechada — `equalEarth()`. |
| **Antimeridiano** | Linha dos ±180° de longitude; anéis que a cruzam precisam de `fixAntimeridian()` para não "borrar" pelo mapa. |
| **Escala quantílica** | Divisão da rampa de cor por quantis dos valores (padrão), alternativa à linear. Ver `buildScale()`. |
| **Modo proxy / direto / off** | Os três modos de runtime detectados por `bootConfig()`. Ver [configuração](../02-referencia/configuracao.md). |
| **RLS** | Row Level Security do Postgres/Supabase; aqui restringe a tabela de suporte a apenas INSERT. |
| **Cadeia de fallback (Gemini)** | Lista de modelos tentados em ordem; erros transitórios caem para o próximo. |
| **`norm()`** | Normalização de nomes (strip de diacríticos, `&`→`and`, `St.`→`saint`, pontuação→espaço) usada como chave de reconciliação. |
| **Redraw completo** | Estratégia de render: cada mudança de estado redesenha todos os painéis, sem diffing. |

## Veja também

- [Contexto e escopo](contexto-e-escopo.md)
- [Modelo de estado](../01-arquitetura/modelo-de-estado.md)
- [Dicionário de dados](../03-dados/dicionario-de-dados.md)
- [Hub da documentação](../README.md)
