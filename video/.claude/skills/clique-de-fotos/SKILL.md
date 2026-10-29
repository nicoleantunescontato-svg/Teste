---
name: clique-de-fotos
description: Fotos entram num clique e atravessam a tela como cartões. Use quando o usuário pedir /clique-de-fotos, ou quiser mostrar prints/fotos/cartões de dados (calendário, métrica, apps) sobrepostos num painel, acima do rosto.
---

# /clique-de-fotos

Efeito: o quadro se divide em duas metades (formato vertical 9:16). Em cima, um painel cinza-claro com grade fina; embaixo, o vídeo da pessoa em zoom. No painel, fotos/cartões brancos com borda arredondada entram "no clique" (estalo rápido), levemente girados, se sobrepõem e atravessam a tela.

## Entradas
- Vídeo falado em `public/`.
- 2 a 5 imagens/cartões (prints, fotos, métricas). Se faltarem, gere cartões em React: calendário "Setembro 2026", métrica "16.981", "Tudo que você precisa" com ícones de apps.

## Passos
1. Defina os momentos de entrada a partir da fala (1 cartão por ideia, a cada ~0,8 s).
2. Crie `src/Effects/CliqueDeFotos.tsx`:
   - Layout: `AbsoluteFill` com o vídeo em `height: 55%` na base (`objectFit: cover`, `scale 1.15`) e painel `height: 45%` no topo, fundo `#e9eaec` com grade `linear-gradient` de 40 px (linhas `rgba(0,0,0,.05)`).
   - Cartão: fundo `#fff`, `borderRadius: 24`, borda 6 px clara (ou verde-menta `#d6efd4` em cartões de destaque), sombra `0 20px 40px rgba(0,0,0,.18)`, rotação aleatória entre -8° e 8° (determinística: `random(seed)` do Remotion).
3. Animação de cada cartão:
   - Entrada "clique": `spring` com `damping: 12, stiffness: 220`, de `scale 0.6` + `translateY 120px` + `opacity 0` para o repouso, em ~8 frames. Adicione 1 frame de flash branco no painel.
   - Cartões antigos recuam (`scale 0.94`, `translateX` deslocado) e vão sendo cobertos pelos novos.
   - Saída: todos atravessam a tela com `translateX` para fora em 10 frames.
4. SFX opcional: estalo de câmera em cada entrada.
5. Teste com `npx remotion still` e renderize.

## Dicas
- Legenda do vídeo fica por cima de tudo, na divisa entre as metades.
- Use no máximo 3 cartões visíveis ao mesmo tempo.
