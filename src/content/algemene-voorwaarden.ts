/**
 * The general terms and conditions, as supplied by the client.
 *
 * ── This is a legal document, not copy ──────────────────────────────────────
 * The text below is the client's own Dutch original, transcribed VERBATIM. It
 * is not edited for tone, house style, address form, or the site's other copy
 * conventions, and it must not be. The rest of the site addresses the visitor
 * as "u" and avoids the passive; this document does neither, and that is
 * correct — it is the contract, and its wording is the client's lawyer's, not
 * ours. Do not "align" it with the marketing copy.
 *
 * Two mechanical repairs were made to the supplied file, and only two:
 *
 *   1. NUMBERING. The source restarts every article at "1." and then continues
 *      with a document-wide running counter — article 2 arrived as 1, 14, 15,
 *      16; article 19 as 1, 86, 87. That is a Word list-numbering artifact from
 *      the export, not the intended numbering: every article opens at 1, and
 *      article 14 lid 8 cross-references "artikel 13" by article rather than by
 *      the running number. Clauses are therefore numbered per article, which is
 *      what the counter would have produced had it reset. Rendering is left to
 *      the browser's own <ol> counter so the numbers cannot drift from the
 *      order of this array.
 *
 *   2. LINE WRAPPING. Hard line breaks from the PDF/Word column are joined into
 *      running prose. No word is added, removed, or reordered.
 *
 * ── Known inconsistencies in the source, left as-is ─────────────────────────
 * These are the client's to resolve, and silently "fixing" any of them would
 * change the meaning of a contract:
 *
 *   • Articles 8 and 10 direct customers to info@valetparkingschiphol.nl and
 *     wijzigingen@valetparkingschiphol.nl. Both are on a DIFFERENT domain from
 *     this site, and neither is siteConfig.email
 *     (klantenservice@langparkerenschiphol.nl). Left verbatim.
 *     TODO(client): confirm these two addresses are monitored, or give us the
 *     langparkerenschiphol.nl equivalents to substitute.
 *
 *   • Article 12 lid 3 charges € 2,50 booking fee per reservation. /tarieven/
 *     currently answers a FAQ with "er zijn dus geen verborgen extra kosten".
 *     Those are reconcilable — a disclosed fee is not a hidden one — but the
 *     fee is not yet stated anywhere on the site outside this document.
 *     TODO(client): confirm the € 2,50 is still charged, so it can be named on
 *     /tarieven/ before checkout rather than only in the terms.
 *
 *   • Article 14 lid 10 reads "deze algemeen voorwaarden" (sic, for "algemene").
 *     Transcribed as written.
 *
 * TODO(client): supply a version date. A set of terms with no "laatst
 * bijgewerkt" cannot be shown to have been the version in force on the day a
 * given booking was made, which is the one thing a dispute turns on. No date is
 * displayed rather than an invented one — fill LAST_UPDATED in the page and it
 * renders.
 */

export type Clause = {
  /** The defined term, set in the heading face. Article 1 only. */
  term?: string;
  text: string;
  /** Lettered sub-clauses, a) b) c). */
  sub?: readonly string[];
};

export type Article = {
  /** Article number. Also the anchor: #artikel-3. */
  number: number;
  title: string;
  /** Running text before the numbered clauses. Article 1 only. */
  intro?: string;
  clauses: readonly Clause[];
};

