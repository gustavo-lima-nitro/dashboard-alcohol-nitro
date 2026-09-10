---
titulo: Registro de decisões arquiteturais (ADRs)
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Registro de decisões arquiteturais (ADRs)

Decisões relevantes do NitroDash, hoje implícitas no código, registradas em
formato ADR: **Contexto · Decisão · Alternativas · Consequências · Status · Data**.

## Índice

| ADR | Título | Status |
| --- | --- | --- |
| [ADR-0001](ADR-0001-single-file-zero-dependencia.md) | Dashboard single-file, zero dependência | Aceito |
| [ADR-0002](ADR-0002-geo-sem-biblioteca.md) | Geometria hand-rolled (sem biblioteca de mapa) | Aceito |
| [ADR-0003](ADR-0003-dois-runtimes-env.md) | Dois runtimes para o `.env` (direto vs proxy) | Aceito |
| [ADR-0004](ADR-0004-render-full-redraw.md) | Renderização por redraw completo | Aceito |
| [ADR-0005](ADR-0005-metrics-registro-unico.md) | `METRICS` como registro único | Aceito |
| [ADR-0006](ADR-0006-gemini-fallback-e-thinking.md) | Cadeia de fallback Gemini e tratamento de "thinking" | Aceito |
| [ADR-0007](ADR-0007-supabase-rls-insert-only.md) | Suporte no Supabase com RLS só de INSERT | Aceito |

> [!NOTE]
> Ao tomar uma decisão nova ou substituir uma existente, crie
> `ADR-<n>-<slug>.md` seguindo o formato e atualize esta tabela. Não reescreva um
> ADR aceito; marque-o como "Substituído" e aponte para o novo.

## Veja também

- [Visão geral da arquitetura](../visao-geral.md)
- [Integrações externas](../integracoes.md)
- [Hub da documentação](../../README.md)
