---
name: grafico-de-vidro
description: Painel de vidro líquido (glassmorphism) com métrica e gráfico de linha verde crescendo, sobre o vídeo. Use quando o usuário pedir /grafico-de-vidro, ou quiser mostrar crescimento (seguidores, views, receita).
---

# /grafico-de-vidro

Efeito: um cartão translúcido com desfoque de fundo ("efeito vidro líquido") surge na parte inferior do vídeo. Mostra o rótulo (SEGUIDORES) em caixa alta espaçada, um número grande que conta de 0 até o valor (ex.: 127 mil, 307 mil, 376 mil) e um gráfico de linha verde com área preenchida que cresce da esquerda para a direita, terminando num ponto brilhante.

## Entradas
- Vídeo falado, rótulo, valor final e unidade (mil, mi, %). Opcional: série de pontos; se não houver, gere curva crescente suave com leve ruído (determinístico).

## Passos
1. Crie `src/Effects/GraficoDeVidro.tsx`.
2. Cartão: `position: absolute; left/right: 5%; bottom: 20%`, `borderRadius: 36`, `background: linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.04))`, `backdropFilter: blur(24px) saturate(1.4)`, borda `1px solid rgba(255,255,255,.22)`, sombra interna `inset 0 1px 0 rgba(255,255,255,.35)`.
3. Texto: rótulo `SEGUIDORES` 22 px, `letterSpacing: .3em`, `rgba(255,255,255,.55)`, monoespaçada. Número 96 px branco bold, unidade "mil" em 44 px ao lado.
4. Contador: `Math.round(interpolate(frame, [0, 45], [0, valor], {easing: Easing.out(Easing.cubic)}))`.
5. Gráfico em SVG: `<path>` da linha (`stroke #22c55e`, 6 px, `strokeLinecap: round`) com `strokeDasharray`/`strokeDashoffset` animados pelo mesmo progresso; área abaixo com gradiente `rgba(34,197,94,.35)` para transparente; círculo brilhante (`filter: drop-shadow(0 0 10px #22c55e)`) na ponta da linha.
6. Entrada: cartão sobe 60 px com spring e `opacity` de 0 a 1 em 10 frames; saída com fade de 6 frames.

## Dicas
- Se o vídeo ao fundo for claro, aumente o `blur` e escureça o cartão (`rgba(0,0,0,.25)`) para manter o contraste.
- Use `calculateMetadata` só se o valor vier de props; senão mantenha fixo.
