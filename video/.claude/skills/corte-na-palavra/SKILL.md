---
name: corte-na-palavra
description: Notícias cortando numa palavra e travada no lugar. Use quando o usuário pedir /corte-na-palavra, ou quiser que uma palavra falada vire destaque num recorte de jornal/notícia (palavra em tarja vermelha, texto serifado desfocado ao fundo).
---

# /corte-na-palavra

Efeito: a fala cita um nome ou termo (ex.: "Claude"). A tela corta para um recorte de notícia em serifa, desfocado, e a câmera "trava" na palavra, que ganha uma tarja vermelha sólida com texto branco serifado grande.

## Entradas
- Vídeo falado em `public/` e a palavra-alvo (pergunte se não vier).
- Legenda com timestamps por palavra (`node sub.mjs <video>` gera o JSON via Whisper).

## Passos
1. Ache na legenda o `startMs`/`endMs` da palavra-alvo. O efeito dura de 0,6 s a 1,2 s, começando 2 a 4 frames antes da palavra.
2. Crie `src/Effects/CorteNaPalavra.tsx` com `<Sequence from={frame} durationInFrames={dur}>` sobre o vídeo.
3. Fundo: parágrafo de texto de notícia (3 a 4 manchetes/linhas, fonte serifada tipo `Playfair Display` ou `Georgia`, cor `#2a2a2a`, fundo papel `#efe6d6`). Aplique `filter: blur(6px)` e escala 1.15.
4. Animação (use `spring`/`interpolate`):
   - 0 a 6 frames: corte seco, texto de fundo com leve tremor horizontal (`translateX` ±8 px) e blur caindo de 12 px para 6 px.
   - Frame 6 em diante: a palavra-alvo entra na tarja com `scale` 1.25 para 1 (spring rápido, damping 14) e fica travada.
   - Tarja: fundo `#c0392b`, texto `#fff` serifado bold ~200 px, `padding: 0 36px`, leve rotação -1°, sombra `0 8px 0 rgba(0,0,0,.25)`.
5. Saída do efeito: fade de 4 frames de volta ao vídeo. O áudio original NÃO é cortado. Opcional: SFX curto de "whoosh" no início e "thud" na trava.
6. Valide com `npx remotion still` num frame do meio e renderize com `npx remotion render`.

## Dicas
- Se a palavra for longa, reduza o `fontSize` com `fitText` de `@remotion/layout-utils`.
- Mantenha a palavra exata como falada, com a mesma grafia da legenda.
