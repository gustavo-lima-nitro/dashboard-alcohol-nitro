---
titulo: Configuração
area: referencia
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Configuração

Variáveis de ambiente, registros de configuração no código e a detecção de modo em
runtime.

## Sumário

- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Detecção de modo (bootConfig)](#detecção-de-modo-bootconfig)
- [Registro METRICS](#registro-metrics)
- [Limites do proxy](#limites-do-proxy)

## Variáveis de ambiente

Definidas em `.env` na raiz (não versionado). Modelo em `.env.example`.

| Variável | Para que serve | Lida por |
| --- | --- | --- |
| `GEMINI_API_KEY` | Chave do Google AI Studio (chat) | `server.mjs`, front (modo direto) |
| `GEMINI_MODELS` | Cadeia de fallback, esquerda→direita | `server.mjs`, front |
| `OPENWEATHER_API_KEY` | Chave do OpenWeatherMap (clima) | `server.mjs`, front (modo direto) |
| `PORT` | Porta dos servidores locais (padrão 8080) | `server.mjs`, `serve.ps1` |
| `ALLOWED_ORIGINS` | Origens extras que podem chamar `/api/*` (CSV) | `server.mjs` |
| `SUPABASE_URL` | URL do projeto Supabase (suporte) | `server.mjs`, front |
| `SUPABASE_ANON_KEY` | **publishable/anon** key (pública por design) | `server.mjs`, front |

> [!WARNING]
> Nunca versione o `.env`, nunca use a `service_role` do Supabase aqui, e nunca
> reproduza valores reais nesta documentação — só **nomes** com valor mascarado
> (`GEMINI_API_KEY=<redigido>`). Ver
> [segurança e privacidade](../05-qualidade/seguranca-e-privacidade.md).

Tanto `server.mjs` (`loadEnv`, `:21`) quanto o front (`parseEnv`, `:2137`) fazem o
mesmo parsing: ignoram `#` e linhas vazias, tiram aspas envolventes.

## Detecção de modo (bootConfig)

`bootConfig()` (`Dashboards/index.html:2152`) popula o objeto `CFG` (`:2134`):

| Campo de `CFG` | Significado |
| --- | --- |
| `mode` | `"proxy"` \| `"direct"` \| `"off"` |
| `chat`, `weather` | features ligadas (há chave) |
| `models` | lista efetiva de modelos (senão `DEFAULT_MODELS`, `:2150`) |
| `geminiKey`, `owmKey` | chaves (só no modo direto) |
| `sbUrl`, `sbKey`, `support` | Supabase e se o suporte está disponível |

Ordem: `file:` → `off`; senão `/api/config` responde → `proxy`; senão `.env`
legível com `GEMINI_API_KEY`/`OPENWEATHER_API_KEY`/`SUPABASE_URL` → `direct`; senão
`off`. Fluxo em [integrações](../01-arquitetura/integracoes.md#os-três-modos-de-runtime).

## Registro METRICS

`Dashboards/index.html:1135`. Fonte única para bebida (ver
[ADR-0005](../01-arquitetura/adr/ADR-0005-metrics-registro-unico.md)).

| `key` | `label` | `short` | `unit` | `dec` | `color` |
| --- | --- | --- | --- | --- | --- |
| `total` | Total | Total álcool puro | L | 1 | `#B9DA00` |
| `beer` | Cerveja | Cerveja | doses | 0 | `#B9DA00` |
| `spirit` | Destilados | Destilados | doses | 0 | `#87bd41` |
| `wine` | Vinho | Vinho | doses | 0 | `#2c6f96` |

Cada entrada tem também `re` (regex de cabeçalho) usada por `detectCols`.

## Limites do proxy

Constantes de payload/uso no `server.mjs`:

| Constante | Linha | Valor | Papel |
| --- | --- | --- | --- |
| `CHAT_BODY_BYTES` | 70 | 256000 | corpo bruto aceito em `/api/chat` |
| `CHAT_MAX_TURNS` | 71 | 16 | turnos por conversa (front guarda 12+1) |
| `CHAT_MAX_PARTS` | 72 | 4 | parts por turno |
| `CHAT_MAX_PART` | 73 | 60000 | caracteres por part |
| `CHAT_MAX_TOTAL` | 74 | 140000 | caracteres somados |
| `LIMITS` | 76 | — | janela deslizante por IP (`/api/chat`, `/api/weather`) |

> [!NOTE]
> O front respeita os tetos: `CHAT.history` fica em 12 turnos e `MAX_ROWS_CTX` em
> 220 linhas (`Dashboards/index.html:2260`). Mexer neles pede revisar os
> `CHAT_MAX_*` do servidor.

## Veja também

- [Integrações externas](../01-arquitetura/integracoes.md)
- [Ambiente local](../04-operacao/ambiente-local.md)
- [Segurança e privacidade](../05-qualidade/seguranca-e-privacidade.md)
- [Índice de símbolos](README.md)
- [Hub da documentação](../README.md)
