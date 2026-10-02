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

## Kommandoer (kjør i `sporsmalsbank/`)

```
npm install
npm run kontroll    # teller, finner dubletter og viser svarlengde-statistikk
npm run bygg        # kontroll + XML + Word + prototype
```

`ut/` og `prototype/index.html` kan alltid bygges på nytt fra `kilde/`. Rediger kilden, ikke de genererte filene.

## Forskjeller mellom eksisterende app og ny bank

| | Eksisterende app (rot) | Ny bank (`sporsmalsbank/`) |
|---|---|---|
| Spørsmål | 150, kategori «Et liv i Norge» m.fl. | 240 (Skole og utdanning, Arbeidsliv, Kritisk tenkning), 80 per tema |
| XML-format | `questionBank/question/option` (engelske navn) | `sporsmalsbank/sporsmal/svar` med tilbakemelding |
| Svarvalg | 20, 30 eller 50 | 30, 36 eller 40 (portalen skal ha 20/30/40) |
| Riktig svar | Alternativ A markert `correct="true"` | Første svar er alltid riktig |

Hvilket XML-format portalen skal bruke, må avgjøres. Forslag til v1.2 står i `docs/PORTAL_BYGGEBESKRIVELSE.md`, kapittel 2.

## Kjente begrensninger

- Banken er **ikke utprøvd** på deltakere, og er derfor ikke psykometrisk validert.
- Familie, helse og hverdagsliv og Norge før og nå er ikke laget ennå.
- Rettigheter til innhold fra samfunnskunnskap.no er ikke avklart.
- Prototypen laster Google Fonts fra nettet. Portalen skal bruke selvhostede fonter.
