# Oversikt over denne grenen

Grenen `samfunnskunnskap-sporsmalsbank-v1` legger til ny spørsmålsbank og dokumentasjon. **Ingen filer i rotmappen er endret.** Den eksisterende appen (`index.html`, `app.js`, `style.css`, `questions.xml`) er urørt.

## Mapper

| Mappe | Innhold |
|---|---|
| `docs/` | `PORTAL_BYGGEBESKRIVELSE.md` (krav til portalen, inkl. kapittel 10 om prøvekvalitet) og `README_samfunnskunnskap.md` (tidligere funksjonsbeskrivelse) |
| `sporsmalsbank/kilde/` | Spørsmålene som data: `a2_*.js` (spørsmål, riktig svar først) og `fb_*.js` (tilbakemelding) |
| `sporsmalsbank/scripts/` | Bygg- og kontrollscript |
| `sporsmalsbank/ut/` | Genererte filer: XML v1.1 (1040 spørsmål, med tilbakemelding), Word og én lesefil (md) per underkategori med emner |
| `prototype/` | Prototype av øvingssiden. `page.src.html` er malen, `index.html` er bygget |

## Kommandoer (kjør i rotmappen)

```
npm install
npm run bygg        # kontroll + XML + questions.xml + Word + prototype
npm run validate    # kontrollerer questions.xml (feil stopper, advarsler vises)
npm test            # enhetstester (trekk, stokking, poeng, 80 %-grense)
npm run e2e         # ende-til-ende-test i nettleser (krever Chromium)
```

`CHROMIUM_PATH` kan settes hvis Chromium ligger et annet sted. GitHub Actions (`.github/workflows/ci.yml`) kjører validering, kontroll av at `questions.xml` stemmer med kilden, enhetstester og e2e ved hver push.

`sporsmalsbank/ut/`, `questions.xml` og `prototype/index.html` kan alltid bygges på nytt fra `sporsmalsbank/kilde/`. Rediger kilden, ikke de genererte filene.

## Appen i rotmappen

De gamle 150 spørsmålene er fjernet fra `questions.xml` (de ligger i git-historikken). Filen genereres nå fra `sporsmalsbank/kilde/` med `npm run bygg`, og inneholder de 1040 spørsmålene med tilbakemelding for riktig og feil svar. `app.js` leser den nye tilbakemeldingen og velger en tilfeldig åpning («Korrekt!», «Nesten, men ikke korrekt.» osv.).

Ikke gjort ennå: statusbar, utskrift med navn, prøvemodus med tidtaker og nytt design. Se `docs/PORTAL_BYGGEBESKRIVELSE.md`.

## Design og tilgjengelighet

