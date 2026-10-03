# Øvingsprøve i samfunnskunnskap – funksjonalitet og anbefalinger

> **Historisk notat (oktober 2026).** Dette dokumentet er et tidlig forslag fra da programmet ikke var laget. Det stemmer ikke med dagens app. Bruk `README.md` for hvordan programmet virker, og `docs/OVERSIKT.md` for å fortsette utviklingen. Banken har nå 1040 spørsmål, ikke 240. XML-formatet i rotmappen er `questions.xml`, ikke eksempelet under.

## 0. Hva dette dokumentet er

Hittil finnes **spørsmålsbanken** (Word og XML). **Selve nettprogrammet er ikke laget ennå.**
Dette dokumentet gjør to ting:

1. Forklarer hva som finnes nå, og hvordan XML-filen er bygd opp.
2. Beskriver funksjonaliteten et øvingsprogram bør ha, og gir innspill som gjør det mer profesjonelt.

Deler som beskriver programmet (kapittel 3–5) er **forslag**, ikke noe som allerede virker.

---

## 1. Hva som er laget

| Fil | Innhold |
|---|---|
| `Spørsmålsbank_samfunnskunnskap.docx` | 240 spørsmål til lesing og gjennomgang. Første alternativ er alltid riktig. |
| `sporsmalsbank_samfunnskunnskap.xml` | De samme 240 spørsmålene i maskinlesbart format. |

**Bankens innhold**

- 3 kategorier med 80 spørsmål hver: *Skole og utdanning*, *Arbeidsliv*, *Kritisk tenkning og digital dømmekraft*.
- Språknivå A2 (CEFR). Setningene er korte, og ordvalget er enkelt.
- Tre svaralternativer per spørsmål. Ingen dubletter i spørsmålstekstene.
- Kilder: de tre sidene på samfunnskunnskap.no med undersider.

---

## 2. XML-filen

### Struktur

```xml
<sporsmalsbank sprak="nb" niva="A2" antallSvar="3">
  <kategori navn="Skole og utdanning" antall="80">
    <sporsmal id="skole-01">
      <tekst>Hva bestemte Norge på 1700-tallet?</tekst>
      <svar riktig="true">Alle barn skal gå på skole, og staten betaler</svar>
      <svar>Bare barn fra rike familier går på skole</svar>
      <svar>Foreldrene må selv betale for skolen</svar>
    </sporsmal>
  </kategori>
</sporsmalsbank>
```

### Regler

- Hvert spørsmål har en fast **id**: `skole-01`…`skole-80`, `arbeid-01`…`arbeid-80`, `kritisk-01`…`kritisk-80`.
- Det **første** `<svar>` er alltid riktig og har `riktig="true"`. De to andre har ikke attributtet.
- Navn på elementer og attributter bruker ikke æøå (tryggere i kode). Selve teksten er UTF-8 og har æøå.
- Hvis du endrer et spørsmål senere, behold id-en. Da følger statistikk og historikk med.

### Viktig: stokk svarene

Siden riktig svar alltid står først, **må programmet stokke rekkefølgen tilfeldig** før visning. Ellers ser deltakerne raskt at første alternativ er riktig.

---

## 3. Anbefalt grunnfunksjonalitet (forslag)

### 3.1 Teststart

- Velg antall spørsmål: standard 36, kan stilles mellom 30 og 40.
- Velg modus (se 3.6).
- Programmet trekker tilfeldige spørsmål **jevnt fordelt** mellom de tre kategoriene (for eksempel 12 + 12 + 12).
- Ingen spørsmål vises to ganger i samme test.

### 3.2 Under testen

- Ett spørsmål om gangen, med tydelig fremdrift ("Spørsmål 7 av 36").
- Svaralternativene vises i tilfeldig rekkefølge.
- Mulighet til å gå tilbake, endre svar og merke et spørsmål for senere.
- Stor, lesbar skrift og store knapper (fungerer godt på mobil).

### 3.3 Etter testen

- Resultat: antall riktige, prosent og bestått/ikke bestått mot en grense du velger.
- Resultat per kategori.
- Gjennomgang av alle svar: elevens svar, riktig svar og en kort forklaring (se 4.2).
- Mulighet til å øve på bare de spørsmålene eleven svarte feil på.

### 3.4 Teknisk bruk av XML-filen

1. Last inn XML-filen (`fetch`) og les den med `DOMParser`.
2. Lag en liste med spørsmål: `id`, `kategori`, `tekst`, `svar[]`.
3. Stokk svarene (Fisher–Yates), og husk hvilket svar som var `riktig="true"`.
4. Kontroller svaret ved å sammenligne med det du husket, ikke med posisjonen.

### 3.5 Valg uten innlogging

Det enkleste er å gjøre alt i nettleseren, uten konto og uten server. Da lagres ingen personopplysninger, og personvernet er enkelt (se 5.1).

### 3.6 Modus

| Modus | Beskrivelse |
|---|---|
| Øvingsmodus | Tilbakemelding rett etter hvert svar, med forklaring |
| Prøvemodus | Ingen tilbakemelding før slutten, og eventuelt en tidsgrense |
| Repetisjon | Bare spørsmål eleven tidligere har svart feil på |
| Én kategori | Øv på bare ett tema |

---

## 4. Innspill som gjør programmet mer profesjonelt

### 4.1 Innhold og kvalitet (viktigst)

