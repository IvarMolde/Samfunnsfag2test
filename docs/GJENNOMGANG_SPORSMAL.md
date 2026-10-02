# Faglig og språklig gjennomgang av spørsmålsbanken

Dato: 2. oktober 2026. Gjennomgått: alle 240 spørsmål og tilbakemeldinger i `sporsmalsbank/kilde/` (skole, arbeid og kritisk tenkning).

ID-ene er de samme som i `questions.xml` (for eksempel `skole-44`). Nummeret er linjenummeret i kildefilen minus 1.

## Status

Alle funnene under er rettet i `sporsmalsbank/kilde/`, og `questions.xml` er bygd på nytt. Teksten som står i banken nå, er stort sett lik forslagene. Noen svaralternativer er gjort like lange, så lengden ikke avslører det riktige svaret.

Under rettingen ble to punkter avklart, og to spørsmål til ble rettet:

- **skole-52 var feil, ikke bare usikker.** Etter opplæringsloven § 18-3 (2024) har voksne rett til videregående opplæring fra skoleåret de fyller 19 år. Det finnes ingen grense på 25 år. «(25 år eller eldre)» er tatt ut, og lovlig opphold er nevnt i tilbakemeldingen.
- **skole-57:** HK-dir har to prøver: Norskprøven A1–B2 og Norskprøven C1. Spørsmålet gjelder norskopplæringen for voksne (A1–B2). Tilbakemeldingen nevner nå C1-prøven.
- **skole-80 (rettet i tillegg):** «Hva bestemmer hvem som får plass på videregående?» sa imot skole-36, fordi alle som har fullført grunnskolen, har rett til plass. Nå spør det om hva som avgjør *hvilken* skole du kommer inn på.
- **skole-37 (rettet i tillegg):** Yrkesfag gir fagbrev *eller svennebrev*.

### Gjennomlesing før publisering

Alle 240 spørsmål skal leses gjennom før endringene publiseres (flettes inn i `main`). Bruk `sporsmalsbank/ut/Spørsmålsbank_samfunnskunnskap.docx`. Der står hvert spørsmål med ID, riktig svar merket med ✓, de gale svarene og begge tilbakemeldingene.

Disse 38 spørsmålene er endret i denne runden og bør leses ekstra nøye:

- **Skole (15):** 01, 20, 23, 35, 37, 40, 44, 52, 57, 58, 59, 62, 63, 65, 80
- **Arbeid (12):** 08, 09, 20, 27, 36, 41, 42, 49, 52, 55, 71, 73
- **Kritisk (11):** 01, 06, 08, 19, 25, 27, 28, 31, 55, 68, 69

Rettelser gjøres i `sporsmalsbank/kilde/` (ikke i `questions.xml`). Kjør deretter `npm run bygg`.

## Kategorier

- **A – Feil eller misvisende.** Bør rettes før banken brukes videre.
- **B – Usikker eller upresis fakta.** Bør sjekkes eller formuleres mer forsiktig.
- **C – Språk.** Grammatikkfeil, uklar setning eller uheldig ordvalg.
- **D – Svarene.** Et galt alternativ kan også være riktig, eller det riktige svaret er for svakt.

Kontrollerte kilder: samfunnskunnskap.no, IMDi (veileder til integreringsloven), Lovdata (integreringsforskriften § 28, tolkeloven), Udir, universitetenes sider om studieavgift og SSB.

---

## A – Feil eller misvisende (8)

### kritisk-08 – Bruk av andres tekster, bilder og musikk
- Nå: «Oppgi hvem som har laget det» er riktig svar.
- Problem: Det er ikke nok å oppgi navnet. Etter åndsverkloven må du som hovedregel ha **lov** fra den som har laget verket (unntak er for eksempel sitat). Svaret lærer bort noe som er galt.
- Forslag: Riktig svar «Spørre om lov og oppgi hvem som har laget det». Tilbakemelding: «Du må ha lov fra den som har laget verket. Du må også skrive hvem som har laget det.»

