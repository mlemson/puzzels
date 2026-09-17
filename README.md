# Puzzelhub

Een lokale, modulaire browsergame. Open `index.html` rechtstreeks in een moderne browser; er is geen account, server of installatie nodig.

## Speelbare spellen
- **Tectonic** — 60 campagnelevels, door de generator gecontroleerd op precies één oplossing.
- **Zweedse puzzel** — 24 campagnelevels met 236 verschillende campagne-antwoorden en een moderne Nederlandse woordenmix.
- **Nonogram** — 12 beeldlogica-levels.
- **Binairo** — 12 levels met 0/1-logica.
- **Hashi** — 12 netwerkpuzzels met bruggen tussen eilanden.
- **Slitherlink** — 12 luspuzzels waarbij je op de randen tekent.
- **Kakuro** — 12 cijferkruiswoordpuzzels met sommen.
- **Logische mijnen** — 12 vaste Minesweeper-levels die vanaf de gegeven start met basisdeductie oplosbaar zijn.
- **Sudoku** — 12 levels.
- **Nurikabe** — 12 gebiedspuzzels met eilanden en één zee.

Dat zijn **180 campagnelevels** verdeeld over tien speltypes.

## Dagelijks
De startpagina bevat een dagelijkse set van drie puzzels:
1. een Tectonic;
2. een Zweedse puzzel;
3. een wisselende logica-puzzel uit Nonogram, Hashi, Slitherlink, Binairo, Kakuro, Logische mijnen, Sudoku of Nurikabe.

De kalenderdatum bepaalt deterministisch welke levels worden gekozen. De dagset verandert dus niet bij verversen. Dagelijkse voltooiingen worden los van de gewone campagne opgeslagen, zodat een dagpuzzel geen campagnelevels overslaat. Als alle drie klaar zijn telt de dag mee voor de streak.

## Algemeen
- Licht/donker-modus, lokaal onthouden.
- Voortgang en beste tijden via `localStorage`.
- Levels ontgrendelen na elkaar.
- Hints op alle spellen.
- Responsive ontwerp voor desktop, tablet en mobiel.
- De nieuwe logicaspellen accepteren iedere oplossing die aan de echte spelregels voldoet; ze vereisen niet per se dat je exact dezelfde interne oplossing kiest.

## Structuur
- `index.html` — hoofdpagina en scriptvolgorde.
- `assets/styles.css` — gedeelde vormgeving en alle spel-specifieke rasters.
- `js/store.js` — campagnevoortgang, dagvoortgang en streaks.
- `js/app.js` — Puzzelhub, navigatie, dark mode en startscherm.
- `js/puzzlekit.js` — gedeelde launcher, timer, modals en levelafronding.
- `js/daily.js` — dagelijkse selectie en dagdashboard.
- `games/tectonic/` — Tectonic-engine en levels.
- `games/swedish/` — Zweedse puzzel-engine en levels.
- `games/logic-pack.js` — acht aanvullende logicaspellen.

## Ontwikkelhulpmiddelen
- `generate_levels.py` genereert de Tectonic-campagne.
- `generate_swedish_levels.py` genereert vaste Zweedse rasters uit de gecureerde woordenbank.

De site is bewust modulair gehouden: een volgend spel kan als losse module worden geregistreerd via `PuzzleHub.registerGame(...)` zonder het startscherm opnieuw te bouwen.
