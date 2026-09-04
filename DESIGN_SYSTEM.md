# Design System — Faculdade Inspirar

Documento de referência para construir novas páginas mantendo consistência visual com o site atual. Todos os valores abaixo foram extraídos diretamente do CSS em produção (`public/css/style.css`).

Stack do projeto: HTML + CSS puro + JavaScript vanilla (sem framework, sem bundler). Servidor Express estático (`server.js`). Não há React, Vue ou similar — os componentes interativos são implementados como IIFEs em `public/js/main.js`.

---

## 1. Princípios

- **Dark-first**: o tema escuro é o padrão. Existe um tema claro alternável via `[data-theme="light"]` no `<html>`, com paleta paralela para cada token.
- **Glassmorphism sóbrio**: cards e navbar usam fundo semitransparente + `backdrop-filter: blur()`, nunca opaco.
- **Verde como único acento**: um único hue de acento (verde-lima) carrega toda a marca. Não introduzir outras cores de destaque (azul, roxo, laranja) sem alinhar antes.
- **Tipografia mista**: sans-serif (Inter) para o corpo e para a maior parte dos títulos; serif itálico (Cormorant Garamond) só para palavras de destaque dentro de títulos (`<em>`).
- **Sem travessão, sem clichê de IA no texto**: ver seção 9 (Voz e tom).
- **Motion sutil**: transições de 0.2–0.6s, easing suave, sem exageros. Respeitar `prefers-reduced-motion`.

---

## 2. Cores

### Tema escuro (padrão)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#080808` | Fundo geral da página |
| `--bg-card` | `rgba(8,10,8,0.55)` | Fundo de cards translúcidos |
| `--bg-card-alt` | `rgba(8,14,8,0.60)` | Variante de fundo de card |
| `--bg-footer` | `#080808` | Fundo do rodapé (card interno) |
| `--green` | `#9be15d` | Cor de marca / acento principal |
| `--green-dark` | `#06140a` | Texto sobre fundo verde (botões primários) |
| `--green-glow` | `rgba(155,225,93,0.6)` | Sombras/glow do acento |
| `--green-subtle` | `rgba(155,225,93,0.08)` | Fundo sutil com tom de marca |
| `--green-border` | `rgba(155,225,93,0.25)` | Bordas com tom de marca |
| `--green-text` | `#b7e89a` | Texto em tom de marca (eyebrows, links) |
| `--text-primary` | `#f7f9f6` | Texto principal |
| `--text-secondary` | `#9aa39a` | Texto secundário / parágrafos |
| `--text-muted` | `#8b928b` | Texto apagado |
| `--text-dim` | `#7d847d` | Texto mais apagado ainda (labels, legendas) |
| `--text-nav` | `#b8beb8` | Links de navegação |
| `--text-card` | `#c9cfc9` | Texto dentro de cards |
| `--text-heading` | `#f2f5f0` | Títulos |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Borda padrão de card |
| `--border-mid` | `rgba(255,255,255,0.10)` | Borda média (inputs, botões outline) |
| `--border-strong` | `rgba(255,255,255,0.14)` | Borda forte (botão ghost) |

### Tema claro (`[data-theme="light"]`)

| Token | Valor |
|---|---|
| `--bg` | `#f5f7f4` |
| `--bg-card` | `rgba(255,255,255,0.88)` |
| `--bg-card-alt` | `rgba(240,248,232,0.95)` |
| `--bg-footer` | `#e4eae4` |
| `--green-text` | `#4a8010` |
| `--text-primary` | `#0b160b` |
| `--text-secondary` | `#4a5c4a` |
| `--text-muted` | `#6a7a6a` |
| `--text-dim` | `#7a8a7a` |
| `--text-nav` | `#2a3a2a` |
| `--text-card` | `#2a3a2a` |
| `--text-heading` | `#091209` |
| `--border-subtle` | `rgba(0,0,0,0.07)` |
| `--border-mid` | `rgba(0,0,0,0.10)` |
| `--border-strong` | `rgba(0,0,0,0.15)` |

`--green` (`#9be15d`) e `--green-dark` (`#06140a`) **não mudam** entre temas — o verde de marca é fixo.