### kritisk-27 – Privat bilde og løgn om deg
- Nå: «Ulovlig, og du kan melde det til politiet.»
- Problem: Ærekrenkelser (å skrive løgn om noen) ble tatt ut av straffeloven i 2015. Det er en sivil sak og ikke noe politiet etterforsker. Å dele private eller krenkende bilder kan derimot være straffbart (straffeloven § 267 a).
- Forslag: Ta bort løgnen fra spørsmålet: «Noen deler et privat bilde av deg uten å spørre deg. Hva er dette?» Riktig svar: «Det kan være ulovlig, og du kan melde det til politiet.»

### kritisk-68 – Tegn på svindel (tilbakemeldingen)
- Nå: «Meldinger fra folk du kjenner er ofte trygge.»
- Problem: Dette er et farlig sikkerhetsråd. Svindlere overtar ofte kontoer og skriver som en venn eller et familiemedlem («Hei mamma»-svindel).
- Forslag: «Svindlere vil at du skal skynde deg. Vær forsiktig også når meldingen ser ut til å komme fra en du kjenner.» Bytt også det gale alternativet «Den kommer fra en kollega du kjenner» med «Den har logoen til banken din».

### kritisk-19 – Hva er forbudt å skrive på nettet
- Nå: «Rasistiske og diskriminerende utsagn.» I tilbakemeldingen står det: «du kan ikke krenke grupper.»
- Problem: Det er for bredt. Straffeloven § 185 forbyr *hatefulle ytringer*: trusler, hets eller sterk nedvurdering på grunn av hudfarge, religion, seksuell orientering, kjønnsidentitet eller funksjonsnedsettelse. Mange utsagn som er rasistiske og krenkende, er likevel lovlige.
- Forslag: Riktig svar «Trusler og hatefulle ytringer mot noen på grunn av hudfarge eller religion». Tilbakemelding: «Du kan kritisere og ha negative meninger. Men trusler og hatefulle ytringer er forbudt.»

### arbeid-42 – Hva kan skje når du jobber svart
- Nå: «Du får ikke feriepenger og dagpenger.»
- Problem: Etter loven har du fortsatt krav på feriepenger fra arbeidsgiveren, men det er vanskelig å få dem. Det du sikkert mister, er rettigheter fra Nav: sykepenger, dagpenger og pensjon. Det gale alternativet «Du får sykepenger og forsikring på jobb» ligner dessuten på det riktige svaret. Grammatikk: Det skal være «verken … eller».
- Forslag: Riktig svar «Du kan miste sykepenger, dagpenger og pensjon». Galt alternativ: «Du får mer lønn og betaler mindre i bot».

### arbeid-49 – Jordbruk i 1950
- Nå: «Hvor mange av **innbyggerne** jobbet i jordbruk i 1950?» Riktig svar: «Mer enn 20 prosent.»
- Problem: Tallet (litt over 20 prosent) gjelder andelen **av dem som jobbet**, ikke av alle innbyggerne. Barn og eldre er med i innbyggerne.
- Forslag: «Hvor mange av dem som jobbet, var i jordbruket i 1950?»

### skole-63 og skole-65 – Retten til opplæring sier imot hverandre
- Nå: skole-63 sier at barn har rett til opplæring i «13 år». skole-65 sier at du har rett til videregående «til du har fullført en utdanning».
- Problem: Den nye opplæringsloven (fra august 2024) gir rett til videregående til du har fullført, ikke et bestemt antall år. Yrkesfag med læretid tar ofte fire år. Det betyr at skole-63 er utdatert og sier imot skole-65.
- Forslag: Skriv om skole-63: «Hvor mange år tar grunnskole og videregående skole vanligvis til sammen?» Riktig svar: «13 år». Gale alternativ: «10 år», «16 år».

### kritisk-06 – Egen mening (tilbakemeldingen)
- Nå: «Man må ikke være enig med læreren.»
- Problem: På norsk betyr «må ikke» at det er *forbudt*. Setningen sier derfor at det er forbudt å være enig med læreren.
- Forslag: «Du trenger ikke å være enig med læreren.»

