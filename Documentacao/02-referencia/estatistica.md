---
titulo: Estatística e geometria
area: referencia
atualizado_em: 2026-09-10
commit_base: 94260d7
responsavel: agente documentador-site
---

# Estatística e geometria

Funções numéricas (estatística descritiva, correlação, regressão) e o motor
cartográfico hand-rolled.

## Sumário

- [stats](#stats)
- [pearson](#pearson)
- [linreg](#linreg)
- [Regra de Sturges (histograma)](#regra-de-sturges-histograma)
- [Geometria e projeção](#geometria-e-projeção)
- [Escalas de cor](#escalas-de-cor)

## stats

`Dashboards/index.html:1066` — estatística descritiva de um array numérico.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `stats(arr) → {n, sum, mean, median, min, max, sd, q1, q3}` |
| Filtra | mantém só `isFinite` |
| Quantis | interpolação linear `(n-1)*p` |
| Desvio | **amostral** (denominador `n-1`); `0` quando `n≤1` |
| Vazio | tudo `null` exceto `n:0, sum:0` |

```js
const varr = n>1 ? a.reduce((s,v)=>s+(v-mean)**2,0)/(n-1) : 0;
return {n,sum,mean,median:q(.5),min:a[0],max:a[n-1],sd:Math.sqrt(varr),q1:q(.25),q3:q(.75)};
```

## pearson

`Dashboards/index.html:1076` — coeficiente de correlação de Pearson.

| Aspecto | Valor |
| --- | --- |
| Assinatura | `pearson(x,y) → number \| null` |
| Pares | só onde ambos são `isFinite` |
| `null` quando | menos de 3 pares, ou variância zero em x ou y |

## linreg

`Dashboards/index.html:1085` — regressão linear simples (mínimos quadrados).

| Aspecto | Valor |
| --- | --- |
| Assinatura | `linreg(x,y) → {m, b, n} \| null` |
| `null` quando | menos de 3 pares, ou `sxx === 0` |
| Uso | reta sobreposta no `renderScatter` |

## Regra de Sturges (histograma)

`renderHist` (`:1634`) escolhe o número de classes pela regra de Sturges
(`⌈log₂ n⌉ + 1`) sobre os valores válidos da métrica. `strength(r)` (`:1627`)
rotula a força: `≥.8` muito forte, `≥.6` forte, `≥.4` moderada, `≥.2` fraca, senão
desprezível.

## Geometria e projeção

Sem biblioteca de mapa (ver
[ADR-0002](../01-arquitetura/adr/ADR-0002-geo-sem-biblioteca.md)).

| Função | Linha | Papel |
| --- | --- | --- |
| `equalEarth(lon,lat)` | `:1164` | projeção Equal Earth em forma fechada (constantes `EE`, `:1163`) |
| `topoDecode(topo)` | `:1172` | expande arcos delta-encoded do TopoJSON; índice negativo = arco reverso via `~i`; ignora Antártida |
| `fixAntimeridian(ring)` | `:1201` | desloca ±360° o hemisfério minoritário de anéis que cruzam ±180° |
| `MAP_PATHS` (IIFE) | `:1210` | pré-computa os paths projetados no viewBox 980×470, em duas passadas |

```js
function fixAntimeridian(ring){
  let cross=false;
  for(let i=1;i<ring.length;i++)
    if(Math.abs(ring[i][0]-ring[i-1][0])>180){ cross=true; break; }
  if(!cross) return ring;
  let pos=0; for(const p of ring) if(p[0]>0) pos++;
  const east = pos >= ring.length/2;
  return ring.map(([lo,la])=>[ east ? (lo<0?lo+360:lo) : (lo>0?lo-360:lo), la ]);
}
```

> [!WARNING]
> `MAP_PATHS` faz **duas passadas**: a 1ª mede a extensão do quadro pelas
> coordenadas cruas (−180…180); a 2ª projeta os anéis já corrigidos. Não junte as
> passadas, ou o enquadramento quebra. O excedente dos anéis corrigidos é aparado
> pelo `#mapClip` — não remova o clip nem a correção de antimeridiano
> (Rússia/Chukotka, Fiji borrariam pelo mapa).

## Escalas de cor

| Função | Linha | Papel |
| --- | --- | --- |
| `hex2rgb(h)` | `:1331` | hex → `[r,g,b]` |
| `rampColor(t)` | `:1332` | interpola `RAMP` em `t∈[0,1]` |
| `corrColor(r)` | `:1338` | divergente por `\|r\|`; `null`→`NODATA` |
| `buildScale(vals)` | `:1346` | monta escala **quantílica** (padrão) ou **linear**; degenera para uma cor quando `lo===hi` |

`RAMP` (7 paradas), `DIV_NEG/DIV_MID/DIV_POS` e `NODATA` estão em `:990–997`.
Detalhe conceitual em
[camada de apresentação](../01-arquitetura/camada-de-apresentacao.md#escalas-de-cor).

## Veja também

- [Funções de render](funcoes-de-render.md)
- [Camada de apresentação](../01-arquitetura/camada-de-apresentacao.md)
- [ADR-0002 — Geometria sem biblioteca](../01-arquitetura/adr/ADR-0002-geo-sem-biblioteca.md)
- [Índice de símbolos](README.md)
- [Hub da documentação](../README.md)
