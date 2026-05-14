# FleetFlow Planner — Konteksti

## Uusi päätavoite — Daily Traffic Planning Cockpit

FleetFlow Planner ei ole vain job-lista, karttademo tai yksittäisen ajon planneri, vaan TMS-henkinen päivittäisen liikennesuunnittelun cockpit.

FleetFlow Planner auttaa liikennekoordinaattoria tarkistamaan, riittävätkö päivän käytössä olevat autot suunniteltuihin jobeihin. Ohjelma huomioi ajoajat, käsittelyajat, tauot, sijainnit ja autokohtaiset job-ketjut. Jos suunnitelma ei onnistu, ohjelma selittää syyt ja ehdottaa joko parempaa jobien jakoa tai lisävetäjän tarvetta. Coordinaattori voi hyväksyä tai hylätä ohjelman ehdottaman uuden suunnitelman.

Ohjelman ydintoiminto on tarkistaa, selviävätkö käytössä olevat autot / vetäjät päivän jobeista huomioiden:

- ajoajat
- käsittelyajat
- lastaukset
- purut
- trailerin noudot
- trailerin jätöt
- vaihtopisteet
- satama-ajot
- tauot
- 4h30 ajon taukoraja
- 9h päivittäinen ajoaikaraja
- sijainnit
- autokohtaiset job-ketjut
- open/risk/not feasible -tilanteet

Coordinaattorin tavoiteprosessi:

1. Päivän jobit ovat ohjelmassa.
2. Coordinaattori jakaa jobit autoille / vetäjille.
3. Coordinaattori painaa nappia: `Check plan` tai UI:ssa mahdollisesti lyhyemmin `Tarkista`.
4. Ohjelma tarkistaa suunnitelman.
5. Ohjelma löytää riskit ja mahdottomat kohdat.
6. Ohjelma kertoo syyt.
7. Ohjelma ehdottaa parempaa suunnitelmaa.
8. Jos nykyiset autot eivät riitä, ohjelma ehdottaa lisävetäjää / lisäautoa.
9. Ohjelma rakentaa uuden ehdotetun ajosuunnitelman.
10. Coordinaattori voi hyväksyä tai hylätä ehdotuksen.

Keskeiset käsitteet:

- Current plan = coordinaattorin nykyinen suunnitelma
- Plan check = tarkistusajo / Check plan
- Issues = ohjelman löytämät ongelmat ja riskit
- Suggested plan = ohjelman ehdottama uusi ajosuunnitelma
- Additional truck needed = lisävetäjä / lisäauto tarvitaan
- Accept suggestion = ota ehdotus käyttöön
- Reject suggestion = hylkää ehdotus

README-tavoitelause myöhemmäksi:

FleetFlow Planner is a TMS-inspired daily traffic planning cockpit that evaluates whether the available trucks can complete the daily job plan considering driving time, handling time, trailer pickup/drop operations, breaks, locations and truck-specific sequences. If the current plan is not feasible, it explains the issues and suggests a better plan or additional truck capacity.

---

## Uusi päävälilehtirakenne

FleetFlow Planner siirtyy kohti cockpit-rakennetta:

**Board | Job | Fleet | Route & Risk**

Board
= päivän yleisnäkymä, Daily Traffic Plan, KPI:t ja valitun jobin quick summary

Job
= valitun jobin tarkempi työtila, handling, assignment ja driver preview

Fleet
= autokohtainen päivän eteneminen, truck sequences, fleet feasibility ja plan check

Route & Risk
= kartta, reitti, Event Log, action feedback ja tulevat feasibility-varoitukset

Fleet-välilehti on jatkossa projektin ydinnäkymä.

Fleet-välilehden tarkoitus on vastata kysymykseen:

**Selviävätkö käytössä olevat autot päivän jobeista, vai tarvitaanko lisää autoja / vetäjiä?**

Fleet-näkymässä näytetään autokohtainen päivän eteneminen, esimerkiksi:

```text
TR-101
06:30-09:00  JOB-001  Kotka -> Hanko Port       Loading - 45 min      OK
09:45-12:15  JOB-002  Hanko Port -> Demo BP     Port pickup - 25 min  OK
13:15-14:15  JOB-003  Demo BP -> Vuosaari       Exchange - 25 min     Break required
15:00-16:00  JOB-004  Vuosaari -> Sipoo DC      Port pickup - 25 min  OK
16:30-17:15  JOB-005  Sipoo DC -> Demo BP       Empty return - 20 min OK

TR-102
06:45-08:45  JOB-006  Lahti -> Vuosaari         Loading - 45 min      OK
09:30-10:15  JOB-007  Vuosaari -> Demo BP       Port pickup - 25 min  OK
11:15-12:00  JOB-008  Demo BP -> Vuosaari       Exchange - 25 min     OK
13:00-14:00  JOB-009  Vuosaari -> Hakkila DC    Port pickup - 25 min  OK
14:30-15:15  JOB-010  Hakkila DC -> Demo BP     Empty return - 20 min Open
```

---

## Tuleva kehityssuunta — FleetFlow Planner Cockpit

Step 6.1 — Cockpit Navigation Shell
- lisätään päävälilehdet:
  - Board
  - Job
  - Fleet
  - Route & Risk
- lisätään workspaceTab-state
- Board pysyy oletusnäkymänä
- muut näkymät voidaan ensin toteuttaa kevyinä placeholder-näkyminä

