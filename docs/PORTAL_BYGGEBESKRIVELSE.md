# Byggebeskrivelse: Øvingsportal til samfunnskunnskapsprøven

Dette dokumentet beskriver hva som skal bygges, hvordan det skal se ut, hvordan spørsmålene lages, og hvordan alt legges i GitHub. Det er den opprinnelige spesifikasjonen. **Ikke les den som fasit for det som er bygd.** Slik portalen er nå, står i `README.md` og `docs/OVERSIKT.md`.

**Status oktober 2026:** Portalen i rotmappen er i drift som statisk GitHub Pages-app. Banken har 1040 spørsmål (13 × 80). Øving, prøvemodus (38), tidtaker, temakort, diplom ved utskrift og UU mot WCAG 2.1 AA er på plass. Åpent: mørk modus, manuell skjermleser, faglig gjennomlesing av 800 spørsmål i Familie/Norge, rettigheter til kilden, PWA og støttespråk. Se `docs/OVERSIKT.md`.

---

## 1. Hensikt og målgruppe

**Hensikt:** Hjelpe voksne innvandrere å øve til samfunnskunnskapsprøven, og samtidig gi dem tilbakemelding som lærer dem noe.

**Målgruppe:** Voksne deltakere som lærer norsk, språknivå rundt A2. Mange bruker mobil. Noen har lite erfaring med nettsider og lange tekster. Lærere bruker portalen i undervisningen.

**Bestemmelser tatt (fra oppdragsgiver):**

| Tema | Valg |
|---|---|
| Teknikk | Statisk nettside, driftet fra et eget GitHub-repo (GitHub Pages) |
| Elevdata | Portalen lagrer ingenting om elevene. Alt skjer i nettleseren |
| Prøvemodus | Valgfri tidtaker (kan slås av og på) |
| Bestått | 80 % riktige, i begge modusene |
| Rettigheter | Ikke undersøkt ennå. Se kapittel 13 |

---

## 2. Innhold: spørsmålsbanken

### 2.1 Det som finnes

Hovedtema **Utdanning, kompetanse og arbeidsliv** har tre underkategorier med 80 spørsmål hver, til sammen 240:

- Skole og utdanning
- Arbeidsliv
- Kritisk tenkning og digital dømmekraft

### 2.2 Det som skal lages

Hentes fra samfunnskunnskap.no, med alle undersider:

- **Familie, helse og hverdagsliv**
- **Norge før og nå**

**Regel:** 80 spørsmål per underkategori. Hvor mange underkategorier det er, avgjøres når sidene er lest. Navn og antall skal hentes fra nettstedet, ikke antas. Antall spørsmål totalt blir da 80 × antall underkategorier.

### 2.3 Slik lages hvert spørsmål

1. Les kildesiden og undersidene i sin helhet. Lag en liste over fakta som kan testes.
2. Skriv spørsmål på **A2-nivå**: korte setninger, vanlige ord, ett tema per spørsmål, ingen negasjoner i spørsmålet (ikke «Hva er IKKE …»).
3. Tre svaralternativer. **Det første er alltid riktig** i filen. Portalen stokker rekkefølgen når den viser dem.
4. De to gale svarene skal være **troverdige**. De skal ikke være latterlige, og ingen av dem skal kunne være riktige.
5. Alternativene skal være omtrent like lange, så lengden ikke avslører svaret. Mål dette, og rett opp.
6. Unngå ord som «alltid», «aldri», «bare», «kun» i gale alternativer hvis de ikke står i riktig alternativ.
7. Skriv **tilbakemelding** til hvert spørsmål: én kort forklaring ved riktig svar og ett hint ved feil svar (se 2.5).
8. Ingen to spørsmål skal måle det samme. Ett spørsmål skal heller ikke gi svaret på et annet.
9. Bruk bare fakta som står i kilden eller som er sikre. Usikre tall, frister og lovregler skal enten utelates eller merkes for kontroll.
10. Spørsmålene skal være rettferdige uavhengig av bakgrunn. Ingen forutsetter kjennskap til norsk kultur som ikke er lært i kilden.

### 2.4 Kvalitetskontroll av innholdet

Hver underkategori skal gå gjennom disse stegene før den legges ut:

- **Automatisk kontroll** (se kapittel 9): antall, struktur, dubletter, lengdebalanse, ordlengde og setningslengde.
- **Faglig gjennomgang** av minst to lærere: stemmer det, og er det relevant for læreplanen?
- **Språklig gjennomgang**: Forstår en deltaker på A2 spørsmålet og alternativene?
- **Utprøving** med en gruppe deltakere før utgivelse, og senere med anonym statistikk hvis det velges (se kapittel 10, særlig 10.6).

### 2.5 Format (XML)

Filen heter `sporsmalsbank.xml` og er den eneste kilden til sannhet. Navn på elementer og attributter har ikke æøå.

