---
name: jornal-apuracao
description: Apuração do dia no repositório — levanta issues abertas/fechadas, PRs, merges, commits, discussions, backlog e estado da produção via gh CLI e grava tudo em um JSON de pauta. Use SEMPRE que for montar o jornal diário do projeto, quando o usuário pedir "apurar o dia", "levantar o que aconteceu", "pauta do jornal", "dados para o jornal", ou quando a rotina `jornal` rodar. É a etapa que vem ANTES da diagramação.
---

# Apuração do dia 📋

Você é o **repórter** da redação. Sua única entrega é um arquivo JSON de pauta com tudo
o que aconteceu no repositório no dia — números conferidos e material narrativo suficiente
para outra pessoa escrever o jornal sem precisar consultar o GitHub de novo.

Repositório: `gustavo-lima-nitro/dashboard-alcohol-nitro`
Diretório de trabalho: `C:\Users\ext.gustavosl\Desktop\claude_nitro\Dashboards_alcohol`
Produção (pública): **https://nitrodash-three.vercel.app**

**Você não escreve o jornal.** Não redija manchete, não faça piada, não use adjetivo de
elogio. Aqui é levantamento: fato, número, link e um resumo seco de cada item.

**Você não altera nada.** Nenhum `gh issue comment`, `gh pr merge`, `git commit`, `git push`,
nenhuma edição de código. Apuração é leitura.

## 1. Defina a janela do dia

O dia do jornal é o **dia local (America/Sao_Paulo)** da execução, de 00:00 a 23:59.

```powershell
$hoje = Get-Date -Format 'yyyy-MM-dd'
$ini  = (Get-Date -Format 'yyyy-MM-ddT00:00:00zzz')
$fim  = (Get-Date -Format 'yyyy-MM-ddT23:59:59zzz')
"$hoje | $ini | $fim"
```

Guarde os três valores. O GitHub devolve timestamps em UTC — compare sempre convertendo,
e ao classificar "hoje" use o intervalo local acima, não a data UTC crua.

## 2. Colete os dados

Rode os comandos abaixo. Se um falhar por falta de escopo do token (o caso conhecido é
`gh project list`, que pede `read:project`), **não tente autenticar de novo**: registre o
campo como `null` com o motivo em `avisos` e siga.

**Issues**

```bash
gh issue list --state all --limit 100 --json number,title,state,createdAt,closedAt,updatedAt,labels,author,url,comments
```

Derive: abertas hoje, fechadas hoje, backlog aberto total, issues abertas mais antigas sem
movimento (candidatas a "atraso da casa"), e labels de prioridade/segurança quando houver.

**Pull requests**

```bash
gh pr list --state all --limit 100 --json number,title,state,isDraft,createdAt,mergedAt,closedAt,author,url,additions,deletions,changedFiles,labels,reviewDecision,headRefName
```

Derive: mergeadas hoje, abertas hoje, fechadas sem merge hoje, abertas no fim do dia
(separando rascunho de pronta para revisão), linhas somadas/removidas do dia e, para cada PR
aberta há mais de um dia, quantos dias está parada.

**Commits do dia no master**

```bash
gh api "repos/gustavo-lima-nitro/dashboard-alcohol-nitro/commits?since=<ini_utc>&per_page=100" --jq '.[] | {sha: .sha[0:7], msg: (.commit.message|split("\n")[0]), autor: .commit.author.name, data: .commit.author.date}'
```

**Discussions (novas e comentadas)**

```bash
gh api graphql -f query='{ repository(owner:"gustavo-lima-nitro", name:"dashboard-alcohol-nitro"){ discussions(first:30, orderBy:{field:UPDATED_AT, direction:DESC}){ totalCount nodes{ number title url createdAt updatedAt category{name} author{login} body comments(first:20){ totalCount nodes{ createdAt author{login} body } } } } } }'
```

Derive: discussions criadas hoje, discussions com comentário novo hoje, e as **falas
citáveis** — trechos curtos, nas palavras de quem escreveu, que valham virar aspas no jornal.

**Atividade de comentários do dia** (o pulso da conversa em issues e PRs): use o
`comments` das listagens acima ou
`gh api "repos/gustavo-lima-nitro/dashboard-alcohol-nitro/issues/comments?since=<ini_utc>&per_page=100"`.

**Releases e tags** (quando houver): `gh release list --limit 5`.

**Estado da produção** — obrigatório, é o que separa "mergeado" de "no ar":

```bash
curl -s -o /dev/null -w "%{http_code}" https://nitrodash-three.vercel.app
```

Se alguma PR mergeada hoje mexeu em `/api/*`, cheque também
`curl -s -o /dev/null -w "%{http_code}" https://nitrodash-three.vercel.app/api/config`.
Registre o código de status cru. **Não conclua que algo está corrigido em produção só
porque a PR foi mergeada** — se não checou, o campo é `"nao_verificado"`.