**Regra de implementação**: toda página nova deve declarar as duas paletas via CSS custom properties (nunca hardcodar hex direto nos componentes) para que o toggle de tema funcione automaticamente.

---

## 3. Tipografia

### Fontes

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- `--font-sans: 'Inter', sans-serif` — corpo do texto, UI, maioria dos títulos.
- `--font-serif: 'Cormorant Garamond', Georgia, serif` — **apenas** itálico, **apenas** para palavras de destaque dentro de um título (via `<em>`). Nunca usar em parágrafos ou botões.

### Escala

| Elemento | font-size | weight | line-height | letter-spacing |
|---|---|---|---|---|
| H1 hero | `clamp(42px, 5.5vw, 70px)` | 700 | 1.02 | -0.03em |
| H2 seção | `clamp(30px, 3.6vw, 44px)` | 600 | normal | -0.02em |
| H3 card | 15–18px | 600–700 | normal | normal |
| Subtítulo hero | 18px | 400 | 1.62 | normal |
| Subtítulo seção | 16.5px | 400 | normal | normal |
| Corpo / parágrafo card | 13–14.5px | 400 | 1.5–1.55 | normal |
| Eyebrow (rótulo pequeno) | 11–12px | 600–700 | normal | **0.09–0.14em**, uppercase |

**Padrão de destaque em título**: a palavra de ênfase de um H1/H2 vai dentro de `<em>`, ganha `font-family: var(--font-serif); font-style: italic; font-weight: 600; font-size: 1.1em; color: var(--green);`. Exemplo:

```html
<h2 class="section__title">Qual área é <em>a sua?</em></h2>
```

**Padrão de eyebrow** (rótulo acima de título de seção):

```html
<div class="eyebrow">
  <span class="eyebrow__dot"></span>
  <span class="eyebrow__label">AGENDA DA REDE</span>
</div>
```
```css
.eyebrow__label {
  font-size: 11px; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: var(--green-text);
}
.eyebrow__dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--green);
  box-shadow: 0 0 10px 2px rgba(155,225,93,0.65);
  animation: dotPulse 2.4s ease-in-out infinite;
}
```

---

## 4. Espaçamento, raios e sombras

```css
--radius-sm:   12px;
--radius-md:   18px;
--radius-lg:   20px;
--radius-xl:   24px;
--radius-pill: 999px;

--section-pad: 90px 32px 40px;  /* padding padrão de uma <section class="section"> */
--max-w: 1180px;                /* largura máxima de conteúdo centralizado */
```

- Botões e badges: sempre `border-radius: var(--radius-pill)`.
- Cards: `var(--radius-md)` (18px) a `var(--radius-xl)` (24px) dependendo do tamanho do card — cards pequenos usam 16–18px, cards grandes/hero usam 20–24px.
- Blur padrão de card: `--blur-card: blur(20px) saturate(160%)`.
- Blur da navbar: `--blur-nav: blur(28px) saturate(180%)`.
- Sombra de elevação padrão de card: `0 20px 50px -24px rgba(0,0,0,0.55)`.
- Sombra/glow de elemento em destaque (verde): `0 0 0 1px rgba(155,225,93,0.10), 0 24px 60px -24px rgba(155,225,93,0.28)`.

---

## 5. Grid e breakpoints

- Largura de conteúdo: `max-width: var(--max-w)` (1180px), centralizado com `margin: 0 auto`, padding lateral 32px.
- Breakpoints usados no site (mobile-first via `max-width`):
  - `900px` — navbar colapsa para hambúrguer; grids de 3+ colunas viram 2.
  - `640px` / `560px` — cards que eram lado a lado empilham verticalmente.
  - `480px` — ajustes finais de padding/font-size para telas pequenas.
- Regra: sempre testar 3 larguras — 1400px (desktop), 900px (tablet) e 390px (mobile).

---

## 6. Componentes

### 6.1 Botões

Quatro variantes, todas `border-radius: var(--radius-pill)`, `display: inline-flex; align-items:center; gap:9px`:

**Primário** (`.btn-primary`) — CTA principal, fundo verde sólido:
```css
padding: 15px 26px; color: var(--green-dark); font-weight: 700; font-size: 15.5px;
background: var(--green); box-shadow: 0 12px 36px -10px rgba(155,225,93,0.7);
```
Hover: `box-shadow: 0 16px 50px -6px rgba(155,225,93,1); transform: translateY(-2px);`

