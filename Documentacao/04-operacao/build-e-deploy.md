---
titulo: Build e deploy
area: operacao
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Build e deploy

Não há build step. O deploy é estático (Vercel), com um rewrite da raiz para o
dashboard.

## Sumário

- [Sem build](#sem-build)
- [Vercel e vercel.json](#vercel-e-verceljson)
- [Deploy com as integrações](#deploy-com-as-integrações)
- [Checklist de promoção](#checklist-de-promoção)

## Sem build

O entregável é `Dashboards/index.html` mais os assets. Não há transpile, bundle ou
minificação — o que está no repositório é o que roda. Ver
[ADR-0001](../01-arquitetura/adr/ADR-0001-single-file-zero-dependencia.md).

## Vercel e vercel.json

`vercel.json` reescreve a raiz para o dashboard:

```json
{
  "rewrites": [
    { "source": "/", "destination": "/Dashboards/index.html" }
  ]
}
```

Assim `https://<deploy>/` serve o dashboard sem expor o caminho. Commit relevante:
`d148764` ("rewrite da raiz para o dashboard no deploy da Vercel").

## Deploy com as integrações

> [!IMPORTANT]
> Servir estático na Vercel equivale ao **modo direto** (não há `/api/*` a menos
> que se publique o `server.mjs` como função/servidor). Consequências:
> - Sem proxy, as chamadas de chat/clima seriam diretas e exporiam a chave — evite
>   publicar `.env` em host estático público.
> - Para manter as chaves fora do navegador em produção, rode o `server.mjs` (ou
>   equivalente) e configure `ALLOWED_ORIGINS` com o domínio do deploy. O
>   `originOk` do `server.mjs` (`:130`) barra origens não autorizadas.
> - Os caminhos de `/api/*` usam URLs **absolutas** para o modo proxy ser
>   detectado corretamente atrás do rewrite (commits `f08e7ef`, `94260d7`).

## Checklist de promoção

- [ ] `drinks.csv` carrega e todos os painéis renderizam (console limpo).
- [ ] Os três modos testados conforme o alvo (estático = direto; com Node = proxy).
- [ ] `.env` **não** incluído no deploy estático público.
- [ ] `ALLOWED_ORIGINS` inclui o domínio, se usar proxy.
- [ ] Migração Supabase aplicada e RLS ligada, se o suporte estiver ativo.
- [ ] Rewrite da raiz funcionando (`/` → dashboard).

## Veja também

- [Ambiente local](ambiente-local.md)
- [Configuração](../02-referencia/configuracao.md)
- [Segurança e privacidade](../05-qualidade/seguranca-e-privacidade.md)
- [Runbooks](runbooks.md)
- [Hub da documentação](../README.md)