- Skrift: Lexend (lisens: SIL OFL, se `fonts/`), hostet i repoet. Ingen eksterne kall.
- Appen er lys modus. Utskrift bruker alltid lyse farger. Mørk modus er ikke implementert ennå.
- axe-core (WCAG 2.1 A og AA, pluss vanlige beste praksiser) kjører i `npm run e2e` på alle skjermer, også når systemet ber om mørk modus. Det er en automatisk kontroll og erstatter ikke test med skjermleser og bare tastatur.
- Riktig og galt vises aldri med farge alene: de har også tekst («✓ Riktig», «✕ Ditt svar»).
- Alle bilder har alternativ tekst (WCAG 1.1.1). Logoen sier organisasjonen. Temabildene har både `alt` og synlig bildetekst (`figcaption`), så innholdet er tilgjengelig uten skjermleser også.
- Interaktive rammer bruker `--border` (#807d75) slik at kontrast mot hvit og beige er minst 3:1 (WCAG 1.4.11). Lenker i bunnteksten er understreket, fordi fargen alene ikke skiller dem fra brødtekst (WCAG 1.4.1).

## Kjente begrensninger

- `npm run validate` gir ingen feil og ingen advarsler. Absolutte ord («alltid», «bare», «kun», «alle») står ikke lenger bare i gale svar. Riktig svar er lengst i 34 % av spørsmålene. Svarlengde sier likevel lite om kvalitet: utprøving på deltakere gjenstår.
- Banken er **ikke utprøvd** på deltakere, og er derfor ikke psykometrisk validert.
- De 400 nye spørsmålene i Familie, helse og hverdagsliv og de 320 i Norge før og nå er ikke gjennomlest av faglærer ennå.
- Rettigheter til innhold fra samfunnskunnskap.no er ikke avklart.
- Prototypen laster Google Fonts fra nettet. Portalen skal bruke selvhostede fonter.

## Struktur: hovedkategori, underkategori og emne (oktober 2026)

Banken er én fil (`questions.xml`) med tre nivåer. Hvert spørsmål har attributtene `main` (hovedkategori), `category` (underkategori) og eventuelt `topic` (emne).

| Hovedkategori | Underkategori | Emner | Status |
|---|---|---|---|
| Utdanning, kompetanse og arbeidsliv | Skole og utdanning, Arbeidsliv, Kritisk tenkning og digital dømmekraft | – | 3 × 80 ferdig |
| Familie, helse og hverdagsliv | Ny i Norge | Et liv i Norge (42), Regler for opphold (17), Introduksjonsprogrammet (12), Hovedside (9) | 80 ferdig |
| Familie, helse og hverdagsliv | Familieliv | Ekteskap og familie (24), Å leve i to kulturer (16), Barneoppdragelse (16), Barnevernet (12), Barn og unges rettigheter (12) | 80 ferdig |
| Familie, helse og hverdagsliv | Fritid | Politisk engasjement (32), Dugnad (24), Sosiale arenaer (24) | 80 ferdig |
| Familie, helse og hverdagsliv | Helse | Helsetjenester (16), Helse og livsstil (14), Psykisk helse (12), Familieplanlegging, svangerskap og oppfølging av barn (12), Tannhelse (10), Å flytte til et nytt land (8), Identitet (8) | 80 ferdig |
| Familie, helse og hverdagsliv | Personlig økonomi | Personlig økonomi (44), Bolig (36) | 80 ferdig |
| Familie, helse og hverdagsliv | Retten til et fritt og selvstendig liv | Vold i nære relasjoner (32), Tvangsekteskap (18), Negativ sosial kontroll (18), Kjønnslemlestelse (12) | 80 ferdig |
| Norge før og nå | Dette er Norge | Fakta om Norge (16), Likestilling og likeverd (16), Merke- og helligdager (14), Minoritet og majoritet i Norge (12), Religion og livssyn (12), Samene (10) | 80 ferdig |
| Norge før og nå | Historie | De første nordmenn (14), Middelalder og unionstid (14), Norge fra 1814 til 1905 (18), Første og andre verdenskrig (16), Det moderne Norge (18) | 80 ferdig |
| Norge før og nå | Menneskerettigheter og demokrati | Demokratiet i Norge (24), Demokratiske rettigheter og plikter (22), Menneskerettigheter (16), Valg og politiske partier (18) | 80 ferdig |
| Norge før og nå | Bærekraft | Bærekraftig utvikling (28), Natur og naturressurser (26), Natur- og miljøvern (26) | 80 ferdig |

**Valg i portalen:** «Alle temaer» eller «Ett undertema» (først hovedtema, så undertema). Filtrering skjer i minnet på `category`. Hovedkategorien står også i XML (`main`).

**Trekning (`js/logic.js`):** `drawBalanced` fordeler plassene likt mellom underkategoriene, og i en underkategori med emner likt mellom emnene. En gruppe som er for liten (for eksempel emnet med 9 spørsmål ved 40 spørsmål fra Ny i Norge) gir det den har, og de andre fyller opp (`allocate`). Ingen spørsmål trekkes to ganger. Resultatet vises per emne når én underkategori med emner er valgt, ellers per underkategori.

**Ny modul:** følg `docs/NYE_SPORSMAL_I_CURSOR.md`. Kort sagt: legg `a2_<navn>.js` og `fb_<navn>.js` i `sporsmalsbank/kilde/`, og legg én linje i registeret i `load.js` (fil, id-prefiks og hovedkategori). Alle byggeskriptene leser registeret. Kjør så `npm run bygg`, `npm run check` og `npm run e2e`. Valideringen krever 80 spørsmål per underkategori, `main` på alle spørsmål og minst 5 spørsmål per emne.

**Lesbare md-filer:** `npm run md` skriver én fil per underkategori med emner til `sporsmalsbank/ut/` (for eksempel `Helse_sporsmal.md`). A er alltid riktig, og filen viser ID, emne, kilde, tilleggskilder og tilbakemeldinger. Filene er laget for gjennomlesing før publisering.

**Kjent begrensning:** emnene er ulike store (for eksempel 42, 17, 12 og 9 i Ny i Norge, og 16 til 8 i Helse). Ved 20 spørsmål gir jevn trekning like mange per emne, så de minste emnene gjentar spørsmål oftere.