**Ghost** (`.btn-ghost`) — CTA secundário, contorno + fundo translúcido:
```css
padding: 15px 26px; color: #e8ece8; font-weight: 600; font-size: 15.5px;
border: 1px solid var(--border-strong); background: rgba(255,255,255,0.04); backdrop-filter: blur(8px);
```
Hover: borda e fundo ficam mais opacos.

**Outline** (`.btn-outline`) — ação terciária ("ver mais"):
```css
padding: 13px 26px; color: #e8ece8; font-weight: 600; font-size: 15px;
border: 1px solid var(--border-strong); background: rgba(255,255,255,0.02);
```
Hover: borda/fundo ganham tom verde (`rgba(155,225,93,0.4)` / `rgba(155,225,93,0.05)`).

**Link** (`.btn-link`) — link com seta, sem fundo/borda, usado em cabeçalhos de seção ("Ver todos →").

Todos os botões com seta usam um SVG inline 11×11 ou 14×14 (seta diagonal), nunca emoji ou ícone de biblioteca externa.

### 6.2 Navbar

Pill flutuante fixa no topo (`position: fixed`), não a viewport inteira:
```css
.navbar__inner {
  max-width: 1160px; margin: 0 auto; padding: 10px 10px 10px 18px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255,255,255,0.11);
  background: rgba(8,8,8,0.52);
  backdrop-filter: blur(28px) saturate(180%);
  box-shadow: 0 8px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
}
```
Ao rolar (`scrollY > 40`), o fundo fica mais opaco via JS (ver `initNavbar` em `main.js`). Abaixo de 900px, os links viram um menu hambúrguer em painel deslizante.

### 6.3 Cards de conteúdo (`.area-card`, `.content-card`)

Imagem de fundo + overlay gradiente + texto sobreposto no rodapé do card:
```css
border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle);
```
Hover: `border-color: rgba(155,225,93,0.4); transform: translateY(-4px);` e a imagem interna ganha `transform: scale(1.05)`.

### 6.4 Cards de feature/vidro (`.feature-card`)

```css
padding: 30px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);
background: linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
backdrop-filter: blur(16px) saturate(160%);
```
Ícone: quadrado 42×42px, `border-radius:12px`, borda e fundo em tom de marca (`--green-subtle` / `rgba(155,225,93,0.3)`).

### 6.5 Tags / pills

```css
font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: var(--radius-pill);
border: 1px solid var(--border-mid); background: rgba(255,255,255,0.03); color: var(--text-secondary);
```
Hover ganha tom verde. Usado para categorias, filtros e badges de status.

### 6.6 Números em destaque (estatísticas)

```css
font-family: var(--font-sans); font-weight: 700; font-size: 46px;
color: var(--green); text-shadow: 0 0 30px rgba(155,225,93,0.4);
```
Animam contando de 0 até o valor final quando entram na viewport (ver `initCounters` em `main.js`).

### 6.7 Formulários

```css
.input, .select {
  width: 100%; padding: 12px 16px; border-radius: var(--radius-md);
  border: 1px solid var(--border-mid); background: rgba(255,255,255,0.04);
  color: var(--text-primary); font-size: 14px; font-family: var(--font-sans);
  outline: none; transition: border-color .2s;
}
.input:focus, .select:focus { border-color: var(--green-border); }
```
Label: 13px, peso 600, `margin-bottom: 6px`.

### 6.8 Cards "empilhados" com imagem accordion (padrão avançado)

Usado na seção "Como é estudar na Inspirar". Cada item é um card `position: sticky` com offset crescente (`top: calc(96px + i*26px)`, `z-index: calc(i + 1)`), criando efeito de baralho ao rolar. Dentro do card, a imagem começa estreita (`flex-basis: clamp(140px,15vw,240px)`, dessaturada) e expande para 40% no `:hover` (`@media (hover:hover) and (pointer:fine)` — nunca aplicar hover-expand em touch). Ver `.jstack`/`.jstep` no CSS e `initJourneyStack` no JS para a implementação de referência.

### 6.9 Logo loop / marquee

