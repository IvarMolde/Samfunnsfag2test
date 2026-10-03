# Oversikt – fortsett her

Dette er utgangspunktet neste gang arbeidet med portalen fortsetter. Slik programmet *virker* for eleven, står i `README.md`. Slik nye spørsmål lages, står i `docs/NYE_SPORSMAL_I_CURSOR.md`.

Repo: `IvarMolde/Samfunnsfag2test`. Statisk side, ingen server, ingen innlogging. Hovedgren: `main`.

## Det som er på plass (oktober 2026)

- Appen i rotmappen: `index.html`, `app.js`, `style.css`, `questions.xml`, `assets/`, `fonts/`, `js/logic.js`.
- 1040 spørsmål, 13 undertemaer à 80, med tilbakemelding for riktig og feil.
- Øvingsmodus (20/30/40) og prøvemodus (alltid 38). Valgfri tidtaker i prøvemodus.
- Temakort side om side (4:3), «Vis temaene» / «Skjul temaene», hover-tekst lik `alt`.
- Én bunntekst med kontakt og lenke til samfunnskunnskap.no.
- Diplom bare etter prøvemodus. Navn skrives inn ved utskrift, ikke på start.
- Bestått er 80 %. Ingenting om eleven lagres.
- UU mot WCAG 2.1 AA: hopp-lenke, overskrifter uten hopp, kontrast på rammer og lenker, radioknapper med piltaster, `alt` på bilder, axe i e2e.

## Filer du vanligvis endrer

| Hva | Hvor |
|---|---|
| Utseende og flyt | `index.html`, `app.js`, `style.css` |
| Trekk, poeng, 80 % | `js/logic.js` |
| Nye spørsmål | `sporsmalsbank/kilde/` + én linje i `load.js`, deretter `npm run bygg` |
| Tester | `tests/unit/`, `tests/e2e/e2e.mjs` |
| Slik programmet virker | `README.md` (oppdater i samme endring) |

Etter endring i `style.css` eller `app.js`: øk `?v=` i `index.html` (nå `style.css?v=22` og `app.js?v=16`), ellers viser nettleseren gammel fil.

Ikke rediger `questions.xml`, `sporsmalsbank/ut/` eller `prototype/index.html` for hånd. De bygges.

## Kommandoer (rotmappen)

```
npm install
npm run bygg        # kontroll + XML + questions.xml + Word + prototype + md
npm run validate    # questions.xml (feil stopper, advarsler vises)
npm test            # enhetstester
npm run e2e         # hele flyten i Chrome, inkludert axe WCAG 2.1 A/AA
npm run check       # validate + enhetstester
```

`CHROMIUM_PATH` kan settes hvis Chrome/Chromium ligger et annet sted (lokalt i dette miljøet: `/usr/local/bin/google-chrome`). GitHub Actions (`.github/workflows/ci.yml`) kjører validate, sjekk av at `questions.xml` stemmer med kilden, enhetstester og e2e ved hver push.

## Design og tilgjengelighet

- Skrift: Lexend (SIL OFL, se `fonts/`), hostet i repoet. Ingen eksterne kall.
- Farger: marine `#143d56`, tekst `#2f4354`, beige `#f3f2ef`, interaktiv ramme `--border` `#807d75` (minst 3:1).
- Appen er lys modus. Utskrift er alltid lys. Mørk modus er ikke implementert.
- axe-core (WCAG 2.1 A og AA, pluss vanlige beste praksiser) kjører i `npm run e2e` på alle skjermer, også når systemet ber om mørk modus. Det erstatter ikke test med skjermleser og bare tastatur.
- Riktig og galt vises aldri med farge alene: de har også tekst («✓ Riktig», «✕ Ditt svar»).
- Hver visning har én synlig H1. Deretter H2 (temakort, bunntekst, resultat per tema). I «Les her» er tittelen H1 og Øving/Prøve/Resultat H2.
- Alle bilder har alternativ tekst. Logoen sier «MOVED, Molde voksenopplæring». Temabildene viser samme tekst over bildet ved hover.

## Åpent neste gang