---

## B – Usikker eller upresis fakta (11)

### arbeid-73 – «Mellom 60 og 80 prosent av jobbene lyses ikke ut»
- På samfunnskunnskap.no står det «**Det sies** at mellom seksti og åtti prosent …». Tallet er altså ikke dokumentert. Navs bedriftsundersøkelse viser at 88 prosent av virksomheter med 50 ansatte eller flere brukte en offentlig kanal sist de ansatte noen. For små virksomheter er det rundt halvparten.
- Det er usikkert å teste et tall som kilden selv tar forbehold om.
- Forslag: Bytt til et spørsmål uten tall: «Mange jobber blir ikke lyst ut. Hvordan kan du få vite om dem?» Riktig svar: «Gjennom nettverket ditt».

### skole-40 – Skolepenger på offentlige universiteter
- Nå: «Nei, men de må kjøpe bøkene selv.»
- Fra høsten 2023 må studenter fra land utenfor EU/EØS og Sveits som hovedregel betale studieavgift. De som har familieinnvandring, beskyttelse (flyktninger) eller permanent oppholdstillatelse, er unntatt. Det gjelder de fleste i målgruppen. Alle studenter betaler dessuten en semesteravgift.
- Forslag: Riktig svar «Nei, de betaler bare en liten semesteravgift». Legg i tilbakemeldingen til: «Noen studenter fra land utenfor EØS må betale.»

### skole-01 – «Alle barn skal gå på skole, og staten betaler» (1700-tallet)
- Svaret følger samfunnskunnskap.no ordrett. Historisk er det upresist: Etter forordningen fra 1739 var det bygdene, kirken og bøndene som betalte. Skolen var underlagt kongen i Danmark-Norge. Staten tok et større ansvar først med loven fra 1860.
- Vurdering: Kan beholdes, fordi prøven bygger på samfunnskunnskap.no. Ikke lag flere spørsmål som bygger på at «staten betalte».

### skole-52 – Rett til videregående for voksne (25 år eller eldre)
- Reglene for voksne ble endret i den nye opplæringsloven (2024). Kontroller at aldersgrensen og vilkåret «grunnskole fra Norge eller utlandet» stemmer med loven slik den er nå. Du må også ha lovlig opphold.
- Språk: Spørsmålet bruker «voksne», mens alternativene bruker «du». Bruk det samme i begge.

### skole-57 – Nivåene i norskopplæringen (A1–B2)
- Sjekk om Norskprøven nå også har nivå C1. Hvis den har det, bør spørsmålet gjelde norsk*prøven* og ikke norsk*opplæringen*, eller C1 bør nevnes.

### skole-58 og skole-59 – 18 måneder eller tre år med norskopplæring
- Tallene stemmer med integreringsloven og IMDi. Men de gjelder bare for dem som har rett og plikt til opplæring (for eksempel flyktninger og familiegjenforente). Arbeidsinnvandrere har ikke denne retten.
- Forslag: «Hvor lenge kan du få norskopplæring etter integreringsloven hvis …»

### skole-23 – «Alle elever har den samme læreplanen»
- Det finnes også egne samiske læreplaner. Forslag: «Læreplanen er den samme i hele landet.»

### arbeid-20 – Lov og avtale
- «Avtaler gjelder for noen bransjer» er upresist. En tariffavtale gjelder der den er inngått, mellom en fagforening og en arbeidsgiver.
- Forslag: «Lover gjelder for alle. Tariffavtaler gjelder der de er inngått.»

### arbeid-41 – Hva er svart arbeid
- Det som gjør arbeidet svart, er at inntekten ikke blir meldt til Skatteetaten. At du mangler kontrakt, er ikke det viktigste.
- Forslag: «Jobb der lønnen ikke blir meldt til Skatteetaten».

### arbeid-27 – Nav-kontor i alle kommuner
- Noen små kommuner deler kontor med nabokommunen. Forslag: «Nav har kontorer over hele landet.»

