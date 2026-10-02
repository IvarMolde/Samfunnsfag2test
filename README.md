# Samfunnskunnskap – A2 øvingsprøve

En statisk webapp for voksne som øver til prøve i samfunnskunnskap.

## Innhold
- 240 spørsmål på A2-nivå (80 per tema: Skole og utdanning, Arbeidsliv, Kritisk tenkning og digital dømmekraft).
- Tilbakemelding etter hvert svar i øvingsmodus, ulik for riktig og feil svar.
- Ett korrekt svar per spørsmål.
- Spørsmål trekkes tilfeldig.
- Svaralternativene stokkes ved hver ny prøve.
- 20, 30 eller 50 spørsmål.
- Øvingsmodus med umiddelbar tilbakemelding.
- Prøvemodus uten fasit underveis.
- 80 % kreves for bestått.
- Resultatvisning og utskriftsvennlig resultat.
- Ingen konto, database eller lagring av elevresultater.
- Ingen eksterne JavaScript-biblioteker.

## GitHub Pages
1. Opprett et GitHub-repository.
2. Last opp `index.html`, `style.css`, `app.js` og `questions.xml`.
3. Gå til **Settings → Pages**.
4. Velg publisering fra repositoryets hovedgren og rotmappe.
5. Åpne adressen GitHub gir deg.

## Viktig om XML
Ikke åpne `index.html` direkte som en `file://`-fil dersom nettleseren blokkerer lokal lasting av XML. GitHub Pages fungerer fordi filene leveres via HTTP/HTTPS.

## Faglig kvalitet
Spørsmålene er skrevet på A2-nivå med utgangspunkt i samfunnskunnskap.no. Kilden ligger i `sporsmalsbank/kilde/`, og `questions.xml` genereres derfra med `npm run bygg` i `sporsmalsbank/`. Rediger kilden, ikke `questions.xml`. Dette er en øvingsprøve, ikke en offisiell eller psykometrisk validert norsk prøve.
