---
name: zoom-sobre-o-ombro
description: Cartões de prova (print, métrica) pousam ao lado da cabeça da pessoa, com zoom suave no vídeo. Use quando o usuário pedir /zoom-sobre-o-ombro, ou quiser mostrar prova social (views, resultados) "sobre o ombro" do apresentador.
---

# /zoom-sobre-o-ombro

Efeito: enquanto a pessoa fala, o vídeo dá um zoom lento (1.0 para 1.12). Um cartão branco com bordas arredondadas, inclinado, pousa ao lado da cabeça (no "ombro"), com uma prova: rótulo pequeno (OUTUBRO), número grande em vermelho (697 mil) e subtítulo (views em 3 dias). A legenda fica abaixo do rosto.

## Entradas
- Vídeo falado, texto/valores do cartão e o instante de entrada.

## Passos
1. Crie `src/Effects/ZoomSobreOOmbro.tsx`.
2. Zoom: aplique no `<Video>` `transform: scale(interpolate(frame, [0, dur], [1, 1.12]))` com `transformOrigin` no rosto (ex.: `50% 35%`).
3. Posição: descubra de que lado a cabeça está (centro-esquerda ou direita). Coloque o cartão no lado livre, na altura do ombro, sem cobrir o rosto nem a boca (~`top: 22%`, `right: 4%`).
4. Cartão: `background: #fff`, `borderRadius: 20`, `padding: 20px 28px`, sombra `0 16px 40px rgba(0,0,0,.25)`, rotação 3° a 6°. Rótulo 16 px caixa alta cinza, número 72 px `#c0392b` bold, subtítulo 14 px cinza.
5. Entrada: spring de `translateY 80px, scale .8, rotate 10°` para o repouso (damping 13), em ~10 frames. Fica ~1,5 s e sai com fade de 5 frames.
6. Opcional: contagem do número (0 até 697) em 20 frames e SFX de "pop".

## Dicas
- Se o fundo do vídeo tiver o mesmo tom do cartão, aumente a sombra ou use cartão escuro.
- Pode haver 2 cartões em sequência (mesmo ombro, trocando o conteúdo).