Step 6.2 — Fleet Timeline / Truck Sequences View
- näytetään autokohtaiset päivän job-ketjut
- TR-101, TR-102 jne.
- näytetään aika, job, reitti, handling ja status

Step 6.3 — Check Plan Button & Validation Result
- lisätään Check plan / Tarkista -painike
- ohjelma tarkistaa nykyisen suunnitelman
- tulos voi olla:
  - OK
  - Risk
  - Not feasible

Step 6.4 — Plan Issues Explanation
- ohjelma kertoo, miksi suunnitelmassa on riski tai mahdoton kohta
- esimerkiksi:
  - liian pieni buffer
  - päällekkäiset jobit
  - ajoaikaraja ylittyy
  - tauko ei mahdu
  - sijaintisiirtymä ei ole realistinen

Step 6.5 — Suggested Plan v1
- ohjelma ehdottaa yksinkertaista parempaa suunnitelmaa
- esimerkiksi jobin siirtoa toiselle truckille

Step 6.6 — Additional Truck Suggestion
- jos nykyiset autot eivät riitä, ohjelma ehdottaa lisävetäjää / lisäautoa
- ohjelma voi lisätä ehdotukseen esimerkiksi TR-103

Step 6.7 — Accept / Reject Suggested Plan
- coordinaattori voi hyväksyä ehdotetun uuden suunnitelman
- hyväksynnässä dailyJobs päivittyy ehdotuksen mukaan
- hylkäyksessä nykyinen suunnitelma säilyy

Step 7.1 — Route Continuity + Handling-aware Feasibility
- tarkistetaan edellisen jobin destinationCity → seuraavan jobin originCity
- huomioidaan handlingDurationMinutes
- huomioidaan siirtymäaika ja buffer

Step 7.2 — Smarter Reassignment Logic
- ohjelma etsii parempia job-yhdistelmiä nykyisille truckeille ennen lisäauton ehdottamista

---

## Projektin nimi

Nykyinen nimi:

**FleetFlow Planner**

Aiempi nimi:

**Traffic Coordinator Planner**

Projektin nimi muutettiin, koska ohjelma ei ole enää vain yksittäisen ajon suunnittelutyökalu. Se kehittyy kohti TMS/SAP/EVO-tyylistä päivän liikennesuunnittelun ja kapasiteetin hallintaa.

---

## Projektin tarkoitus

FleetFlow Planner on React + Vite -pohjainen TMS/SAP/EVO-tyylinen desktop planner logistiikan ja liikennesuunnittelun tarpeisiin.

Tavoitteena on näyttää:

- logistiikan toimialaosaamista
- päivittäisen liikennesuunnittelun logiikkaa
- kuljetuskapasiteetin hallintaa
- React-frontend-osaamista
- karttavisualisointia
- ETA- ja ajoaikalogiikkaa
- TMS-tyylistä business UI -suunnittelua
- logistiikka + IT -portfolio-osaamista

---

## Tietosuoja- ja demodatarajaus

Projektissa käytetään vain keksittyä demodataa.

Ei käytetä:

- oikeita asiakasnimiä
- oikeita order-numeroita
- oikeita trip-numeroita
- oikeita rekisterinumeroita
- oikeita kuljettajia
- oikeita terminaali- tai keikkatunnuksia
- oikeaa työdataa
- työnantajan järjestelmäkuvia GitHubissa, README:ssä tai demossa

Työjärjestelmien rakenteita ja logiikkaa voidaan käyttää vain idean ja layoutin hahmottamiseen.

---

## Teknologiat

- React
- Vite
- JavaScript
- Leaflet
- React-Leaflet
- CSS
- GitHub
- GitHub Pages

---

## Toteutettu tähän mennessä

- React + Vite -projekti
- Leaflet-kartta
- reittiviiva kartalla
- kaupunkipohjainen etäisyyslaskenta
- ETA-laskenta
- EU-ajoaikalogiikka:
  - 4h30 ajo → 45 min tauko
  - 9h päivittäinen ajoaikaraja
- vetäjäkohtainen ajoaika tänään
- statuslogiikka:
  - OK
  - Break required
  - Risk
- dynaaminen event log
- klassinen TMS/SAP/EVO-tyylinen desktop layout
- theme-valitsin:
  - classic
  - light
  - dark
- GitHub Pages deploy toimii

---

## Nykyinen layout

Yläosa:

- Lastaus
- Purku
- Kalusto
- Ajotiedot

Alaosa:

- Kartta
- Suunnitelman huomautukset
- Ajotiedot oikealla

---

## Theme-päätös

FleetFlow Plannerissa pidetään kolme theme-vaihtoehtoa:

### classic

Nykyinen TMS/EVO-henkinen oletusteema.

### light

SAP-henkinen beige/harmaa business UI. Ei puhdas valkoinen.

UI:ssa light voidaan nimetä:

**SAP Light**

Koodissa theme-arvo pysyy:

```js
light
```

Tulevan light-teeman tavoitesävyt:

```css
--bg-main: #f3efe7;
--panel-bg: #fbf8f1;
--panel-header: #e6ded2;
--border: #c9bfb0;
--text-main: #1f2933;
--text-muted: #6b7280;
--accent: #0a6ed1;
```

### dark

Moderni tumma control room -teema.


===================================================================================
Koodimuutosten ohje jatkoa varten
===================================================================================

Kun tehdään koodimuutoksia, käytetään aina rakennetta:

ETSI TÄMÄ KOHTA
LISÄÄ TÄMÄ TÄMÄN JÄLKEEN / ENNEN
KOPIOI TÄMÄ KOODI