Faixa horizontal de logos rolando infinitamente, pausa suave no hover, fade nas bordas. Implementação vanilla (sem libs) em `initLogoLoop` (`main.js`) + `.logoloop` (CSS). Reaproveitar esse padrão para qualquer carrossel de logos/parceiros.

---

## 7. Efeitos ambientes (glows)

O fundo da página tem "blobs" radiais verdes/esverdeados, posicionados em `position:absolute` com blur, para dar profundidade sem poluir:
```css
.ambient__blob {
  position: absolute; border-radius: 50%; filter: blur(20–45px);
  background: radial-gradient(ellipse/circle at center, rgba(155,225,93, 0.16–0.48), transparent 62–70%);
}
```
Alguns têm animação de flutuação lenta (`floatA`/`floatB`, 16–22s, ease-in-out infinite). Usar com moderação — no máximo 1 blob visível por "dobra" de tela.

---

## 8. Ícones

- Sempre **SVG inline no HTML**, nunca ícone de fonte ou emoji.
- `stroke="currentColor"`, `fill="none"`, `stroke-width` entre 1.4 e 2, `stroke-linecap="round"` `stroke-linejoin="round"`.
- Tamanhos comuns: 11–14px (dentro de botões), 15–18px (navbar/cards), 22–30px (destaque).

---

## 9. Voz e tom (copywriting)

Regras obrigatórias para qualquer texto novo do site (ver `~/.claude/skills/humanizer` para a versão completa):

- **Nunca usar travessão (—)** para pausa dramática. Trocar por ponto, vírgula ou dois-pontos.
- **Nunca usar a fórmula "não é apenas X, é Y"**. Dizer a coisa direto.
- **Evitar tríades de efeito** ("rápido, simples e eficiente"). Uma ideia bem colocada > três adjetivos.
- **Evitar clichês de redação**: "além disso", "vale ressaltar", "é importante destacar", "em suma".
- **Sem pergunta retórica de abertura** ("Você sabia que...?").
- **Superlativo sempre com fato concreto atrás** ("nota máxima MEC", não "ensino de excelência").
- Segunda pessoa direta ("você"), tom próximo, frases de tamanho variado.

---

## 10. Estrutura de página e convenções de código

- HTML5 semântico, `lang="pt-BR"`, uma `<section>` por bloco de conteúdo, sempre com comentário `<!-- ========== NOME DA SEÇÃO ========== -->` acima.
- Todo bloco de seção usa `.section` (padding/max-width padrão) + `.section__header` (`data-reveal`) + `.section__title` + `.section__sub`, a menos que tenha layout de largura total (hero, jornada, footer).
- `data-reveal` em qualquer bloco que deve animar fade+slide-up ao entrar na viewport (`IntersectionObserver`, ver `main.js`). Estado inicial `opacity:0; transform:translateY(28px)`, classe `.revealed` aplicada via JS.
- Imagens: `/fotos/...` serve da pasta `FOTOS/` (fotos reais/geradas), `/images/...` serve de `public/images/` (logo, ícones fixos).
- JS: um IIFE por funcionalidade em `main.js` (`(function initX() { ... })();`), sempre com early-return se o elemento-alvo não existir na página (`if (!el) return;`) — isso permite que o mesmo `main.js` sirva todas as páginas sem erros de "elemento não encontrado".
- Sempre checar `prefers-reduced-motion` antes de rodar `requestAnimationFrame` contínuo.
- Sempre implementar hover-only effects dentro de `@media (hover: hover) and (pointer: fine)` para não deixar estados "grudados" em touch.

---

## 11. Checklist para página nova

1. Reutilizar `<head>` padrão (fonts, `css/style.css`, viewport meta) e a navbar/footer existentes — não recriar.
2. Todo texto passa pelas regras da seção 9 antes de entrar no HTML.
3. Nenhuma cor hardcoded — usar sempre os tokens `var(--...)` da seção 2.
4. Testar em dark e light theme (`data-theme="light"` no `<html>`).
5. Testar em 1400px, 900px e 390px de largura.
6. Nenhum elemento novo deve gerar scroll horizontal (`document.documentElement.scrollWidth <= clientWidth`).
7. Verificar console sem erros JS.