```xml
<sporsmalsbank sprak="nb" niva="A2" antallSvar="3" versjon="1.2">
  <tilbakemeldingsmaler>
    <apning type="riktig">Bra, du svarte riktig!</apning>
    <apning type="feil">Det var ikke helt riktig.</apning>
  </tilbakemeldingsmaler>
  <kategori id="utdanning" navn="Utdanning, kompetanse og arbeidsliv">
    <underkategori id="skole" navn="Skole og utdanning" antall="80">
      <sporsmal id="skole-001">
        <tekst>Hva bestemte Norge på 1700-tallet?</tekst>
        <svar riktig="true">Alle barn skal gå på skole, og staten betaler</svar>
        <svar>Bare barn fra rike familier går på skole</svar>
        <svar>Foreldrene må selv betale for skolen</svar>
        <tilbakemelding>
          <riktig>Fra 1700-tallet skulle alle barn gå på skole.</riktig>
          <feil>Tenk på at alle barn skulle få lære noe.</feil>
        </tilbakemelding>
        <kilde url="https://samfunnskunnskap.no/..." kontrollert="2026-10-02"/>
      </sporsmal>
    </underkategori>
  </kategori>
</sporsmalsbank>
```

**Endringer fra dagens fil (v1.1):**

- Nytt nivå `underkategori` mellom kategori og spørsmål (i dag er underkategorien kalt `kategori`).
- Id-er med tre sifre (`skole-001`), så det er plass til flere.
- Valgfritt `<kilde>` med URL og kontrolldato per spørsmål.
- Valgfritt `vanskelighet` (1–3), satt etter utprøving.
- Valgfritt `maal` (læreplanmål/kildeside) og `kanEndres="true"` for fakta som kan endre seg (se kapittel 10).
- Id-er endres aldri etter utgivelse. Et spørsmål som tas ut, markeres `utgatt="true"` i stedet for å slettes.

Bygget lager en `sporsmalsbank.json` fra XML-en, som nettsiden bruker.

---

## 3. Funksjonskrav

### 3.1 Startside

- Kort og vennlig forklaring: hva portalen er, og at den ikke er den offisielle prøven.
- Valg av modus: **Øvingsmodus** og **Prøvemodus**, med en setning om hva hver betyr.
- Valg av antall spørsmål: **20, 30 eller 40**.
- Valg av tema: **Alle temaer** (standard) eller ett eller flere temaer.
- Knapp: «Start».
- Lenke til «Slik fungerer det» og «Om innholdet og kildene».

### 3.2 Utvalg av spørsmål

Dette er en kjernefunksjon og skal ha egne tester.

- Spørsmålene trekkes **tilfeldig** fra valgte underkategorier.
- Underkategoriene **vektes likt**. Med *k* valgte underkategorier og *n* spørsmål får hver underkategori `floor(n / k)` spørsmål.
- Er det rest (for eksempel 20 spørsmål fordelt på 6 underkategorier), fordeles resten på forskjellige underkategorier, valgt tilfeldig. Ingen underkategori får mer enn ett spørsmål mer enn en annen.
- Ingen spørsmål vises to ganger i samme test.
- Rekkefølgen på spørsmålene er tilfeldig. Rekkefølgen på svarene er tilfeldig.
- Spørsmål som er markert `utgatt` brukes ikke.
- Hvis en underkategori har færre spørsmål enn den skal bidra med, fordeles det som mangler på de andre, og dette logges i konsollen (ikke vist til eleven).
- For testing: utvalget skal kunne gjøres reproduserbart med en seed (kun i utviklermodus).

### 3.3 Øvingsmodus

- Ett spørsmål om gangen, med **fremdriftslinje** (se 3.5).
- Eleven får **alltid tilbakemelding** etter hvert svar:
  - Riktig: en åpningsfrase fra malene og en kort forklaring.
  - Feil: en åpningsfrase og et hint. Eleven får prøve én gang til.
  - Feil to ganger: riktig svar vises sammen med forklaringen.
- Som riktig regnes svar på **første forsøk**.
- Eleven kan bruke tastene 1, 2 og 3.
- Eleven kan avslutte underveis og se resultatet så langt.

### 3.4 Prøvemodus

Mål: Det skal føles som en ekte prøve.

- **Ingen tilbakemelding** av noe slag før eleven leverer inn. Ikke «riktig/feil», ikke hint, ikke poengsum underveis.
- Ett svar per spørsmål. Eleven kan endre svaret og gå frem og tilbake mellom spørsmålene, helt til hun leverer.
- Spørsmål kan **merkes** for å komme tilbake til dem.
- **Oversiktsside før innlevering:** viser alle spørsmålsnumre med status (besvart, ikke besvart, merket). Eleven kan hoppe til et spørsmål.
- **Tydelig bekreftelse** før innlevering, bygget inn i siden (ikke nettleserens dialogboks). Hvis noe er ubesvart, sies det klart.
- **Tidtaker er valgfri.** Den slås på og av på startsiden. Når den er på, vises gjenstående tid hele tiden. Ved tidens slutt leveres prøven automatisk inn.
- Verifiser antall spørsmål og tid mot offisiell informasjon om prøven før standardverdiene settes. Dagens forslag er ikke bekreftet.
- Ingen mulighet til å se riktig svar før levering. Etter levering vises resultatet (3.6).

### 3.5 Statuslinje

Skal være synlig under hele testen (både i øvings- og prøvemodus):

- «Spørsmål 7 av 30».
- En fremdriftslinje som fylles etter hvert.
- I øvingsmodus: antall riktige så langt.
- I prøvemodus: antall **besvarte**, ikke antall riktige.
- Når tidtaker er på: gjenstående tid.
- Linjen skal være tilgjengelig for skjermleser (`role="progressbar"` med verdier).

### 3.6 Resultatside (dashbord)

Vises etter testen. Skal være **utskriftsvennlig** og kunne **lagres som PDF**.

Innhold:

- **Navn (valgfritt).** Eleven kan skrive inn navn før eller på resultatsiden. Navnet brukes bare på siden og i utskriften. Det lagres ikke noe sted.
- Dato og klokkeslett, modus (øving eller prøve), og antall spørsmål.
- **Resultat:** antall riktige av totalt, prosent, og tydelig **Bestått** eller **Ikke bestått**.
- **Bestått-grense:** 80 %. Vis også hva det betyr i antall (20 spørsmål: 16, 30: 24, 40: 32).
- **Resultat per underkategori** som stolper med tall.
- **Gjennomgang av feil:** hvert spørsmål eleven svarte feil på, med elevens svar, riktig svar og forklaring. I prøvemodus vises dette først nå.
- Knapper: «Skriv ut / lagre som PDF», «Øv på feilene», «Ny test».
- Teksten under resultatet skal være vennlig og konkret om hva eleven bør øve på.

**Utskrift og PDF:**

- Eget utskriftsutseende (`@media print`): hvit bakgrunn, svart tekst, ingen knapper, sidebrudd som ikke deler et spørsmål i to, A4.
- Eleven bruker nettleserens utskriftsfunksjon og velger «Lagre som PDF».
- Toppen av utskriften har portalens navn, dato og navn (hvis oppgitt). Bunnen har en kort setning om at dette er en øvingsprøve og ikke et offisielt dokument.
- **Viktig:** Utskriften skal ikke se ut som et offisielt vitnemål eller bevis. Det skal stå tydelig at det er en øvingsprøve.

### 3.7 Øv på feilene

Starter en ny runde med bare de spørsmålene eleven svarte feil på. Hentes fra den siste testen i minnet. Fungerer bare i samme økt.

### 3.8 Andre sider

- **Slik fungerer det:** forklaring av modusene og vurderingen, på enkelt språk.
- **Om innholdet:** kilder, når innholdet sist ble kontrollert, og hvordan feil meldes inn.
- **Personvern:** kort og tydelig: «Vi lagrer ingenting om deg.»
- **Tilgjengelighetserklæring.**

---

## 4. Design

Frontenden skal se ut som den er laget av et profesjonelt designstudio: rolig, tydelig og trygg. Den skal virke seriøs uten å være kjedelig.

### 4.1 Designprinsipper

1. **Klarhet foran pynt.** Ett valg per skjerm. Én hovedhandling per skjerm.
2. **Rolig og trygg.** Prøver skaper stress. Utseendet skal dempe det: god luft, myke farger, ingen blinkende elementer.
3. **Enkelt språk overalt.** Knapper og tekster er på A2-nivå.
4. **Aldri farge alene.** Riktig og galt vises med både farge, ikon og tekst.
5. **Mobil først.** Alle skjermer tegnes først for 360 px bredde.
6. **Trygg for alle:** stor tekst, god kontrast, store trykkflater.

### 4.2 Visuell retning

- Moderne, nordisk og nøktern. Ikke bruk flagg- eller folkloreklisjeer.
- Én tydelig aksentfarge (en dyp blå eller blågrønn), brukt med måte, og nøytrale flater med et svakt farget skjær i stedet for ren grå.
- Egne farger for **riktig**, **galt**, **hint** og **advarsel**, adskilt fra aksenten.
- **Lys og mørk modus.** Begge skal være fullt gjennomarbeidet.
- Avrundede hjørner i én størrelse for kort og én for knapper. Skygger bare der det trengs.
- Egne ikoner i samme stil (ett ikonsett, ikke blanding). Ingen emojier som ikoner.

### 4.3 Typografi

- To skrifttyper: en tydelig overskriftsfont med karakter og en svært lesbar tekstfont (for eksempel Atkinson Hyperlegible, som er laget for lesbarhet).
- **Selvhost skriftene** i repoet (ikke last fra Google Fonts), for personvern og stabilitet.
- Brødtekst minst 18 px. Linjelengde under 70 tegn.
- Typeskala definert som tokens (xs til 3xl).

### 4.4 Komponenter

Designsystemet skal ha tokens og komponenter som brukes likt overalt:

- Knapper (primær, sekundær, tekst), med tilstandene vanlig, hover, fokus, trykket og deaktivert.
- Svaralternativ (vanlig, valgt, riktig, galt, deaktivert).
- Fremdriftslinje og tidtaker.
- Tilbakemeldingsboks (riktig, hint, galt).
- Spørsmålsoversikt i prøvemodus (rutenett med numre og status).
- Resultatkort, stolpediagram per tema, og Bestått/Ikke bestått-merke.
- Inndatafelt (navn) med etikett og feilmelding.
- Bekreftelsesboks bygget inn i siden.
- Toppmeny og bunntekst.

### 4.5 Skjermer

Disse skal tegnes (Figma eller direkte i kode) og godkjennes før koding av detaljene:

1. Startside
2. Valg av modus, antall og tema
3. Spørsmål i øvingsmodus (ubesvart, riktig, hint, galt)
4. Spørsmål i prøvemodus (ubesvart, besvart, merket)
5. Oversikt og innlevering i prøvemodus
6. Resultat (bestått og ikke bestått)
7. Utskriftsvisning av resultatet
8. Støttesider
9. Tom tilstand, feilside og «mistet tilkobling»

### 4.6 Bevegelse