Aina annetaan pieni edeltävä koodinpätkä tai ankkuri, jotta muutoskohta löytyy varmasti.

Ei korvata koko sovellusta, ellei ole pakko.

Edetään pienissä, turvallisissa vaiheissa.

## Step 3.3 — Daily Capacity Summary

Yläosan oikeaan tyhjään kohtaan lisättiin uusi paneeli:

**Daily Capacity**

Paneelin tarkoitus on näyttää päivän kapasiteettitilanne nopeasti liikennesuunnittelijan näkökulmasta.

Nykyinen yläosan layout:

- Lastaus
- Purku
- Kalusto
- Daily Capacity

Näytettävät KPI:t:

- Jobs today
- Assigned
- Open
- Risk
- Break required
- Trucks in use

Laskenta tehdään `dailyJobs`-datasta:

- totalJobs = kaikki päivän keikat
- assignedJobs = keikat, joissa truck ei ole `Unassigned`
- openJobs = keikat, joissa status on `Open`
- riskJobs = keikat, joissa status on `Risk`
- breakRequiredJobs = keikat, joissa status on `Break required`
- trucksInUse = uniikit käytössä olevat vetäjät, pois lukien `Unassigned`

Toteutustapa:

- ei lisätty uutta statea
- KPI-arvot johdetaan `dailyJobs`-datasta
- valittu keikka ei vielä ohjaa karttaa, ETA:a tai ajoaikalogiikkaa
- nykyinen TMS/SAP/EVO-tyylinen desktop-layout säilytettiin
- paneeli täyttää yläosan oikean tyhjän tilan

Status: tehty Codexilla.

Build:

```text
npm run build passed
```

---

## Step 7.1A.1 - Board Daily Traffic Overview layout fix

Board-valilehti on nyt tiivis Daily Traffic Overview -nakyma.

Toteutettu rakenne:

- vasen control-sarake:
  - Daily Capacity
  - Selected Job
  - Operational Notes
- oikea levea traffic-sarake:
  - Day Status / Workload / Fleet Status
  - Daily Traffic Plan
  - Fleet Preview

Tarkea layout-korjaus:

- Daily Traffic Plan ei enaa odota vasemman Daily Capacity -paneelin korkeutta.
- Board jaettiin kahteen itsenaiseen pystysarakkeeseen:
  - `.board-control-column`
  - `.board-traffic-column`
- Daily Traffic Plan alkaa suoraan oikean ylarivin KPI-paneelien alareunan alta.
- Daily Traffic Planin korkeutta kasvatettiin oikean traffic-sarakkeen keskialueessa.
- Pitkat listat scrollaavat paneelien sisalla:
  - Daily Traffic Plan
  - Fleet Preview
  - Operational Notes

Boardin KPI-rivi:

- Daily Capacity pysyy vasemmalla ylhaalla.
- Day Status, Workload ja Fleet Status ovat oikean traffic-sarakkeen ylarivilla.
- Day Status / Workload / Fleet Status pidetaan kompakteina, ilman turhaa alatyhjaa.

Selected Job:

- Sijainti: vasemmassa control-sarakkeessa Daily Capacityn alla.
- Kayttaa 2-column summary -rakennetta.
- Sisaltoa ei leikata normaalissa desktop-nakymassa.

Operational Notes:

- Sijainti: vasemmassa control-sarakkeessa Selected Jobin alla.
- Muutettu Board-tason bullet-listaksi.
- Ei kayteta 01 / 02 / 03 event-log-numerointia.
- Ei ole Job Planning Log eika Fleet Event Log.

Fleet Preview:

- Sijainti: oikeassa traffic-sarakkeessa Daily Traffic Planin alla.
- Kevyt Board-yhteenveto, ei taytta Fleet Timelinea.
- Assigned truck -kortit kayttavat responsiivista gridia.
- TR-101 ja TR-102 voivat nakya rinnakkain, jos tila riittaa.
- Unassigned nakyy omana taysleveana korttinaan.
- Korttien tekstit on jaettu header- ja next-riveihin, jotta tekstit eivat mene paallekkain.

Sailytykset ja rajaukset:

- Ei muutoksia Job-valilehteen.
- Ei muutoksia Fleet-valilehteen.
- Ei muutoksia Route & Risk -valilehteen.
- Ei muutoksia dailyJobs-demodataan.
- Ei muutoksia ETA-, route/map- tai EU driving time -logiikkaan.
- Ei Check Plania, Suggested Plania, Accept/Reject-toimintoja tai Additional Truck Needed -algoritmia Boardiin.
- Reset demo plan -logiikka sailyi.
- Theme-rakenne sailyi:
  - classic
  - light / SAP Light
  - dark

Muokatut tiedostot:

- `src/App.jsx`
- `src/App.css`

Verifiointi:

```text
npm run lint passed
npm run build passed
```

---

## Step 6.2 — Fleet Timeline / Truck Sequences View

Fleet-välilehdelle lisättiin autokohtainen päivän job sequence -näkymä.

Fleet näyttää jokaisen käytössä olevan truckin jobit kronologisesti `loadingTime`-ajan mukaan.

Näkymässä näytetään:

- truck
- jobien määrä
- aika
- job id
- reitti
- handlingType ja handlingDurationMinutes
- status

Unassigned-jobit jätetään Fleet sequence -listauksen ulkopuolelle, koska niitä ei ole vielä osoitettu truckille.

Fleet-näkymässä job-korttia klikkaamalla:

- selectedJobId päivittyy
- planner-state synkataan valitusta jobista samalla `syncPlannerStateFromJob`-helperillä kuin Board-näkymässä

Tässä vaiheessa ei muutettu:

- Board-näkymän nykyistä planner-logiikkaa
- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- assign truck -logiikkaa
- reset-toimintoa
- Event Log -logiikkaa
- theme-järjestelmää

Build:

```text
npm run lint passed
npm run build passed
```

---

## Step 6.1 — Cockpit Navigation Shell

FleetFlow Planneriin lisättiin cockpit-päävälilehtien runko.

Lisättiin uusi state:

- workspaceTab

Päävälilehdet:

- Board
- Job
- Fleet
- Route & Risk

Board on oletusnäkymä ja näyttää nykyisen toimivan planner-layoutin.

Job, Fleet ja Route & Risk ovat tässä vaiheessa kevyitä placeholder-näkymiä tulevia kehitysvaiheita varten.

Tässä vaiheessa ei vielä siirretty toiminnallisuuksia eri näkymiin.

Tavoite oli valmistella FleetFlow Plannerin uusi cockpit-rakenne:

- Board = päivän yleisnäkymä
- Job = valitun jobin tarkempi työtila
- Fleet = autokohtainen päivän eteneminen ja tuleva plan check
- Route & Risk = kartta, Event Log ja tulevat riskivaroitukset

Tässä vaiheessa ei muutettu:

- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- assign truck -logiikkaa
- reset-toimintoa
- Event Log -logiikkaa
- theme-järjestelmää

Build:

```text
npm run lint passed
npm run build passed
```

---

## Step 5.3.3 — SAP-style Details Tabs

Ajotiedot / tulos -paneeli muutettiin SAP-/TMS-tyyliseksi välilehtipaneeliksi.

Lisättiin uusi state:

- detailsTab

Välilehdet:

- Driving
- Job Preview
- Assignment

Driving-tab sisältää nykyiset ajo- ja tulostiedot, kuten:

- status
- etäisyys
- ajoaika
- kuljettajan ajo tänään
- ajo yhteensä
- tauko
- kokonaisaika
- ETA

Job Preview -tab sisältää valitun jobin preview-tiedot, kuten:

- Job ref
- Driver hours today
- Route driving time
- Handling, jos handling-kentät ovat käytössä
- Total after job
- Preview status

Assignment-tab sisältää assign truck -toiminnon Open-jobille.

Jos job ei ole Open, Assignment-tab näyttää locked-tyylisen viestin, että valitulla jobilla on jo truck.

Tavoite:

- vähentää Ajotiedot-paneelin pituutta
- välttää turhaa scrollia
- tehdä UI:sta enemmän SAP-/TMS-tyylinen
- säilyttää kaikki nykyiset laskennat ja toiminnallisuudet ennallaan

Tässä vaiheessa ei muutettu:

- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- assign truck -toiminnon peruslogiikkaa
- reset-toimintoa
- Event Log -logiikkaa
- theme-järjestelmää

Build:

```text
npm run build passed
```

---

## Step 5.3.2 — Add Handling Type and Duration

Lisättiin dailyJobs-demodataan geneerinen käsittelyvaihe ja arvioitu käsittelykesto.

Tausta:

Kaikki jobit eivät ole perinteisiä lastauksia, vaan työvaihe voi olla esimerkiksi:

- lastaus
- purku
- trailerin nouto
- trailerin jättö satamaan
- tyhjän kärryn palautus
- vaihtopisteellä kytkentä
- satamasta nouto
- satamaan vienti

Lisättiin kentät:

- handlingType
- handlingDurationMinutes

Käytetyt handlingType-arvot:

- Loading
- Unloading
- Trailer pickup
- Trailer drop
- Empty return
- Trailer exchange
- Port pickup
- Port drop

Demoarvioina käytetään esimerkiksi:

- Loading: 45 min
- Unloading: 45 min
- Trailer pickup: 20 min
- Trailer drop: 20 min
- Empty return: 20 min
- Trailer exchange: 25 min
- Port pickup: 25 min
- Port drop: 25 min

Handling näkyy nyt:

- Selected Job -kortissa
- Ajotiedot-paneelin selected job preview -osiossa

Tässä vaiheessa handlingDurationMinutes on informatiivinen kenttä.

Sitä ei vielä lisätty ajoaika- tai feasibility-laskentaan.

Step 5.4 voi myöhemmin käyttää handlingDurationMinutes-arvoa location/time feasibility -tarkistuksessa.

Tässä vaiheessa ei muutettu:

- ajoaikalogiikkaa
- ETA-laskennan peruslogiikkaa
- karttalogiikkaa
- getTruckScheduleFeasibility-logiikkaa
- assign truck -toiminnon peruslogiikkaa
- reset-toimintoa
- themejä

Build:

```text
npm run build passed
```

---

## Step 5.3.1 — Multi-job Truck Sequence Demo Scenario

Lisättiin realistisempi multi-job truck sequence -demodata ennen Route Continuity / Location Feasibility -logiikkaa.

Tavoite:

- testata samaa truckia usealla päivän jobilla
- kuvata realistisempaa liikennesuunnittelun ketjua
- valmistella Step 5.4 Route Continuity / Location Feasibility Warning -vaihetta

Demossa on noin 10 jobia ja kaksi truckia:

- TR-101
- TR-102

Molemmilla truckeilla on useita peräkkäisiä päivän jobeja.

