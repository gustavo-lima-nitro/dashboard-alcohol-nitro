---
titulo: Segurança e privacidade
area: qualidade
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Segurança e privacidade

Postura de segurança do NitroDash: processamento local, gestão de segredos,
barreiras do proxy e conformidade LGPD.

## Sumário

- [Privacidade dos dados](#privacidade-dos-dados)
- [Segredos e chaves](#segredos-e-chaves)
- [Barreiras do proxy](#barreiras-do-proxy)
- [Supabase e RLS](#supabase-e-rls)
- [LGPD](#lgpd)
- [Achados e riscos](#achados-e-riscos)

## Privacidade dos dados

> [!IMPORTANT]
> Os dados da planilha são processados **100% no navegador** e não deixam a
> máquina. As únicas saídas de rede são: a folha do Google Fonts (sempre), e —
> quando o usuário aciona — o **recorte agregado** enviado ao chat e a
> geolocalização ao clima. `esc()` (`Dashboards/index.html:1063`) escapa qualquer
> texto do CSV antes de injetá-lo no DOM.

O contexto do chat é montado de `filtered()` e limitado a `MAX_ROWS_CTX` (220)
linhas; recorte vazio é sinalizado em vez de mandar o dataset inteiro.

## Segredos e chaves

| Segredo | Onde deve ficar | Nunca |
| --- | --- | --- |
| `GEMINI_API_KEY` | `.env` (não versionado); no proxy, só no processo | no repositório; em host estático público |
| `OPENWEATHER_API_KEY` | idem | idem |
| `SUPABASE_ANON_KEY` | pública por design — vai ao navegador | confundir com a `service_role` |
| `SUPABASE` service_role | **só** no painel Supabase | em `.env`, código ou docs |

- `.env` está no `.gitignore`.
- No **modo direto** (`serve.ps1`), as chaves Gemini/OWM chegam ao navegador —
  aceitável só em máquina do próprio analista.
- No **modo proxy** (`server.mjs`), `/.env` responde 403 e as chaves ficam no
  processo.

> [!WARNING]
> Esta documentação nunca reproduz valores de segredo — apenas **nomes** com valor
> mascarado (`GEMINI_API_KEY=<redigido>`). Ao encontrar segredo versionado no
> repositório, registrar como risco aqui (na tabela abaixo) sem reproduzir o valor.

## Barreiras do proxy

`server.mjs` protege `/api/chat` e `/api/weather` com três barreiras simples e sem
dependência:

| Barreira | Função | Linha |
| --- | --- | --- |
| Origem | `originOk` — mesmo host ou `ALLOWED_ORIGINS`; sem `Origin`/`Referer` só loopback | 130 |
| Taxa | `rateLimit` — janela deslizante por IP (`LIMITS`) | 142 |
| Payload | `validateContents` — turnos `user`/`model`, tetos de parts/caracteres | 166 |

Sem elas, o `/api/chat` seria um proxy aberto gastando a cota da Nitro. O `system`
do cliente é ignorado no proxy (o prompt é do servidor).

## Supabase e RLS

RLS ligada com **apenas** policy de INSERT: o público grava e não lê/edita/apaga.
Validação de conteúdo por `check` no schema. Ver
[esquema Supabase](../03-dados/esquema-supabase.md) e
[ADR-0007](../01-arquitetura/adr/ADR-0007-supabase-rls-insert-only.md).

## LGPD

- O formulário de suporte coleta **nome, e-mail e mensagem** — dado pessoal.
  Minimize retenção; a leitura fica restrita a `service_role`/painel.
- Não há PII nos dados de consumo (agregados por país).
- Recomenda-se: informar finalidade e base legal no ponto de coleta; política de
  retenção/expurgo da tabela `suporte_mensagens`; e acesso ao painel Supabase sob
  MFA e RBAC.

## Achados e riscos

| Risco | Severidade | Observação |
| --- | --- | --- |
| INSERT anônimo sem CAPTCHA/rate-limit em `suporte_mensagens` | média | a tabela pode receber spam; considerar limite por IP na borda |
| Modo direto expõe chaves ao navegador | média | restringir ao uso local; nunca publicar `.env` em estático público |
| Nenhum segredo real encontrado versionado (`.env` ignorado; `.env.example` só com placeholders) | — | conferir a cada rodada |

> [!NOTE]
> Nenhum valor de segredo foi encontrado em texto claro no repositório nesta
> apuração (o `.env.example` traz apenas placeholders como
> `cole-sua-chave-...`). Reavaliar a cada execução do agente.

## Veja também

- [Esquema Supabase](../03-dados/esquema-supabase.md)
- [Configuração](../02-referencia/configuracao.md)
- [Integrações externas](../01-arquitetura/integracoes.md)
- [ADR-0007 — Supabase RLS só de INSERT](../01-arquitetura/adr/ADR-0007-supabase-rls-insert-only.md)
- [Hub da documentação](../README.md)