- Små, rolige overganger (under 250 ms). Fremdriftslinjen glir.
- Respekter `prefers-reduced-motion`: ingen animasjon hvis brukeren har bedt om det.
- Ingen konfetti eller lyder som kan skape stress eller være upassende.

### 4.7 Kvalitetskrav til frontend

- Lighthouse-resultat på minst 95 for ytelse, tilgjengelighet, beste praksis og SEO.
- Ingen horisontal rulling fra 320 px.
- Første visning laster under 2 sekunder på vanlig mobilnett.
- Fungerer i siste to versjoner av Chrome, Safari, Edge og Firefox, og på Android og iOS.
- Fungerer uten nett etter første besøk (se 8).

---

## 5. Tilgjengelighet

Mål: **WCAG 2.1 AA** (kravet for offentlig bruk, og god praksis uansett).

- Alt kan brukes med tastatur. Fokus er alltid synlig og i riktig rekkefølge.
- Kontrast: tekst minst 4,5:1, store elementer minst 3:1.
- Skjermleser: riktig bruk av overskrifter, `aria-live` for tilbakemelding, `role="progressbar"`, etiketter på alle felt.
- Fokus flyttes til spørsmålet når det byttes.
- Tidtaker kan slås av. Hvis den er på, sies det klart (ikke hver sekund til skjermleser, bare ved viktige tidspunkter).
- Tekst kan forstørres til 200 % uten tap av innhold.
- Test med skjermleser (NVDA og VoiceOver) og med bare tastatur, og kjør automatiske tester (axe).

---

## 6. Språk og tekster

- Alle tekster i grensesnittet er på bokmål på A2-nivå.
- Tekstene samles i én fil (`tekster.json`), ikke spredt i koden. Da kan de rettes og oversettes lett.
- Alle meldinger skal være vennlige og konkrete. Ingen feilkoder til eleven.
- **Senere (valgfritt):** støttespråk (for eksempel ukrainsk, arabisk, tigrinja, somali, engelsk) i grensesnittet. Spørsmålene i prøvemodus forblir på norsk. Oversettelser må kvalitetssikres av morsmålstalende.

---

## 7. Teknikk

### 7.1 Valgt løsning

**Statisk nettside** uten server og uten database. Ren HTML, CSS og JavaScript (ES-moduler). Hvis en liten byggesteg trengs (for eksempel Vite), skal resultatet fortsatt være statiske filer.

Begrunnelse: gratis drift, ingen sikkerhetsrisiko fra server, ingen personopplysninger, og enkelt å vedlikeholde.

### 7.2 Repo og mappestruktur

Eget repo, for eksempel `samfunnskunnskap-portal`:

```
/
├─ README.md                  Kort om prosjektet og hvordan det kjøres
├─ docs/                      Denne beskrivelsen, designvalg, beslutninger
├─ content/
│  ├─ sporsmalsbank.xml       Spørsmålene (kilde til sannhet)
│  └─ tekster.json            Tekster i grensesnittet
├─ scripts/
│  ├─ validate.mjs            Kontrollerer XML (se kapittel 9)
│  └─ build-json.mjs          Lager JSON fra XML
├─ src/
│  ├─ index.html
│  ├─ css/                    tokens.css, base.css, components.css, print.css
│  ├─ js/                     utvalg.js, test.js, resultat.js, tidtaker.js, ui.js
│  └─ assets/                 fonter, ikoner
├─ tests/
│  ├─ unit/                   Utvalg, poengberegning, stokking
│  └─ e2e/                    Hele flyten i nettleser
├─ .github/workflows/
│  ├─ ci.yml                  Validerer og tester ved hver endring
│  └─ deploy.yml              Publiserer til GitHub Pages
└─ LICENSE og CONTENT-LICENSE Lisens for kode og for innhold
```

### 7.3 Moduler og ansvar

| Modul | Ansvar |
|---|---|
| `utvalg` | Trekker spørsmål likt fra underkategoriene (3.2) |
| `test` | Holder tilstand: spørsmål, svar, merker, modus, tid |
| `tidtaker` | Valgfri nedtelling og automatisk innlevering |
| `resultat` | Regner ut riktige, prosent, bestått og per tema |
| `ui` | Tegner skjermene og tilbakemeldingen |
| `print` | Utskriftsutseende og sidebrudd |

Logikken (utvalg, poeng, bestått) skal ligge i rene funksjoner uten nettleserkode, så den kan testes enkelt.

### 7.4 Tilstand og lagring

- Tilstanden ligger i minnet. **Ingenting lagres** i nettleseren om elevens svar eller navn.
- Hvis en test avbrytes av en sideoppdatering, mister eleven fremdriften. Dette sies tydelig på siden. (Mulig senere: «Fortsett der du slapp» med lagring i nettleseren. Da må eleven få vite det.)
- Ingen sporing, ingen cookies, ingen tredjepartsscript.

### 7.5 Frakoblet bruk (valgfritt, men anbefalt)

En enkel service worker kan lagre siden og spørsmålene, slik at portalen virker uten nett etter første besøk.

---

## 8. Testing

- **Enhetstester:** utvalg (likt fordelt, ingen dubletter, riktig rest-fordeling for alle kombinasjoner av 20, 30, 40 og 1 til 8 underkategorier), poengberegning, bestått-grense (grenseverdier som 15/20, 16/20), stokking.
- **Ende-til-ende-tester** (Playwright): hele flyten i øvingsmodus og prøvemodus, inkludert at prøvemodus ikke viser tilbakemelding, innlevering med ubesvarte spørsmål, tidtaker som går ut, og utskriftsvisning.
- **Tilgjengelighet:** automatiske tester (axe) i CI, og manuell test av tastatur og skjermleser før utgivelse.
- **Ytelse:** Lighthouse i CI med krav til minimum.
- **Innhold:** `validate.mjs` kjører ved hver endring i spørsmålsfilen.