Demo sisältää:
- aamulastauksia
- lastattujen kärryjen vientiä satamaan
- paluukärryjä terminaaliin
- terminaalista lastattuja kärryjä Vuosaareen
- Vuosaaresta maahan tulleita kärryjä asiakaspurkuun
- tyhjän kärryn palautuksia terminaaliin

Lisättiin demoterminaali:

- Name: FleetFlow Demo Terminal BP
- UI name: Demo Terminal BP
- Area: Tuupakka, Vantaa
- Demo address: Demoportti 1, 01740 Vantaa
- Role: oma terminaali / trailer yard / vaihtopiste / thermo-rivi

Demo käyttää vain keksittyjä asiakas-, job-, terminaali- ja sijaintitietoja.

Tässä vaiheessa ei lisätty uutta optimointilogiikkaa.

Tässä vaiheessa ei muutettu:

- ajoaikalogiikkaa
- karttalogiikan perusperiaatetta
- ETA-laskennan peruslogiikkaa
- assign truck -toiminnon peruslogiikkaa
- reset-toimintoa
- actionFeedbackType-logiikkaa
- themejä

Build:

```text
npm run build passed
```

---

## Step 5.3 — Truck Schedule Feasibility Warning

Truck conflict -ajattelua korjattiin realistisemmaksi.

Aiempi yksinkertainen tulkinta "sama truck on jo toisella jobilla" ei ole yksinään virhe, koska sama truck voi tehdä päivän aikana useita peräkkäisiä jobeja.

Uusi tulkinta:

- sama truck saa olla usealla päivän jobilla
- järjestelmä tekee kevyen sequence / feasibility -tarkistuksen
- warning annetaan vain, jos aikataulu näyttää päällekkäiseltä tai liian tiukalta

Lisättiin kevyt apulogiikka:

- parseTimeToMinutes
- getTruckScheduleFeasibility

Feasibility check tarkistaa:

- onko samalla truckilla muita päivän jobeja
- meneekö uusi job ajallisesti päällekkäin olemassa olevan jobin kanssa
- onko lähimmän edellisen tai seuraavan jobin väli alle 45 minuuttia
- jos truckilla on muita jobeja mutta ei selvää ongelmaa, näytetään sequence check -viesti

Feedback-tyypit:

- clear assignment → success
- sequence check ilman selvää ongelmaa → success
- overlap tai alle 45 min väli → warning
- reset → info

Tässä vaiheessa warning ei estä assignausta.

Tämä on edelleen warning-only -malli.

Tässä vaiheessa ei lisätty:

- assignauksen estoa
- tarkkaa siirtymäaikalaskentaa sijaintien välillä
- optimointialgoritmia
- drag & dropia
- backendia
- localStoragea

Build:

```text
npm run build passed
```

---

## Step 5.2 — Conflict Warning UI Polish

Action feedback -viestien visuaalista erottelua parannettiin.

Lisättiin uusi state:

- actionFeedbackType

Sallitut feedback-tyypit:

- success
- warning
- info

Käyttö:

- onnistunut truck assignment → success
- truck conflict warning → warning
- reset demo plan → info

UI käyttää nyt luokkia:

- action-feedback success
- action-feedback warning
- action-feedback info

Conflict ei tässä vaiheessa estä assignausta.

Toteutus pysyy edelleen warning only -mallissa:

- Open job voidaan assignata myös truckille, joka on jo toisella jobilla
- käyttäjälle näytetään selkeä warning-tyylinen palaute
- actionFeedback näkyy myös Event Login ensimmäisenä viestinä nykyisen logiikan kautta

Tässä vaiheessa ei lisätty:

- toast-kirjastoa
- ulkoisia dependencyjä
- automaattista timeoutia
- assignauksen estoa
- optimointialgoritmia
- backendia
- localStoragea

Build:

```text
npm run build passed
```

---

## Step 5.1 — Truck Availability / Conflict Check

Lisättiin kevyt truck availability / conflict check -logiikka assign-toimintoon.

Kun Open-keikalle osoitetaan truck, järjestelmä tarkistaa, onko sama truck jo käytössä toisella päivän jobilla.

Conflict-tarkistus:

- sama truck löytyy dailyJobs-listasta
- job.id ei ole sama kuin valittu job
- truck ei ole Unassigned

Tässä vaiheessa conflict ei estä assignausta.

Toteutus on warning only:

- assign tehdään edelleen
- Open → OK toimii kuten ennen
- actionFeedback näyttää varoituksen, jos sama truck on jo toisella jobilla
- warning näkyy myös Event Logissa, koska actionFeedback lisätään Event Login alkuun

Esimerkkivaroitus:

- Warning: TR-101 is already assigned to FFL-2026-001. TR-101 assigned to FFL-2026-004.

Jos conflictia ei ole, palaute pysyy normaalina:

- Truck TR-104 assigned to FFL-2026-004.

Tässä vaiheessa ei lisätty:

- assignauksen estoa
- aikataulujen päällekkäisyyslaskentaa
- optimointialgoritmia
- backendia
- localStoragea
- drag & dropia

Build:

```text
npm run build passed
```

---

## Step 4.2 — Theme QA & Visual Consistency Pass

Tehtiin visuaalinen QA- ja consistency-pass kaikille kolmelle teemalle:

- classic
- SAP Light
- dark

Tarkistettiin:

- kontrastit
- paneelien luettavuus
- taulukon luettavuus
- status-pillien värit
- input/select/button-tyylit
- Daily Capacityn mahtuminen
- Selected Jobin borderit
- Event Login luettavuus
- karttapaneelin ympäristö
- action feedbackin näkyvyys

