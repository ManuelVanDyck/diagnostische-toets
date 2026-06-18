// Per gebied en niveau: specifieke feedback voor de leerling
export interface NiveauFeedback {
  kan: string      // Wat je al kan
  beheerst: string // Welke regels/formules je beheerst
  werk_aan: string // Waar je nog aan moet werken
}

// Feedback per gebied (A-G), per niveau (0-5)
export const GEBIED_FEEDBACK: Record<string, Record<number, NiveauFeedback>> = {
  A: {
    0: {
      kan: 'Je herkent enkele basisbegrippen over getallen.',
      beheerst: 'De natuurlijke getallen (0, 1, 2, …).',
      werk_aan: 'Oefen op het verschil tussen N, Z en Q. Leer verzamelingen noteren en symbolen zoals ∈, ⊂, ∪ en ∩ correct gebruiken. Begin met het ordenen van gehele getallen op een getallenas.',
    },
    1: {
      kan: 'Je herkent de verschillende getalverzamelingen (N, Z, Q) en basisbegrippen zoals unie en doorsnede.',
      beheerst: 'Notatie van verzamelingen, symbolen ∈ en ⊂, en het ordenen van gehele getallen.',
      werk_aan: 'Oefen op het rekenen met ggd en kgv. Leer verzamelingen door opsomming te geven en werk met venndiagrammen.',
    },
    2: {
      kan: 'Je ordent getallen correct, bepaalt ggd en kgv, en werkt vlot met unie en doorsnede van verzamelingen.',
      beheerst: 'Verzamelingenleer (∩, ∪, \\), ggd en kgv, ordenen van rationale getallen.',
      werk_aan: 'Werk aan priemfactorisatie, het herkennen van priemgetallen, en het noteren van irrationaal vs. rationaal. Probeer meerdere stappen te combineren in één oefening.',
    },
    3: {
      kan: 'Je combineert verzamelingenleer met getallenkennis en voert priemfactorisatie correct uit.',
      beheerst: 'Priemfactorisatie, venndiagrammen, verschil van verzamelingen (\\), irrationaal vs. rationaal.',
      werk_aan: 'Oefen op complexere verzamelingsvraagstukken en het redeneren over deelverzamelingen in realistische contexten.',
    },
    4: {
      kan: 'Je analyseert verzamelingen, legt verbanden tussen ggd en priemfactorisatie, en werkt met reële getallen.',
      beheerst: 'Priemfactorisatie, ggd via priemfactoren, alle verzamelingsbewerkingen.',
      werk_aan: 'Probeer open vraagstukken waarbij je zelf een redenering moet opbouwen over getalverzamelingen en deelbaarheid.',
    },
    5: {
      kan: 'Je hebt diep inzicht in getalverzamelingen en past dit zelfstandig toe in nieuwe situaties.',
      beheerst: 'Volledige getallenkennis: N, Z, Q, R, priemgetallen, ggd, kgv, verzamelingen.',
      werk_aan: 'Je beheerst dit gebied volledig. Blijf oefenen om het te onderhouden.',
    },
  },

  B: {
    0: {
      kan: 'Je herkent de basisbewerkingen (+, −, ·, :).',
      beheerst: 'Optellen en aftrekken met positieve getallen.',
      werk_aan: 'Leer de tekenregels voor negatieve getallen. Oefen op eenvoudige volgorde van bewerkingen: eerst haakjes, dan × en :, dan + en −. Herhaal de tafels.',
    },
    1: {
      kan: 'Je kent de eigenschappen van bewerkingen: commutativiteit, associativiteit, distributiviteit. Je benoemt wat een opslorpend en neutraal element is.',
      beheerst: 'Basisbegrippen: eigenschappen benoemen, volgorde van bewerkingen opnoemen.',
      werk_aan: 'Oefen op rekenen met negatieve getallen (optellen, aftrekken). Pas de distributieve eigenschap toe op eenvoudige voorbeelden.',
    },
    2: {
      kan: 'Je rekent correct met gehele getallen en past de distributieve eigenschap toe.',
      beheerst: 'Optellen, aftrekken, vermenigvuldigen en delen in Z. Volgorde van bewerkingen.',
      werk_aan: 'Oefen met machten en vierkantswortels in berekeningen. Werk aan gedurige producten en de tekenregel bij oneven/even aantal negatieve factoren.',
    },
    3: {
      kan: 'Je beheerst de volgorde van bewerkingen met machten en wortels, en past eigenschappen correct toe.',
      beheerst: 'Rekenen met machten, vierkantswortels, distributiviteit, volgorde van bewerkingen.',
      werk_aan: 'Werk aan complexere uitdrukkingen met meerdere haakjes, machten en wortels in één oefening. Bewijs eigenschappen zoals niet-commutativiteit van aftrekken.',
    },
    4: {
      kan: 'Je combineert machten, wortels en absolute waarde in één berekening en doorziet de structuur.',
      beheerst: 'Machten met negatieve exponenten, derdemachtswortels, absolute waarde.',
      werk_aan: 'Oefen met abstractere opgaven waarbij je zelf de volgorde moet bepalen in complexe uitdrukkingen.',
    },
    5: {
      kan: 'Je hebt volledig inzicht in alle rekenregels en past ze foutloos toe in complexe uitdrukkingen.',
      beheerst: 'Alle bewerkingen in R, machten, wortels, absolute waarde, eigenschappen en bewijsvoering.',
      werk_aan: 'Alles onder de knie. Blijf complexe oefeningen maken om scherp te blijven.',
    },
  },

  C: {
    0: {
      kan: 'Je herkent letters als plaatsvervangers voor getallen.',
      beheerst: 'Het concept van een variabele.',
      werk_aan: 'Leer het verschil tussen een eenterm (bv. 3x) en een veelterm (bv. 5m + 3). Oefen op het benoemen van coëfficiënt en variabele.',
    },
    1: {
      kan: 'Je onderscheidt eentermen van veeltermen en herkent gelijksoortige termen.',
      beheerst: 'Basisbegrippen: eenterm, veelterm, coëfficiënt, variabele, gelijksoortige termen.',
      werk_aan: 'Oefen op het herleiden van eenvoudige uitdrukkingen (bv. 5x + 8x = 13x) en het invullen van getalwaarden.',
    },
    2: {
      kan: 'Je herleidt eenvoudige uitdrukkingen en berekent getalwaarden door substitutie.',
      beheerst: 'Herleiden, getalwaarde bepalen, distributieve eigenschap met letters (bv. 4·(x−y) = 4x−4y).',
      werk_aan: 'Oefen op het wegwerken van haakjes bij uitdrukkingen met negatieve coëfficiënten en meerdere termen.',
    },
    3: {
      kan: 'Je werkt vlot met algebraïsche uitdrukkingen: haakjes wegwerken, herleiden, getalwaarde bepalen.',
      beheerst: 'Volledige distributieve eigenschap, substitutie in veeltermen, haakjes wegwerken.',
      werk_aan: 'Oefen op formules omvormen (druk één variabele uit in functie van een andere) en het opstellen van een formule bij een verhaal.',
    },
    4: {
      kan: 'Je herleidt complexe uitdrukkingen met haakjes en combineert meerdere algebraïsche stappen.',
      beheerst: 'Product van tweetermen, formules omvormen, haakjes wegwerken en vereenvoudigen.',
      werk_aan: 'Werk aan het omvormen van formules met meerdere variabelen (bv. F = 1,8C + 32 → C = …) en het herkennen van patronen.',
    },
    5: {
      kan: 'Je beheerst algebra volledig: je vormt formules om, stelt voorschriften op en werkt met veeltermen van hogere graad.',
      beheerst: 'Alle algebraïsche vaardigheden: herleiden, omvormen, distributiviteit, substitutie.',
      werk_aan: 'Je bent klaar voor gevorderde algebra. Blijf oefenen op complexe omvormingen.',
    },
  },

  D: {
    0: {
      kan: 'Je begrijpt wat een vergelijking is (linkerlid = rechterlid).',
      beheerst: 'Het concept van een oplossing: een waarde die de vergelijking laat kloppen.',
      werk_aan: 'Oefen op het vertalen van eenvoudige zinnen naar een vergelijking (bv. "vier meer dan een getal" → p + 4). Los eenvoudige vergelijkingen op zoals x + 3 = 7.',
    },
    1: {
      kan: 'Je vertaalt eenvoudige zinnen naar vergelijkingen en herkent of een getal een oplossing is.',
      beheerst: 'Basisvergelijkingen, oplossing controleren door substitutie.',
      werk_aan: 'Oefen op het oplossen van eenvoudige eerstegraadsvergelijkingen met de balansmethode (bv. x + 12 = −2, −8x = 24).',
    },
    2: {
      kan: 'Je lost eenvoudige eerstegraadsvergelijkingen correct op met de balansmethode.',
      beheerst: 'Eerstegraadsvergelijkingen van de vorm ax + b = c en ax = b.',
      werk_aan: 'Oefen op vergelijkingen met de onbekende in beide leden (bv. 3(x−2) = 2x + 5) en werk met vergelijkingen uit een verhaal.',
    },
    3: {
      kan: 'Je lost eerstegraadsvergelijkingen op, ook met haakjes, en vertaalt een verhaal naar een vergelijking.',
      beheerst: 'Eerstegraadsvergelijkingen met haakjes, verhaal → vergelijking.',
      werk_aan: 'Oefen op vergelijkingen met procenten (bv. 5% van x = 15) en eerstegraadsongelijkheden. Probeer vraagstukken met twee onbekenden op te lossen.',
    },
    4: {
      kan: 'Je lost complexe eerstegraadsvergelijkingen op en doorziet de structuur van het probleem.',
      beheerst: 'Vergelijkingen met haakjes en meerdere stappen, procentvraagstukken.',
      werk_aan: 'Werk aan ongelijkheden en het opstellen van vergelijkingen bij complexere verhaaltjes met meerdere condities.',
    },
    5: {
      kan: 'Je beheerst vergelijkingen volledig: opstellen, oplossen, controleren en interpreteren.',
      beheerst: 'Alle eerstegraadsvergelijkingen en -ongelijkheden, vraagstukken.',
      werk_aan: 'Klaar voor stelsels van vergelijkingen. Blijf complexe vraagstukken oefenen.',
    },
  },

  E: {
    0: {
      kan: 'Je herkent een assenstelsel met x- en y-as.',
      beheerst: 'De begrippen x-coördinaat en y-coördinaat.',
      werk_aan: 'Oefen op het aflezen van coördinaten van een punt. Leer de vier kwadranten benoemen.',
    },
    1: {
      kan: 'Je leest coördinaten af en plaatst punten in een assenstelsel. Je weet wat de vier kwadranten zijn.',
      beheerst: 'Coördinaten, kwadranten, assenstelsel.',
      werk_aan: 'Leer het functiebegrip: wat is een functie? Welke voorstellingswijzen zijn er (tabel, grafiek, voorschrift)? Oefen met eenvoudige tabellen.',
    },
    2: {
      kan: 'Je werkt met tabellen en grafieken, en herkent stijgen en dalen. Je bepaalt het snijpunt met de y-as.',
      beheerst: 'Tabel → grafiek, stijgen/dalen, snijpunt y-as bij een eerstegraadsfunctie.',
      werk_aan: 'Oefen op het opstellen van een functievoorschrift uit een tabel of verhaal. Bepaal de rico van een eerstegraadsfunctie.',
    },
    3: {
      kan: 'Je werkt vlot met eerstegraadsfuncties: rico, snijpunt y-as, nulwaarde en tekenverloop.',
      beheerst: 'Eerstegraadsfuncties: voorschrift, tabel, grafiek, rico, nulwaarde.',
      werk_aan: 'Oefen op het omzetten tussen verschillende voorstellingswijzen (voorschrift ↔ grafiek ↔ tabel) en het interpreteren van een functie in een realistische context.',
    },
    4: {
      kan: 'Je analyseert functies: je bepaalt nulwaarden, tekenverloop en domein/bereik.',
      beheerst: 'Volledige eerstegraadsfunctie-analyse: domein, bereik, nulwaarde, tekenverloop.',
      werk_aan: 'Werk aan ongelijkheden grafisch oplossen en het vergelijken van twee functies (snijpunt bepalen).',
    },
    5: {
      kan: 'Je hebt diep inzicht in functies en past dit toe in nieuwe, onbekende situaties.',
      beheerst: 'Alle aspecten van functies: voorschrift, grafiek, analyse, interpretatie.',
      werk_aan: 'Klaar voor tweedegraadsfuncties. Blijf grafieken interpreteren in realistische contexten.',
    },
  },

  F: {
    0: {
      kan: 'Je herkent basisvormen: rechthoek, vierkant, cirkel, driehoek.',
      beheerst: 'Het verschil tussen omtrek (rondom) en oppervlakte (binnenkant).',
      werk_aan: 'Leer de formules voor omtrek en oppervlakte van een rechthoek en vierkant. Oefen met eenvoudige berekeningen.',
    },
    1: {
      kan: 'Je kent de formules voor omtrek, oppervlakte en volume van basisvormen.',
      beheerst: 'Omtrek: rechthoek, vierkant, cirkel. Oppervlakte: rechthoek, driehoek, cirkel. Volume: balk, kubus.',
      werk_aan: 'Oefen op het toepassen van deze formules met concrete getallen. Let op de juiste eenheden (cm, cm², cm³).',
    },
    2: {
      kan: 'Je berekent correct omtrek, oppervlakte en volume voor basisvormen.',
      beheerst: 'Omtrek cirkel (2πr), oppervlakte cirkel (πr²), oppervlakte driehoek (b·h/2), volume balk (l·b·h).',
      werk_aan: 'Oefen met samengestelde figuren. Werk met schaal (1:500) en reken om tussen verschillende eenheden (cm → m).',
    },
    3: {
      kan: 'Je berekent oppervlakte en volume van basisvormen en werkt met schaal.',
      beheerst: 'Alle formules voor omtrek, oppervlakte en volume, schaalberekeningen.',
      werk_aan: 'Oefen op samengestelde ruimtefiguren. Begrijp wat er met omtrek, oppervlakte en volume gebeurt bij schaalverandering.',
    },
    4: {
      kan: 'Je werkt met samengestelde figuren en begrijpt schaalverandering.',
      beheerst: 'Samengestelde oppervlaktes (overlap correct verrekenen), schaal 1:k.',
      werk_aan: 'Oefen met complexe samengestelde figuren. Verdiep je in het effect van vergroting: lengte ×k, oppervlakte ×k², volume ×k³.',
    },
    5: {
      kan: 'Je beheerst alle meetkundige formules en past ze toe in complexe situaties.',
      beheerst: 'Alle formules, schaalverandering, samengestelde figuren en ruimtefiguren.',
      werk_aan: 'Klaar voor analytische meetkunde. Blijf ruimtelijk inzicht oefenen.',
    },
  },

  G: {
    0: {
      kan: 'Je herkent een rechthoekige driehoek en de schuine zijde.',
      beheerst: 'De begrippen rechthoekszijde en schuine zijde.',
      werk_aan: 'Leer de stelling van Pythagoras (a² + b² = c²). Oefen op het herkennen van de schuine zijde.',
    },
    1: {
      kan: 'Je kent de stelling van Pythagoras en de goniometrische formules (SOS CAS TOA).',
      beheerst: 'Pythagoras: a² + b² = c². SOS CAS TOA: sin = ov/sch, cos = aan/sch, tan = ov/aan.',
      werk_aan: 'Oefen op het benoemen van overstaande en aanliggende rechthoekszijde bij een gegeven hoek.',
    },
    2: {
      kan: 'Je past de stelling van Pythagoras toe en berekent sin, cos en tan in eenvoudige driehoeken.',
      beheerst: 'Pythagoras, eenvoudige goniometrie (sin, cos, tan).',
      werk_aan: 'Oefen op toepassingen van Pythagoras in realistische situaties (ladder, diagonaal). Bereken een onbekende zijde met goniometrie.',
    },
    3: {
      kan: 'Je past Pythagoras en goniometrie correct toe, ook in contextopgaven.',
      beheerst: 'Pythagoras in context (ladder, diagonaal), sin/cos/tan berekenen.',
      werk_aan: 'Oefen op de grondformule sin²α + cos²α = 1. Werk aan goniometrische berekeningen waarbij je zelf de juiste formule moet kiezen.',
    },
    4: {
      kan: 'Je combineert Pythagoras met goniometrie en gebruikt de grondformule.',
      beheerst: 'Pythagoras + goniometrie gecombineerd, grondformule, afleiden van tan uit sin en cos.',
      werk_aan: 'Oefen op complexe meetkundige vraagstukken waarbij je meerdere stappen moet combineren.',
    },
    5: {
      kan: 'Je hebt volledig inzicht in goniometrie en Pythagoras en past dit toe in nieuwe contexten.',
      beheerst: 'Alle goniometrische formules, Pythagoras in vlak en ruimte.',
      werk_aan: 'Klaar voor goniometrische cirkel en verdere verdieping. Blijf complexe vraagstukken maken.',
    },
  },
}
