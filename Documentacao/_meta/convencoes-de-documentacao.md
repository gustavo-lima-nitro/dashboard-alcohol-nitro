---
titulo: Convenções de documentação
area: meta
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Convenções de documentação

Regras de estilo e formatação para toda página em `Documentacao/`. Derivadas do
playbook do agente em `.claude/agents/documentador-site.md`.

## Sumário

- [Idioma e tom](#idioma-e-tom)
- [Estrutura de cada arquivo](#estrutura-de-cada-arquivo)
- [Referência a código](#referência-a-código)
- [Recursos de formatação](#recursos-de-formatação)
- [Segurança](#segurança)

## Idioma e tom

- **pt-BR** em tudo. Tom técnico e direto, sem marketing.
- Um único `# H1` por arquivo; hierarquia de títulos sem pular níveis.

## Estrutura de cada arquivo

1. **Frontmatter YAML** obrigatório no topo:

   ```yaml
   ---
   titulo: <título curto>
   area: <visao-geral | arquitetura | referencia | dados | operacao | qualidade | meta>
   atualizado_em: AAAA-MM-DD
   commit_base: <sha curto>
   responsavel: agente documentador-site
   ---
   ```

2. **Sumário** (lista de links internos) em arquivos com mais de 3 seções.
3. Corpo com seções bem delimitadas.
4. **`## Veja também`** ao final, com 2 a 5 links relativos. Nenhuma página órfã:
   o [hub](../README.md) linka todas, e cada página linka de volta.

## Referência a código

- Sempre no formato `caminho/arquivo.ext:linha` em backticks —
  ex.: `Dashboards/index.html:1258`.
- Bloco de código curto (≤ 15 linhas) quando o trecho for essencial ao entendimento.
- Como `Dashboards/index.html` tem uma linha gigante (o TopoJSON inline, ~100 KB
  na linha 983), para lê-lo como texto filtre essa linha:
  `awk 'length($0)<600' Dashboards/index.html`.

## Recursos de formatação

- **Tabelas** para parâmetros, retornos, erros, variáveis de ambiente e colunas.
- **Diagramas Mermaid** em blocos ` ```mermaid ` (`flowchart`, `sequenceDiagram`,
  `erDiagram`, `stateDiagram-v2`) — versionam como texto.
- **Blocos de destaque**: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]`.
- **ADR**: Contexto · Decisão · Alternativas consideradas · Consequências ·
  Status (Proposto/Aceito/Substituído) · Data.

> [!WARNING]
> Proibido placeholder do tipo "TODO: descrever". Se não deu para apurar, escreva
> o que se sabe e registre a lacuna em [`estado.md`](estado.md).

## Segurança

Nunca copie para a documentação senhas, tokens, chaves de API, connection strings,
conteúdo real do `.env`, dados pessoais ou PII. Documente apenas **nomes** de
variáveis, com valor mascarado (`GEMINI_API_KEY=<redigido>`). Ver
[segurança e privacidade](../05-qualidade/seguranca-e-privacidade.md).

## Veja também

- [Hub da documentação](../README.md)
- [Estado da documentação](estado.md)
- [Histórico de execuções](historico-execucoes.md)
- [Segurança e privacidade](../05-qualidade/seguranca-e-privacidade.md)
