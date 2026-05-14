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

## Nykyinen päälayout

FleetFlow Planner käyttää cockpit-rakennetta:

- Board
- Job
- Fleet
- Route & Risk

Board on tällä hetkellä pisimmälle viimeistelty näkymä ja käyttää 3-column cockpit -rakennetta:

- Left Control Column
- Center Status Column
- Right Operations Column

Job-välilehti on seuraava merkittävä kehityskohde. Se muutetaan yhdestä pitkästä lomakkeesta ammattimaiseksi TMS-työtilaksi, jossa on sisäiset välilehdet.

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

Cockpit-rakenne on toteutettu. Board on oletusnäkymä. Fleet-välilehdelle on jo lisätty truck sequence -näkymä. Job-välilehdellä on nykyinen Job Input / Edit -pohjainen rakenne, joka muutetaan seuraavaksi ammattimaiseksi sisäisten välilehtien työtilaksi. Route & Risk on vielä kevyempi kehityskohde.

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
```

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
```

---

## Toimintamalli — ChatGPT suunnittelee, Codex toteuttaa

FleetFlow Planner -projektissa käytetään jatkossa työnjakoa:

- ChatGPT toimii suunnittelijana, arkkitehtina ja sparraajana.
- Käyttäjä ja ChatGPT suunnittelevat ominaisuudet, UI-rakenteet, logiikan ja etenemisjärjestyksen.
- Codex tekee varsinaiset koodimuutokset projektin tiedostoihin.
- ChatGPT antaa Codexille suoraan kopioitavan promptin.
- Codexille annettava prompti sisältää aina selkeän tavoitteen, rajaukset, tiedostot, muutoskohdat ja testausohjeet.
- Koodimuutokset tehdään pienissä, turvallisissa vaiheissa.
- Ei tehdä liian isoja refaktorointeja kerralla, ellei se ole välttämätöntä.
- Ei korvata koko sovellusta, ellei käyttäjä erikseen pyydä.
- Nykyinen toimiva rakenne säilytetään aina mahdollisimman pitkälle.
- Jokaisen vaiheen jälkeen ajetaan vähintään:

```bash
npm run lint
npm run build
```

---

# FleetFlow Planner — Päivitetty konteksti / Trip–Order–Node–Job-malli

## Päivityksen tarkoitus

FleetFlow Plannerin suunta tarkentuu uusien työnkulkujen, kuljetusyhtiöille annettujen ohjeistusesimerkkien ja TMS-/EVO-tyylisten kuvien perusteella.

FleetFlow Planner ei ole pelkkä job-lista, yksittäisen ajon planneri tai karttademo. Se on TMS-henkinen päivittäisen liikennesuunnittelun cockpit, jonka tarkoitus on auttaa liikennekoordinaattoria suunnittelemaan, jakamaan ja tarkistamaan päivän tripit, jobit, trailerisiirrot, lastaukset, purut, terminaalikäynnit, satamatapahtumat ja huolto-/korjaamonodet käytettävissä olevilla vetäjillä ja autoilla.

FleetFlowin ydinkysymys on:

**Saadaanko päivän suunnitellut tripit, purut, lastaukset, trailerisiirrot, terminaalikäynnit, satamatapahtumat ja muut node-tapahtumat hoidettua käytössä olevilla vetäjillä, vai tarvitaanko lisää vetäjiä / autoja?**

---

## Erittäin tärkeä tietosuoja- ja demodatarajaus

Projektissa käytetään aina vain keksittyä demodataa.

Mitään alkuperäistä työdataa ei saa kopioida FleetFlow Planneriin, GitHubiin, README:hen, dokumentaatioon, demodataan tai käyttöliittymään.

Ei saa kopioida suoraan:

- oikeita asiakasnimiä
- oikeita yritysnimiä
- oikeita order-numeroita
- oikeita trip-numeroita
- oikeita unit-/trailer-tunnuksia
- oikeita rekisterinumeroita
- oikeita kuljettajia
- oikeita henkilöitä
- oikeita osoitteita
- oikeita lastaus- tai purkuaikoja
- oikeita yhteystietoja
- oikeita linkkejä
- oikeita satama-, terminaali-, ferry- tai työjärjestelmän tunnuksia
- oikeita työjärjestelmän rivejä
- työnantajan järjestelmäkuvia GitHubissa, README:ssä tai demossa
- tuotantodataa tai muuta työnantajan dataa

TMS-/EVO-tyylisistä kuvista saa käyttää vain yleisiä ideoita ja rakenteita:

- listanäkymien rakenne
- trip/order/capacity/details-ikkunat
- node-/stop-logiikka
- dispatcher board -tyyppinen työskentelymalli
- context menu -toimintojen ideat
- TMS/SAP/EVO-tyylinen tiivis business UI
- tripin, orderin, trailerin, noden ja jobin välinen yleinen logiikka
- suunnitteluprosessin työnkulku

Kaikki FleetFlowin esimerkkidata tehdään fiktiiviseksi.

---

## Päivitetty päätavoite

FleetFlow Planner auttaa liikennekoordinaattoria tarkistamaan, onnistuvatko päivän työt käytössä olevilla vetäjillä, autoilla ja trailereilla.

Ohjelman pitää huomioida:

- ajoajat
- käsittelyajat
- lastaukset
- purut
- trailerin noudot
- trailerin jätöt
- vaihtopisteet
- satama-ajot
- lautta-/ferry-tapahtumat
- terminaalikäynnit
- trailerin sähköön vienti
- trailerin parkkiin vienti
- trailerin vaihto toiselle vetäjälle
- trailerin siirto toiselle kärrylle / uudelleenjärjestely
- trailerin huolto-/korjaamonodet
- tauot
- 4h30 ajon taukoraja
- 9h päivittäinen ajoaikaraja
- sijaintien välinen jatkuvuus
- autokohtaiset job-ketjut
- vetäjäkohtainen kapasiteetti
- ADR-vaatimukset
- GDP-vaatimukset
- lämpötilavaatimukset
- trailerityyppi
- open / risk / not feasible -tilanteet
- lisävetäjän tai lisäauton tarve

---

## FleetFlowin pääprosessi

Päivitetty pääprosessi:

1. Tripit ovat valmiina tai ne luodaan suunnittelua varten.
2. Tripille lisätään order / orderit.
3. Orderien vaatimukset määritellään.
4. Orderit kiinnitetään trailerille / unitille.
5. Tripille määritellään stopit / node-tapahtumat.
6. Tripistä muodostetaan yksi tai useampi jobi.
7. Jobit jaetaan päivän käytössä oleville vetäjille / autoille.
8. FleetFlow tarkistaa, onnistuuko suunnitelma.
9. FleetFlow ilmoittaa riskit ja mahdottomat kohdat.
10. FleetFlow ehdottaa muutoksia, jobien uudelleenjakoa tai lisävetäjää.
11. Coordinaattori hyväksyy tai hylkää ehdotuksen.

---

## Keskeiset käsitteet

### Current plan

Coordinaattorin nykyinen suunnitelma.

Sisältää päivän jobit, niille valitut vetäjät/autot/trailerit ja suunnitellut sequence-ketjut.

### Plan check

Tarkistusajo, jossa FleetFlow arvioi nykyisen suunnitelman toteutettavuuden.

UI:ssa voi olla painike:

- Check plan
- Tarkista
- Validate plan

### Issues

Ohjelman löytämät ongelmat ja riskit.

Esimerkkejä:

- liian pieni buffer
- päällekkäiset jobit
- liian pitkä ajopäivä
- tauko ei mahdu
- 4h30 ajon taukoraja ylittyy
- 9h ajopäiväraja ylittyy
- sijaintisiirtymä ei ole realistinen
- ADR-vaatimus ei täyty
- GDP-vaatimus ei täyty
- väärä trailerityyppi
- trailer ei ole käytettävissä huolto-/korjaamonoden takia
- open job ilman vetäjää
- additional truck needed

### Suggested plan

FleetFlowin ehdottama uusi ajosuunnitelma.

Esimerkkejä:

- siirrä JOB-003 vetäjältä TR-101 vetäjälle TR-102
- muuta jobien järjestystä
- lisää bufferia
- lisää tauko
- lisää TR-103 päivän suunnitelmaan
- jätä trailer Demo Terminaliin ja jatka toisella vetäjällä myöhemmin

### Additional truck needed

FleetFlow toteaa, että nykyiset vetäjät/autot eivät riitä päivän töihin.

Ohjelma ehdottaa lisävetäjän tai lisäauton tarvetta.

### Accept suggestion

Coordinaattori ottaa FleetFlowin ehdotuksen käyttöön.

### Reject suggestion

Coordinaattori hylkää ehdotuksen ja nykyinen suunnitelma säilyy.

---

## Päivitetty käsitemalli

FleetFlowin keskeinen malli on:

**Trip → Orders → Nodes / Stops → Jobs → Assignment → Plan Check**

---

## Order

Order on kuljetustilaus tai tilauksen osa.

Order voi sisältää esimerkiksi:

- order reference
- customer
- pickup location
- delivery location
- pickup date / time
- delivery date / time
- time window
- exact time / flexible time
- weight
- ldm
- pallets
- colli
- goods summary
- temperature requirement
- ADR requirement
- GDP requirement
- trailer requirement
- ferry / port reference
- order status
- planning status
- remarks
- instructions

