---
titulo: Qualidade e validação
area: dados
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Qualidade e validação

Regras de tolerância do parser, casos degenerados e o que efetivamente quebra a
ingestão.

## Sumário

- [O que o parser tolera](#o-que-o-parser-tolera)
- [Casos degenerados tratados](#casos-degenerados-tratados)
- [O que quebra (erros de ingest)](#o-que-quebra-erros-de-ingest)
- [Casos de borda de reconciliação](#casos-de-borda-de-reconciliação)

## O que o parser tolera

| Situação | Tratamento | Onde |
| --- | --- | --- |
| Delimitador `, ; tab \|` | detectado por frequência | `sniff` `:1097` |
| BOM no início | removido | `parseCSV` `:1104` |
| CRLF / CR | normalizado para LF | `parseCSV` `:1104` |
| Campos com aspas e `""` escapado | máquina de estados | `parseCSV` `:1108` |
| `1.234,5` e `1,234.5` | ambos → número | `toNum` `:1127` |
| `NA`, `n/a`, `null`, `-`, `—`, vazio | → nulo | `toNum` `:1124` |
| `12%`, `12 kg` | sufixo removido → `12` | `toNum` `:1125` |
| Linhas totalmente vazias | descartadas | `parseCSV` `:1119` |
| País duplicado | mantém o primeiro (`seen` por `nk`) | `ingest` `:1275` |

## Casos degenerados tratados

> [!TIP]
> Testes de borda que **não** devem quebrar:
> - **`S.countries` vazio** (nenhum país): recorte vazio legítimo; painéis mostram
>   "Sem dados no filtro atual." e o chat avisa em vez de inventar.
> - **`lo === hi`** em `buildScale`: a rampa degenera para uma cor só (`:1350`).
> - **`stats([])`**: devolve `null` nos agregados, `n:0` — sem divisão por zero.
> - **`pearson`/`linreg` com < 3 pares ou variância zero**: retornam `null`; os
>   painéis omitem a reta/coeficiente.
> - **Total ausente**: derivado das doses e marcado `_derived`.

## O que quebra (erros de ingest)

`ingest` lança `Error` (capturado por `loadFile`, que chama `fail()` e reexibe o
hero):

| Mensagem | Causa |
| --- | --- |
| "Arquivo vazio ou sem linhas de dados." | menos de 2 linhas após `parseCSV` |
| "Nenhuma coluna de consumo reconhecida. Esperado algo como …" | nenhuma das regex de `METRICS` casou o cabeçalho |
| "Nenhuma linha válida encontrada." | nenhuma linha tem ao menos um valor numérico |
| "Arquivo maior que 20 MB." | `loadFile` `:1978`, antes de ler |
| "Falha ao ler o arquivo." | erro do `FileReader` |

## Casos de borda de reconciliação

- Nome de país em **português** → não casa o gazetteer (indexado em inglês) →
  `continent === "—"` ("Sem mapeamento"). O `console.info` reporta a contagem
  (`loadFile` `:1994`).
- ~29 microestados sem polígono no atlas 110m: entram em toda estatística/tabela,
  mas não aparecem desenhados; a contagem é exposta na nota do mapa
  (`mapNoteText`, `:1449`).
- Alias mal escrito (não normalizado, ou apontando para nome inexistente no atlas)
  → o país some do mapa. Escreva a chave via `norm()` e valide o alvo no atlas.
  Ver [pipeline](../01-arquitetura/pipeline-de-dados.md#normalização-e-reconciliação-de-nomes).

## Veja também

- [Dicionário de dados](dicionario-de-dados.md)
- [Pipeline de dados](../01-arquitetura/pipeline-de-dados.md)
- [Funções de dados](../02-referencia/funcoes-de-dados.md)
- [Runbooks](../04-operacao/runbooks.md)
- [Hub da documentação](../README.md)
