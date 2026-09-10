---
titulo: Documentação técnica — NitroDash (Dashboards_alcohol)
area: hub
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Documentação técnica — NitroDash

Hub da documentação do **dashboard de consumo de álcool da Nitro** (divisão de
*Deixa Comigo Bebidas*). Público-alvo: equipe de engenharia. Idioma: **pt-BR**.

O produto é um **dashboard analítico single-file** (HTML + CSS + JS em
`Dashboards/index.html`, sem dependências) que roda no navegador a partir de
`file://`, com duas capacidades opcionais servidas por HTTP (chat com IA sobre o
recorte filtrado e previsão do tempo) e um formulário de suporte que grava no
Supabase.

> [!NOTE]
> Esta documentação descreve **o que o código faz hoje** (commit `94260d7`). Ao
> alterar o código, atualize a página correspondente e o `commit_base` no
> frontmatter. Consulte as [convenções de documentação](_meta/convencoes-de-documentacao.md)
> antes de editar.

## Mapa da documentação

### 00 · Visão geral
- [Contexto e escopo](00-visao-geral/contexto-e-escopo.md) — o que é, para quem, fronteiras do sistema.
- [Stakeholders e fluxo de trabalho](00-visao-geral/stakeholders-e-fluxo.md) — quem usa, quem mantém, ciclo do agente.
- [Glossário](00-visao-geral/glossario.md) — termos de negócio e técnicos.

### 01 · Arquitetura
- [Visão geral da arquitetura](01-arquitetura/visao-geral.md) — componentes e fluxo principal.
- [Modelo de estado (`S`)](01-arquitetura/modelo-de-estado.md) — campos, invariantes, estados válidos.
- [Pipeline de dados](01-arquitetura/pipeline-de-dados.md) — do drop do arquivo ao render.
- [Camada de apresentação](01-arquitetura/camada-de-apresentacao.md) — painéis, tokens visuais, acessibilidade.
- [Integrações externas](01-arquitetura/integracoes.md) — chat Gemini, clima, Supabase, runtimes, deploy.
- [Registro de decisões (ADRs)](01-arquitetura/adr/README.md) — decisões arquiteturais.

### 02 · Referência
- [Índice de símbolos](02-referencia/README.md) — símbolo → `arquivo:linha`.
- [Funções de dados](02-referencia/funcoes-de-dados.md) — `parseCSV`, `detectCols`, `ingest`, filtros.
- [Funções de render](02-referencia/funcoes-de-render.md) — `renderAll` e o render de cada painel.
- [Estatística e geometria](02-referencia/estatistica.md) — `stats`, `pearson`, `linreg`, projeção, escalas.
- [Configuração](02-referencia/configuracao.md) — `.env`, variáveis, flags, modos de runtime.

### 03 · Dados
- [Dicionário de dados](03-dados/dicionario-de-dados.md) — `drinks.csv`: colunas, tipos, domínio.
- [Qualidade e validação](03-dados/qualidade-e-validacao.md) — regras, casos degenerados, o que quebra o parser.
- [Esquema Supabase](03-dados/esquema-supabase.md) — tabela `suporte_mensagens`, RLS, migração.

### 04 · Operação
- [Ambiente local](04-operacao/ambiente-local.md) — `serve.ps1`, `server.mjs`, `file://`.
- [Build e deploy](04-operacao/build-e-deploy.md) — Vercel, `vercel.json`.
- [Runbooks](04-operacao/runbooks.md) — sintoma → diagnóstico → ação.

### 05 · Qualidade
- [Estratégia de testes](05-qualidade/estrategia-de-testes.md) — loop de verificação real.
- [Segurança e privacidade](05-qualidade/seguranca-e-privacidade.md) — LGPD, segredos, RLS.
- [Desempenho](05-qualidade/desempenho.md) — custo do TopoJSON inline, renders, gargalos.

### _meta
- [Estado da documentação](_meta/estado.md) — cobertura, lacunas, backlog.
- [Histórico de execuções](_meta/historico-execucoes.md) — uma linha por rodada do agente.
- [Convenções de documentação](_meta/convencoes-de-documentacao.md) — estilo e formatação.

## Estrutura do repositório

```
Dados/drinks.csv          dataset de exemplo (193 países) — somente leitura
Dashboards/index.html     o entregável: HTML + CSS + JS em um arquivo
Referencias/*.pdf         brand book (fonte visual)
serve.ps1                 servidor estático local (PowerShell)
server.mjs                servidor local com proxy das APIs (Node 18+)
supabase/*.sql            migração da tabela de suporte
Jornal/                   subprojeto editorial (fora do escopo do dashboard)
vercel.json               rewrite da raiz para o dashboard no deploy
.env / .env.example       variáveis de ambiente (o .env não é versionado)
```

## Veja também

- [Contexto e escopo](00-visao-geral/contexto-e-escopo.md)
- [Visão geral da arquitetura](01-arquitetura/visao-geral.md)
- [Estado da documentação](_meta/estado.md)
