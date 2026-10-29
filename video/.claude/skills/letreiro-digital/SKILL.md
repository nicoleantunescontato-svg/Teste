---
name: letreiro-digital
description: Texto grande em estilo letreiro de LED/pixels que revela a frase palavra por palavra. Use quando o usuário pedir /letreiro-digital, ou quiser uma frase de impacto em tela cheia sobre fundo escuro com grade de pixels.
---

# /letreiro-digital

Efeito: tela preta com trama de pontos/pixels (painel de LED). Uma frase de destaque (ex.: "Cada efeito foi feito com um prompt.") aparece em branco, fonte sans bem pesada, enorme, cortada pela borda, como um letreiro. O texto parece desenhado por pixels e termina em ponto final.

## Entradas
- Vídeo falado, trecho (início/fim) e a frase. Se a frase não vier, extraia da legenda.

## Passos
1. Crie `src/Effects/LetreiroDigital.tsx`, `<Sequence>` com a duração da frase falada.
2. Fundo: `#0a0a0a` com trama de pixels: `radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1.5px)` com `background-size: 6px 6px`.
3. Texto: fonte `TheBoldFont` (já em `public/theboldfont.ttf`) ou Montserrat 800, `fontSize` ~220 px, branco `#f5f5f5`, `letterSpacing: -4px`, sem quebra de linha longa.
4. Efeito pixel: sobre o texto aplique uma máscara com a mesma trama (`mask-image: radial-gradient(...)` 6 px) e `text-shadow: 0 0 12px rgba(255,255,255,.35)`. Para o brilho de LED, `filter: contrast(1.3)`.
5. Revelação: uma palavra por vez, sincronizada com a legenda (`startMs`). Cada palavra entra com `opacity 0 para 1` e `translateX 40px para 0` em 4 frames. Último termo recebe ponto final.
6. Movimento: a frase inteira desliza devagar para a esquerda (`translateX` linear, ~-200 px ao longo da duração), de modo que o texto fique cortado pela borda, como no original.

## Dicas
- Ajuste o tamanho para que ao menos uma palavra fique legível por completo em cada instante.
- Combine com `/corte-na-palavra` para dar variedade ao longo do vídeo.
