---
name: chuva-de-particulas
description: Bolinhas vermelhas caindo como chuva e se acumulando num recipiente, formando um gráfico/contador, no painel acima do rosto. Use quando o usuário pedir /chuva-de-particulas, ou quiser visualizar volume ("muito", "milhares") com partículas.
---

# /chuva-de-particulas

Efeito: painel superior cinza-claro com grade. Centenas de partículas vermelhas caem de cima, quicam e se empilham num recipiente retangular com marcações (01, 02, 03) nas laterais. Uma legenda curta fica abaixo ("com apenas", "um prompt"). Embaixo, a pessoa falando em zoom.

## Entradas
- Vídeo falado, quantidade-alvo de partículas (padrão 400) e a legenda curta.

## Passos
1. Crie `src/Effects/ChuvaDeParticulas.tsx`, layout igual ao `/clique-de-fotos` (painel 45% em cima, vídeo 55% embaixo).
2. Simulação DETERMINÍSTICA (obrigatório no Remotion, nada de `Math.random`): pré-calcule posições com `random('p'+i)` e a física por frame:
   - Cada partícula `i` nasce no frame `i * 0.15` (ou em lotes), `x` aleatório dentro da largura do recipiente, `y` começa fora do topo.
   - Queda: `y = y0 + 0.5 * g * t²` até o piso da pilha; altura da pilha = `floor(contagem / partículas por linha) * diâmetro`.
   - Ao pousar, pequeno quique (`spring` com damping 8) e fica na camada calculada.
   - Algumas partículas "escapam" para fora do recipiente (5%), para dar vida.
3. Desenho: um único `<svg>` com `<circle r=7 fill="#d63a2f">` (varie o tom ±8% em luminosidade). Recipiente: contorno `#2b2b2b` 3 px, sem tampa. Rótulos `01`/`02`/`03` em 11 px monoespaçado.
4. Legenda curta animada com `spring` abaixo do recipiente, cor `#c0392b`, bold.
5. Performance: no máximo ~600 círculos; calcule posições com `useMemo`.

## Dicas
- Sincronize a chuva com a palavra que sugere volume (ex.: "milhares").
- Para um número no recipiente, mostre o contador (`/grafico-de-vidro` tem o mesmo padrão).