Tavoite:

- kaikki teemat ovat käyttökelpoisia
- SAP Light pysyy beige/harmaa business UI -tyylisenä
- classic ja dark eivät rikkoudu
- Step 3:n toiminnallisuudet pysyvät ennallaan
- layout pysyy tiiviinä TMS/SAP/EVO-tyylisenä desktop plannerina

Tässä vaiheessa ei lisätty uusia ominaisuuksia.

Tässä vaiheessa ei muutettu:

- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- assign truck -toimintoa
- reset-toimintoa
- Event Log -logiikkaa

Build:

```text
npm run build passed
```

---

## Step 4.1 — SAP Light Theme Polish

Light-teema viimeisteltiin SAP-henkiseksi beige/harmaa business UI -teemaksi.

Theme-päätös:

- koodissa theme-arvo pysyy edelleen `light`
- käyttäjälle näkyvä label voi olla `SAP Light`

Light-teeman tavoitesävyt:

```css
--bg-main: #f3efe7;
--panel-bg: #fbf8f1;
--panel-header: #e6ded2;
--border: #c9bfb0;
--text-main: #1f2933;
--text-muted: #6b7280;
--accent: #0a6ed1;
```

Light-teeman paneelit, inputit, selectit, napit, taulukko, Daily Capacity, Selected Job ja Event Log sovitettiin beige/harmaa business UI -ilmeeseen.

Tässä vaiheessa ei muutettu:

- React-logiikkaa
- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- assign truck -toimintoa
- reset-toimintoa
- Step 3:n toiminnallisuuksia

Build:

```text
npm run build passed
```

---

## Step 3.10 — Demo Action Feedback

Lisättiin käyttäjätoimintojen palaute demoon.

Uusi actionFeedback-state näyttää viimeisimmän käyttäjän tekemän toiminnon.

Palaute näytetään Daily Capacity -paneelin yhteydessä ja lisätään myös Event Login alkuun.

Assign truck -toiminnon jälkeen palaute kertoo esimerkiksi:

- Truck TR-104 assigned to JOB-004.

Reset demo plan -toiminnon jälkeen palaute kertoo:

- Demo plan reset to initial state.

Tavoite:

- käyttäjä näkee heti, että toiminto onnistui
- demo tuntuu viimeistellymmältä
- Event Log näyttää myös käyttäjän tekemän viimeisimmän toiminnon

Tässä vaiheessa ei lisätty:

- toast-kirjastoa
- ulkoisia dependencyjä
- automaattista timeoutia
- localStoragea
- backendia
- monimutkaista logihistoriaa

Tässä vaiheessa ei muutettu:

- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- Daily Traffic Planin rakennetta
- Selected Job -kortin rakennetta

Build:

```text
npm run build passed
```

---

## Step 3.9.2 — Selected Job Status Border Fix

Korjattiin Selected Job -kortin Status-rivin alaviiva, joka katkesi status-pill:n kohdalla tai ennen oikeaa reunaa.

Korjaus tehtiin CSS-only -muutoksena.

Tavoite:
- Selected Job -rivien alaviivat jatkuvat koko rivin leveydelle
- Status-pill pysyy oikeassa reunassa
- Selected Job -kortti pysyy tiiviinä
- sisäistä scrollia ei palautettu

Tässä vaiheessa ei muutettu:
- React-logiikkaa
- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- Daily Traffic Plania

Build:

```text
npm run build passed
```

---

## Step 3.9.1 — Daily Capacity Layout Fix

Korjattiin layout-ongelma, jossa Daily Capacity -paneelin sisältö valui seuraavan rivin / Daily Traffic Plan -alueen päälle Step 3.9:n Reset demo plan -painikkeen lisäämisen jälkeen.

Korjaus tehtiin CSS/layout-tasolla.

Tavoite:

- Daily Capacity näkyy kokonaan yläosan oikeassa paneelissa
- Reset demo plan -painike näkyy kokonaan
- Daily Capacity ei mene Daily Traffic Plan -alueen päälle
- Daily Traffic Plan pysyy luettavana
- Selected Job pysyy näkyvänä ilman sisäistä scrollia
- desktop TMS/SAP/EVO-tyylinen tiivis layout säilyy

Tässä vaiheessa ei muutettu:

- React-logiikkaa
- dailyJobs-dataa
- ajoaikalogiikkaa
- karttalogiikkaa
- ETA-laskentaa
- assign truck -toimintoa
- reset-toimintoa

Build:

```text
npm run build passed
```

---

## Step 3.9 — Reset Demo Plan

Lisättiin demo-reset-toiminto, jolla päivän suunnitelma voidaan palauttaa alkuperäiseen demotilaan ilman selaimen refreshiä.

Reset-toiminto palauttaa:

- dailyJobs takaisin initialDailyJobs-dataan
- selectedJobId ensimmäiseen demojobiin
- selectedAssignTruck oletusarvoon TR-101

Reset-toiminnon tarkoitus on parantaa portfolio-demon käytettävyyttä, koska Step 3.8 lisäsi interaktiivisen toiminnon:

- Open job → assign truck → update dailyJobs

Reset-painike lisättiin käyttöliittymään tiiviinä TMS/SAP/EVO-tyylisenä toimintona.

Resetin jälkeen nykyinen selectedJob → planner state -logiikka päivittää automaattisesti:

- loadingCity
- unloadingCity
- tractor
- trailerType
- loadRef