Order kuuluu tripille.

Yhdellä tripillä voi olla yksi tai monta orderia.

Order voi olla:

- pickup-order
- delivery-order
- import-delivery
- export-pickup
- terminal handling -tyyppinen työ
- osapurku
- lisälastaus
- trailer transfer -tyyppinen tapahtuma

---

## Trip

Trip on kuljetuskokonaisuus.

Trip voi olla valmiiksi olemassa tai coordinaattori voi luoda sen suunnittelua varten.

Trip voi sisältää:

- yhden orderin
- useita ordereita
- yhden asiakkaan orderit
- usean asiakkaan orderit
- yhden pickupin
- useita pickupeja
- yhden deliveryn
- useita deliveryitä
- import-trailerin purun
- export-lastausketjun
- satamatapahtuman
- lauttatapahtuman
- terminaalikäynnin
- trailerin jättämisen sähköön
- trailerin jättämisen parkkiin
- trailerin vaihdon
- trailerin siirron toiselle kärrylle
- trailerin uudelleenjärjestelyn
- huolto-/korjaamonoden
- katsastuksen
- VAK-/ADR-teknisen korjauksen
- kylmäkonehuollon

Trip ei välttämättä ole yhden vetäjän alusta loppuun ajama työ.

Tärkeä periaate:

**Trip on kuljetuskokonaisuus. Job on yhdelle vetäjälle / autolle annettava toteutettava työosuus.**

---

## Node / Stop / Event

Tripille määritellään node-tapahtumat.

Node tarkoittaa fyysistä tai suunnittelullista tapahtumaa tripin ketjussa.

Node voi olla esimerkiksi:

- pickup
- loading
- delivery
- unloading
- port pickup
- port drop
- ferry departure
- ferry arrival
- terminal drop
- terminal pickup
- trailer parked
- trailer plugged to electricity
- trailer exchange
- trailer shift to another unit
- partial unload at demo terminal
- additional loading at demo terminal
- trailer ready for next driver
- workshop visit
- cold unit service
- body repair
- inspection
- ADR / VAK technical repair
- trailer cleaning
- fuel check
- support bar check
- load securing equipment check

Node-tapahtumat eivät ole vain muistiinpanoja, vaan ne vaikuttavat suunnitteluun.

Node voi vaikuttaa:

- aikatauluun
- sijaintiin
- trailerin käytettävyyteen
- vetäjän päivän sequenceen
- jobin alkuun
- jobin päättymiseen
- seuraavan vetäjän mahdollisuuteen jatkaa
- plan check -tulokseen

---

## Job

Job on yhdelle vetäjälle / autolle annettava työosuus.

Yhdestä tripistä voi muodostua:

- yksi job
- kaksi jobia
- useita jobeja

Job voi sisältää:

- yhden noden
- useita nodeja
- yhden pickupin
- useita pickupeja
- yhden deliveryn
- useita deliveryitä
- port pickupin
- port dropin
- trailerin viennin terminaaliin
- trailerin haun terminaalista
- trailerin viennin sähköön
- trailerin jättämisen parkkiin
- trailerin siirron korjaamolle
- trailerin noudon korjaamolta
- osan tripistä, jonka toinen vetäjä jatkaa myöhemmin

Tärkeä periaate:

**Trip voi jatkua, vaikka yksittäisen vetäjän job päättyy.**

---

## Esimerkki: Import-trip

Import-trip voi tulla mantereelta Suomeen lautalla eri satamiin.

Työnkulku voi olla:

1. Trailer saapuu satamaan.
2. Vetäjä hakee trailerin satamasta.
3. Vetäjä kytkee tarvittaessa lämmöt päälle.
4. Trailer viedään asiakkaalle purkuun tai Demo Terminaliin.
5. Trailer voidaan jättää:
   - asiakkaalle
   - Demo Terminaliin
   - sähköön
   - parkkiin
   - toiselle vetäjälle jatkoon
6. Vetäjän job päättyy määriteltyyn nodeen.
7. Toinen vetäjä voi jatkaa myöhemmin samalla trailerilla.

Esimerkkimalli:

    Trip: Import trailer from port to customer area

    Job 1:
    Port pickup → Demo Terminal
    Driver ends job at Demo Terminal

    Job 2:
    Demo Terminal → Customer delivery → Empty trailer back to terminal
    Second driver continues later

---

## Esimerkki: Export-trip / kotimaan lastaus

Kotimaassa voidaan luoda trip suunnittelua varten.

Tripillä voi olla:

- yksi order / yksi asiakas
- monta orderia / yksi asiakas
- monta orderia / monta asiakasta
- yksi lastauspaikka
- useita lastauspaikkoja
- yksi purkupaikka
- useita purkupaikkoja
- osapurku Demo Terminaliin
- lisälastaus Demo Terminalista
- trailerin uudelleenjärjestely
- trailerin shift to another trailer / unit
- vienti satamaan päivän lauttaan

Esimerkkimalli:

    Trip: Domestic export loading

    Job 1:
    Demo Terminal → Customer pickup → Port drop

    Job 2:
    Port → Trailer pickup → Workshop / Terminal

Toinen esimerkki:

    Trip: Multi-order domestic/export trip

    Node 1:
    Pickup customer A

    Node 2:
    Pickup customer B

    Node 3:
    Partial unload at Demo Terminal

    Node 4:
    Additional loading at Demo Terminal

    Node 5:
    Port drop for ferry departure

---

## Tripin luonti / suunnittelun työnkulku

Tripin luonnissa huomioidaan:

1. Trip on valmiina tai se luodaan suunnittelua varten.
2. Coordinaattori lisää orderin / orderit tripille.
3. Order kiinnitetään trailerille / unitille.
4. Orderin vaatimukset määritellään:
   - ADR
   - GDP
   - temperature
   - weight
   - ldm
   - pallets / colli
   - delivery / pickup constraints
5. Tripille lisätään stopit / node-tapahtumat.
6. Jos trip menee ulos Suomesta, lisätään lautta-/ferry-node.
7. Jos trip tulee Suomeen, lisätään port arrival / port pickup -node.
8. Määritellään, mihin vetäjän job päättyy:
   - asiakkaalle
   - satamaan
   - Demo Terminaliin
   - trailer parkkiin
   - sähköpaikalle
   - korjaamolle
   - seuraavalle vetäjälle jatkoon
9. Tripistä muodostetaan yksi tai useampi job.
10. Jobille valitaan vetäjä / truck / trailer / carrier -combination.
11. Tarkistetaan vetäjän ja carrierin kelpoisuudet:
   - ADR
   - GDP
   - mahdolliset muut vaatimukset
12. Hyväksytään suunnitelma tai korjataan sitä.
13. FleetFlow tarkistaa koko päivän planin Fleet-näkymässä.

---

## ADR / GDP / lämpötilavaatimukset

Orderin ja tripin vaatimukset pitää huomioida suunnittelussa.

Orderilla / tripillä voi olla:

- ADR requirement
- GDP requirement
- temperature requirement
- thermo trailer requirement

Assignment-vaiheessa FleetFlow tarkistaa:

- onko vetäjällä ADR-lupa
- onko vetäjä / carrier GDP-kelpoinen
- sopiiko trailerityyppi lämpötilavaatimukseen
- onko valittu truck/trailer/driver/carrier-combination sallittu kyseiselle jobille

Tämän hetkinen periaate:

- Kaikki demo-vetäjät osaavat ajaa lämpösäädeltyjä kuljetuksia.
- Thermo tarkistetaan ensisijaisesti trailerityyppiä vasten.
- ADR ja GDP tarkistetaan carrier/truck/driver-combinationia vasten.

Jos ADR- tai GDP-vaatimus ei täyty, FleetFlow ei saa hyväksyä suunnitelmaa sellaisenaan.

Tulos voi olla esimerkiksi:

- OK
- Risk
- Not feasible
- Missing ADR qualification
- Missing GDP qualification
- Wrong trailer type
- Additional qualified driver needed

---

## Trailerin huolto- ja korjaamotapahtumat nodeina

Trailerin huollot ja korjaamot käsitellään tripin omina node-tapahtumina.

Esimerkkejä:

- VTA / kylmäkonehuolto
- Boxfix
- kaapin / runkoseinien korjaus
- katsastus
- VAK / ADR-tekninen korjaus
- trailer inspection
- trailer cleaning
- fuel check
- support bars / load securing equipment check

Nämä vaikuttavat suunnitteluun, koska trailer ei ole normaalisti käytettävissä huolto-/korjaamonoden aikana.

FleetFlowin pitää myöhemmin pystyä näyttämään, jos:

- trailer on huollossa
- trailer ei ehdi seuraavaan jobiin
- trailer pitää hakea korjaamolta ennen seuraavaa tehtävää
- trailerin tekninen tila vaikuttaa ADR/GDP/thermo-käyttöön
- trailerin käyttö vaatii tarkistuksen ennen lähtöä

---

## Kuljetusyhtiöille annettavien ohjeiden vaikutus FleetFlowiin

