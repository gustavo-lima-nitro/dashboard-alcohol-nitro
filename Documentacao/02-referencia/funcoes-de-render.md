---
titulo: Funções de render
area: referencia
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Funções de render

Cada painel é uma função `renderX(data)` que recebe as linhas já filtradas
(`filtered()`) e redesenha do zero. Orquestradas por `renderAll()`
(`Dashboards/index.html:1389`).

## Sumário

- [renderAll](#renderall)
- [Painéis](#painéis)
- [Auxiliares de UI](#auxiliares-de-ui)

## renderAll

`Dashboards/index.html:1389`. Calcula `filtered()` uma vez e passa a todos; ao
final sincroniza o chat (`CHAT_SYNC`) e revela os painéis (`reveal`).

```js
function renderAll(){
  const data = filtered();
  renderStats(data); renderMap(data); renderRank(data); renderCorr(data);
  renderScatter(data); renderInsights(data); renderHist(data);
  renderContTab(data); renderDataTab(data);
  $("#mapNote").textContent = mapNoteText(data);
  $("#tabNote").textContent = `${data.length} de ${S.rows.length} registros`;
  $("#footSrc").textContent = `FONTE: ${S.fileName.toUpperCase()}`;
  if(CHAT_SYNC) CHAT_SYNC();
  reveal();
}
```

## Painéis

| Função | Linha | Entrada | Saída / notas |
| --- | --- | --- | --- |
| `renderStats(data)` | `:1412` | recorte | 7 cartões (`STAT_DEF`, `:1408`): Soma, Média (com IQR), Mediana, Máximo (país), Mínimo (país), Desvio (com CV%), Países. `countUp` anima o número. |
| `renderMap(data)` | `:1456` | recorte | SVG coroplético; cor por `buildScale`; nota via `mapNoteText`; zoom por `applyZoom`. |
| `renderRank(data)` | `:1503` | recorte | barras top/bottom (`S.rank`) da métrica ativa; ignora valor `null`. |
| `renderCorr(data)` | `:1538` | recorte | matriz Pearson entre métricas; cor por `corrColor`; destaca `\|r\|>0.62`. |
| `renderScatter(data)` | `:1571` | recorte | dispersão `S.sx`×`S.sy` + reta de `linreg`; rótulo de força via `strength`. |
| `renderHist(data)` | `:1634` | recorte | histograma da métrica; nº de bins por regra de Sturges. |
| `renderContTab(data)` | `:1688` | recorte | tabela agregada por continente (`stats` por grupo). |
| `renderDataTab(data)` | `:1725` | recorte | tabela de linhas; ordenável por `S.sortKey/sortDir`. |
| `renderInsights(data)` | `:1754` | recorte | frases automáticas (extremos, dispersão) sobre o recorte. |

> [!NOTE]
> Todos tratam `data.length === 0` exibindo "Sem dados no filtro atual." — ver
> [modelo de estado](../01-arquitetura/modelo-de-estado.md#estado-filtro-vazio).

## Auxiliares de UI

| Função | Linha | Papel |
| --- | --- | --- |
| `el(t,a,p)` | `:1365` | cria elemento (SVG/HTML) com atributos e pai |
| `ticks(lo,hi,n)` | `:1371` | ticks "bonitos" (1/2/2.5/5/10 × 10ⁿ) para eixos |
| `countUp(node,...)` | `:1436` | anima número do cartão |
| `renderLegend(sc)` | `:1483` | legenda da escala do mapa |
| `applyZoom()` | `:1497` | aplica transform de zoom/pan no mapa |
| `showTip/showRawTip/place/hideTip` | `:1799–1820` | tooltip |
| `toggleHi(key)` | `:1822` | destaca país (`S.hi`) e re-renderiza |
| `reveal()` | `:1964` | anima a entrada dos painéis (classe `in`) |

## Veja também

- [Camada de apresentação](../01-arquitetura/camada-de-apresentacao.md)
- [Estatística e geometria](estatistica.md)
- [Funções de dados](funcoes-de-dados.md)
- [Índice de símbolos](README.md)
- [Hub da documentação](../README.md)
