---
titulo: ADR-0007 — Suporte no Supabase com RLS só de INSERT
area: arquitetura
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# ADR-0007 — Suporte no Supabase com RLS só de INSERT

- **Status**: Aceito
- **Data**: 2026-09-10 (documentado; decisão anterior ao registro)

## Contexto

O formulário "Fale com o suporte" precisa persistir mensagens sem backend próprio.
O navegador só pode usar a chave **publishable/anon**, que é pública por design —
qualquer um que veja o front tem a chave.

## Decisão

Gravar direto na tabela `public.suporte_mensagens` via REST do Supabase com a
anon key, e **proteger com RLS**: uma única policy de `INSERT` (`with check (true)`)
para `anon, authenticated`, e `revoke select, update, delete`. Assim o público
grava, mas **não lê, edita ou apaga** nada. A leitura fica para o painel Supabase /
`service_role`. A coluna `enviado_em` é preenchida pelo banco (`now()`), nunca pelo
cliente.

## Alternativas consideradas

- **Backend próprio**: mais controle, mas contraria o "zero infra" do projeto.
- **Tabela sem RLS**: expõe leitura/edição a qualquer um com a anon key —
  inaceitável.

## Consequências

- ✅ Persistência sem servidor dedicado; segredo forte (`service_role`) nunca sai
  do painel.
- ✅ Validação de conteúdo no próprio schema (checks de tamanho e formato).
- ⚠️ A anon key vai ao navegador — é esperado; a segurança depende inteiramente da
  RLS estar ligada. Ver [segurança](../../05-qualidade/seguranca-e-privacidade.md).
- ⚠️ Sem CAPTCHA/rate-limit no INSERT: a tabela pode receber spam anônimo.

## Veja também

- [Índice de ADRs](README.md)
- [Esquema Supabase](../../03-dados/esquema-supabase.md)
- [Segurança e privacidade](../../05-qualidade/seguranca-e-privacidade.md)