Tässä vaiheessa ei lisätty:

- localStoragea
- backendia
- optimointialgoritmia
- confirm-dialogia
- isoa layout-muutosta

Build:

```text
npm run build passed
```

---

## Step 3.8 — Assign Open Job to Truck

Lisättiin ensimmäinen varsinainen planner-toiminto:

Open job → assign truck → update dailyJobs

Open-statuksella olevalle keikalle voidaan nyt osoittaa vetäjä dropdownista.

Toteutus:

- dailyJobs muutettiin tarvittaessa stateksi
- lisättiin availableTrucks-lista
- lisättiin selectedAssignTruck-state
- lisättiin handleAssignTruckToSelectedJob-funktio
- Assign-toiminto näkyy vain Open-keikalle
- Assign päivittää valitun jobin:
  - truck: "Unassigned" → valittu truck
  - status: "Open" → "OK"
  - driverHoursToday: 0

Vaikutukset:

- Daily Capacity päivittyy dailyJobs-datan perusteella
- Selected Job päivittyy
- Kalusto-paneeli päivittyy
- Ajotiedot preview päivittyy
- Event Log päivittyy selectedJob- ja preview-logiikan kautta

Tässä vaiheessa ei lisätty:

- drag & dropia
- optimointialgoritmia
- backendia
- localStoragea
- monimutkaista truck availability -logiikkaa

Build:

```text
npm run build passed
```

---

## Step 3.7 — Job-specific Event Log Messages

Event Log laajennettiin reagoimaan valittuun Daily Traffic Plan -keikkaan.

Event Log näyttää nyt selectedJob-kohtaisia operatiivisia huomautuksia, kuten:

- valittu keikka ladattu planneriin
- valittu reitti
- osoitettu vetäjä
- trailerityyppi
- driver time preview -tulkinta

Open-keikalla Event Log kertoo:

- keikka on avoin
- vetäjää ei ole osoitettu
- dispatch planning vaatii vetäjän osoittamisen
- ajoaika-preview odottaa vetäjää

Break required -tilassa Event Log huomauttaa taukosuunnittelun tarpeesta.

Risk-tilassa Event Log huomauttaa riskirajan ylittymisestä ja kehottaa tarkistamaan ajoajat tai vaihtoehtoisen vetäjän.

OK-tilassa Event Log kertoo, että valittu keikka on ajoaikojen puolesta suunnitelluissa rajoissa.

Tässä vaiheessa ei muutettu:

- ajoaikasääntöjä
- karttalogiikkaa
- ETA-laskennan peruslogiikkaa
- Daily Traffic Planin rakennetta
- Selected Job -kortin scroll- tai korkeuslogiikkaa

Build:

```text
npm run build passed
```

---

## Step 3.6 — Job-specific Driver Time Preview

Ajotiedot-paneeliin lisättiin valitun Daily Traffic Plan -keikan ajoaika- ja riskiesikatselu.

dailyJobs-dataan lisättiin job-kohtainen kenttä:

- driverHoursToday

Preview näyttää valitulle keikalle:

- Job ref
- Driver hours today
- Route driving time
- Total after job
- Preview status

Preview käyttää samoja perussääntöjä kuin nykyinen ajoaikalogiikka:

- yli 9 h → Risk
- yli 4 h 30 min → Break required
- muuten → OK
- Open-keikka pysyy statuksella Open

Tämä on vain valitun keikan esikatselu.

Tässä vaiheessa ei muutettu:

- varsinaisia ajoaikasääntöjä
- karttalogiikkaa
- ETA-laskennan peruslogiikkaa
- Daily Traffic Planin rakennetta
- Selected Job -kortin scroll- tai korkeuslogiikkaa

Build:

```text
npm run build passed
```

---

## Step 3.5 — Selected Job Data Quality & Planner Consistency

Daily Traffic Plan -demodata yhtenäistettiin, jotta Selected Job, Daily Capacity ja plannerin perustiedot käyttävät samoja kenttiä ja samoja status-arvoja.

Jokaisella dailyJobs-rivillä on vähintään seuraavat kentät:

- id
- flow
- type
- customer
- originCity
- destinationCity
- loadingTime
- deliveryTime
- truck
- trailerType
- status

Sallitut status-arvot ovat:

- OK
- Break required
- Risk
- Open

Open-keikan truck-arvo pidetään muodossa:

- Unassigned

Assigned-keikoilla truck-arvo on keksitty vetäjätunnus, esimerkiksi:

- TR-101
- TR-102
- TR-103

Daily Capacity -laskenta perustuu edelleen dailyJobs-dataan:

- totalJobs = dailyJobs.length
- assignedJobs = truck !== "Unassigned"
- openJobs = status === "Open"
- riskJobs = status === "Risk"
- breakRequiredJobs = status === "Break required"
- trucksInUse = uniikit truck-arvot ilman Unassigned-arvoa

Tässä vaiheessa ei muutettu:

- ajoaikalogiikan sääntöjä
- karttalogiikkaa
- ETA-laskennan peruslogiikkaa
- layoutia

Build:

```text
npm run build passed
```

---

## Step 3.4 — Connect Selected Job to Planner State

Valittu Daily Traffic Plan -rivi yhdistettiin plannerin perustietoihin.

Kun käyttäjä valitsee eri keikan, seuraavat arvot päivittyvät:

- selectedJob.originCity → loadingCity
- selectedJob.destinationCity → unloadingCity
- selectedJob.truck → tractor
- selectedJob.trailerType → trailerType
- selectedJob.id → loadRef

