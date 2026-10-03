# Kvalitetsnotater

Slik programmet virker, står i `README.md`. Slik du fortsetter, står i `docs/OVERSIKT.md`.

- Banken består av 1040 spørsmål (80 per underkategori, 13 underkategorier) med tilbakemelding for riktig og feil svar. De tidligere 150 spørsmålene er fjernet fra `questions.xml` (de ligger i git-historikken).
- Kilde: samfunnskunnskap.no. Der en side har lite tekst, er temaet utdypet med offentlige kilder (for eksempel Nav, Helsenorge, Bufdir, Skatteetaten, Forbrukerrådet, Husbanken, politiet og Lovdata). Tilleggskildene står per emne i kildefilene og i lesefilene i `sporsmalsbank/ut/`.
- Spørsmålene er skrevet på A2–B1-nivå. Grensesnittet er A2.
- De 240 spørsmålene i Skole, Arbeid og Kritisk tenkning er gjennomgått (se `docs/GJENNOMGANG_SPORSMAL.md`). De 400 i Familieliv, Fritid, Helse, Personlig økonomi og Retten til et fritt og selvstendig liv, og de 320 i Norge før og nå, er nye og skal leses gjennom av en faglærer. Plan, læringsmål og fordeling står i `docs/testspesifikasjon.md`.
- Sensitive temaer (vold, tvangsekteskap, kjønnslemlestelse, barnevern) har nøytral tone og nevner hvor man får hjelp.
- Riktig svar står først i kildefilene og stokkes av appen.
- Appen bruker 80 % som beståttgrense. Dette er et valg i øvingsprogrammet, ikke en offisiell grense som er kontrollert.
- Banken er **ikke utprøvd** og ikke psykometrisk validert. Se `docs/PORTAL_BYGGEBESKRIVELSE.md`, kapittel 10.
- Rettigheter til innhold fra samfunnskunnskap.no er ikke avklart.