### kritisk-69 – Åpent wifi og nettbank
- I dag bruker nettbanker kryptering, så risikoen er mindre enn før. Den største faren er falske wifi-nett.
- Forslag: «Fordi noen kan lage et falskt wifi-nett og lure deg.»

---

## C – Språk (10)

| ID | Nå | Forslag |
|---|---|---|
| skole-44 (spørsmål og tilbakemelding) | «etter at man er ferdig å studere» | «etter at man er ferdig **med** å studere» |
| arbeid-09 (tilbakemelding) | «flere er med å bestemme» | «flere er med **på** å bestemme» |
| arbeid-55 | «Hva gjelder for ledige jobber i Norge, selv om få er arbeidsledige?» | «Det er få arbeidsledige i Norge. Hva er likevel vanlig når en jobb blir lyst ut?» |
| kritisk-01 (og tilbakemelding) | «Å tenke kritisk om det du leser» (forklarer ordet med seg selv) | «Å vurdere om informasjonen stemmer, og hvem som står bak» |
| kritisk-25 | «Ting som hører til deg og dine» | «Ting som bare gjelder deg og familien din» |
| kritisk-28 (galt alternativ) | «Det er nærmeste venner som ser det du deler» | «Bare de nærmeste vennene dine ser det du deler» |
| skole-20 | «Hva skjer med elevene etter sommerferien?» (uklart hvilke elever) | «Hva skjer med elevene i grunnskolen etter sommerferien?» |
| skole-35 | «Hvorfor jobber elevene ofte i grupper?» / «De lærer at alle må hjelpe til» | «De lærer å samarbeide med andre» |
| arbeid-52 | «Å gi et fast håndtrykk og se på dem» | «Å hilse høflig og se dem i øynene» (noen hilser ikke med hånden av religiøse grunner) |
| arbeid-71 | «Staten, fylket eller kommunen» | «Staten, fylkeskommunen eller kommunen» (som ellers i banken) |

---

## D – Svarene (4)

### skole-62 – God måte å øve norsk på hver dag
- Det gale alternativet «Å lese norske lærebøker hjemme» er også en god måte å øve på. Det kan gjøre spørsmålet urettferdig.
- Forslag: «Å bare snakke morsmålet hjemme og på jobb».

### arbeid-08 – Hva er et verneombud
- Det gale alternativet «En som kontrollerer arbeidsplassene» passer delvis, for verneombudet går vernerunder. Det er Arbeidstilsynet som fører tilsyn.
- Forslag: «En som kontrollerer at bedriften betaler skatt».

### kritisk-31 – Hva er en pålitelig kilde
- «En kilde som sier hvem som står bak» er nødvendig, men ikke nok. En falsk nettside kan også oppgi et navn.
- Forslag: «En kilde som sier hvem som står bak, og hvor fakta kommer fra».

### kritisk-55 – Personnummer
- Det offisielle navnet på tallet med 11 siffer er *fødselsnummer*. Personnummer er de fem siste sifrene. Mange sier personnummer, men noen får D-nummer i stedet.
- Forslag: «Et fødselsnummer (personnummer) har 11 siffer og er bare ditt.»

---

## Generelt

- **Språknivå:** De fleste spørsmålene ligger på A2. Noen stammer og tilbakemeldinger er korte på en måte som gjør dem stive eller uklare. Det er bedre med litt lengre og naturlige setninger på A2–B1 enn med svært korte setninger. Eksempler er arbeid-55 og skole-35.
- **«Man» og «du»:** Banken bytter mellom «man» og «du», også inne i samme spørsmål (skole-52). Det er lettere å lese når «du» brukes hele veien.
- **Lovendringer:** Spørsmål om rettigheter (opplæringsloven 2024, integreringsloven, studieavgift 2023) blir fort utdaterte. Banken bør sjekkes mot gjeldende regler minst én gang i året.
- **Samsvar med kilden:** Noen svar følger samfunnskunnskap.no selv om kilden forenkler (skole-01, arbeid-73). Det er greit når prøven bygger på samme kilde. Men tall som kilden selv tar forbehold om, bør ikke testes.
