---
titulo: Runbooks
area: operacao
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Runbooks

Sintoma → causa provável → ação. Referência rápida para diagnóstico.

## Sumário

- [Dashboard / dados](#dashboard--dados)
- [Chat (Gemini)](#chat-gemini)
- [Clima](#clima)
- [Suporte (Supabase)](#suporte-supabase)
- [Mapa](#mapa)

## Dashboard / dados

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| Nada renderiza após soltar o CSV | erro de ingestão | ver a faixa de erro (`#err`) e o console; conferir cabeçalho contra as regex de `METRICS` |
| "Nenhuma coluna de consumo reconhecida" | cabeçalhos fora do padrão | renomear colunas ou ajustar `re` em `METRICS` |
| Dashboard "quebrado" após testar no console | `ingest()` mutou `S` parcialmente | resetar `S` inteiro, depois `recomputeBounds(false); renderAll()` |
| Painéis vazios com dados carregados | recorte vazio (país/faixa) | afrouxar filtros; é estado legítimo, não bug |
| País no grupo "Sem mapeamento" | nome em português ou fora do gazetteer | adicionar alias normalizado em `ALIAS_RAW`/`CONT_RAW` |

## Chat (Gemini)

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| Botão de chat ausente/inerte | modo `off` (`file://`) ou sem `GEMINI_API_KEY` | servir por HTTP; conferir `.env` |
| "Não consegui responder" com tentativas listadas | todos os modelos falharam | ver `tried`; checar cota (429), chave (401/403), lista de modelos |
| Resposta volta vazia | `MAX_TOKENS` no "thinking" | garantir `thinkingLevel:"low"` + `maxOutputTokens` folgado (já no código) |
| Modos respondem diferente | `SYSTEM_PROMPT` dessincronizado | igualar as cópias em `index.html:2325` e `server.mjs:54` |
| `403 origem não autorizada` (proxy) | origem fora de `ALLOWED_ORIGINS` | incluir o domínio em `ALLOWED_ORIGINS` |
| `429 muitas requisições` | janela deslizante por IP | aguardar o `retry-after`; revisar `LIMITS` se legítimo |

## Clima

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| Widget nunca aparece | permissão de localização negada, ou sem `OPENWEATHER_API_KEY` | conceder localização; conferir chave; é degradação silenciosa por design |
| `503 OPENWEATHER_API_KEY ausente` (proxy) | chave não configurada | preencher `.env` |

## Suporte (Supabase)

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| "Envio indisponível" no form | `CFG.support` falso (sem `SUPABASE_URL`/`SUPABASE_ANON_KEY`) | configurar `.env` e servir por HTTP |
| "Não conseguimos enviar agora" | erro REST do Supabase | ver console; conferir RLS de INSERT, URL e anon key |
| INSERT rejeitado por check | payload fora das regras (tamanho/e-mail/assunto) | validar o form contra o [esquema](../03-dados/esquema-supabase.md) |

## Mapa

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| País preenche atravessando o mapa | anel de antimeridiano sem correção | não remover `fixAntimeridian` nem o `#mapClip` |
| Console: "Invalid keyframe value" | animação SVG sem unidade CSS | usar `"0px"`, não `0` |
| País some do mapa | alias mal escrito ou alvo inexistente no atlas | escrever chave via `norm()`; validar nome no atlas 110m |
| Microestado não aparece | sem polígono em 110m (esperado) | contagem exibida na nota do mapa |

## Veja também

- [Qualidade e validação](../03-dados/qualidade-e-validacao.md)
- [Integrações externas](../01-arquitetura/integracoes.md)
- [Ambiente local](ambiente-local.md)
- [Estratégia de testes](../05-qualidade/estrategia-de-testes.md)
- [Hub da documentação](../README.md)
