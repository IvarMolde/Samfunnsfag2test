# Samfunnskunnskap – A2 øvingsprøve

En statisk webapp for voksne som øver til prøve i samfunnskunnskap. Den drives av Molde voksenopplæring.

Dette er en øvingsprøve, ikke den offisielle prøven.

Knappen «Les her» på startsiden åpner en kort forklaring. Den sier hvordan øving og prøve virker, og at resultatet bare gjelder denne prøven. Det er ikke et offisielt resultat.

Skal du lage nye spørsmål, se `docs/NYE_SPORSMAL_I_CURSOR.md`.

## Denne filen

Denne filen forklarer hvordan programmet virker. Den oppdateres i samme endring som en ny bestemmelse, for eksempel modus, trekk, tema, beståttgrense eller navigasjon. Det som ikke lenger gjelder, tas ut, slik at teksten beskriver det som faktisk gjelder.

## Øvingsmodus

- Du kan øve på ett undertema, eller på alle undertema som har spørsmål.
- I blandingen får hvert undertema like mange spørsmål. Resten fordeles tilfeldig, slik at ingen undertema får mer enn ett spørsmål mer enn et annet.
- Du får tilbakemelding etter hvert svar. Tilbakemeldingen er ulik for riktig og feil svar.
- Bare det første svaret teller.

## Prøvemodus

Prøvemodus har alltid 38 spørsmål. Du kan ikke velge antall, og du kan ikke velge tema. Prøven trekker alltid spørsmål tilfeldig fra alle undertema som har spørsmål, med like mange fra hvert undertema. Når prøvemodus velges, vises denne forklaringen på startsiden.

- Ingen tilbakemelding, farger eller poeng før innlevering.
- Du kan gå tilbake, endre svar og merke spørsmål.
- Før innlevering ser du en oversikt over besvart, ubesvart og merket.
- Tidtakeren er valgfri. Når tiden er ute, leveres prøven automatisk.
- Tiden i tidtakeren er ikke den offisielle tiden på prøven.

## Antall og svar

- I øving kan du ta 20, 30 eller 40 spørsmål.
- I prøvemodus kan du ikke velge antall. Det er alltid 38 spørsmål.
- Ett korrekt svar per spørsmål. Svaralternativene stokkes hver gang.
- Ingen spørsmål gjentas i samme runde.

## Tema

Alle tre hovedtemaene har spørsmål, 80 i hvert undertema (1040 til sammen):

- Utdanning, kompetanse og arbeidsliv: Skole og utdanning, Arbeidsliv, Kritisk tenkning og digital dømmekraft.
- Familie, helse og hverdagsliv: Ny i Norge, Familieliv, Fritid, Helse, Personlig økonomi, Retten til et fritt og selvstendig liv.
- Norge før og nå: Dette er Norge, Historie, Menneskerettigheter og demokrati, Bærekraft.

Undertemaene i Familie, helse og hverdagsliv og i Norge før og nå har emner, ett for hver underside på samfunnskunnskap.no. I et undertema med emner trekkes spørsmålene jevnt fra emnene. Er et emne for lite, fyller de andre opp. Resultatet vises da per emne. Emner, læringsmål og kilder står i `docs/testspesifikasjon.md`.

Et nytt undertema blir med i øvingen og i prøvens blanding av seg selv når spørsmålene er lagt inn.

## Bestått og personvern

- Bestått er 80 % riktige. Det er 16 av 20, 24 av 30, 31 av 38 og 32 av 40.
- Navn er valgfritt. Det vises bare på resultatet og på diplomet.
- Ingenting om eleven lagres. En sideoppdatering sletter fremdriften.
- Utskriften er et diplom. Det viser logo, dato, navn hvis det er fylt inn, poengsum og tydelig bestått eller ikke bestått. Spørsmålene er ikke med. Nederst står det: «Diplomet er resultatet fra en øvingsprøve, ikke en godkjenning på samfunnfagsprøven fra norske myndigheter.»

## GitHub Pages

1. Opprett et GitHub-repository.
2. Last opp filene i rotmappen, blant annet `index.html`, `style.css`, `app.js`, `questions.xml` og `assets/`.
3. Gå til **Settings → Pages**.
4. Velg publisering fra repositoryets hovedgren og rotmappe.
5. Åpne adressen GitHub gir deg.

## Viktig om XML

Ikke åpne `index.html` direkte som en `file://`-fil dersom nettleseren blokkerer lokal lasting av XML. GitHub Pages fungerer fordi filene leveres via HTTP/HTTPS.

## Faglig kvalitet

Spørsmålene er skrevet på A2-nivå med utgangspunkt i samfunnskunnskap.no. Bunnteksten lenker dit: «Les mer her: www.samfunnskunnskap.no». Kilden ligger i `sporsmalsbank/kilde/`, og `questions.xml` genereres derfra med `npm run bygg`. Rediger kilden, ikke `questions.xml`. Banken er ikke utprøvd på deltakere, og resultatet er en indikasjon.
