# Lage nye spørsmål i Cursor

Denne veiledningen er for deg og for Cursor-agenten når et nytt undertema skal bygges. Følg den i rekkefølge. Ikke gjør andre endringer i appen enn det som står her.

## Mål
80 spørsmål per undertema, A2, tre svaralternativer, første alternativ er alltid riktig (appen stokker rekkefølgen). Hvert spørsmål har en tilbakemelding for riktig svar og en for feil svar.

## Status
| Hovedtema | Undertema | Status |
|---|---|---|
| Utdanning, kompetanse og arbeidsliv | Skole og utdanning, Arbeidsliv, Kritisk tenkning og digital dømmekraft | ferdig |
| Familie, helse og hverdagsliv | Ny i Norge | ferdig |
| Familie, helse og hverdagsliv | Familieliv, Fritid, Helse, Personlig økonomi, Retten til et fritt og selvstendig liv | ferdig, ikke gjennomlest av faglærer (plan i `docs/testspesifikasjon.md`) |
| Norge før og nå | Dette er Norge, Historie, Menneskerettigheter og demokrati, Bærekraft | ikke startet |

## Slik legger du til et undertema
1. **Les kilden.** Hent undertemaet fra samfunnskunnskap.no, med alle undersidene. Skriv ned fakta og tall. Bruk ikke fakta du er usikker på. Sjekk tall mot UDI, Nav, Udir eller SSB.
2. **Lag `sporsmalsbank/kilde/a2_<fil>.js`.** Se `a2_nyinorge.js` som mal:
   ```js
   module.exports = { tema: "Familieliv", emner: [
     { emne: "Navn på underside", kilde: "https://samfunnskunnskap.no/…", items: [
       ["Spørsmål?", "RIKTIG svar", "feil svar 1", "feil svar 2"],
     ]},
   ]};
   ```
   Har undertemaet flere undersider, lag ett emne per underside. Har det ingen, bruk ett emne.
3. **Lag `sporsmalsbank/kilde/fb_<fil>.js`.** En liste i nøyaktig samme rekkefølge som spørsmålene: `[["Riktig. Forklaring.", "Hint til den som svarte feil."], …]`.
4. **Registrer det i `sporsmalsbank/kilde/load.js`.** Én linje i `REGISTER`: `{ fil: '<fil>', slug: '<id-prefiks>', hoved: FAMILIE }`.
5. **Kjør** `npm run bygg` og så `npm run check`. Rett alt som valideringen melder. Kjør også `npm run e2e`.
6. **Oppdater tellingen i testene.** `tests/e2e/e2e.mjs` har antall undertema og totalt antall spørsmål. Oppdater dem. Legg til en e2e-test som velger det nye undertemaet.
7. **Oppdater `README.md`, `docs/OVERSIKT.md` og tabellen over.** Flytt undertemaet fra planlagt til ferdig.
8. **Skriv ikke `questions.xml` for hånd.** Den bygges av `npm run bygg`.
9. **Commit og push på en egen gren.** Lag en pull request. Flett først når Actions er grønn.

## Regler for gode spørsmål
- **Språk:** A2. Korte setninger og vanlige ord. Spørsmålet har høyst 15 ord (mål: omtrent 7). Alternativene er korte (mål: omtrent 6 ord).
- **Ett spørsmål, én ting.** Ingen ledende formuleringer og ingen overlapp med andre spørsmål.
- **Ikke skriv spørsmål som kopierer spørsmålene på nettsiden.** Skriv dem på nytt.
- **Ingen negative spørsmål** («Hva er ikke …»). Ingen «alle/ingen av de over».
- **Ingen absolutte ord** (alltid, aldri, bare, kun, alle, ingen) som bare står i gale svar. Bruk dem ikke i det hele tatt hvis du kan.
- **Like lange alternativer.** Det riktige er lengst i omtrent 33 % av spørsmålene (validatoren advarer over 40 %). Sjekk også at riktig svar er kortest i omtrent en tredjedel.
- **Troverdige gale svar** som bygger på reelle misforståelser. Ikke tulle- eller åpenbart gale svar.
- **Unike spørsmålstekster i hele banken.** Valideringen sjekker dette. Det gjelder også mellom undertema.
- **Rettferdig.** Spørsmålet skal ikke kreve kunnskap om en bestemt kultur, religion eller bakgrunn utover det kilden lærer.
- **Tall:** bruk «omtrent» og pek på det kilden sier. Ikke bruk tall som endrer seg ofte uten å sjekke dem.
- **Tilbakemelding:** riktig-teksten bekrefter og forklarer kort. Feil-teksten gir et hint uten å røpe svaret ordrett.

## Spørsmålsfordeling
Fordel 80 spørsmål mellom emnene etter hvor mye stoff hver underside har. Hvert emne skal ha minst 5 spørsmål (valideringen krever det). Trekningen fordeler jevnt mellom emnene og fyller opp når et emne er lite.

## Forslag til prompt i Cursor
> Les `docs/NYE_SPORSMAL_I_CURSOR.md` og lag undertemaet «<navn>» under «<hovedtema>». Hent stoffet fra <lenke> og alle undersidene. Lag 80 spørsmål etter reglene, registrer det i `load.js`, kjør `npm run bygg`, `npm run check` og `npm run e2e`, og rett alt som feiler. Lag en pull request. Ikke endre `app.js` eller utseendet.

## Før bruk i prøven
Be en faglærer kontrollere fakta mot offentlige kilder. Spørsmålene er ikke utprøvd på deltakere.