---

## 9. Automatisk kontroll av spørsmålsfilen

`scripts/validate.mjs` skal stoppe bygget hvis noe av dette er feil:

- Nøyaktig tre `<svar>` per spørsmål, og nøyaktig ett `riktig="true"`, som det første.
- Unike id-er. Ingen tomme tekster.
- Hver underkategori har det antallet spørsmål den oppgir (80).
- Ingen to like spørsmålstekster. Ingen like svar i samme spørsmål.
- Tilbakemelding finnes (riktig og feil) for alle spørsmål.
- Ingen punktum på slutten av svaralternativer (hvis det er valgt som regel), og ingen «alltid/aldri/bare/kun» i gale svar uten å stå i riktig svar.
- Hvert spørsmål har `maal` og `<kilde>`. Spørsmål med `kanEndres="true"` og kontrolldato eldre enn 6 måneder gir advarsel.
- Ingen negative formuleringer i spørsmålsteksten (for eksempel «ikke», «unntatt») og ingen «alle/ingen av de over».
- **Rapport (advarsel, ikke feil):**
  - Hvor ofte riktig svar er lengst. Mål: nær 33 %.
  - Setninger over 15 ord og svært lange ord.
  - Ord som ikke er i en liste over vanlige ord (hjelper til å fange opp for vanskelig språk).

---

## 10. Prøvekvalitet: validitet, reliabilitet og rettferdighet

Dette kapitlet er et **krav** til spørsmålsbanken og til portalen. Det bygger på etablert testteori og forskning på språktesting (se kildene nederst). Målet er at øvingsprøven måler det den skal måle, gir pålitelige resultater og er rettferdig for deltakere med ulik bakgrunn.

**Ærlig grense:** Slike egenskaper kan ikke bare skrives inn i en fil. De må vises med utprøving og data. Derfor skiller kapitlet mellom det som kan sikres *før* bruk og det som må dokumenteres *etter* utprøving. Portalen skal ikke påstå at prøven er «valid» eller «reliabel» før dette er gjort.

### 10.1 Hva prøven skal måle (konstruktet)

Skriv konstruktet ned i ett kort dokument (`docs/konstrukt.md`) før flere spørsmål lages:

- **Det prøven skal måle:** kunnskap om norsk samfunnsliv som er relevant for å leve og arbeide i Norge (for eksempel rettigheter, plikter, arbeidsliv, skole, helse, historie).
- **Det prøven ikke skal måle:** leseferdighet i norsk utover det som trengs, gjetting, testvett eller kulturell bakgrunnskunnskap som ikke står i læreplanen.
- Språknivået (A2) er en **forutsetning for at språket ikke skal stå i veien**, ikke en del av det som måles. Dette kalles å fjerne konstruktirrelevant varians.

### 10.2 Innholdsvaliditet: dekning og relevans

- **Testspesifikasjon (blueprint):** en tabell som viser underkategori, læreplanmål/kildeside og antall spørsmål. Hvert spørsmål knyttes til ett mål (attributtet `maal` på `<sporsmal>` i XML, også lagt til i kapittel 2). Spørsmål uten kobling til mål fjernes.
- **Dekning:** alle underkategorier har like mange spørsmål (80), og innenfor hver underkategori dekkes alle undersider fra kilden. Programmet rapporterer hull.
- **Kun pensum:** spørsmål om detaljer som ikke er sentrale (årstall, navn, tall som er lette å glemme) lages bare når de er viktige for å forstå samfunnet.
- **Ekspertgjennomgang:** minst to fagpersoner (en samfunnskunnskapslærer og en språklærer) vurderer hvert spørsmål på relevans og nivå. Bruk skjema med skala 1–4 per kriterium. Spørsmål som får lav score, skrives om eller fjernes. Behold gjennomgangsloggen i repoet.

### 10.3 Faglig riktighet og aktualitet

- Hvert spørsmål har `<kilde url="…" kontrollert="…"/>` (URL og dato).
- **Fire-øyne-prinsippet:** en annen person enn forfatteren kontrollerer riktig svar mot kilden.
- Spørsmål om regler, frister, beløp og etatsnavn merkes `kanEndres="true"` og kontrolleres hver sjette måned. Valideringen advarer når `kontrollert` er eldre enn 6 måneder.
- Hvert spørsmål skal ha **ett klart riktig svar**. Hvis fagpersoner er uenige om svaret, fjernes spørsmålet.
- Ingen spørsmål om meninger eller politiske standpunkter. Spørsmål om verdier skal handle om hva loven eller samfunnet i Norge sier, ikke hva eleven mener.

### 10.4 Utforming av spørsmål (itemskriving)

Regler fra forskning på flervalgsoppgaver (blant annet Haladyna, Downing og Rodriguez), tilpasset deltakere som lærer norsk:

