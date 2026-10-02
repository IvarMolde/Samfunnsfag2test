# Oversikt over denne grenen

Grenen `samfunnskunnskap-sporsmalsbank-v1` legger til ny spørsmålsbank og dokumentasjon. **Ingen filer i rotmappen er endret.** Den eksisterende appen (`index.html`, `app.js`, `style.css`, `questions.xml`) er urørt.

## Mapper

| Mappe | Innhold |
|---|---|
| `docs/` | `PORTAL_BYGGEBESKRIVELSE.md` (krav til portalen, inkl. kapittel 10 om prøvekvalitet) og `README_samfunnskunnskap.md` (tidligere funksjonsbeskrivelse) |
| `sporsmalsbank/kilde/` | Spørsmålene som data: `a2_*.js` (spørsmål, riktig svar først) og `fb_*.js` (tilbakemelding) |
| `sporsmalsbank/scripts/` | Bygg- og kontrollscript |
| `sporsmalsbank/ut/` | Genererte filer: XML v1.1 (240 spørsmål, med tilbakemelding) og Word |
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

De gamle 150 spørsmålene er fjernet fra `questions.xml` (de ligger i git-historikken). Filen genereres nå fra `sporsmalsbank/kilde/` med `npm run bygg`, og inneholder de 240 spørsmålene med tilbakemelding for riktig og feil svar. `app.js` leser den nye tilbakemeldingen og velger en tilfeldig åpning («Korrekt!», «Nesten, men ikke korrekt.» osv.).

Ikke gjort ennå: statusbar, utskrift med navn, prøvemodus med tidtaker og nytt design. Se `docs/PORTAL_BYGGEBESKRIVELSE.md`.

## Design og tilgjengelighet

- Skrift: Lexend (lisens: SIL OFL, se `fonts/`), hostet i repoet. Ingen eksterne kall.
- Lys og mørk modus følger systemet. Utskrift bruker alltid lyse farger.
- axe-core (WCAG 2.1 A og AA) kjører i `npm run e2e` på alle skjermer, i lys og mørk modus. Det er en automatisk kontroll og erstatter ikke test med skjermleser og bare tastatur.
- Riktig og galt vises aldri med farge alene: de har også tekst («✓ Riktig», «✕ Ditt svar»).

## Kjente begrensninger

- `npm run validate` gir ingen feil og ingen advarsler. Absolutte ord («alltid», «bare», «kun», «alle») står ikke lenger bare i gale svar. Riktig svar er lengst i 33 % av spørsmålene. Svarlengde sier likevel lite om kvalitet: utprøving på deltakere gjenstår.
- Banken er **ikke utprøvd** på deltakere, og er derfor ikke psykometrisk validert.
- Familie, helse og hverdagsliv og Norge før og nå er ikke laget ennå.
- Rettigheter til innhold fra samfunnskunnskap.no er ikke avklart.
- Prototypen laster Google Fonts fra nettet. Portalen skal bruke selvhostede fonter.

## Struktur: hovedkategori, underkategori og emne (oktober 2026)

Banken er én fil (`questions.xml`) med tre nivåer. Hvert spørsmål har attributtene `main` (hovedkategori), `category` (underkategori) og eventuelt `topic` (emne).

| Hovedkategori | Underkategori | Emner | Status |
|---|---|---|---|
| Utdanning, kompetanse og arbeidsliv | Skole og utdanning, Arbeidsliv, Kritisk tenkning og digital dømmekraft | – | 3 × 80 ferdig |
| Familie, helse og hverdagsliv | Ny i Norge | Et liv i Norge (42), Regler for opphold (17), Introduksjonsprogrammet (12), Hovedside (9) | 80 ferdig |
| Familie, helse og hverdagsliv | Familieliv, Fritid, Helse, Personlig økonomi, Retten til et fritt og selvstendig liv | ikke hentet ennå | planlagt, 80 hver |

**Valg i portalen:** «Alle kategorier», «Alle i denne gruppen» (en hovedkategori) eller én underkategori. Filtrering skjer i minnet på `main` og `category`, ikke på visningsnavn.

**Trekning (`js/logic.js`):** `drawBalanced` fordeler plassene likt mellom underkategoriene, og i en underkategori med emner likt mellom emnene. En gruppe som er for liten (for eksempel emnet med 9 spørsmål ved 40 spørsmål fra Ny i Norge) gir det den har, og de andre fyller opp (`allocate`). Ingen spørsmål trekkes to ganger. Resultatet vises per emne når én underkategori med emner er valgt, ellers per underkategori.

**Ny modul:** legg `a2_<navn>.js` og `fb_<navn>.js` i `sporsmalsbank/kilde/`, ta dem med i `load.js` (med hovedkategori), legg `fb`-filen og id-prefikset inn i `bygg-appxml.js`, og kjør `npm run bygg`, `npm run check` og `npm run e2e`. Valideringen krever 80 spørsmål per underkategori, `main` på alle spørsmål og minst 5 spørsmål per emne.

**Lesbar md-fil:** `npm run md` skriver `sporsmalsbank/ut/Ny_i_Norge_sporsmal.md` (A er alltid riktig, med emner og kilder).

**Kjent begrensning:** emnene i Ny i Norge er ulike store (42, 17, 12, 9). Ved 20 spørsmål gir jevn trekning 5 per emne, så det minste emnet gjentar spørsmål oftere. Utjevnes ved flere spørsmål i neste runde.
