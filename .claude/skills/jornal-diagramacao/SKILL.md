---
name: jornal-diagramacao
description: Escreve e diagrama a edição diária de "O Diário do NitroDash" — transforma o JSON de pauta da apuração em um jornal HTML autocontido, com identidade Nitro, e salva a edição em Jornal/edicoes. Use SEMPRE que for redigir, formatar ou refazer o jornal do projeto, quando o usuário pedir "monta o jornal", "escreve a edição", "formata o jornal", ou quando a rotina `jornal` rodar. Vem DEPOIS da habilidade jornal-apuracao.
---

# O Diário do NitroDash — redação e diagramação 📰

Você é o **editor-chefe**. Recebe o JSON de pauta produzido por `jornal-apuracao` e entrega
**um arquivo HTML** autocontido — a edição, que fica salva em disco e é lida no navegador.

A entrega termina no arquivo: **esta habilidade não envia nada para lugar nenhum** — sem
webhook, sem e-mail, sem publicação. Quem lê abre o arquivo.

Entrada: `Jornal/apuracao/<AAAA-MM-DD>.json`
Saída: `Jornal/edicoes/<AAAA-MM-DD>-ed-<NNN>.html`
Leitor: uma pessoa só — o dono do projeto, que passou o dia fora e tem 3 minutos.

**Nunca apure aqui.** Todo número e todo fato vêm do JSON. Se um dado não está lá, ele não
entra no jornal — não vá ao GitHub "só para conferir" e jamais preencha lacuna com suposição.

## Numeração da edição

```bash
ls Jornal/edicoes/*.html 2>/dev/null | wc -l
```

Edição = contagem + 1, com três dígitos (`001`). Se já existe edição para a data de hoje,
**sobrescreva a mesma** em vez de criar outra (reenvio não gasta número novo).

## As sete regras da casa

1. **Fato com número e link.** Toda afirmação sobre trabalho feito cita `#N`. Sem `#N`, a
   frase sai.
2. **"Mergeado" não é "corrigido em produção".** Só escreva que algo está no ar se
   `verificado_em_producao` for `"sim"`. Quando for `"nao_verificado"`, diga exatamente isso:
   *"mergeado hoje; ainda não conferido em produção"*.
3. **Traduza para consequência.** Cada matéria termina em **Por que importa para você** —
   o efeito para quem usa o dashboard ou para o negócio, não o detalhe técnico repetido.
4. **Honestidade antes de manchete.** Dia fraco é dia fraco. Não infle, não celebre, não use
   "revolucionário", "incrível", "robusto". Se a redação errou ou atrasou, o jornal registra.
5. **Separe o que é do dono do que é da frota.** O que exige credencial, painel de terceiro,
   dinheiro ou decisão de produto vai para *A Mesa do Dono*, com caminho e comando de
   conferência. O resto é atraso da casa e a redação cobra a si mesma.
6. **pt-BR, voz ativa, frase curta.** Zero jargão de commit no corpo do texto (o leitor não
   quer ler `fixAntimeridian`, quer saber que o mapa parou de escorrer).
7. **Sem dado sensível.** Nenhuma chave, token, URL com assinatura, e-mail de terceiro ou
   conteúdo de `.env` — nem mascarado, nem de brincadeira.

## Estrutura da edição

Nesta ordem. Seção sem material some — não deixe título órfão nem "nada a relatar".

| Seção | Conteúdo | Tamanho |
|---|---|---|
| **Masthead** | `O Diário do NitroDash` + tagline + `Edição Nº NNN · <dia da semana>, <data por extenso>` + `Produção · Vercel · master` | fixo |
| **Clima do projeto** | Parágrafo único que resume o dia: volume, qualidade e o incômodo. É o que se lê se só houver 20 segundos. | 40–70 palavras |
| **Capa** | A matéria mais importante do dia: manchete de 1–2 linhas, linha fina, 2–4 parágrafos, `Por que importa` e as referências. | 150–250 palavras |
| **Os números do dia** | Grade com issues abertas/fechadas, PRs abertas/mergeadas, backlog, commits, discussions, quadro (se houver). Abaixo, uma linha de saldo: *fechou X, abriu Y*. | grade + 1 linha |
| **Matérias** | 1 a 3 blocos para o que mais rendeu depois da capa (segurança, correção rápida, entrega grande). Mesmo formato da capa, mais curto. | 80–150 palavras cada |
| **Bastidores** | Lista das correções silenciosas: uma linha por item com `#N`. | 1 linha por item |
| **A Mesa do Dono** | Só o que agente nenhum consegue fazer. Cada item: o que é, por que travou, o caminho e **como conferir depois** (comando em bloco monoespaçado). | 1–4 itens |
| **Opinião** | Editorial curto e assinado por um membro fictício da redação, sobre um padrão observado nos dados do dia — não sobre a vida. Assine com nome e cargo. | 100–160 palavras |
| **A voz da comunidade** | Aspas reais das discussions (campo `citacao`), com a resposta honesta da redação. Sem citação no JSON, a seção não existe. | 80–140 palavras |
| **Radar — em trânsito** | Issues e PRs abertas que seguem pendentes: `#N` + uma linha do que trava. Marque os atrasos da casa. | 1 linha por item |
| **Rodapé** | `O Diário do NitroDash` · redação composta por agentes · fonte GitHub `gustavo-lima-nitro/dashboard-alcohol-nitro` · edição e data · *A próxima edição chega amanhã, às 21h00.* | fixo |

### Edição magra (dia sem movimento)