1. **Ett poeng per spørsmål.** Ett spørsmål tester én ting.
2. **Spørsmålet kan forstås uten å se på svarene.** Stammen er en hel spørsmålssetning.
3. **Ingen negative formuleringer** («Hva er ikke…»). De måler leseforståelse, ikke kunnskap, og er svært vanskelige på A2.
4. **Ingen «alle/ingen av de over».** 
5. **Plausible distraktorer.** Gale svar skal være feil som en deltaker uten kunnskap virkelig kan tro. Hent dem fra vanlige misforståelser (for eksempel forveksling av land, etater eller regler). Ikke bruk tulleforslag.
6. **Like lange og like bygde svar.** Samme grammatiske form, omtrent samme lengde, og ingen som peker seg ut. Riktig svar skal være lengst i omtrent 33 % av spørsmålene (se kapittel 9).
7. **Ingen språklige hint.** Ord fra spørsmålet skal ikke stå bare i riktig svar. Absolutte ord («alltid», «aldri», «bare») brukes ikke bare i gale svar.
8. **Ingen avhengighet mellom spørsmål.** Ett spørsmål skal ikke avsløre svaret på et annet.
9. **Ingen kunnskap som krever én bestemt kultur eller religion.** Se 10.7.
10. **Tre svaralternativer er nok.** Forskning viser at tre alternativer ofte fungerer like godt som fire, fordi den tredje distraktoren sjelden velges. Dette gjør spørsmålene også kortere å lese. Den eneste ulempen er at gjettesjansen er 33 %. Derfor brukes en høy beståttgrense (80 %) og nok spørsmål.

### 10.5 Språk uten skjult vanskelighet (A2)

- Mål språknivået med verktøy, ikke bare med skjønn: ordlister (for eksempel fra Norsk profil / Vocabulary-lister for A2–B1), setningslengde og ordlengde. Valideringen rapporterer avvik (kapittel 9).
- Fagord som **må** brukes (for eksempel «fagbrev», «kjernetid», «Datatilsynet») er en del av det som testes, eller de forklares i spørsmålet. Ellers brukes enkle ord.
- Ingen idiomer, billedlig språk, ironi eller lange sammensatte ord uten grunn.
- **Tenk-høyt-prøve:** 5–8 deltakere på A2–B1 leser spørsmål og forklarer med egne ord hva de tror spørsmålet spør om. Spørsmål som misforstås, skrives om. Dette er den beste måten å finne språklige problemer på.

### 10.6 Reliabilitet (pålitelighet)

Reliabilitet betyr at en deltaker får omtrent samme resultat uansett hvilke spørsmål som trekkes og når testen tas.

**Det som kan sikres på forhånd:**
- Stratifisert tilfeldig trekk: alle underkategorier vektes likt (kapittel 3). Dette gir **parallelle** prøver som er like vanskelige i gjennomsnitt.
- Nok spørsmål: 20 spørsmål gir lav pålitelighet (resultatet svinger mye). 30–40 gir bedre. Portalen sier dette tydelig ved valg av 20: «Kort test. Resultatet er usikkert.»
- Standardiserte forhold i Prøvemodus: samme instruksjon, samme regler, ingen hjelp.
- Svarene stokkes, men tilfeldig trekk kan **reproduseres** med et frø (seed) ved feilsøking.

**Det som må måles etter utprøving (minst 100–200 deltakere):**
- **Vanskelighet (p-verdi)** per spørsmål: andel riktige. Behold spørsmål mellom 0,30 og 0,95.
- **Diskriminering** per spørsmål (korrelasjon mellom spørsmålet og totalscore). Spørsmål under 0,20 vurderes på nytt.
- **Distraktoranalyse:** velges hver distraktor av noen? Velger sterke deltakere en distraktor oftere enn riktig svar, kan spørsmålet ha to svar.
- **Intern konsistens:** Cronbachs alfa (eller KR-20) for hele banken og per tema. Mål: 0,80 eller høyere for en blandet prøve på 40 spørsmål.
- **Standardmåleavvik** ved beståttgrensen, slik at det er kjent hvor mange poeng usikkerhet det er rundt 80 %.
- **Differensiell itemfunksjon (DIF):** se 10.7.

For å kunne gjøre dette uten å lagre persondata (se kapittel 1) brukes **enten** en lukket utprøving i klasserom (svar samles inn på papir eller i et eget skjema uten navn) **eller** frivillig, anonym innsending av svarmønster som ikke kan knyttes til en person. Dette må avgjøres først (kapittel 15).

### 10.7 Rettferdighet og universell utforming av innhold

- **Ingen kunnskap som favoriserer en gruppe:** spørsmål skal ikke kreve kjennskap til norske tradisjoner, mat, humor eller idrett som ikke står i pensum.
- **Nøytralt innhold:** ingen stereotypier om land, religion, kjønn eller yrker. Eksempler bruker varierte navn og situasjoner.
- **Følsomme temaer** (religion, likestilling, vold, seksualitet) formuleres nøkternt og tar utgangspunkt i norsk lov og offentlige kilder.
- **Lese- og skrivevansker:** mulighet for større tekst, høy kontrast og (valgfritt) opplesning i øvingsmodus (kapittel 4). Ingen tidtaker er påkrevd.
- **DIF-analyse** når data finnes: sammenlign spørsmålsresultater mellom grupper med lik totalscore (for eksempel etter hovedspråk eller skolebakgrunn, hvis slike data samles inn frivillig og anonymt). Spørsmål med tydelig DIF granskes av fagpersoner.
- Alt innhold gjennomgås av minst én person med erfaring fra voksenopplæring med flerspråklige deltakere.

