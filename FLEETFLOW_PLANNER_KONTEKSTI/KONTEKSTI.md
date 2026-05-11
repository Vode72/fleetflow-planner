# FleetFlow Planner — Konteksti

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