**Quadro do projeto** (opcional): `gh project list --owner gustavo-lima-nitro`. Sem o escopo
`read:project` isso falha — vire `null` e registre em `avisos`.

## 3. Leia o que importa antes de resumir

Para cada issue fechada hoje, PR mergeada hoje e discussion nova, abra o item e leia:
`gh issue view <N> --comments`, `gh pr view <N> --comments`, ou o `body` já trazido pelo
GraphQL. O resumo de uma linha só vale se você leu o item.

Nos resumos, registre também **o que o item destrava ou bloqueia** e **se depende de
credencial, painel de terceiro ou decisão do dono** (chave de API, DNS, Vercel, dinheiro,
visibilidade de repositório). Isso alimenta a seção "A Mesa do Dono" do jornal.

## 4. Grave a pauta

Escreva **um** arquivo em `Jornal/apuracao/<AAAA-MM-DD>.json`, exatamente neste formato
(campo ausente = `null`, lista sem item = `[]`; nunca invente valor para preencher):

```json
{
  "data": "2026-09-09",
  "dia_semana": "quarta-feira",
  "janela": { "inicio": "2026-09-09T00:00:00-03:00", "fim": "2026-09-09T23:59:59-03:00" },
  "numeros": {
    "issues_abertas_hoje": 0,
    "issues_fechadas_hoje": 0,
    "backlog_aberto": 0,
    "prs_abertas_hoje": 0,
    "prs_mergeadas_hoje": 0,
    "prs_fechadas_sem_merge_hoje": 0,
    "prs_abertas_no_fim_do_dia": 0,
    "prs_em_rascunho": 0,
    "commits_hoje": 0,
    "linhas_adicionadas": 0,
    "linhas_removidas": 0,
    "arquivos_tocados": 0,
    "discussions_novas_hoje": 0,
    "discussions_comentadas_hoje": 0,
    "discussions_total": 0,
    "comentarios_hoje": 0,
    "quadro": null
  },
  "issues_fechadas": [
    { "numero": 7, "titulo": "...", "url": "...", "autor": "...", "labels": [],
      "aberta_em": "...", "fechada_em": "...", "horas_de_vida": 0,
      "pr_relacionada": 8, "resumo": "o que estava errado e o que foi feito",
      "impacto": "por que isso importa para quem usa o dashboard",
      "verificado_em_producao": "sim | nao | nao_verificado" }
  ],
  "issues_abertas": [
    { "numero": 4, "titulo": "...", "url": "...", "autor": "...", "labels": [],
      "aberta_em": "...", "dias_aberta": 0, "resumo": "...",
      "bloqueada_por": "credencial | decisao | outra_issue | nada" }
  ],
  "prs_mergeadas": [
    { "numero": 10, "titulo": "...", "url": "...", "autor": "...",
      "mergeada_em": "...", "adicoes": 0, "remocoes": 0, "arquivos": 0,
      "fecha_issues": [6], "resumo": "...", "revisao": "..." }
  ],
  "prs_abertas": [
    { "numero": 11, "titulo": "...", "url": "...", "autor": "...", "rascunho": false,
      "aberta_em": "...", "dias_parada": 0, "resumo": "...", "destrava": "..." }
  ],
  "commits": [ { "sha": "94260d7", "mensagem": "...", "autor": "...", "hora": "16:35" } ],
  "discussions": [
    { "numero": 16, "titulo": "...", "url": "...", "categoria": "General", "autor": "...",
      "criada_em": "...", "nova_hoje": true, "comentarios_hoje": 0,
      "resumo": "...", "citacao": "trecho curto nas palavras de quem escreveu ou null" }
  ],
  "producao": {
    "url": "https://nitrodash-three.vercel.app",
    "http": 200,
    "endpoints": [ { "path": "/api/config", "http": 200 } ],
    "observacao": "o que o status significa para as entregas do dia"
  },
  "mesa_do_dono": [
    { "assunto": "...", "por_que": "...", "caminho": "o que só o dono pode fazer",
      "como_conferir": "comando ou checagem objetiva", "referencia": "#4" }
  ],
  "atrasos_da_casa": [
    { "item": "PR #11", "parado_desde": "...", "o_que_destrava": "...", "de_quem_depende": "frota" }
  ],
  "avisos": [ "quadro do projeto nao lido: token sem escopo read:project" ]
}
```

Regras do JSON:

- **Número conferido, nunca estimado.** Se não conseguiu apurar, `null` + linha em `avisos`.
- Todo item citável tem `numero` e `url` — o jornal precisa linkar.
- `resumo` é uma ou duas frases secas, em pt-BR, sem adjetivo de valor.
- Dia sem movimento é resultado legítimo: grave o JSON com zeros e listas vazias.
  A diagramação sabe publicar edição magra.
- Nada de credencial, token, chave ou conteúdo de `.env` no JSON — nem mascarado.

## 5. Relate

Ao terminar, informe: caminho do JSON gravado, os números principais em uma linha, quantos
itens foram lidos individualmente e o que ficou em `avisos`.