### 10.8 Innsikt fra språktesting: rettferdig bruk av resultatet

- **Øvingsprøven er ikke en offisiell prøve.** Resultatet er en indikasjon, ikke et vedtak. Siden skal ikke love at eleven vil bestå den offisielle prøven.
- **Gjetting:** Med tre alternativer er forventet gjettescore 33 %. Beståttgrensen på 80 % gjør det svært lite sannsynlig å bestå ved ren gjetting. Dette kan dokumenteres med binomialfordelingen (utregnet med p = 1/3: sjansen for minst 16 av 20 riktige er ca. 0,003 %, minst 24 av 30 ca. 0,00002 %, og minst 32 av 40 ca. 0,0000002 %).
- **Tilbakemelding og læring:** I øvingsmodus brukes tilbakemelding og repetisjon fordi forskning viser at testing med tilbakemelding gir bedre læring enn ren gjennomlesing (*testing effect*). Prøvemodus brukes for å måle, ikke lære.
- **Gjennomsiktighet:** Siden forklarer kort hva resultatet betyr og ikke betyr, på enkelt språk.

### 10.9 Dokumentasjon som skal ligge i repoet

| Fil | Innhold |
|---|---|
| `docs/konstrukt.md` | Hva prøven måler og ikke måler |
| `docs/testspesifikasjon.md` | Tabell: underkategori, mål, kilde, antall spørsmål |
| `docs/skrivereglene.md` | Reglene i 10.4 med eksempler på gode og dårlige spørsmål |
| `docs/gjennomgang/` | Logg fra ekspertgjennomgang og tenk-høyt-prøver |
| `docs/utproving/` | Resultater fra utprøving: p-verdi, diskriminering, alfa, DIF |
| `docs/endringslogg.md` | Hvilke spørsmål som er endret eller fjernet, og hvorfor |

### 10.10 Kvalitetsporter (må bestås før offentlig utgivelse)

| Port | Krav |
|---|---|
| 1. Skrevet | Alle spørsmål følger 10.4 og validerer (kapittel 9) |
| 2. Faglig kontrollert | Hvert spørsmål kontrollert mot kilde av en annen person |
| 3. Språklig kontrollert | Ordliste- og setningskontroll, og tenk-høyt-prøve er gjennomført |
| 4. Fagfellevurdert | To uavhengige vurderinger av relevans og dekning |
| 5. Utprøvd | Minst 100 deltakere (anbefalt 200+), statistikk i 10.6 beregnet |
| 6. Justert | Spørsmål som ikke holder mål, er byttet ut, og banken er på nytt kontrollert |
| 7. Dokumentert | Alle filer i 10.9 finnes, og siden viser dato for siste kontroll |

Hvis port 5 ikke er nådd, merkes banken **«Ikke utprøvd»** i portalen og i dokumentasjonen.

### 10.11 Kilder (faglig grunnlag)

- Haladyna, T. M., Downing, S. M. og Rodriguez, M. C. (2002). *A review of multiple-choice item-writing guidelines for classroom assessment.* Applied Measurement in Education.
- Rodriguez, M. C. (2005). *Three options are optimal for multiple-choice items: A meta-analysis of 80 years of research.* Educational Measurement: Issues and Practice.
- Bachman, L. F. og Palmer, A. S. (2010). *Language Assessment in Practice.* Oxford University Press.
- Messick, S. (1989). *Validity.* I Linn (red.), *Educational Measurement.*
- AERA, APA og NCME (2014). *Standards for Educational and Psychological Testing.*
- Europarådet (2001/2020). *Det felles europeiske rammeverket for språk (CEFR) og Companion Volume.*
- Europarådet (2009). *Relating Language Examinations to the CEFR: A Manual.*
- Roediger, H. L. og Karpicke, J. D. (2006). *Test-enhanced learning.* Psychological Science.

> Kildene er oppgitt fra faglig kunnskap og **må kontrolleres** (årstall, titler) før de siden brukes i offisiell dokumentasjon.

---

## 11. Forslag og anbefalinger

### Bør med fra start (MVP)

1. Alle krav i kapittel 3.
2. Egen **«Slik fungerer det»**-side, så ingen er usikre på hva modusene betyr.
3. Tydelig tekst om at dette er **øvelse, ikke den offisielle prøven.**
4. **Tilgjengelighet og mobil** som krav fra dag én, ikke som etterarbeid.
5. **Automatisk validering** og tester i GitHub Actions.

### Bør komme tidlig etter MVP

6. **Anonym spørsmålsstatistikk** (hvis du velger det): hvilke spørsmål nesten alle har rett eller galt på, og hvilke gale svar som velges mest. Det er den beste måten å forbedre spørsmålene på. Krever en liten tjeneste og en personvernvurdering, og bryter dagens valg om ingen lagring. Ta det som et eget valg senere.
7. **Utprøving i klassen** av hver ny underkategori før den publiseres.
8. **Faglig gjennomgang** og en fast dato hver halvår for faktasjekk.
9. **Støtte for «Fortsett senere»** (avbrutt test), med tydelig forklaring.

### Senere