export const TERMS: readonly Article[] = [
  {
    number: 1,
    title: 'Definities',
    intro:
      'In deze algemene voorwaarden worden de volgende termen, steeds met hoofdletter beginnend, in de navolgende betekenis gebruikt.',
    clauses: [
      {
        term: 'The Parking Company',
        text: 'de vennootschap onder firma The Parking Company, de gebruiker van deze algemene voorwaarden, tevens handelend onder de handelsnamen Flight Parking, Business Valet, Valetparkingschiphol.nl en langparkerenschiphol.nl, gevestigd aan Proosdijland 12, 3645 LA te Vinkeveen, ingeschreven in het Handelsregister onder KvK-nummer 74048856.',
      },
      {
        term: 'Klant',
        text: 'iedere natuurlijke of rechtspersoon met wie The Parking Company een Overeenkomst heeft gesloten of beoogt te sluiten.',
      },
      {
        term: 'Consument',
        text: 'een Klant, natuurlijk persoon, niet handelend voor doeleinden die binnen zijn beroeps- of bedrijfsactiviteiten vallen.',
      },
      {
        term: 'Zakelijke Klant',
        text: 'de Klant, natuurlijke of rechtspersoon, handelend in de uitoefening van een beroep of bedrijf.',
      },
      {
        term: 'Partijen',
        text: 'The Parking Company en de Klant gezamenlijk.',
      },
      {
        term: 'Overeenkomst/Reservering',
        text: 'iedere tussen Partijen tot stand gekomen overeenkomst in het kader waarvan The Parking Company zich jegens de Klant heeft verbonden tot het verlenen van Diensten.',
      },
      {
        term: 'Diensten/Dienstverlening',
        text: 'de in het kader van de Overeenkomst namens The Parking Company te verlenen diensten, waaronder begrepen kan zijn Valet Parking en Shuttle Parking, alsmede eventuele aanvullende diensten.',
      },
      {
        term: 'Valet Parking',
        text: 'de dienst waarbij het Voertuig van de Klant op of nabij Schiphol op de afgesproken locatie namens The Parking Company in ontvangst wordt genomen, vervolgens wordt verplaatst en geparkeerd, en bij terugkomst van de Klant weer aan de Klant wordt teruggegeven.',
      },
      {
        term: 'Shuttle Parking',
        text: 'de dienst waarbij de Klant zelf naar een aangewezen parkeerlocatie rijdt, aldaar het Voertuig parkeert en afsluit, de sleutel zelf behoudt, en vervolgens namens The Parking Company per shuttlevervoer van en naar Schiphol wordt vervoerd.',
      },
      {
        term: 'Voertuig',
        text: 'het motorvoertuig waarop de Overeenkomst betrekking heeft.',
      },
      {
        term: 'Uitvoerende Partij',
        text: 'de door The Parking Company voor de feitelijke uitvoering van de Diensten ingeschakelde derde en eventuele andere hulppersonen of uitvoerende derden.',
      },
      {
        term: 'Website',
        text: 'iedere website die door The Parking Company wordt gebruikt voor het aanbieden en verwerken van Reserveringen en waarop deze algemene voorwaarden zijn geplaatst.',
      },
      {
        term: 'Schriftelijk',
        text: 'naast traditionele schriftelijke communicatie, communicatie per e-mail, sms of enige andere wijze van communicatie die met het oog op de stand der techniek en de in het maatschappelijk verkeer geldende opvattingen hiermee gelijk kan worden gesteld.',
      },
    ],
  },

  {
    number: 2,
    title: 'Algemene bepalingen en toepasselijkheid',
    clauses: [
      {
        text: 'Deze algemene voorwaarden zijn van toepassing op elk aanbod van The Parking Company, iedere Overeenkomst en alle daaruit tussen Partijen voortvloeiende rechtsverhoudingen.',
      },
      {
        text: 'De eventuele algemene voorwaarden van de Zakelijke Klant, onder welke benaming dan ook aangeduid, zijn niet op de Overeenkomst van toepassing.',
      },
      {
        text: 'Van het bepaalde in deze algemene voorwaarden kan uitsluitend uitdrukkelijk en Schriftelijk worden afgeweken. Indien en voor zover hetgeen Partijen uitdrukkelijk en Schriftelijk zijn overeengekomen afwijkt van het bepaalde in deze algemene voorwaarden, geldt hetgeen Partijen uitdrukkelijk en Schriftelijk zijn overeengekomen.',
      },
      {
        text: 'Vernietiging of nietigheid van een of meer van de bepalingen uit deze algemene voorwaarden of de Overeenkomst als zodanig, laat de geldigheid van de overige bedingen onverlet. In een voorkomend geval zijn Partijen verplicht in onderling overleg te treden teneinde een vervangende regeling te treffen ten aanzien van het aangetaste beding. Daarbij wordt zoveel mogelijk het doel en de strekking van de oorspronkelijke bepaling in acht genomen.',
      },
    ],
  },

  {
    number: 3,
    title: 'Aanbod en totstandkoming van overeenkomsten',
    clauses: [
      {
        text: 'Reserveringen kunnen worden gemaakt via de Website, telefonisch of per e-mail.',
      },
      {
        text: 'Elk aanbod van The Parking Company is vrijblijvend. The Parking Company is gerechtigd een Reservering zonder opgave van redenen te weigeren, bijvoorbeeld indien de gevraagde gegevens ontbreken, gerede twijfel bestaat over de juistheid van de opgegeven gegevens of uitvoering redelijkerwijs niet mogelijk is.',
      },
      {
        text: 'Kennelijke fouten, vergissingen of kennelijke verschrijvingen in een aanbod, prijsopgave, boekingsbevestiging of andere mededeling van The Parking Company binden haar niet.',
      },
      {
        text: 'De Klant dient bij het doen van een Reservering alle door The Parking Company gevraagde gegevens volledig en naar waarheid te verstrekken.',
      },
      {
        text: 'Bij een Reservering dient de Klant in elk geval de datum en het tijdstip van aanvang van de Dienst en de datum en het tijdstip van terugkomst op te geven. Zonder terugkomstdatum of terugkomsttijd kan geen geldige Reservering tot stand komen.',
      },
      {
        text: 'De Overeenkomst komt tot stand op het moment dat de Reservering door The Parking Company langs elektronische weg, per e-mail, telefonisch of anderszins door haar is bevestigd.',
      },
      {
        text: 'Indien de Klant de Overeenkomst namens een andere natuurlijke of rechtspersoon sluit, verklaart hij daartoe bevoegd te zijn. De Klant is naast deze (rechts)persoon hoofdelijk aansprakelijk voor de nakoming van alle uit de Overeenkomst voortvloeiende verplichtingen.',
      },
    ],
  },

  {
    number: 4,
    title: 'Aard van de dienstverlening en uitbesteding',
    clauses: [
      {
        text: 'The Parking Company biedt Reserveringen aan voor Valet Parking en Shuttle Parking rondom Schiphol. The Parking Company zal de uitvoering van de Diensten overlaten aan een Uitvoerende Partij.',
      },
      {
        text: 'Deze algemene voorwaarden zijn mede bedongen ten behoeve van de betreffende Uitvoerende Partij, zodat deze zich, voor zover de betreffende rechten en verplichtingen naar hun aard of strekking daartoe lenen, tegenover de Klant op deze algemene voorwaarden kan beroepen als ware zij zelf partij bij de Overeenkomst.',
      },
      {
        text: 'The Parking Company is gerechtigd de wijze van uitvoering, gebruikte parkeerlocaties, operationele processen, contactnummers, werkwijzen en hulppersonen naar redelijkheid te wijzigen, mits de aard van de overeengekomen Dienst daardoor niet wezenlijk wordt gewijzigd.',
      },
    ],
  },

  {
    number: 5,
    title: 'Annulering, no-show en wijziging van de reservering',
    clauses: [
      {
        text: 'Een Reservering is bindend. Het wettelijke herroepingsrecht van consumenten, komt de Consument niet toe. De Dienstverlening van The Parking Company betreft de terbeschikkingstelling van parkeercapaciteit en daarmee accommodatie anders dan voor woondoeleinden, althans een daarmee naar aard en strekking vergelijkbare dienst waarbij voor de Klant gedurende een vooraf bepaalde periode capaciteit wordt gereserveerd. Wegens deze wettelijke uitsluitingsgrond is het herroepingsrecht uitgesloten.',
      },
      {
        text: 'Indien de Klant geen gebruik maakt van de gereserveerde Dienst, bijvoorbeeld wegens annulering van de vlucht, wijziging van vakantie- of reisplannen, ziekte, uitstel of afgelasting van een reis, komt dit voor risico van de Klant. The Parking Company is gerechtigd in geval van annulering, no-show of niet-gebruik van de Dienst de volledige overeengekomen prijs in rekening te brengen of te behouden.',
      },
      {
        text: 'Wijzigingen van de Reservering, waaronder wijzigingen van data, tijden, vluchtinformatie, parkeerduur of andere relevante gegevens, dienen zo spoedig mogelijk na bekendwording aan The Parking Company te worden doorgegeven. The Parking Company zal zich inspannen om een wijziging te verwerken, maar is daartoe niet verplicht indien de wijziging operationeel of administratief redelijkerwijs niet meer kan worden doorgevoerd.',
      },
    ],
  },

  {
    number: 6,
    title: 'Uitvoering van Valet Parking',
    clauses: [
      {
        text: 'Bij Valet Parking dient de Klant ongeveer 30 minuten vóór aankomst op Schiphol telefonisch contact op te nemen met het door The Parking Company opgegeven operationele telefoonnummer van de Uitvoerende Partij. Het Voertuig wordt vervolgens op of nabij de afgesproken locatie op Schiphol, in beginsel tussen vertrekhal 2 en 3 dan wel op een in de bevestiging of operationele instructies genoemde alternatieve locatie, door de Uitvoerende Partij in ontvangst genomen.',
      },
      {
        text: 'Bij terugkomst dient de Klant telefonisch contact op te nemen zodra de bagage is ontvangen, dan wel zodra de Klant gereed is om het Voertuig weer in ontvangst te nemen.',
      },
      {
        text: 'Nadat de Klant de in het vorige lid bedoelde melding heeft gedaan, wordt het Voertuig in beginsel binnen 10 minuten teruggebracht. Deze termijn van 10 minuten geldt uitsluitend als indicatieve streeftermijn en nimmer als fatale termijn. De Klant dient in elk geval rekening te houden met een redelijke marge in afgesproken tijden in verband met verkeersdrukte, veiligheidsmaatregelen, luchthavenomstandigheden, piekbelasting, weersomstandigheden, vluchtgerelateerde omstandigheden en andere onvoorziene factoren.',
      },
    ],
  },

  {
    number: 7,
    title: 'Uitvoering van Shuttle Parking',
    clauses: [
      {
        text: 'Bij Shuttle Parking rijdt de Klant zelf naar de door The Parking Company of de Uitvoerende Partij aangewezen parkeerlocatie. Tenzij uitdrukkelijk anders is overeengekomen, parkeert de Klant het Voertuig daar zelf, sluit het Voertuig af en houdt de sleutel zelf onder zich. De Klant en zijn eventuele medepassagiers worden vervolgens door de Uitvoerende Partij per shuttlevervoer naar Schiphol gebracht.',
      },
      {
        text: 'Bij terugkomst worden de Klant en zijn eventuele medepassagiers weer per shuttlevervoer opgehaald en teruggebracht naar de parkeerlocatie.',
      },
      {
        text: 'Tijden voor vertrek, ophalen en terugvervoer zijn indicatief. The Parking Company spant zich in voor een behoorlijke uitvoering, maar kan geen exacte wachttijden of vertrektijden garanderen.',
      },
      {
        text: 'Indien de uitvoering van Shuttle Parking operationeel redelijkerwijs vereist dat nadere instructies worden gevolgd, is de Klant gehouden deze instructies op te volgen.',
      },
    ],
  },

  {
    number: 8,
    title: 'Operationele communicatie en klantcontact',
    clauses: [
      {
        text: 'Operationele vragen over aankomst, ophalen, afleveren, inleveren, terugkomst, wachttijden, ritten, chauffeurs, shuttlevervoer en vergelijkbare uitvoeringskwesties dienen door de Klant rechtstreeks te worden afgestemd via het opgegeven operationele telefoonnummer.',
      },
      {
        text: 'Algemene vragen, servicevragen, klachten en niet zuiver operationele vragen kunnen door de Klant worden gericht aan info@valetparkingschiphol.nl.',
      },
      {
        text: 'De Klant is gehouden bereikbaar te zijn op de door hem verstrekte contactgegevens voor zover dit voor de uitvoering van de Reservering noodzakelijk is.',
      },
    ],
  },

  {
    number: 9,
    title: 'Verplichtingen van de Klant',
    clauses: [
      {
        text: 'De Klant staat ervoor in dat hij alle voor de uitvoering van de Overeenkomst van belang zijnde informatie juist, volledig en tijdig verstrekt.',
      },
      {
        text: 'Het aanleveren en in ontvangst nemen van het Voertuig is uitsluitend toegestaan aan personen van 18 jaar of ouder die bevoegd zijn over het Voertuig te beschikken en, voor zover relevant, beschikken over een geldig rijbewijs.',
      },
      {
        text: 'De Klant staat ervoor in dat het Voertuig deugdelijk is onderhouden, verkeersveilig is en voldoet aan de wettelijke eisen om aan het verkeer deel te nemen.',
      },
      {
        text: 'De Klant staat ervoor in dat op het Voertuig ten minste een wettelijk verplichte WA-verzekering van kracht is en gedurende de looptijd van de Overeenkomst van kracht blijft.',
      },
      {
        text: 'De Klant is gehouden waardevolle zaken, geld, sieraden, elektronica, reisdocumenten en andere kostbare of gemakkelijk verplaatsbare goederen uit het Voertuig te verwijderen vóór aanvang van de Dienstverlening.',
      },
      {
        text: 'De Klant dient ervoor zorg te dragen dat het Voertuig op een normale en veilige wijze kan worden aangenomen, verplaatst, geparkeerd of gebruikt in het kader van de overeengekomen Dienst.',
      },
      {
        text: 'De Klant is gehouden alle redelijke instructies van The Parking Company en de Uitvoerende Partij op te volgen die voor de uitvoering van de Overeenkomst nodig zijn.',
      },
      {
        text: 'De Klant dient tijdig aanwezig te zijn op de afgesproken plaats en tijd.',
      },
      {
        text: 'Indien de Klant niet tijdig verschijnt of onvoldoende meewerkt aan een vlotte overdracht of afhandeling, komen de daaruit voortvloeiende extra kosten, vertragingen en nadelige gevolgen voor rekening van de Klant.',
      },
      {
        text: 'De Klant mag geen betalingen verrichten aan chauffeurs, medewerkers of andere personen die namens de Uitvoerende Partij handelen. Betaling aan een chauffeur of andere personen die namens de Uitvoerende Partij handelen, bevrijdt de Klant niet van zijn betalingsverplichtingen jegens The Parking Company.',
      },
    ],
  },

  {
    number: 10,
    title: 'Vluchtgegevens en wijzigingen in reisinformatie',
    clauses: [
      {
        text: 'De Klant kan bij de Reservering vluchtgegevens verstrekken, maar is daartoe niet verplicht. Voor zover vluchtgegevens door de Klant worden verstrekt, mogen deze door of namens The Parking Company worden gebruikt voor de operationele planning en monitoring van de uitvoering.',
      },
      {
        text: 'Indien de Klant geen vluchtgegevens verstrekt, onjuiste vluchtgegevens verstrekt of gewijzigde vluchtgegevens niet tijdig doorgeeft, komt het risico van daardoor veroorzaakte vertragingen, langere wachttijden of andere operationele nadelen voor rekening van de Klant.',
      },
      {
        text: 'Reiswijzigingen, vluchtschemawijzigingen, verlengingen en andere relevante wijzigingen dienen door de Klant zo spoedig mogelijk na bekendwording te worden doorgegeven via wijzigingen@valetparkingschiphol.nl.',
      },
      {
        text: 'The Parking Company zal zich inspannen om tijdig doorgegeven wijzigingen te verwerken, maar kan niet garanderen dat iedere wijziging nog zonder gevolgen voor de uitvoering kan worden verwerkt.',
      },
    ],
  },

  {
    number: 11,
    title: 'Parkeerlocaties en beveiliging',
    clauses: [
      {
        text: 'The Parking Company is gerechtigd het Voertuig te laten stallen op één of meer parkeerlocaties die door of namens haar worden gebruikt of aangewezen.',
      },
      {
        text: 'Voertuigen kunnen worden gestald op buitenlocaties, verharde onoverdekte terreinen, terreinen met slagbomen, terreinen met gedeeltelijk cameratoezicht of andere parkeerlocaties die naar het oordeel van The Parking Company of de Uitvoerende Partij passend zijn voor de uitvoering van de Dienst.',
      },
      {
        text: 'De Klant aanvaardt dat het Voertuig niet noodzakelijkerwijs (voortdurend) wordt gestald op de locatie waar het Voertuig is afgegeven of op een locatie die vooraf individueel aan de Klant is meegedeeld.',
      },
      {
        text: 'Aanwezigheid van cameratoezicht, slagbomen, afsluiting, terreinbeheer of andere beveiligingsmaatregelen betekent niet dat ieder risico op schade, diefstal, vermissing, inbraak of vandalisme is uitgesloten.',
      },
      {
        text: 'The Parking Company geeft geen garantie dat alle parkeerlocaties volledig en permanent onder cameratoezicht staan of dat iedere parkeerplaats afzonderlijk zichtbaar is op camera.',
      },
      {
        text: 'Mededelingen over beveiliging, toezicht of afsluiting moeten worden opgevat in het licht van de feitelijke situatie ter plaatse en niet als een resultaatsgarantie.',
      },
    ],
  },

  {
    number: 12,
    title: 'Prijzen, boekingskosten en betaling',
    clauses: [
      {
        text: 'Het aanbod van The Parking Company vermeldt de voor de Diensten geldende prijs.',
      },
      {
        text: 'The Parking Company is gerechtigd haar prijzen te wijzigen, met dien verstande dat prijswijzigingen geen betrekking hebben op reeds tot stand gekomen Overeenkomsten.',
      },
      {
        text: 'Voor iedere Reservering worden boekingskosten van € 2,50 inclusief btw in rekening gebracht. Een aanbod gericht aan Consumenten vermeldt deze boekingskosten uitdrukkelijk.',
      },
      {
        text: 'Betaling geschiedt aan The Parking Company via een van de door haar aangeboden betaalmethode(n).',
      },
      {
        text: 'The Parking Company is gerechtigd betaling vooraf of na de Reservering te verlangen, al naar gelang de door haar aangeboden of toegestane betaalwijze. In geval van voorafbetaling is The Parking Company niet eerder gehouden om uitvoering aan de Reservering te geven dan nadat de voorafbetaling volledig is voldaan.',
      },
      {
        text: 'Indien betaling achteraf plaatsvindt, geldt een betalingstermijn van 14 dagen na factuurdatum, tenzij uitdrukkelijk anders is overeengekomen.',
      },
      {
        text: 'Indien geen tijdige betaling plaatsvindt, treedt het verzuim van de Zakelijke Klant van rechtswege in. Vanaf de dag dat het verzuim intreedt, is de Zakelijke Klant over het openstaande bedrag de wettelijke handelsrente verschuldigd. Indien de Klant een Consument is, treedt het verzuim niet eerder in dan nadat de Consument Schriftelijk is aangemaand tot betaling binnen een termijn van 14 dagen na de dag van ontvangst van de aanmaning en betaling binnen deze termijn is uitgebleven. Vanaf het moment dat het verzuim van de Consument intreedt, is de Consument over het openstaande bedrag de wettelijke rente verschuldigd.',
      },
      {
        text: 'Alle redelijke kosten, zowel gerechtelijke als buitengerechtelijke incassokosten, gemaakt ter verkrijging van de door de Klant verschuldigde bedragen, komen voor rekening van de Klant.',
      },
      {
        text: 'The Parking Company is gerechtigd facturen en betalingsverzoeken uitsluitend langs elektronische weg aan de Klant beschikbaar te stellen.',
      },
    ],
  },

  {
    number: 13,
    title: 'Klachten en melding van schade',
    clauses: [
      {
        text: 'De Klant is gehouden het Voertuig bij terugontvangst direct te controleren op zichtbare schade en andere onregelmatigheden.',
      },
      {
        text: 'Zichtbare of anderszins direct merkbare schade dient door de Klant onmiddellijk bij terugontvangst van het Voertuig te worden gemeld aan The Parking Company of de op dat moment aanwezige operationele contactpersoon.',
      },
      {
        text: 'De Klant dient een schademelding vervolgens zo spoedig mogelijk en zo volledig mogelijk Schriftelijk aan The Parking Company te bevestigen, onder bijvoeging van relevante foto’s, omschrijving van de schade en overige relevante informatie.',
      },
      {
        text: 'Later gemelde schade wordt slechts in behandeling genomen indien en voor zover voldoende aannemelijk is dat de schade tijdens de uitvoering van de Dienstverlening is ontstaan.',
      },
      {
        text: 'Iedere andere klacht omtrent de uitvoering van de Overeenkomst dient door de Klant zo spoedig mogelijk na constatering, althans nadat de Klant de klacht redelijkerwijs had kunnen constateren, Schriftelijk aan The Parking Company te worden gemeld.',
      },
      {
        text: 'Een klacht schort de betalingsverplichtingen van de Klant niet op, behoudens voor zover de wet daaraan ten behoeve van de Consument dwingend in de weg staat.',
      },
      {
        text: 'The Parking Company is steeds gerechtigd een klacht of schadeclaim te onderzoeken of te laten onderzoeken en de Klant is gehouden daaraan alle redelijke medewerking te verlenen.',
      },
      {
        text: 'Voor Zakelijke Klanten geldt dat schade of klachten die niet uiterlijk binnen 24 uur na constatering Schriftelijk zijn gemeld, als te laat gemeld worden beschouwd.',
      },
      {
        text: 'Voor Consumenten geldt dat The Parking Company een melding niet op uitsluitend formele gronden zal afwijzen indien de Consument de klacht of schade binnen bekwame tijd heeft gemeld en de aard van het geval meebrengt dat een later moment redelijk is.',
      },
    ],
  },

  {
    number: 14,
    title: 'Aansprakelijkheid algemeen',
    clauses: [
      {
        text: 'The Parking Company is gehouden de Overeenkomst met de zorg te laten uitvoeren die in de gegeven omstandigheden redelijkerwijs van haar mag worden verwacht.',
      },
      {
        text: 'The Parking Company is niet aansprakelijk voor schade ontstaan als gevolg van door de Klant verstrekte onjuiste of onvolledige gegevens, het niet opvolgen van instructies, het niet of niet tijdig verstrekken van vluchtgegevens, gebreken aan het Voertuig, omstandigheden die redelijkerwijs voor rekening van de Klant komen of andere aan de Klant toe te rekenen omstandigheden.',
      },
      {
        text: 'The Parking Company is niet aansprakelijk voor verlies van, diefstal van of schade aan losse of achtergelaten eigendommen in het Voertuig.',
      },
      {
        text: 'The Parking Company is niet gehouden schade aan de Klant te vergoeden voor zover de Klant ter zake daarvan daadwerkelijk vergoeding ontvangt uit hoofde van een verzekering, onverminderd eventuele wettelijke regresrechten van de verzekeraar en onverminderd aansprakelijkheid van The Parking Company voor zover deze op grond van dwingend recht niet kan worden uitgesloten of beperkt.',
      },
      {
        text: 'The Parking Company is niet aansprakelijk voor indirecte schade, waaronder mede begrepen gevolgschade, gederfde winst, gemiste besparingen, gemiste inkomsten, gemiste zakelijke kansen, schade wegens gemiste vluchten, vertragingen in reis- of werkschema’s en schade door bedrijfsstagnatie, behoudens voor zover dwingend recht dit ten aanzien van Consumenten verhindert.',
      },
      {
        text: 'The Parking Company is niet aansprakelijk voor schade als gevolg van omstandigheden op of rondom Schiphol, verkeersdrukte, wegafsluitingen, veiligheidsmaatregelen, vertragingen in het bagageproces, vluchtvertragingen, vervroegde aankomsten of andere externe omstandigheden die de uitvoering beïnvloeden en niet aan The Parking Company kunnen worden toegerekend.',
      },
      {
        text: 'Indien The Parking Company ondanks het bepaalde in deze algemene voorwaarden aansprakelijk mocht zijn, is zij, behoudens voor zover dwingend recht dit ten aanzien van Consumenten verhindert, slechts aansprakelijk voor directe schade. Onder directe schade wordt uitsluitend verstaan:',
        sub: [
          'de redelijke kosten ter vaststelling van de oorzaak en omvang van de schade, voor zover de vaststelling betrekking heeft op schade die in de zin van deze algemene voorwaarden voor vergoeding in aanmerking komt;',
          'de eventuele redelijke kosten gemaakt om de gebrekkige prestatie van The Parking Company aan de Overeenkomst te laten beantwoorden, voor zover deze aan The Parking Company kunnen worden toegerekend;',
          'de redelijke kosten, gemaakt ter voorkoming of beperking van schade, voor zover de Klant aantoont dat deze kosten hebben geleid tot beperking van directe schade als bedoeld in deze algemene voorwaarden.',
        ],
      },
      {
        text: 'Iedere aansprakelijkheid van The Parking Company vervalt indien de Klant niet tijdig klaagt overeenkomstig artikel 13.',
      },
      {
        text: 'Voor Zakelijke Klanten is iedere aansprakelijkheid van The Parking Company beperkt tot ten hoogste het factuurbedrag van de betreffende Reservering. Voor Consumenten geldt dat aansprakelijkheidsbeperkingen van The Parking Company niet verder strekken dan wettelijk is toegestaan en nimmer afdoen aan aansprakelijkheid van The Parking Company in gevallen waarin uitsluiting of beperking naar maatstaven van redelijkheid en billijkheid onaanvaardbaar zou zijn.',
      },
      {
        text: 'De aansprakelijkheidsbeperkende clausules in deze algemeen voorwaarden gelden niet indien de schade is veroorzaakt door opzet of bewuste roekeloosheid van The Parking Company of van leidinggevend personeel van The Parking Company.',
      },
    ],
  },

  {
    number: 15,
    title: 'Overmacht',
    clauses: [
      {
        text: 'The Parking Company is niet gehouden tot het nakomen van enige verplichting uit de Overeenkomst indien en voor zolang zij daartoe gehinderd wordt door een omstandigheid die haar krachtens de wet, een rechtshandeling of in het maatschappelijk verkeer geldende opvattingen niet kan worden toegerekend (overmacht).',
      },
      {
        text: 'Onder overmacht wordt mede verstaan: extreme verkeersdrukte, wegafsluitingen, luchthavenmaatregelen, stakingen, storingen in systemen of koppelingen, uitval van communicatieverbindingen, overheidsmaatregelen, pandemieën, weersomstandigheden, calamiteiten en andere omstandigheden waarop The Parking Company of de Uitvoerende Partij redelijkerwijs geen invloed kan uitoefenen.',
      },
      {
        text: 'Indien de overmachtssituatie de nakoming blijvend onmogelijk maakt, zijn Partijen gerechtigd de Overeenkomst geheel of gedeeltelijk te ontbinden, zonder recht op aanvullende schadevergoeding.',
      },
      {
        text: 'Indien The Parking Company bij het intreden van de overmachtssituatie reeds gedeeltelijk aan haar verplichtingen heeft voldaan of nog gedeeltelijk kan voldoen, is zij gerechtigd het reeds uitgevoerde gedeelte afzonderlijk in rekening te brengen als ware sprake van een zelfstandige Overeenkomst.',
      },
      {
        text: 'Schade als gevolg van overmacht komt niet voor vergoeding in aanmerking.',
      },
    ],
  },

  {
    number: 16,
    title: 'Opschorting, ontbinding en weigering van uitvoering',
    clauses: [
      {
        text: 'The Parking Company is, indien de tekortkoming van de Klant zulks redelijkerwijs rechtvaardigt, bevoegd de uitvoering van de Overeenkomst op te schorten, te weigeren of de Overeenkomst met onmiddellijke ingang geheel of gedeeltelijk te ontbinden, indien:',
        sub: [
          'de Klant zijn verplichtingen uit de Overeenkomst niet, niet tijdig of niet volledig nakomt;',
          'na het sluiten van de Overeenkomst The Parking Company ter kennis gekomen omstandigheden goede grond geven te vrezen dat de Klant zijn verplichtingen niet zal nakomen;',
          'de Klant onjuiste of misleidende gegevens verstrekt;',
          'uitvoering van de Overeenkomst door gedragingen of omstandigheden aan de zijde van de Klant onveilig, onredelijk bezwarend of praktisch onuitvoerbaar wordt.',
        ],
      },
      {
        text: 'Indien de Klant niet tijdig aanwezig is, niet bereikbaar is of anderszins onvoldoende medewerking verleent, is The Parking Company gerechtigd de uitvoering aan te passen, uit te stellen of te beëindigen en de daarmee gepaard gaande kosten aan de Klant door te berekenen.',
      },
      {
        text: 'De Klant is verplicht de schade die The Parking Company ten gevolge van opschorting, weigering of ontbinding lijdt, te vergoeden.',
      },
    ],
  },

  {
    number: 17,
    title: 'Website en elektronische communicatie',
    clauses: [
      {
        text: 'The Parking Company spant zich in om de goede werking en bereikbaarheid van haar Website, reserveringssysteem, betaalomgeving en communicatiekanalen te bevorderen, maar kan niet garanderen dat deze steeds zonder onderbreking, foutloos of volledig beschikbaar zijn.',
      },
      {
        text: 'Elektronische communicatie, elektronische bevestigingen en digitale administraties van The Parking Company leveren, behoudens tegenbewijs, dwingend bewijs op van de inhoud en het tijdstip van de betreffende communicatie en handelingen.',
      },
    ],
  },

  {
    number: 18,
    title: 'Privacy en persoonsgegevens',
    clauses: [
      {
        text: 'The Parking Company verwerkt persoonsgegevens van de Klant in overeenstemming met de toepasselijke privacywetgeving.',
      },
      {
        text: 'Persoonsgegevens worden verwerkt voor zover dat noodzakelijk is voor het aangaan en uitvoeren van de Overeenkomst, het verwerken van Reserveringen, betalingen, klantenservice, klachtenafhandeling, operationele uitvoering en daarmee samenhangende doeleinden.',
      },
      {
        text: 'The Parking Company is gerechtigd persoonsgegevens en Reserveringsgegevens te delen met Uitvoerende Partijen en andere ingeschakelde derden voor zover dat voor de uitvoering van de Overeenkomst noodzakelijk is of een gerechtvaardigd belang van The Parking Company dient.',
      },
      {
        text: 'Nadere informatie over de verwerking van persoonsgegevens is opgenomen in een afzonderlijke privacyverklaring van The Parking Company op de Website.',
      },
    ],
  },

  {
    number: 19,
    title: 'Slotbepalingen',
    clauses: [
      {
        text: 'Op elke Overeenkomst en alle daaruit tussen Partijen voortvloeiende rechtsverhoudingen is uitsluitend Nederlands recht van toepassing.',
      },
      {
        text: 'Alvorens een beroep te doen op de rechter, zijn Partijen verplicht zich optimaal in te spannen om het geschil in onderling overleg te beslechten.',
      },
      {
        text: 'Uitsluitend de bevoegde rechter binnen het arrondissement van de rechtbank Amsterdam wordt in eerste aanleg aangewezen om van eventuele gerechtelijke geschillen tussen Partijen kennis te nemen, onverminderd het recht van The Parking Company een andere volgens de wet bevoegde rechter aan te wijzen. Een Consument is evenwel gerechtigd de volgens de wet bevoegde rechter te kiezen binnen een maand nadat The Parking Company Schriftelijk heeft aangekondigd bij de door hem aangewezen rechter te willen procederen.',
      },
    ],
  },
];