Se o dia zerou (nenhuma issue, PR, commit ou discussion), publique mesmo assim, com
**Masthead + Clima do projeto + Os números do dia + Radar + Rodapé** e o selo
`EDIÇÃO MAGRA` no lugar do rótulo de confidencialidade. Uma frase basta: dia sem movimento,
backlog em X, produção respondendo Y. Nunca faça uma edição normal com material inventado.

## Identidade visual

Do brandbook Nitro (`Referencias/nitro_brand_book_by_pomelli.pdf`) — **não** das skills
`nitro-padrao-sistemas` / `nitro-ppt`, cujo azul é outro.

| Token | Hex | Uso |
|---|---|---|
| Admiral Blue | `#003663` | masthead, títulos de seção, filetes |
| Chartreuse | `#94C356` | destaque de número, marcador de lista |
| Citron | `#B9DA00` | realce pontual, selo |
| Gunmetal | `#424242` | corpo de texto |
| White | `#FFFFFF` | fundo |
| Cinza de apoio | `#F4F6F8` / `#DDE3E8` | fundo de caixa e borda |

Tipografia: **Poppins**, sempre com a pilha
`font-family:'Poppins','Segoe UI',Arial,Helvetica,sans-serif` — a edição não baixa fonte, e o
texto precisa cair em algo decente. Corpo 15px/1.6, manchete 22–26px em Admiral Blue, rótulo
de seção 11px, caixa-alta, `letter-spacing:1.5px`.

## Restrições do HTML

A edição é **um arquivo só, que se basta**: tem de abrir igual daqui a um ano, offline, numa
máquina que nunca viu este projeto — e continuar legível se alguém copiar o conteúdo para
outro lugar. Então:

- **Estilo inline em todo elemento.** Nada de `<style>`, `<link>`, classe ou variável CSS —
  é o que sobrevive a um copiar e colar.
- **Layout em `<table>`** com `role="presentation"`, largura máxima `680px`, centralizada.
  Sem flexbox, sem grid, sem `position`.
- **Sem imagem externa, sem script, sem iframe, sem requisição de rede.** O masthead é
  tipografia; filete é `border-top` ou célula com `background-color`.
- Cor sempre em hex de 6 dígitos; `padding` em `px`; sem `rem`, `vh` ou `calc()`.
- Comece com `<!DOCTYPE html>` e um `<meta charset="utf-8">` no `<head>`, para o arquivo abrir
  certo no navegador.
- Acento em pt-BR gravado em **UTF-8 sem BOM**.

Esqueleto de referência (adapte, não copie cego):

```html
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>O Diário do NitroDash — Ed. Nº 001</title></head>
<body style="margin:0;padding:0;background-color:#F4F6F8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F6F8;">
 <tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="width:680px;max-width:680px;background-color:#FFFFFF;border:1px solid #DDE3E8;">
   <!-- selo -->
   <tr><td style="background-color:#003663;padding:8px 28px;font-family:'Poppins','Segoe UI',Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#B9DA00;text-transform:uppercase;">Boletim diário · edição do dono · confidencial</td></tr>
   <!-- masthead -->
   <tr><td style="padding:28px 28px 8px 28px;font-family:'Poppins','Segoe UI',Arial,Helvetica,sans-serif;">
     <div style="font-size:32px;line-height:1.1;font-weight:700;color:#003663;">O Diário do NitroDash</div>
     <div style="font-size:13px;font-style:italic;color:#424242;padding-top:6px;">Tudo o que a frota de agentes fez no dashboard enquanto você tocava a operação</div>
   </td></tr>
   <tr><td style="padding:0 28px;"><div style="border-top:3px solid #94C356;"></div></td></tr>
   <tr><td style="padding:10px 28px 0 28px;font-family:'Poppins','Segoe UI',Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#424242;">Edição Nº 001 · quarta-feira, 9 de setembro de 2026 · Produção · Vercel · master</div></td></tr>
   <!-- clima, capa, números, matérias, bastidores, mesa do dono, opinião, comunidade, radar -->
   <tr><td style="padding:20px 28px;font-family:'Poppins','Segoe UI',Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#424242;">…</td></tr>
  </table>
 </td></tr>
</table>
</body></html>
```

Padrões dos elementos recorrentes:

- **Rótulo de seção**: célula com `border-top:1px solid #DDE3E8;` e texto 11px, caixa-alta,
  `letter-spacing:1.5px`, cor `#003663`.
- **Número do dia**: tabela de duas ou três colunas; valor 26px `font-weight:700` em
  `#003663`, rótulo 11px em `#424242`, célula com `background-color:#F4F6F8;padding:12px`.
- **Caixa "Por que importa para você"**: célula `background-color:#F4F6F8;`
  `border-left:4px solid #94C356;padding:12px 14px;font-size:14px;`, com o rótulo em
  negrito e itálico.
- **Comando de conferência**: `<div style="font-family:Consolas,'Courier New',monospace;font-size:13px;background-color:#003663;color:#FFFFFF;padding:10px 12px;">`.
- **Referência de item**: `<a href="…" style="color:#003663;font-weight:600;text-decoration:underline;">#7</a>`.

## Fechamento

1. Grave o HTML em `Jornal/edicoes/<AAAA-MM-DD>-ed-<NNN>.html`.
2. Atualize `Jornal/edicoes/INDEX.md` com uma linha:
   `- Ed. Nº NNN — AAAA-MM-DD — <manchete da capa> — [arquivo](<AAAA-MM-DD>-ed-<NNN>.html)`
   (crie o arquivo com o título `# Edições — O Diário do NitroDash` se não existir).
3. Confira antes de entregar: todo `#N` tem link, nenhum número contradiz o JSON, nenhuma
   seção vazia sobrou e não há `<style>`, classe, script ou imagem externa no arquivo.
4. Relate: caminho do arquivo, número da edição e a manchete da capa.
