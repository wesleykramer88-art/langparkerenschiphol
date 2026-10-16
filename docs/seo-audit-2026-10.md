# SEO/GEO-verbetering — oplevering (oktober 2026)

Status: **preview-branch, niets gepubliceerd.** Beschermde onderdelen (GA4/GTM/Ads, ParkingPro-iframe, prijs-API, consent, conversie-events) zijn niet gewijzigd.

## Uitgevoerd in deze branch
| Wijziging | Bestand | Doel |
|---|---|---|
| 308-redirect `/ervaringen/` → `/reviews/` | next.config.ts | Oude route gaf 404; zelfde zoekintentie |
| 308-redirect `/reisbureaus/` → `/samenwerken/` | next.config.ts | Idem |
| Sitemap zonder `lastmod`/`changefreq`/`priority` | src/app/sitemap.ts | `lastmod` was build-tijd (onbetrouwbaar) |
| Nieuwe titles/descriptions (home, services, tarieven, contact, shuttle, valet, veilig) | src/lib/seo.ts | Duidelijkere intentie; geen onbewezen claims (“24/7”, “afgesloten”) in snippets |
| Contact-lead natuurlijker Nederlands | contact/page.tsx | “Lang parkeren schiphol contact nodig?” was geforceerd |

Gecontroleerd (lokale productiebuild): `/ervaringen/` en `/reisbureaus/` → 308; onbekende URL → 404; canonicals aanwezig; sitemap geldig; `tsc`, `eslint` en `next build` zonder fouten.

### Voor/na-titles
| Route | Voor | Na |
|---|---|---|
| / | Parkeren Schiphol Reserveren \| Lang Parkeren Schiphol | Lang parkeren Schiphol \| Shuttle & Valet |
| /onze-services/ | Schiphol Parkeerplaats Reserveren \| … | Shuttle of valet parkeren bij Schiphol? Vergelijk |
| /tarieven/ | Parkeren Schiphol Kosten & Tarieven \| … | Kosten lang parkeren Schiphol \| Shuttle & Valet |
| /contact/ | Lang Parkeren Schiphol Contact \| Lang Parkeren Schiphol | Contact & parkeerlocaties \| Lang Parkeren Schiphol |
| /shuttle-parkeren-schiphol/ | Shuttle Parkeren Schiphol \| Veilig \| … | Shuttle parkeren Schiphol \| Sleutel mee op reis |
| /valet-parking-schiphol/ | Valet Parking Schiphol \| Veilig \| … | Valet parking Schiphol \| Afgeven bij de vertrekhal |
| /veilig-parkeren-schiphol/ | Beveiligd Parkeren Schiphol \| … | Veilig parkeren Schiphol \| Beveiligingsmaatregelen |

Titles zijn bewust gewijzigd; leg vóór livegang een Search Console-baseline vast.

## Keyword-to-page-mapping
| Pagina | Eigen vraag |
|---|---|
| / | Merk, aanbod, keuze en boeken |
| /shuttle-parkeren-schiphol/ | Hoe werkt shuttle parkeren (aankomst, transfer, terugkomst) |
| /valet-parking-schiphol/ | Hoe werkt afgeven bij de vertrekhal |
| /tarieven/ | Wat kost het en hoe is de prijs opgebouwd |
| /onze-services/ | Shuttle of valet kiezen |
| /parkeren-schiphol-zonder-sleutel-inleveren/ | Houd ik mijn sleutel? |
| /zelf-parkeren-schiphol/ | Aankomstprocedure bij zelf parkeren |
| /goedkoop-shuttle-parkeren-schiphol/ | Prijsbewust kiezen |
| /veilig-parkeren-schiphol/ | Concrete maatregelen |
| /waarom-lang-parkeren-schiphol/ | Vertrouwen/merk; overlapt met veilig |
| /reviews/, /contact/ | Ervaringen; contact en locaties |

Shuttle / zelf parkeren / sleutel mee: niet samengevoegd (geen prestatiedata); beslissen na 90 dagen Search Console-data.

## Redirects (nieuw)
`/ervaringen/` → `/reviews/`; `/reisbureaus/` → `/samenwerken/`. Geen interne links naar de oude routes aangetroffen. Bestaande redirects ongewijzigd.

## Audit
**Opgelost:** 404 op twee historische routes; onbetrouwbare sitemap-lastmod; onbewezen claims in snippets; geforceerde contacttekst.

