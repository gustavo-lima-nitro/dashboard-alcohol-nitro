# Dashboard de Consumo de Álcool — Nitro

Dashboard analítico single-file (HTML + CSS + JS, sem dependências) para dados globais de
consumo de álcool, desenvolvido para a divisão **Nitro** da *Deixa Comigo Bebidas*.
Interface em **pt-BR**.

## Estrutura

```
Dados/drinks.csv                            dataset de exemplo (193 países) — referência, somente leitura
Dashboards/index.html                       entregável: HTML + CSS + JS em um único arquivo
Referencias/nitro_brand_book_by_pomelli.pdf fonte visual (cores, tipografia, logo)
```

Não há build step, gerenciador de pacotes ou test runner. Tudo roda no navegador a partir de `file://`.

## Como usar

Abra o dashboard diretamente no navegador:

```bash
start "" "Dashboards/index.html"
```

Depois arraste o arquivo `Dados/drinks.csv` (ou qualquer CSV no mesmo formato) para dentro da
janela para carregar os dados. O dashboard funciona em **um único gesto**: ao soltar a planilha,
todos os filtros já iniciam com "tudo selecionado".

Nenhum dado é enviado para fora do navegador — todo o processamento é 100% local (a única
chamada de rede é a folha de estilo do Google Fonts).

## Arquitetura

Fluxo de dados: `drop/seleção do arquivo → loadFile → parseCSV → detectCols → ingest →
recomputeBounds → renderAll`.

- **Estado** centralizado em um único objeto `S` (linhas, colunas, métrica ativa, filtros de
  continente/país, faixa numérica, etc).
- **Renderização** é sempre um redraw completo — sem diffing. Cada painel (mapa, ranking,
  correlação, dispersão, histograma, tabelas) tem sua própria função de render, chamada a
  partir de `renderAll()`.
- **Ingestão de CSV** tolerante a delimitador, aspas, BOM/CRLF e formatos numéricos
  (`1.234,5` e `1,234.5`), com detecção de colunas por regex.
- **Mapa-múndi** desenhado à mão (sem biblioteca de geo): TopoJSON inline decodificado em tempo
  de carga e projeção Equal Earth em forma fechada.

Detalhes completos de arquitetura, convenções e limitações conhecidas estão documentados em
[`CLAUDE.md`](CLAUDE.md).

## Identidade visual

Paleta e tipografia derivadas do brand book oficial da Nitro
(`Referencias/nitro_brand_book_by_pomelli.pdf`): Admiral Blue, Chartreuse, Citron, Gunmetal,
fonte Poppins — todos expostos como custom properties CSS em `:root`.

## Limitações conhecidas

- Cerca de 29 microestados não possuem polígono no atlas de 110m de resolução (permanecem nas
  estatísticas, mas não aparecem desenhados no mapa).
- O gazetteer de continente/alias é indexado por nomes de país em **inglês**; nomes em
  português caem no grupo "Sem mapeamento".
- O modal de suporte não possui backend — apenas registra o formulário no console.

## Confidencialidade

Este repositório contém material de marca interno da Nitro. Repositório privado — não
compartilhar publicamente sem autorização.
