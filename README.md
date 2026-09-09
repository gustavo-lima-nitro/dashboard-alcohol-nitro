# Dashboard de Consumo de Álcool — Nitro

Dashboard analítico single-file (HTML + CSS + JS, sem dependências) para dados globais de
consumo de álcool, desenvolvido para a divisão **Nitro** da *Deixa Comigo Bebidas*.
Interface em **pt-BR**.

## Estrutura

```
Dados/drinks.csv                            dataset de exemplo (193 países) — referência, somente leitura
Dashboards/index.html                       entregável: HTML + CSS + JS em um único arquivo
Referencias/nitro_brand_book_by_pomelli.pdf fonte visual (cores, tipografia, logo)
serve.ps1                                   servidor estático local (PowerShell puro)
server.mjs                                  servidor local com proxy das APIs (Node 18+)
.env.example                                modelo das variáveis de ambiente
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

Os dados da planilha continuam sendo processados 100% no navegador. As duas integrações
opcionais (chat com IA e previsão do tempo) são as únicas que fazem chamadas externas — e só
quando você as usa. Veja a seção abaixo.

## Integrações opcionais (chat com IA e clima)

O dashboard ganha duas capacidades quando servido por HTTP:

- **Conversar com os dados** — botão na parte inferior central. Abre um chat com o Google
  Gemini que responde sobre o **recorte filtrado** (continente, países, faixa e métrica ativos),
  com cadeia de modelos de fallback em caso de erro ou estouro de cota.
- **Previsão do tempo** — pílula na barra superior, por geolocalização do navegador
  (OpenWeatherMap). Sem permissão de localização, o widget simplesmente não aparece.

Ambas leem as chaves de um `.env` na raiz. Copie o modelo e preencha:

```bash
cp .env.example .env
```

### Por que preciso de um servidor?

Uma página aberta em `file://` não consegue ler o `.env` — o navegador bloqueia `fetch` de
arquivos locais. Há duas opções, ambas sem instalar dependência alguma:

**PowerShell** (funciona em qualquer Windows, sem instalar nada):

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

**Node 18+** (modo proxy: as chaves ficam no servidor e nunca chegam ao navegador):

```bash
node server.mjs
```

Os dois sobem em `http://localhost:8080/Dashboards/index.html`. Abrir por `file://` continua
funcionando — o chat e o clima apenas ficam desativados, com um aviso explicando o motivo.

### Variáveis do `.env`

| Variável | Para que serve |
| --- | --- |
| `GEMINI_API_KEY` | Chave do Google AI Studio, usada pelo chat |
| `GEMINI_MODELS` | Cadeia de fallback, da esquerda para a direita |
| `OPENWEATHER_API_KEY` | Chave do OpenWeatherMap, usada pelo widget de clima |
| `PORT` | Porta dos servidores locais (padrão 8080) |

O `.env` está no `.gitignore` e **nunca** deve ser versionado.

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
