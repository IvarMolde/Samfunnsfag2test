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

## Kjente begrensninger

- Banken er **ikke utprøvd** på deltakere, og er derfor ikke psykometrisk validert.
- Familie, helse og hverdagsliv og Norge før og nå er ikke laget ennå.
- Rettigheter til innhold fra samfunnskunnskap.no er ikke avklart.
- Prototypen laster Google Fonts fra nettet. Portalen skal bruke selvhostede fonter.
