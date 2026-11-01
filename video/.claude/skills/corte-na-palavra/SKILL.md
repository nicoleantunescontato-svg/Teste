---
name: corte-na-palavra
description: Notícias cortando numa palavra e travada no lugar. Use quando o usuário pedir /corte-na-palavra, ou quiser que uma palavra falada vire destaque num recorte de jornal/notícia (palavra em tarja vermelha, texto serifado desfocado ao fundo).
---

# /corte-na-palavra

Efeito: a fala cita um nome ou termo (ex.: "Claude"). A tela faz **cortes rápidos (a cada ~6 frames) entre trechos de notícias diferentes**, em fontes diferentes (máquina de escrever `Courier New` e serifada `Georgia`). A palavra fica numa **tarja vermelha sempre no mesmo lugar, no centro**, enquanto o texto ao redor muda a cada corte. A página vai dando zoom (1 para 1.3), as linhas de cima e de baixo ficam desfocadas (mais quanto mais longe do centro) e o foco fica na linha da palavra.

## Entradas
- Vídeo falado em `public/` e a palavra-alvo (pergunte se não vier).
- Legenda com timestamps por palavra (`node sub.mjs <video>`) para achar o `startMs` da palavra.

## Passos
1. Ache o início da palavra na legenda. O efeito dura ~60 frames (2 s a 30 fps), começando ~2 frames antes dela.
2. Use `src/Effects/CorteNaPalavra.tsx` (já implementado). Props: `word`. Edite `SNIPPETS` para trocar os trechos ao redor. Cada um tem `font`, `above` (3 linhas), `before`, `after` e `below` (3 linhas), com as linhas cortadas pela borda.
3. Estrutura:
   - Frames 0 a 3: introdução com trama de pontos (halftone) e a tarja ainda pequena.
   - A cada 6 frames: troca para o próximo trecho; a tarja dá um pop (`spring`) e gira ±0.8°.
   - Página inteira com `scale` de 1 a 1.3 ao longo da duração.
   - Últimos 4 frames: fade de volta ao vídeo.
4. Tarja: fundo `#c0392b`, texto branco 220 px, `padding: 0 36px`, sombra `0 10px 0 rgba(0,0,0,.28)`. Posicione `before` e `after` de forma absoluta nos lados da tarja, para ela nunca se mover.
5. Fundo: papel `radial-gradient(#f7f3ea, #dcd4c1)`; linhas de cima/baixo com `blur(dist * 4px)`.
6. Use `<Sequence from={frame} durationInFrames={60}>` sobre o vídeo, sem cortar o áudio. Opcional: SFX de whoosh no início.
7. Valide com `npx remotion render CorteNaPalavra` (composição de teste em `Root.tsx`).

## Dicas
- Se a palavra for longa, reduza o `fontSize` com `fitText` de `@remotion/layout-utils`.
- Mantenha a palavra exata como falada, com a mesma grafia da legenda.