Käyttäjän antamat ohjeistusesimerkit osoittavat, että yhdelle autolle / vetäjälle annettava päivän ohjelma voi sisältää monta peräkkäistä tehtävää.

Esimerkkityyppisiä tehtäviä:

- hae trailer satamasta
- kytke lämmöt päälle
- tarkista löpötilanne
- tarkista tukitangot
- aja asiakkaalle purkuun
- palauta tyhjä trailer terminaaliin
- hae toinen trailer
- vie trailer sähköön
- hae kolmas trailer
- aja purkuun
- aja lastaukseen
- vie lastattu trailer satamaan
- ilmoita ETA
- odota jatko-ohje
- jatka seuraavana päivänä uuteen lastaukseen

Tästä seuraa FleetFlowin kannalta tärkeä vaatimus:

**FleetFlowin pitää pystyä muodostamaan vetäjäkohtainen päivän sequence useista jobeista, nodeista ja tripeistä.**

Instructions-näkymän pitää myöhemmin pystyä koostamaan valitusta suunnitelmasta selkeä kuljetusyhtiölle / vetäjälle annettava ajettava ohjelma.

Instructions-sisältö voi perustua:

- tripin tietoihin
- order-listaan
- node-listaan
- lämpötilavaatimuksiin
- ADR/GDP-vaatimuksiin
- trailerin tietoihin
- pickup-/delivery-paikkoihin
- ferry-/port-nodeihin
- terminaali-/parkki-/sähkö-nodeihin
- seuraavaan toimenpiteeseen
- status update -muistutukseen
- ETA-pyyntöön
- lastinsidonta- tai käsittelyhuomioihin

Demossa ei käytetä oikeita linkkejä tai oikeaa työdataa.

---

## TMS-kuvista saadut UI- ja toimintamalli-ideat

Kuvista voidaan poimia yleisiä UI- ja työnkulkuideoita.

### Trip List ja Order List

FleetFlowiin voidaan myöhemmin rakentaa erilliset mutta linkittyvät näkymät:

- Trip List
- Orders on Trip
- Capacity / Details
- Node / Stop list
- Map
- Planning status
- Dispatcher board

Trip-listalta valitaan trip, jonka orderit ja node-tapahtumat näkyvät oikealla, alapuolella tai Job-välilehden sisäisessä näkymässä.

### Capacity Details / Order Details / Trip Details

Trip- tai order-details-näkymässä voidaan näyttää:

- trip reference
- order reference
- customer
- carrier
- truck
- trailer / unit
- pickup location
- delivery location
- pickup time
- delivery time
- time window
- weight
- ldm
- pallets / colli
- temperature
- ADR / GDP
- planning status
- order status
- ferry / port
- remarks
- instructions

### Context menu -toiminnot

TMS-kuvien context menu -rakenteista voidaan ottaa yleisiä toimintoideoita.

Mahdollisia tulevia toimintoja:

- Trip details
- Capacity Details
- Order Details
- Map
- Calculate actual distance
- Route schedule
- Arrange Trip Sequence
- Start Correction
- Close round-trip
- Move to Dispatcher Board
- Create Ferry Report
- Send Instructions
- Change Planning Status
- Toggle ferry booked
- Update order status
- Create report
- Create credit note

Näitä ei tarvitse toteuttaa heti.

Ne kirjataan tuleviksi ideoiksi.

---

## Päävälilehtirakenne

FleetFlow Plannerin päävälilehdet:

- Board
- Job
- Fleet
- Route & Risk

### Board

Board on päivän yleisnäkymä.

Board vastaa kysymykseen:

**Mikä on päivän tilanne juuri nyt?**

Board näyttää:

- Daily Capacity
- Day Status
- Workload
- Fleet Status
- Next Attention
- Daily Traffic Plan
- Fleet Preview
- Selected Job quick summary
- Operational Notes

Boardiin ei lisätä raskasta trip/order-editointia.

Board on nopea operatiivinen cockpit.

### Job

Job on valitun jobin tarkempi työtila.

Job vastaa kysymykseen:

**Mitä valitulle jobille pitää tehdä, mihin tripiin se kuuluu, mitä ordereita se sisältää, mitkä nodet siihen kuuluvat ja onko se ajettavissa valitulla vetäjällä / autolla?**

Job-välilehdellä voidaan näyttää:

- selected job selector
- job overview
- trip summary
- orders on trip
- stops / nodes
- assignment
- instructions
- validation
- planning log

Job ei saa olla vain yksi pitkä lomake.

Jobin sisälle rakennetaan omat sisäiset välilehdet.

### Fleet

Fleet on päivän kapasiteetin ja plan checkin ydinnäkymä.

Fleet vastaa kysymykseen:

**Onnistuuko coordinaattorin tekemä päivän suunnitelma käytössä olevilla vetäjillä?**

Fleet näyttää:

- vetäjäkohtaiset job-sequencet
- truck sequences
- päivän trip/job-ketjut
- open jobs
- risk jobs
- not feasible -tilanteet
- plan check -tulokset
- suggested plan
- additional truck needed
- accept / reject suggestion

Fleet ei ole orderien editointipaikka.

Fleet on kapasiteetin ja toteutettavuuden tarkistusnäkymä.

### Route & Risk

Route & Risk näyttää valitun jobin / tripin reitin ja riskit.

Route & Risk voi myöhemmin näyttää:

- route map
- node sequence
- route continuity
- driving time
- buffer
- break warning
- port / ferry notes
- terminal / workshop nodes
- route risk log
- selected job route summary

Route & Risk ei ole Fleet-tason plan check -näkymä.

---

## Job-välilehden uusi tavoiterakenne

Job-välilehteä ei kannata pitää yhtenä pitkänä Job Input / Edit -lomakkeena.

Parempi rakenne on ammattimainen TMS-tyylinen työtila, jossa on sisäiset välilehdet.

Ehdotettu rakenne:

    Job workspace
    ├── Selected Job / Job selector
    ├── Internal tabs
    │   ├── Overview
    │   ├── Trip & Orders
    │   ├── Stops / Nodes
    │   ├── Assignment
    │   ├── Instructions
    │   └── Validation
    └── Job Planning Log / Validation Log

### Overview

Näyttää valitun jobin tiiviin yhteenvedon:

- job id
- trip id
- customer
- route
- time window
- truck
- trailer
- status
- handling
- next step

### Trip & Orders

Näyttää tripin ja siihen kuuluvat orderit:

- trip id
- trip type
- order list
- customer
- pickup / delivery
- goods summary
- ldm
- kg
- pallets / colli
- temperature
- ADR / GDP badges
- order status
- planning status

### Stops / Nodes

Näyttää tripin fyysiset tapahtumat järjestyksessä:

- port arrival
- port pickup
- pickup
- loading
- delivery
- unloading
- terminal drop
- terminal pickup
- ferry departure
- ferry arrival
- workshop
- inspection
- electricity / parking
- trailer exchange
- continuation by another driver

### Assignment

Näyttää vetäjä / truck / trailer -valinnan:

- carrier
- truck
- trailer
- driver
- ADR capability
- GDP capability
- trailer type
- assignment status
- capability check
- possible warning / not feasible result

### Instructions

Muodostaa kuljetusyhtiölle / vetäjälle selkeän ajo-ohjeen.

Instructions voi sisältää:

- mitä haetaan
- mistä haetaan
- minne viedään
- missä järjestyksessä
- lämpötila
- ADR/GDP-huomio
- sidontaohjeet
- trailerin tarkistus
- portti-/lauttaohjeet
- terminaaliohjeet
- ETA-pyyntö
- status update reminder
- jatko-ohje

Demossa kaikki Instructions-data on fiktiivistä.

### Validation

Näyttää jobin / tripin tarkistuksen:

- onnistuuko tällä vetäjällä
- ajoaika
- taukotarve
- buffer
- ADR check
- GDP check
- trailer type check
- location continuity
- riskit
- ehdotukset
- not feasible -syy

---

## Job Input / Edit -roolin tarkennus

Nykyinen Job Input / Edit ei ole paras päänäkymä Job-välilehdelle.

Se voidaan siirtää:

- omaksi sisäiseksi välilehdeksi
- Assignment/Input-tabin alle
- myöhemmin erilliseksi Add/Edit Job -modaliksi
- myöhemmin Trip Builder / Add Trip -toiminnoksi

Tärkeä periaate:

**Job-välilehden päänäkymä ei saa olla pelkkä lomake, vaan valitun jobin operatiivinen työtila.**

---

## Fleet-välilehden tarkennettu rooli

Fleet-välilehti on plan validation -ydinnäkymä.

Fleet näyttää vetäjäkohtaiset päivän sequence-ketjut.

Esimerkki:

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

Fleetissä pitää näkyä:

- Fleet Timeline
- truck sequences
- truck-kohtaiset job-ketjut
- jobit aikajärjestyksessä
- handling
- status
- Check Plan
- Fleet Event Log
- issues / warnings
- Suggested Plan
- Suggested recovery plan
- Plan Check Result
- Accept suggestion
- Reject suggestion
- Additional Truck Needed

Fleet ei näytä kaikkia order-details-tietoja, vaan keskittyy kapasiteettiin ja plan checkiin.

---

## Board-välilehden nykyinen tavoiterakenne

