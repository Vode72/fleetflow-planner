# FF-002C — työtilan korkeuden hallinta

Pohja: main `7e3fe83`, jossa PR #2 (FF-002A) ja PR #3 (FF-002B) on yhdistetty.

## Syy ja korjaus

`.app` käyttää korkeutta `100vh` ja `overflow: hidden`. Boardin
`calc(100vh - 151px)` sekä Fleetin ja Route & Riskin
`calc(100vh - 127px)` eivät huomioi todellista otsaketta (79 px),
välilehtiä tai suunnitteluhuomiota (testissä 95,75 px + 5 px marginaali).
Jobilla ei ollut jäljelle jäävään tilaan rajattua vieritysaluetta.

Yli 1100 px:n leveydessä sovelluksen flex-pystyasettelu antaa työtilalle
otsakkeen, välilehtien ja huomion jälkeen jäävän tilan. Työtila voi vieriä,
Boardin sisempi asettelu täyttää sen, ja Fleetin sekä Route & Riskin
olemassa olevat sarakevieritykset säilyvät. Jobin sisältö ja Fleetin
vasemman sarakkeen kortit eivät kutistu: ylivuoto pääsee vieritettäväksi.
Enintään 1100 px:n säännöt säilyvät ennallaan.

Ainoa tuotantokoodin muutos: `src/App.css`. Tämä tiedosto on tarkistusraportti.
Liiketoimintalogiikkaa, demodataa tai riippuvuustiedostoja ei muutettu.

## Ennen–jälkeen-mittaukset

Chromium 156.0.8078.79, CSS-pikseleitä, pyöristetty lähimpään kokonaislukuun.
Työtilan yläreuna on ilman huomiota 142 px ja huomion kanssa 242 px.
Taulukossa on työtilan korkeus ja alareuna; sovelluksen alareunan sisäpuolelle
jätetään korjauksen jälkeen 10 px:n täyte.
Jobin lähtötilana on Overview ilman huomiota ja Assignment huomion kanssa.

| Koko | Huomio | Näkymä | Korkeus ennen → jälkeen | Alareuna ennen → jälkeen |
| --- | --- | --- | --- | --- |
| 1440 × 800 | ei | Board | 656 → 648 | 798 → 790 |
| 1440 × 800 | ei | Job | 335 → 648 | 477 → 790 |
| 1440 × 800 | ei | Fleet | 673 → 648 | 815 → 790 |
| 1440 × 800 | ei | Route & Risk | 673 → 648 | 815 → 790 |
| 1440 × 800 | kyllä | Board | 656 → 548 | 898 → 790 |
| 1440 × 800 | kyllä | Job | 446 → 548 | 688 → 790 |
| 1440 × 800 | kyllä | Fleet | 673 → 548 | 915 → 790 |
| 1440 × 800 | kyllä | Route & Risk | 673 → 548 | 915 → 790 |
| 1440 × 900 | ei | Board | 756 → 748 | 898 → 890 |
| 1440 × 900 | ei | Job | 335 → 748 | 477 → 890 |
| 1440 × 900 | ei | Fleet | 773 → 748 | 915 → 890 |
| 1440 × 900 | ei | Route & Risk | 773 → 748 | 915 → 890 |
| 1440 × 900 | kyllä | Board | 756 → 648 | 998 → 890 |
| 1440 × 900 | kyllä | Job | 446 → 648 | 688 → 890 |
| 1440 × 900 | kyllä | Fleet | 773 → 648 | 1015 → 890 |
| 1440 × 900 | kyllä | Route & Risk | 773 → 648 | 1015 → 890 |

## Chromium-tarkistukset

- Koot: 390 × 900, 700 × 900, 900 × 900, 1100 × 900,
  1440 × 800 ja 1440 × 900.
- Board, Job, Fleet ja Route & Risk kussakin koossa sekä ilman huomiota että
  huomion kanssa: 48 perusyhdistelmää.
- Huomio luotiin käyttöliittymästä: Job → JOB-010 → Assignment → Assign truck.
- Lisäksi Jobin kaikki seitsemän alavälilehteä jokaisessa koossa ja huomion
  tilassa: yhteensä 120 näkymätilaa yhdessä muiden näkymien kanssa.
- Näkyvien painikkeiden, syötteiden ja valitsimien saavutettavuus tarkistettiin
  vierittämällä ne näkyviin ja vertaamalla rajoja viewportiin ja leikkaaviin
  esi-isiin. Vieritysalueista tarkistettiin, että scrollTop muuttuu.
- Enintään 1100 px:n perusnäkymien geometria ja vieritysmittaukset olivat
  ennen ja jälkeen samat. Route & Riskin kartta oli kaikissa näissä koissa
  360 px korkea molemmissa huomion tiloissa.
- 1440 px:n leveydessä työtila päättyy kaikissa näkymissä kohtaan 790 px
  (800 px korkea ikkuna) tai 890 px (900 px korkea ikkuna).

## Komentotarkistukset

`npm run build`, `npm run lint`, `npm run test` ja `git diff --check`.
Testejä 7, testitiedostoja 2; kaikki läpäisty.

## Jäljelle jäävät havainnot ja rajaukset

- Testiympäristössä ulkoiset OpenStreetMap-karttatiilet eivät latautuneet.
  Leaflet-kontti, merkit, zoomauspainikkeet ja kartan korkeus olivat tarkistettavissa;
  taustakartan verkkolatausta ei siten vahvistettu.
- Fleetin Check Plan -painikkeen teksti rivittyy ahtaassa sarakkeessa olemassa
  olevan kiinteän painikekorkeuden ulkopuolelle. Painike on saavutettavissa;
  sen typografia ei kuulu tähän korkeudenhallinnan korjaukseen.
- Tarkistus koskee yllä mainittuja kokoja ja demosuunnitelman tuottamaa huomiota.