1. **Utprøving og spørsmålsstatistikk.** Logg anonymt hvor mange som svarer riktig på hvert spørsmål, og hvilket svar som velges mest. Spørsmål som nesten alle har rett eller galt på, bør byttes ut. Spørsmål der mange velger samme gale svar, kan ha to mulige svar.
2. **Faglig og språklig gjennomgang** av minst to kollegaer før bruk i opplæring.
3. **Bredere pensum.** Banken dekker i dag bare tre temaer. Et profesjonelt verktøy bør dekke hele læreplanen, for eksempel demokrati og rettigheter, norsk historie, helse, familie og bosetting.
4. **Metadata per spørsmål:** læreplanmål, vanskelighetsgrad, kildedato, sist kontrollert og ansvarlig. Dette gjør det mulig å trekke jevne prøver og å oppdatere fakta.
5. **Jevnlig faktasjekk.** Regler, frister og navn på etater endrer seg. Sett en fast dato hvert halvår.
6. **Flere spørsmål.** Med 80 per kategori og 12 per test ser elevene samme spørsmål ofte. 120–150 per kategori gir bedre variasjon.
7. **Svarlengde.** Det riktige svaret er det lengste i omtrent 40 % av spørsmålene. Fortsett å jevne ut lengdene.

### 4.2 Læring

- **Forklaring** til hvert riktig svar (én til to korte setninger på A2) og en lenke til kilden.
- **Svakhetsanalyse:** vis hvilke temaer eleven trenger å øve mer på.
- **Repetisjon med mellomrom:** spørsmål eleven svarer feil på, kommer oftere tilbake.
- **Ordforklaringer** som vises ved trykk på vanskelige ord (kjernetid, fagbrev, streik, Datatilsynet).
- **Opplesning** av spørsmål og svar (talesyntese), som hjelper deltakere med svak lesing.
- **Støttespråk:** valgfri oversettelse av spørsmål og svar til for eksempel ukrainsk, arabisk, tigrinja, somali og engelsk. Dette er pedagogisk nyttig under øving, men prøven selv er på norsk.

### 4.3 Brukeropplevelse

- Mobilvennlig design som først tegnes for liten skjerm.
- Tydelig fremdriftslinje, ingen unødvendig tekst og få valg per skjerm.
- Tydelige farger med god kontrast (WCAG 2.1 AA), og aldri farge som eneste signal for riktig/galt.
- Fungerer uten mus (tastaturnavigasjon) og med skjermleser.
- Mulighet til å forstørre teksten.
- Fungerer **uten nett** etter første innlasting (PWA), slik at deltakere kan øve på bussen.

### 4.4 Læreroppfølging (valgfritt)

- Lærervisning: klassens resultat per spørsmål og per tema, uten personnavn (eller med kode i stedet for navn).
- Mulighet til å lage en egen test av utvalgte spørsmål (for eksempel «bare arbeidsliv»).
- Eksport av resultater til CSV/Excel.
- Utskrift av test som PDF (for undervisning uten PC).

---

## 5. Profesjonell drift

### 5.1 Personvern (GDPR)

- Lagre så lite som mulig. Helst ingen personopplysninger.
- Hvis du lagrer resultater: bruk anonyme koder, ikke navn, og skriv en kort personvernerklæring på enkelt språk.
- Informer tydelig om hva som logges og hvorfor.
- Slett gamle data automatisk.

### 5.2 Tilgjengelighet

- Universell utforming er et krav for offentlig bruk (WCAG 2.1 AA). Test med en skjermleser og med bare tastatur.
- Enkelt språk i grensesnittet: korte setninger, tydelige knapper («Neste», «Avslutt»).

### 5.3 Versjonering og vedlikehold

- Legg XML-filen i en versjonert mappe (for eksempel Git). Skriv i hver endring hva som ble endret og hvorfor.
- Legg versjonsnummer og dato i XML-filen (for eksempel `versjon="1.0"`).
- Lag en liten testfil som kontrollerer: nøyaktig tre svar, nøyaktig ett riktig, ingen like id-er, ingen tomme tekster.

### 5.4 Ansvar og troverdighet

- Skriv tydelig at dette er et **øvingsverktøy** og ikke den offisielle prøven. Det offisielle innholdet og kravene bestemmes av myndighetene, og deltakere bør se oppdatert informasjon der.
- Oppgi kildene og dato for siste faktasjekk i bunnen av siden.
- Ha en enkel måte for brukere og kollegaer å melde fra om feil (skjema eller e-post).

### 5.5 Teknisk kvalitet

- Egen testsuite som kjører automatisk ved hver endring.
- Gjør tilfeldig utvalg *reproduserbart* ved feilsøking (bruk et frø/seed).
- Hold alt i én enkel struktur: `index.html`, `app.js`, `style.css` og XML-filen. Ikke bruk tunge rammeverk hvis det ikke er nødvendig.

---

## 6. Foreslått rekkefølge

1. **Nå:** Få to kollegaer til å lese gjennom banken, og rett det de finner.
2. **Så:** Bygg en enkel nettside (kapittel 3) som leser XML-filen, trekker 36 spørsmål og viser resultat.
3. **Deretter:** Legg til forklaringer, svakhetsanalyse og anonym spørsmålsstatistikk (4.1–4.2).
4. **Til slutt:** Utvid til flere temaer i læreplanen, støttespråk og lærervisning.

---

## 7. Kjente begrensninger i dagens bank

- Dekker bare tre temaer, ikke hele læreplanen.
- Ikke utprøvd på deltakere, så vanskelighetsgrad og kvalitet per spørsmål er ukjent.
- Språknivå A2 er vurdert etter ordvalg og setningslengde, ikke målt med et verktøy.
- Noen fakta (frister, regler og tall, blant annet «60–80 % av jobbene lyses ikke ut») må kontrolleres jevnlig.
- Det riktige svaret er ofte litt lengre enn de andre. Stokking hjelper ikke mot dette.