Board on päivittäisen tilanteen yleisnäkymä.

Boardin rakenne:

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
```

---

Boardissa säilytetään kevyt, nopea cockpit-ajatus.

Board ei ole:

- täysi order management
- trip builder
- raskas editointinäkymä
- Fleet-tason plan check -näkymä
- Route & Risk -analyysinäkymä

Board näyttää nopeasti päivän tilanteen.

---

## Route & Risk -välilehden tavoite

Route & Risk näyttää valitun jobin tai tripin reitti- ja riskikontekstin.

Sisältö voi myöhemmin olla:

- Route Map
- Route Summary
- Route Risk Summary
- Route Risk Log
- node sequence
- origin/destination markerit
- route polyline
- driving time warning
- break warning
- buffer warning
- ferry / port notes
- terminal / workshop nodes
- continuity placeholder

Route & Risk ei sisällä:

- Fleet-tason Check Plania
- Suggested Plania
- Accept / Reject -toimintoja
- Additional Truck Needed -päätöstä
- täyttä Job Details/Edit -lomaketta

---

## README-tavoitelause myöhemmäksi

FleetFlow Planner is a TMS-inspired daily traffic planning cockpit that evaluates whether the available trucks can complete the daily job plan considering driving time, handling time, trailer pickup/drop operations, breaks, locations, ferry and terminal events, order requirements and truck-specific sequences. If the current plan is not feasible, it explains the issues and suggests a better plan or additional truck capacity.

---

## Kehityksen toimintamalli

FleetFlow Plannerin kehitysmalli on seuraava:

1. Käyttäjä ja ChatGPT suunnittelevat rakenteen, logiikan ja UI:n yhdessä.
2. ChatGPT toimii suunnittelijana, arkkitehtina ja Codex-promptien tuottajana.
3. Codex tekee varsinaiset koodimuutokset.
4. ChatGPT antaa käyttäjälle suoraan kopioitavan Codex-promptin.
5. Käyttäjä ajaa promptin Codexissa.
6. Muutokset tehdään pienissä, turvallisissa vaiheissa.
7. Jokainen koodimuutos ohjeistetaan selkeillä ankkureilla.
8. Ei korvata koko sovellusta, ellei se ole välttämätöntä.
9. Jokaisen vaiheen jälkeen ajetaan:
   - npm run lint
   - npm run build

Koodiohjeiden muoto:

    ETSI TÄMÄ KOHTA
    LISÄÄ TÄMÄ TÄMÄN JÄLKEEN / ENNEN
    KOPIOI TÄMÄ KOODI

Aina annetaan pieni edeltävä koodinpätkä tai ankkuri, jotta muutoskohta löytyy varmasti.

---

## Seuraava suositeltu kehitysvaihe

Seuraava järkevä vaihe on Job-välilehden uudelleenrakennus ammattimaiseksi sisäisten välilehtien avulla.

Ehdotettu vaihe:

**Step 8.1 — Job Workspace Internal Tabs**

Tavoite:

- muuttaa Job-välilehti yhdestä pitkästä lomakkeesta ammattimaiseksi TMS-työtilaksi
- erottaa input, trip/order-sisältö, nodes, assignment, instructions ja validation
- valmistella Trip → Orders → Nodes → Jobs -malli
- säilyttää nykyinen selectedJobId-synkka
- säilyttää nykyiset toimivat laskennat ja state-logiikat
- ei lisätä backendia
- ei lisätä oikeaa työdataa
- ei rikota Board-, Fleet- tai Route & Risk -näkymiä

Ensimmäisen vaiheen sisäinen tab-rakenne:

    Job
    ├── Overview
    ├── Trip & Orders
    ├── Stops / Nodes
    ├── Assignment
    ├── Instructions
    └── Validation

Step 8.1 rajaukset:

- ei muuteta Fleetin plan check -logiikkaa
- ei muuteta Boardin 3-column cockpit -rakennetta
- ei muuteta Route & Risk -näkymää
- ei lisätä backendia
- ei lisätä localStoragea
- ei lisätä oikeaa työdataa
- käytetään vain keksittyä demodataa
- nykyinen Job Input / Edit voidaan siirtää sisäiseen tabiin tai korvata kevyellä Job Details / Edit -sisällöllä
- Instructions-tab voi aluksi olla demo-ohjeen preview, ei vielä automaattinen tuotantoviesti
- Validation-tab voi aluksi näyttää nykyiset ajoaika-, tauko-, ADR/GDP- ja trailer-check -placeholderit

---

## Tiivistetty projektin suunta

FleetFlow Plannerin ydin on:

**Trip → Orders → Nodes → Jobs → Assignment → Plan Check**

FleetFlow ei ensimmäisessä vaiheessa ole:

- täysi TMS
- order management -järjestelmä
- carrier master-data -järjestelmä
- tarjouslaskuri
- tuotantokäyttöinen dispatch-järjestelmä
- oikeaa työdataa käyttävä järjestelmä

FleetFlow on portfolioon sopiva TMS-henkinen suunnittelu- ja plan validation -työkalu, joka näyttää logistiikan toimialaosaamista, React-osaamista, UI-ajattelua ja kykyä mallintaa oikean liikennesuunnittelun työnkulkuja fiktiivisellä demodatalla.

---

---

## Step 8.1A — Job Workspace Internal Tabs

Job-välilehti muutettiin pitkästä Job Input / Edit -tyyppisestä näkymästä ammattimaiseksi TMS-tyyliseksi Job Workspace -näkymäksi.

Uusi Job Workspace -rakenne:

- Job workspace header
- Selected job -dropdown
- sisäiset välilehdet:
  - Overview
  - Trip & Orders
  - Stops / Nodes
  - Assignment
  - Instructions
  - Validation
- oikean reunan Job Planning Log

Tavoite:

- tehdä Job-välilehdestä operatiivinen työtila
- erottaa jobin yhteenveto, trip/order-sisältö, nodet, assignment, instructions ja validation omiin näkymiin
- valmistella Trip → Orders → Nodes → Jobs → Assignment → Plan Check -mallia
- säilyttää nykyinen selectedJobId-synkka
- säilyttää nykyiset Board-, Fleet- ja Route & Risk -näkymät ennallaan

Toteutus:

- lisättiin uusi `jobWorkspaceTab`-state
- lisättiin `jobWorkspaceTabs`-määrittely
- lisättiin kevyet fiktiiviset demo-helperit:
  - `getDemoTripDetailsForJob`
  - `getDemoOrdersForJob`
  - `getDemoNodesForJob`
  - `getDemoAssignmentCheckForJob`
- Job-välilehdelle lisättiin oma selected job -dropdown
- dropdown käyttää nykyistä `selectedJobId`-logiikkaa
- jobin vaihto synkkaa planner staten nykyisen `syncPlannerStateFromJob`-helperin kautta
- Assignment-tab säilyttää Open-jobin assign truck -toiminnon
- Instructions-tab näyttää demo-preview’n kuljetusyhtiölle/vetäjälle annettavasta ohjeesta
- Validation-tab näyttää ensimmäisen version job-kohtaisista tarkistuksista ja placeholderit myöhemmälle validoinnille

Step 8.1A:ssa ei tehty:

- ei muutettu Boardin 3-column cockpit -rakennetta
- ei muutettu Fleetin truck sequence- tai plan check -rakennetta
- ei muutettu Route & Risk -näkymää
- ei lisätty backendia
- ei lisätty localStoragea
- ei tehty täyttä Trip Builderia
- ei lisätty oikeaa työdataa
- ei refaktoroitu koko sovellusta

Kaikki uudet trip/order/node/assignment-sisällöt ovat fiktiivistä demodataa.

---

## Step 8.1A.1 — Job Workspace Tab UI Polish

Job Workspace -välilehtien ulkoasua korjattiin.

Korjattu ongelma:

- sisäiset tabit näkyivät aluksi pystyrivinä / liian korkeina
- hover muuttui liian tummaksi / mustaksi

Korjaus:

- Job Workspace -tabit muutettiin vaakariviksi
- hover-tila korjattiin vaaleaksi / accent-henkiseksi
- active-tab näkyy sinisenä
- tabit eivät enää veny koko leveydelle yksittäisiksi riveiksi
- tabit saavat wrapata pienellä leveydellä

---

---

---

## Step 8.1A.2 — Align Job Workspace Tabs with Board Detail Panel

Job Workspace -sisäiset tabit viimeisteltiin vastaamaan Board Detail Panelin Selected Job / Operational Notes -valitsimien tyyliä.

Tavoite:

- yhtenäinen SAP/TMS-henkinen valitsintyyli
- vaalea tausta
- ohut reunaviiva
- matala ja tiivis korkeus
- pyöristetyt kulmat
- sininen active-tab
- hover ei muutu mustaksi

Tulos:

- Job-välilehden sisäiset tabit ovat visuaalisesti yhtenäisemmät Board Detail Panelin kanssa
- Job Workspace näyttää rauhallisemmalta ja ammattimaisemmalta
- Board, Fleet ja Route & Risk säilyivät ennallaan

Muokatut tiedostot:

- `src/App.css`

Verifiointi:

```text
npm run lint passed
npm run build passed
```

---