Toteutus tehtiin useEffectillä, joka kuuntelee selectedJob-muutosta.

Tämän seurauksena nykyiset kartta-, reittiviiva-, ETA- ja ajotietologiikat voivat päivittyä nykyisten planner-statejen kautta.

Ajoaikalogiikkaa ei vielä muutettu selectedJob-kohtaiseksi.

Build:

```text
npm run build passed
```

---

### Selected Job card scroll fix

Selected Job -korttiin oli aiemmassa CSS-korjauksessa tullut sisäinen scrollbar.

Tämä korjattiin CSS-only -muutoksena.

Muutokset:

- `.selected-job-card` overflow muutettiin `auto` → `visible`
- Daily Traffic Plan -gridirivin korkeus nostettiin 230px → 250px
- bottom row min-height pienennettiin 240px → 220px

Tavoite:

- Selected Job -kortti näyttää kaikki rivit ilman sisäistä scrollia
- layout pysyy tiiviinä desktop planner -näkymänä
- ei muutoksia logiikkaan, karttaan, ETA:an tai ajoaikalaskentaan

Build:

```text
npm run build passed
```

---

### Selected Job status visibility fix

Selected Job -kortista puuttui Status-rivi sen jälkeen, kun sisäinen scroll poistettiin.

Korjaus tehtiin CSS-only -muutoksena.

Tulos:

- Selected Job -kortissa näkyvät nyt kaikki rivit:
  - Flow
  - Type
  - Customer
  - Route
  - Time
  - Truck
  - Status
- Status-pill, esimerkiksi OK, näkyy ilman sisäistä scrollia
- kortti pysyy tiiviinä ja TMS/SAP/EVO-tyylisenä

Build:

Build:

```text
npm run build passed
```
---

## Step 7.1B — Board 3-Column Cockpit Layout

Board-välilehti on päivitetty 3-column cockpit -rakenteeseen.

Toteutettu rakenne:

```text
Board
├── Left Control Column
│   ├── Daily Capacity
│   └── Board Detail Panel
│       ├── Selected Job
│       └── Operational Notes
│
├── Center Status Column
│   ├── Day Status
│   ├── Workload
│   ├── Fleet Status
│   └── Next Attention
│
└── Right Operations Column
    ├── Daily Traffic Plan
    └── Fleet Preview

---

### Boardin pääidea

Board on päivän yleisnäkymä.

Board vastaa kysymykseen:

**Mikä on päivän tilanne juuri nyt?**

Board ei ole syvä editointinäkymä eikä Fleet-tason plan validation -näkymä. Sen tehtävä on näyttää nopeasti:

- päivän kapasiteetti
- päivän jobit
- valittu job
- avoimet assignmentit
- fleetin kevyt tilanne
- seuraava huomiota vaativa asia

### Left Control Column

Vasemmassa sarakkeessa ovat:

- Daily Capacity
- Board Detail Panel

Daily Capacity näyttää:

- Jobs today
- Assigned
- Open
- Risk
- Break required
- Trucks in use
- Reset demo plan -painike
- actionFeedback, jos käyttäjä on tehnyt toiminnon

Board Detail Panel sisältää sisäiset tabit:

- Selected Job
- Operational Notes

Vain toinen näkyy kerrallaan.

Tämä ratkaisu korvaa aiemman mallin, jossa Selected Job ja Operational Notes olivat yhtä aikaa erillisinä ahtaissa paneeleissa.

### Board Detail Panel — Selected Job

Selected Job näyttää valitun jobin tiiviinä 2-column summary -rakenteena.

Näytettävät tiedot:

- Job ref
- Flow
- Type
- Customer
- Route
- Time
- Truck
- Trailer
- Status
- Handling

Selected Job käyttää placeholder-tekstejä, jos jokin arvo puuttuu.

Esimerkkejä:

- `No job ID`
- `Flow TBD`
- `Type TBD`
- `Unknown customer`
- `Unknown origin`
- `Unknown destination`
- `Time TBD`
- `Trailer TBD`
- `Status unknown`
- `Handling not set`

### Board Detail Panel — Operational Notes

Operational Notes on Board-tason bullet-lista.

Se ei ole Job Planning Log eikä Fleet Event Log.

Nykyinen sisältö muodostuu `boardOperationalNotes`-logiikasta.

Operational Notes näyttää esimerkiksi:

- viimeisin käyttäjän actionFeedback
- valittu job ladattu
- avoimet jobit
- break planning -jobit
- risk jobit
- käytössä olevat truckit
- muistutus käyttää Fleet-välilehteä Check Plania varten
- demo reset -status

Nykyinen Operational Notes on teknisesti toimiva, mutta sisältö on vielä osittain staattinen.

Myöhempi kehitysidea:

Operational Notes jaetaan sisällöllisesti kahteen osaan:

1. Board notes
   - open jobs
   - break jobs
   - risk jobs
   - check plan reminder

2. Selected job notes
   - selected job loaded
   - selected job status
   - truck assignment
   - handling
   - next action

### Center Status Column

Keskisarakkeessa ovat:

- Day Status
- Workload
- Fleet Status
- Next Attention

Day Status näyttää:

- Overall
- Open
- Risk
- Break required

Workload näyttää:

- Total jobs
- Export
- Import
- Other

Fleet Status näyttää:

- Trucks in use
- Unassigned
- Break warnings
- Additional needed

Additional needed on tässä vaiheessa placeholder:

```text
Not checked yet