- **Flett inn** UU-grenen (`cursor/wcag-uu-d5b5`, PR #18) når den er godkjent.
- **Mørk modus** (ønsket i byggebeskrivelsen, ikke et WCAG-krav).
- **Manuell UU:** NVDA og VoiceOver, og bare tastatur gjennom hele flyten.
- **Faglig gjennomlesing** av de 800 spørsmålene i Familie, helse og hverdagsliv og Norge før og nå.
- **Rettigheter** til innhold fra samfunnskunnskap.no er ikke avklart.
- **Ikke påbegynt fra spesifikasjonen:** frakoblet bruk (PWA), `tekster.json`, støttespråk, Lighthouse i CI, lærervisning.

`docs/PORTAL_BYGGEBESKRIVELSE.md` er den opprinnelige spesifikasjonen. Den er ikke skrevet om. Det som står over, er det som faktisk er bygd.

## Mapper

| Mappe | Innhold |
|---|---|
| rot | Appen som kjører på GitHub Pages |
| `docs/` | Denne filen, byggebeskrivelse, spørsmålsveiledning, testspesifikasjon |
| `sporsmalsbank/kilde/` | `a2_*.js` (riktig svar først) og `fb_*.js` (tilbakemelding) |
| `sporsmalsbank/scripts/` | Bygg- og kontrollscript |
| `sporsmalsbank/ut/` | Genererte Word-, XML- og md-filer |
| `prototype/` | Eldre prototype. `page.src.html` er malen. Ikke portalen i rotmappen. |
| `tests/` | Enhetstester og e2e (Playwright + axe) |

## Struktur: hovedkategori, underkategori og emne

Banken er én fil (`questions.xml`) med tre nivåer. Hvert spørsmål har `main` (hovedkategori), `category` (underkategori) og eventuelt `topic` (emne).

| Hovedkategori | Underkategori | Emner | Status |
|---|---|---|---|
| Utdanning, kompetanse og arbeidsliv | Skole og utdanning, Arbeidsliv, Kritisk tenkning og digital dømmekraft | – | 3 × 80 ferdig |
| Familie, helse og hverdagsliv | Ny i Norge | Et liv i Norge (42), Regler for opphold (17), Introduksjonsprogrammet (12), Hovedside (9) | 80 ferdig |
| Familie, helse og hverdagsliv | Familieliv | Ekteskap og familie (24), Å leve i to kulturer (16), Barneoppdragelse (16), Barnevernet (12), Barn og unges rettigheter (12) | 80, ikke faglærer-lest |
| Familie, helse og hverdagsliv | Fritid | Politisk engasjement (32), Dugnad (24), Sosiale arenaer (24) | 80, ikke faglærer-lest |
| Familie, helse og hverdagsliv | Helse | Helsetjenester (16), Helse og livsstil (14), Psykisk helse (12), Familieplanlegging, svangerskap og oppfølging av barn (12), Tannhelse (10), Å flytte til et nytt land (8), Identitet (8) | 80, ikke faglærer-lest |
| Familie, helse og hverdagsliv | Personlig økonomi | Personlig økonomi (44), Bolig (36) | 80, ikke faglærer-lest |
| Familie, helse og hverdagsliv | Retten til et fritt og selvstendig liv | Vold i nære relasjoner (32), Tvangsekteskap (18), Negativ sosial kontroll (18), Kjønnslemlestelse (12) | 80, ikke faglærer-lest |
| Norge før og nå | Dette er Norge | Fakta om Norge (16), Likestilling og likeverd (16), Merke- og helligdager (14), Minoritet og majoritet i Norge (12), Religion og livssyn (12), Samene (10) | 80, ikke faglærer-lest |
| Norge før og nå | Historie | De første nordmenn (14), Middelalder og unionstid (14), Norge fra 1814 til 1905 (18), Første og andre verdenskrig (16), Det moderne Norge (18) | 80, ikke faglærer-lest |
| Norge før og nå | Menneskerettigheter og demokrati | Demokratiet i Norge (24), Demokratiske rettigheter og plikter (22), Menneskerettigheter (16), Valg og politiske partier (18) | 80, ikke faglærer-lest |
| Norge før og nå | Bærekraft | Bærekraftig utvikling (28), Natur og naturressurser (26), Natur- og miljøvern (26) | 80, ikke faglærer-lest |

**Valg i portalen:** «Alle temaer» eller «Velg undertemaer» (først hovedtema, så ett eller flere undertemaer). Filtrering skjer i minnet på `category`.

**Trekning (`js/logic.js`):** `drawBalanced` fordeler plassene likt mellom underkategoriene, og i en underkategori med emner likt mellom emnene. En gruppe som er for liten, gir det den har, og de andre fyller opp (`allocate`). Ingen spørsmål trekkes to ganger. Resultatet vises per emne når ett undertema med emner er valgt i øving, ellers per undertema.

**Ny modul:** følg `docs/NYE_SPORSMAL_I_CURSOR.md`. Valideringen krever 80 spørsmål per underkategori, `main` på alle spørsmål og minst 5 spørsmål per emne.

**Kjent begrensning i trekning:** emnene er ulike store. Ved 20 spørsmål fra ett undertema gir jevn trekning like mange per emne, så de minste emnene kan gjenta spørsmål oftere over mange økter (ikke i samme runde).

## Kjente begrensninger

- `npm run validate` gir ingen feil og ingen advarsler. Riktig svar er lengst i 34 % av spørsmålene. Svarlengde sier likevel lite om kvalitet: utprøving på deltakere gjenstår.
- Banken er **ikke utprøvd** på deltakere, og er derfor ikke psykometrisk validert.
- Rettigheter til innhold fra samfunnskunnskap.no er ikke avklart.
- Prototypen i `prototype/` laster Google Fonts. Portalen i rotmappen bruker selvhostede fonter.