**Nog te verifiëren (niets verzonnen of aangepast):**
1. “24/7 camerabewaking”, “afgesloten terrein”, “24 uur bewaakt en gemonitord”, “overdekt parkeren”: per dienst/locatie bevestigd? Camerabewaking ≠ permanente fysieke bewaking. Voorkomt o.a. in Faq, ClosingCta, WhyUs, ServiceChooser, Security, HeroSection, MobileTrustBlock en de shuttle-, veilig- en waarom-pagina.
2. “Onze eigen chauffeurs/terrein/mensen op de foto” (valet, veilig, shuttle, waarom): wie is de uitvoerende partij; is de foto echt eigen personeel?
3. Waar worden valetauto’s geparkeerd (overdrachtspunt Vertrekpassage staat in site.ts, parkeerlocatie niet)?
4. Waar haalt de shuttle klanten op na terugkomst (TODO in site.ts)?
5. Openingstijden parkeren/transfers/klantenservice apart; sleutelbeleid bij aanvullende diensten.
6. Postcode 1119 PA, KvK, juridische naam; telefoon 020-303 3460 (klantbesluit) vs. 0297-785515 in algemene voorwaarden.
7. “Volle accu bij terugkomst” (opladen €35): bevestigen en formuleren naar wat gegarandeerd kan worden.
8. Ritregistratie alleen bij valet vermelden; shuttlepagina’s nalopen.
9. Testimonials: bron, datum, toestemming; geen rating/aantal zonder openbare bron.
10. Schema (src/lib/schema.ts): ParkingFacility, coördinaten en sameAs controleren na bevestiging van bovenstaande.

**Niet uitgevoerd in deze run (browser/live data of externe toegang nodig):** screenshots voor/na, Lighthouse/CrUX, widget- en kalendertests (1366×768, 1440×900, 1920×1080, 375/390 px), conversietest, Search Console/backlinkdata, WAF-controle (robots.ts staat Googlebot, Bingbot en OAI-SearchBot toe via `allow: /`), alt-tekstreview na visuele inspectie, homepage-vergelijking en tariefuitleg (feiten eerst bevestigen), prijsvoorbeelden 8/15/22 dagen (geen veilige actuele prijsbron zonder ParkingPro-API te wijzigen; nodig: reisdata/tijden en gecontroleerde offertes per product).

**Beschermd — advies:** geen wijziging nodig gebleken.

## Afbeeldingen
Alt-teksten als “24/7 beveiligd parkeren Schiphol” (veilig) en “lang parkeren schiphol ervaringen” (reviews) zijn keywordachtig; herschrijf na visuele inspectie naar wat zichtbaar is. Ontbrekende echte foto’s: ingang, terrein, shuttle, bagage, valet-overdracht, overdekte plekken. Video alleen met echt materiaal.

## Meetplan
Search Console per landingspagina (klikken, vertoningen, CTR/positie, merk vs. niet-merk), indexering, GA4 organische boekingen/omzet (bestaande meting), Bedrijfsprofielacties, AI-referral in GA4 (beperkt: geen volledige AI-rapportage), CrUX/PageSpeed voor/na. Baseline 28–90 dagen, seizoen meenemen.

## Offpage 30/60/90 dagen (niet uitgevoerd)
| Termijn | Prioriteit | Actie | Eigenaar | Benodigd | Meetpunt |
|---|---|---|---|---|---|
| 30 | Hoog | Google Bedrijfsprofiel controleren (naam, adres, tel, uren, categorie, geen terminalvestiging/dubbel profiel) | Marketing | GBP-toegang, bevestigde NAP | Profielacties |
| 30 | Hoog | Neutrale reviewverzoeken na verblijf (geen gating/vergoeding) | Klantenservice | Template, reviewlink | Aantal/gemiddelde per merk |
| 30 | Hoog | Search Console-baseline + backlinkcheck oude URL’s | SEO | GSC-toegang | Baseline-export |
| 60 | Midden | Verwijzingen via bestaande reisbureaus, hotels, zakelijke partners | Partnermanager | Relatielijst | Verwijzende domeinen |
| 60 | Midden | Echte foto’s/video | Operations | Terreintoegang | Beelden live |
| 90 | Midden | Publicatie met geanonimiseerde data (periode, steekproef, methode) | Data/Marketing | Boekingsexport | Citaties/links |
| 90 | Laag | Besluit over samenvoegen overlappende pagina’s | SEO | 90 dagen GSC-data | Klikken/posities |

Geen gekochte links, bulkdirectories of automatische outreach.
