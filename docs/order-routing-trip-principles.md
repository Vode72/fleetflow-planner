# Order Routing ja Trip — sovitut periaatteet

Päivitetty: 14.11.2026  
Tila: hyväksytyt suunnitteluperiaatteet; avoimet rajaukset on erotettu omaksi luvukseen.

## Lähde, tarkoitus ja suhde aiempaan malliin

Tämä dokumentti kirjaa käyttäjän 14.11.2026 toimittaman päätöskoosteen keskustelusta
[Tietomallin auditointi](chatgpt-conversation://6af604e1-6dbc-83ed-b234-2b0189051b98).
Koko aiempaa keskustelua ei voitu lukea tässä päivityksessä. Tarkentamattomia asioita
ei siksi esitetä hyväksyttyinä päätöksinä.

Pohjana tarkistettu main: `f9a04f0543f48a5adc0271b9ada39560ad226c44`
(PR #5, FF-002D). Tämä on dokumentaatiopäivitys, ei kuvaus uuden mallin
valmiista toteutuksesta.

[Master Context](../FLEETFLOW_PLANNER_KONTEKSTI/FLEETFLOW_MASTER_CONTEXT.md)
kuvaa aiemman suunnittelunäkymän:

```text
Trip → Orders → Nodes / Stops → Jobs → Assignment → Plan Check
```

Sen Job-, Node-, Assignment- ja Plan Check -periaatteet säilyvät. Uusi
Order-lähtöinen kuljetusketju täydentää mallia ja tarkentaa Orderin ja Tripin
suhdetta. Nuolet kuvaavat käsitteellistä etenemistä, eivät valmista
tietokantaskeemaa tai kaikkia suhteiden kardinaliteetteja.

## Hyväksytyt päätökset

### 1. Order → Order Routing → Order Leg → Trip

- **Order** on kuljetustilaus, jonka tunniste säilyy kuljetusketjussa.
- **Order Routing** kuvaa Orderin suunnitellun reitityksen.
- **Order Leg** on reitityksen yksittäinen kuljetusosuus.
- **Trip** on operatiivinen kuljetuskokonaisuus, johon kuljetusosuuksia liitetään.

Sama Order ID voi esiintyä usealla leg-rivillä. Jokaisella legillä on oma
sisäinen yksilöivä leg-id; Order ID ei yksin yksilöi leg-riviä.
Reitityksen jakaminen osuuksiin ei luo uusia asiakastilauksia.

### 2. Cross Dock, UNLOAD, LOAD ja Remain LU

Cross Dock ei luo uutta Order ID:tä. Kun kuorma puretaan terminaaliin ja
lastataan jatkokuljetukseen, terminaalikäsittely kuvataan erillisillä
**UNLOAD**- ja **LOAD**-tapahtumilla. Orderin tunniste säilyy, vaikka
kuljetusosuus, Trip tai traileri vaihtuu.

**Remain LU** tarkoittaa, että kuorma jää traileriin. Sitä ei kuvata
toteutuneena UNLOAD/LOAD-käsittelynä pelkän terminaalikäynnin perusteella.
Trip voi jatkua terminaalin jälkeen kuorman pysyessä trailerissa.
Terminaalikäynti ei siis automaattisesti päätä Tripiä tai luo uutta Orderia.

### 3. Routing ja Gateway Instructions PDF

Routing voidaan suunnitella jo ennen kuorman saapumista terminaaliin.
Saapuminen ei ole reitityksen aloittamisen edellytys.

Gateway Instructions PDF kertoo, mitkä kuormat:

- **UNLOAD** — puretaan terminaalissa;
- **LOAD** — lastataan jatkokuljetukseen;
- **REMAIN** — jätetään traileriin.

Ohjeeseen vaikuttavista muutoksista ilmoitetaan. Aiemmin toimitettu PDF ei
yksin takaa, että vastaanottajalla on muuttunut ohje tiedossaan.
Ilmoituskanava, vastaanottajat, versiointi ja kuittausmenettely ovat vielä
avoimia toteutusrajauksia.

### 4. IOP, IOD ja POD sekä aikojen tarkistus

IOP, IOD ja POD pidetään erillisinä tietoina/tapahtumina. Yhtä ei käytetä
automaattisesti toisen korvikkeena. Niiden ajat tarkistetaan.

**IOP–IOD on kuorman kuljetusaika.** POD on erillinen toimitustodisteeseen
liittyvä tieto; sen käsittelyä ei yhdistetä automaattisesti IOD-aikaan.
Tripin kokonaiskesto ei ole sama asia kuin kuorman IOP–IOD-kuljetusaika.

Aikatarkistuksen on huomioitava tapahtumien ajallinen johdonmukaisuus.
Tarkat aikaleimakentät, tapahtumien kohdistustaso, aikavyöhykekäytäntö,
puuttuvien aikojen käsittely ja virheiden estävä/varoittava vaikutus
määritellään erikseen. Lyhenteiden täydellisiä kenttämääritelmiä ei
vahvisteta tässä dokumentissa.

### 5. Tripin oma elinkaari

Tripillä on oma elinkaarensa. Se voi jatkua kuorman toimituksen jälkeen
tyhjän trailerin palautukseen. Orderin toimitus, kuorman kuljetusajan loppu,
POD ja Tripin päättyminen eivät siten ole yksi yhteinen päättymistapahtuma.

Aiempi päätös säilyy: Trip voi jatkua yhden kuljettajan Jobin päättymisen
jälkeen. Job on yhdelle truck/driver/carrier-yhdistelmälle osoitettava
suoritettava työyksikkö. Tripin jatkuminen ei edellytä samaa kuljettajaa
koko ketjulle.

### 6. Kotimaan ja mantereen variaatiot sekä RoundTrip

Mallissa huomioidaan kotimaan ja mantereen kuljetusten variaatiot.
Kaikkia ketjuja ei pakoteta samaan terminaali-, satama- tai Trip-rajaan.
Yhteiset Order ID-, leg-id-, käsittely- ja elinkaariperiaatteet säilyvät
variaatiosta riippumatta.

**RoundTrip on valinnainen.** Se ei ole jokaisen Order Routingin tai Tripin
edellytys. Sen tarkka sisältö, muodostaminen ja sulkeminen ovat avoimia.

## Havainnollistavat esimerkit

Seuraavat ovat fiktiivisiä mallinnusesimerkkejä. Kaupunkiketjut ovat sovitut
esimerkit; tunnisteet, käsittelyvaihtoehdot ja Trip-jaot havainnollistavat
periaatteita eivätkä lukitse vielä avoimia variaatioita.

### Jyväskylä–Vantaa–Lübeck

Order `DEMO-ORDER-A` reititetään Jyväskylästä Vantaan kautta Lübeckiin.

| Order ID | Sisäinen leg-id | Osuus |
| --- | --- | --- |
| DEMO-ORDER-A | DEMO-LEG-A1 | Jyväskylä → Vantaa |
| DEMO-ORDER-A | DEMO-LEG-A2 | Vantaa → Lübeck |

- Cross Dock -vaihtoehdossa kuorma UNLOADataan Vantaalla ja LOADataan
  jatkokuljetukseen. Order ID säilyy molemmilla leg-riveillä.
- Remain LU -vaihtoehdossa kuorma jää traileriin Vantaalla. Trip voi jatkua;
  käynnistä ei päätellä kuorman purkua tai uudelleenlastausta.
- Reititys ja Gateway Instructions voidaan valmistella ennen Vantaalle
  saapumista. Ohjeeseen vaikuttava muutos ilmoitetaan.
- Legien tarkka Trip-jako sekä mahdollisten satama-/lauttatapahtumien
  yksityiskohtainen mallinnus jäävät myöhempään määrittelyyn.

### Vuosaari–Vantaa–Oulu

Order `DEMO-ORDER-B` reititetään Vuosaaresta Vantaan kautta Ouluun.

| Order ID | Sisäinen leg-id | Osuus |
| --- | --- | --- |
| DEMO-ORDER-B | DEMO-LEG-B1 | Vuosaari → Vantaa |
| DEMO-ORDER-B | DEMO-LEG-B2 | Vantaa → Oulu |

- Vantaan terminaalissa Gateway Instructions kertoo kuormakohtaisesti
  UNLOAD-, LOAD- tai REMAIN-toimenpiteen.
- Cross Dock säilyttää Order ID:n; Remain LU -kuorma pysyy trailerissa.
- Routing voidaan tehdä jo ennen Vantaalle saapumista.
- Kuorman IOP–IOD-kuljetusaika käsitellään erillään POD-tiedosta ja Tripin
  kokonaiskestosta. Jos Trip sisältää tyhjän trailerin palautuksen Oulun
  toimituksen jälkeen, Trip voi jatkua palautukseen asti.
- Palautuspaikkaa tai pakollista RoundTrip-rakennetta ei oleteta.

## Avoimet variaatiot ja rajaukset — eivät hyväksyttyjä toteutuspäätöksiä

| Aihe | Vielä ratkaistava |
| --- | --- |
| Legin rajat | Milloin uusi leg syntyy: terminaali, satama, lautta, trailerin vaihto tai muu reititysmuutos? |
| Tripin rajat | Milloin sama Trip jatkuu ja milloin perustetaan uusi Trip eri kotimaan/mantereen tapauksissa? |
| Suhteet ja tietorakenne | Routingin versiot, leg–Trip-kohdistus, jakaminen/yhdistäminen ja tunnisteiden tekninen toteutus. |
| Osittainen käsittely | Saman Orderin osittainen UNLOAD/LOAD/REMAIN, määrät ja kuorman osien seuranta. |
| Gateway Instructions | PDF:n versiot, jakelu, muutosilmoituksen vastaanottajat ja kuittaus sekä suunnitellun/toteutuneen käsittelyn erot. |
| IOP/IOD/POD | Täsmälliset määritelmät, kohdistus Order-/leg-/tapahtumatasolle, aikaleimat ja validointisäännöt. |
| Tripin sulkeminen | Tilat, sulkemisehdot, palautuksen rajat ja poikkeustilanteet. |
| RoundTrip | Ryhmittely, suhde Tripeihin, aloitus-/päätepiste ja sulkeminen. |
| Käyttöliittymä ja toteutus | Näkymät, migraatio nykyisestä demomallista, tallennus ja toteutusjärjestys. |

## Säilyvät aiemmat päätökset ja tämän muutoksen rajaus

- FleetFlow on portfolio-/demo-sovellus ja käyttää vain fiktiivistä demodataa.
- Node/Stop kuvaa fyysisiä tai suunnitteluun vaikuttavia tapahtumia.
- Job-, Assignment- ja Plan Check -roolit sekä Board-, Job-, Fleet- ja
  Route & Risk -näkymien vastuut säilyvät master-kontekstin mukaisina.
- Tämä päätöskirja tarkentaa kuljetusmallia; se ei ilmoita uutta mallia,
  PDF-tuotantoa tai muutosilmoituksia toteutetuiksi.
- Aiempi [arkistokonteksti](../FLEETFLOW_PLANNER_KONTEKSTI/ARCHIVE_KONTEKSTI.md)
  säilytetään historiatietona. Tämän dokumentin hyväksytyt päätökset
  tarkentavat aiempaa Order–Trip-kuvausta; avoin luku ei korvaa päätöksiä.