10. Støttespråk i grensesnittet og eventuelt oversatte forklaringer i øvingsmodus.
11. Opplesning av spørsmål og svar (talesyntese) for deltakere med svak lesing.
12. Lærerverktøy: lag en egen test av utvalgte temaer og del en lenke. (Krever ingen innlogging hvis lenken inneholder valgene.)
13. Mer detaljert tilbakemelding: egne forklaringer for hvert gale svar (i stedet for ett hint per spørsmål).
14. Ordforklaringer på vanskelige ord (kjernetid, fagbrev, streik og så videre) ved trykk.
15. Egen domene og enkel, personvernvennlig besøksstatistikk (uten cookies).

---

## 12. Fremdriftsplan

| Trinn | Innhold | Ferdig når |
|---|---|---|
| 1 | Les «Familie, helse og hverdagsliv» og «Norge før og nå». Lag oversikt over underkategorier og fakta. | Oversikt godkjent av deg |
| 2 | Skriv 80 spørsmål per underkategori, med tilbakemeldinger. Lag `docs/konstrukt.md` og testspesifikasjon først (10.1–10.2). | Automatisk kontroll uten feil, og port 1–4 i 10.10 |
| 3 | Opprett repo, flytt filer, sett opp CI og validering | Grønt bygg |
| 4 | Design: tokens og skjermer for alle skjermer i 4.5 | Godkjent av deg |
| 5 | Bygg portalen: utvalg, øving, prøve, resultat og utskrift | Alle akseptkriterier i kapittel 14 oppfylt |
| 6 | Tilgjengelighet, ytelse og tester | Krav i 4.7 og 5 oppfylt |
| 7 | Utprøving med deltakere og retting | Rapport med funn og rettelser |
| 8 | Publisering på GitHub Pages | Lenken virker og er testet på mobil |

---

## 13. Rettigheter og ansvar (må avklares før offentlig publisering)

Du har ikke undersøkt om innholdet på samfunnskunnskap.no kan brukes i en egen portal. Før portalen gjøres offentlig:

- **Sjekk vilkårene og lisensen** for tekstene på samfunnskunnskap.no. Spørsmålene er laget fra tekstene, og de ligger så nær kilden at lisensen kan gjelde. Kontakt eieren av nettstedet (via nettstedets kontaktinformasjon) og be om skriftlig svar.
- **Kildehenvisning:** Oppgi i portalen hvilke sider spørsmålene bygger på.
- **Ikke offisiell:** Vis tydelig at portalen ikke er den offisielle prøven og ikke gir rett til noe.
- **Lisens i repoet:** Velg en lisens for koden (for eksempel MIT) og en egen lisens eller en tydelig merknad for spørsmålsinnholdet.
- Hvis svaret er at portalen ikke kan publiseres åpent, bruk den bare i egen undervisning (privat repo og en lenke du deler selv).

---

## 14. Akseptkriterier

Portalen er ferdig når alt dette stemmer:

- [ ] Eleven kan velge 20, 30 eller 40 spørsmål, og modus.
- [ ] Spørsmålene trekkes tilfeldig, og alle underkategorier vektes likt (verifisert med tester).
- [ ] Ingen spørsmål gjentas i en test.
- [ ] Statuslinje vises hele tiden under testen.
- [ ] Øvingsmodus gir alltid tilbakemelding, med hint ved feil og ny sjanse.
- [ ] Prøvemodus gir ingen tilbakemelding før innlevering, har oversiktsside, mulighet til å merke spørsmål, og valgfri tidtaker.
- [ ] Resultatsiden viser riktige, prosent, Bestått/Ikke bestått (80 %), resultat per tema og gjennomgang av feil.
- [ ] Eleven kan skrive inn navn (valgfritt), og navnet vises bare på siden og i utskriften.
- [ ] Resultatet kan skrives ut og lagres som PDF, med tydelig «øvingsprøve»-merking.
- [ ] Ingenting om eleven lagres.
- [ ] Kvalitetsportene 1–4 i kapittel 10.10 er bestått. Er ikke port 5 (utprøving) nådd, vises banken som «Ikke utprøvd».
- [ ] Portalen påstår ikke at øvingsprøven er offisiell, og forklarer på enkelt språk hva resultatet betyr (10.8).
- [ ] Oppfyller WCAG 2.1 AA og Lighthouse-kravene.
- [ ] Fungerer fra 320 px til stor skjerm, i lys og mørk modus.
- [ ] Alle tester og valideringer er grønne i GitHub Actions.
- [ ] Siden er publisert fra et eget repo.

---

## 15. Åpne punkter

1. **Underkategoriene** under «Familie, helse og hverdagsliv» og «Norge før og nå» er ikke hentet ennå.
2. **Offisielt format på prøven** (antall spørsmål, tid) skal bekreftes fra offisiell informasjon, slik at Prøvemodus virkelig blir lik.
3. **Offisiell bestått-grense.** 80 % er kravet i denne portalen. Kontroller om det stemmer med den offisielle prøven, og skriv i så fall tydelig hva portalen bruker.
4. **Rettigheter** til innholdet (kapittel 13).
5. **Navn og eget domene** for portalen.
6. **Hvem som gjennomgår** spørsmålene faglig og språklig (minst to personer, se 10.2 og 10.3).
7. **Utprøving:** hvem og hvor mange (minst 100), og hvordan data samles inn uten å lagre persondata (10.6).
8. **Kilder i 10.11** må kontrolleres (titler og årstall) før de brukes offentlig.
9. **Beståttgrensen:** lag en standard-setting-vurdering (for eksempel Angoff) hvis 80 % skal forsvares som faglig grense, og ikke bare som valg i portalen.
