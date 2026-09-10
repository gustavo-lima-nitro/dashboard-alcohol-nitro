---
titulo: Camada de apresentação
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Camada de apresentação

Renderização, painéis, tokens visuais e acessibilidade. A estratégia é
**redraw completo**: cada mudança de estado redesenha todos os painéis, sem
diffing. Ver a decisão em [ADR-0004](adr/ADR-0004-render-full-redraw.md).

## Sumário

- [renderAll e os painéis](#renderall-e-os-painéis)
- [Identidade visual (tokens)](#identidade-visual-tokens)
- [Escalas de cor](#escalas-de-cor)
- [Animação](#animação)
- [Acessibilidade e estados vazios](#acessibilidade-e-estados-vazios)

## renderAll e os painéis

`renderAll()` (`Dashboards/index.html:1389`) recebe o recorte de `filtered()` e
chama cada painel com as linhas já filtradas:

```js
function renderAll(){
  const data = filtered();
  renderStats(data); renderMap(data); renderRank(data); renderCorr(data);
  renderScatter(data); renderInsights(data); renderHist(data);
  renderContTab(data); renderDataTab(data);
  // ... notas de rodapé ...
  if(CHAT_SYNC) CHAT_SYNC();   // mantém o resumo de filtros do chat em dia
  reveal();
}
```

| Painel | Função | Arquivo:linha | O que mostra |
| --- | --- | --- | --- |
| Cartões de estatística | `renderStats` | `:1412` | soma, média, mediana, máx/mín, desvio, contagem |
| Mapa coroplético | `renderMap` | `:1456` | métrica ativa por país (Equal Earth) |
| Ranking | `renderRank` | `:1503` | top/bottom países pela métrica |
| Matriz de correlação | `renderCorr` | `:1538` | Pearson entre pares de métricas |
| Dispersão | `renderScatter` | `:1571` | `S.sx` × `S.sy` + reta de regressão |
| Histograma | `renderHist` | `:1634` | distribuição da métrica (bins de Sturges) |
| Tabela por continente | `renderContTab` | `:1688` | agregados por continente |
| Tabela de dados | `renderDataTab` | `:1725` | linhas do recorte, ordenáveis |
| Insights | `renderInsights` | `:1754` | frases automáticas sobre o recorte |

> [!TIP]
> **Adicionar um painel = escrever uma função `renderX(data)` + chamá-la em
> `renderAll`.** Cada painel recebe as linhas já filtradas; não refaça a filtragem
> dentro do painel.

Detalhes de assinatura em [funções de render](../02-referencia/funcoes-de-render.md).

## Identidade visual (tokens)

Paleta e tipografia derivam do brand book
(`Referencias/nitro_brand_book_by_pomelli.pdf`), expostas como custom properties
em `:root` e como constante `BRAND` (`Dashboards/index.html:986`).

| Token | Valor | Uso |
| --- | --- | --- |
| Admiral Blue | `#003663` | fundo/base institucional |
| Chartreuse | `#94C356` | verde de marca |
| Citron | `#B9DA00` | destaque, topo da rampa |
| Gunmetal | `#424242` | texto/neutro |
| White | `#FFFFFF` | — |
| Tipografia | **Poppins** | única fonte (Google Fonts) |

> [!IMPORTANT]
> Use as custom properties CSS, nunca hex cru em markup/estilo. As **únicas**
> escolhas de cor em JS são a rampa coroplética (`RAMP`) e a paleta divergente de
> correlação (`DIV_NEG`/`DIV_MID`/`DIV_POS`). A identidade **não** vem das skills
> `nitro-padrao-sistemas`/`nitro-ppt` (o Admiral Blue delas difere).

## Escalas de cor

- **Sequencial** `RAMP` (`:990`): Admiral Blue → Chartreuse → Citron, 7 paradas.
- **Divergente** de correlação (`:995`): azul claro (−) ↔ neutro (fundo do painel)
  ↔ lima (+); o ponto neutro parte do próprio fundo, então `r≈0` "desaparece" e a
  intensidade codifica a força.
- **Sem dado**: `NODATA = "rgba(255,255,255,.055)"` (`:991`).

Implementação em `rampColor`, `corrColor`, `buildScale` — ver
[estatística e geometria](../02-referencia/estatistica.md#escalas-de-cor).

## Animação

> [!WARNING]
> Geometria SVG animada pela Web Animations API precisa de **unidades CSS** —
> `{height:"0px"}`, não `{height:0}` — ou o console enche de
> "Invalid keyframe value". Os painéis também escrevem os valores finais de
> atributo diretamente no elemento, para que uma animação falha não deixe barras
> ou pontos invisíveis. Siga esse padrão.

## Acessibilidade e estados vazios

- Todo painel trata recorte vazio com "Sem dados no filtro atual." (ver
  [modelo de estado](modelo-de-estado.md#estado-filtro-vazio)).
- `esc()` (`:1063`) escapa HTML em qualquer texto vindo do CSV antes de injetar no
  DOM — proteção contra conteúdo malicioso na planilha.

## Veja também

- [Funções de render](../02-referencia/funcoes-de-render.md)
- [Estatística e geometria](../02-referencia/estatistica.md)
- [Modelo de estado](modelo-de-estado.md)
- [Desempenho](../05-qualidade/desempenho.md)
- [Hub da documentação](../README.md)
