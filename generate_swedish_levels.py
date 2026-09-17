import random, json, string

BANK = [
# easy/common
('APPEL','Fruit met een klokhuis',1),('FIETS','Voertuig met twee wielen',1),('TREIN','Rijdt over rails',1),('STRAND','Zand langs de zee',1),('KAAS','Beleg van melk',1),('BROOD','Komt vaak van de bakker',1),('REGEN','Valt uit wolken',1),('ZOMER','Seizoen na de lente',1),('WINTER','Koudste seizoen',1),('LENTE','Seizoen met veel nieuw groen',1),('HERFST','Seizoen van vallende bladeren',1),('HOND','Blaffend huisdier',1),('KAT','Spinnend huisdier',1),('PAARD','Dier waarop je kunt rijden',1),('BOS','Veel bomen bij elkaar',1),('RIVIER','Stromend water',1),('EILAND','Land met water eromheen',1),('BERG','Hoge natuurlijke verheffing',1),('STAD','Grote bebouwde plaats',1),('DORP','Kleinere woonplaats',1),('MARKT','Plek met kramen',1),('WINKEL','Plek waar je iets koopt',1),('SCHOOL','Plek om te leren',1),('BOEK','Heeft bladzijden',1),('KRANT','Nieuws op papier',1),('MUZIEK','Kun je beluisteren',1),('PIANO','Instrument met toetsen',1),('GITAAR','Snaarinstrument',1),('FILM','Verhaal op het scherm',1),('SERIE','Verhaal in afleveringen',1),('KOFFIE','Drank van gebrande bonen',1),('THEE','Drank van getrokken blaadjes',1),('WATER','Komt uit de kraan',1),('TAFEL','Meubel om aan te zitten',1),('STOEL','Meubel met een rugleuning',1),('DEUR','Hierdoor ga je een kamer in',1),('RAAM','Glas in de gevel',1),('TUIN','Groen stuk bij een huis',1),('BLOEM','Plant met vaak kleurrijke blaadjes',1),('ZON','Ster die overdag licht geeft',1),('MAAN','Zie je vaak in de nacht',1),('STER','Lichtpunt aan de nachtelijke hemel',1),('LUCHT','Wat je inademt',1),('WOLK','Witte of grijze massa in de lucht',1),('WEG','Daar rijdt verkeer over',1),('BRUG','Verbinding over water',1),('PLEIN','Open ruimte in een stad',1),('PARK','Groene openbare plek',1),('SPORT','Bewegen volgens regels',1),('VOETBAL','Sport met een ronde bal',1),('TENNIS','Sport met racket en net',1),('ZWEMMEN','Bewegen door water',1),('LOPEN','Te voet gaan',1),('KOKEN','Eten bereiden',1),('SLAPEN','Wat je meestal ’s nachts doet',1),('DROMEN','Beelden beleven tijdens slaap',1),('LACHEN','Doen als iets grappig is',1),('VRIEND','Iemand met wie je graag omgaat',1),('FAMILIE','Mensen aan wie je verwant bent',1),
# modern / everyday
('APP','Programma op je telefoon',1),('WIFI','Draadloos internet',1),('EMOJI','Klein beeldje in een bericht',1),('SELFIE','Foto die je van jezelf maakt',1),('PODCAST','Luisterprogramma op aanvraag',1),('STREAM','Online uitgezonden beeld of geluid',2),('MEME','Internetgrap in beeld of tekst',1),('SWIPE','Veegbeweging op een scherm',2),('CLOUD','Online opslag, letterlijk ook wolk',2),('PIXEL','Kleinste beeldpunt op een scherm',2),('DRONE','Onbemand vliegend toestel',2),('AVATAR','Digitale verschijning van een gebruiker',2),('ROBOT','Machine die taken zelfstandig uitvoert',1),('GAMEN','Een videospel spelen',1),('GAMER','Iemand die videogames speelt',1),('VLOG','Videodagboek op internet',2),('VIRAL','Razendsnel gedeeld op internet',2),('CHAT','Digitaal gesprek in tekst',1),('LIKE','Digitale blijk van waardering',1),('MATCH','Digitale of sportieve koppeling',2),('UPDATE','Nieuwe versie of bijwerking',1),('LOGIN','Toegang met accountgegevens',1),('ONLINE','Verbonden met internet',1),('OFFLINE','Niet verbonden met internet',1),('QR','Vierkante scanbare code, afgekort',2),('CODE','Reeks tekens of programmeertaal',1),('AI','Kunstmatige intelligentie, afgekort',1),('PROMPT','Opdracht aan een AI-systeem',2),('BOT','Geautomatiseerd programma',1),('FEED','Stroom van berichten in een app',2),('STORY','Tijdelijk bericht op sociale media',2),('REEL','Korte verticale socialvideo',2),('HASHTAG','Woord met een hekje ervoor',2),('INFLUENCER','Online maker met veel bereik',2),('CREATOR','Iemand die online content maakt',2),('CONTENT','Tekst, beeld of audio voor publiek',2),('PLAYLIST','Zelf samengestelde muzieklijst',1),('HEADSET','Koptelefoon met microfoon',1),('LAPTOP','Draagbare computer',1),('TABLET','Plat apparaat met touchscreen',1),('MOBIEL','Telefoon voor onderweg',1),('OPLADER','Geeft je apparaat weer stroom',1),('BATTERIJ','Slaat elektrische energie op',1),('SCHERM','Hierop zie je digitaal beeld',1),('TOUCH','Aanraking als bediening',2),('SCROLL','Door een pagina bewegen',2),('ZOOM','In- of uitvergroten',1),('MUTE','Geluid tijdelijk uit',2),('STICKER','Kleefplaatje, ook digitaal verstuurd',1),('GIF','Korte herhalende animatie',2),('FILTER','Effect op foto of video',1),('PROFILE','Engels voor profiel',3),
# culture/life
('FESTIVAL','Evenement met optredens',1),('CONCERT','Live muziekoptreden',1),('TERRAS','Buitenplek bij horeca',1),('KROEG','Café in informele taal',1),('BRUNCH','Maaltijd tussen ontbijt en lunch',2),('SUSHI','Japanse hap met rijst',1),('TACO','Gevulde Mexicaanse tortilla',1),('RAMEN','Japanse noedelsoep',2),('VEGAN','Zonder dierlijke producten',1),('BARISTA','Koffiespecialist',2),('LATTE','Koffie met veel melk',1),('SMOOTHIE','Dikke drank van gemixt fruit',1),('SNACK','Kleine hap tussendoor',1),('TAKEAWAY','Eten om mee te nemen, Engels',2),('VINTAGE','Ouder maar juist weer stijlvol',2),('SNEAKER','Sportieve schoen',1),('HOODIE','Trui met capuchon',1),('DENIM','Stof waarvan veel spijkerbroeken zijn',2),('TREND','Wat tijdelijk populair is',1),('HYPE','Plotselinge grote aandacht',2),('DESIGN','Vormgeving of ontwerp',1),('STUDIO','Werkruimte voor creatieve makers',1),('STARTUP','Jong snelgroeiend bedrijf',2),('FREELANCE','Werken zonder vast dienstverband',2),('COWORK','Samenwerken vanuit gedeelde werkplek',3),('WORKOUT','Trainingssessie',1),('YOGA','Bewegingsvorm met houdingen',1),('RUNNER','Hardloper of sportschoentype',2),('CITYTRIP','Korte vakantie naar een stad',1),('ROADTRIP','Reis waarbij de route centraal staat',1),('AIRBNB','Platform voor tijdelijke verblijven',2),('HOSTEL','Goedkope gedeelde overnachtingsplek',1),('CABIN','Kleine houten verblijfplek',2),('TINYHOUSE','Zeer compact woonhuis',1),('ECO','Verkort voor milieubewust',2),('SOLAR','Met betrekking tot de zon, Engels',3),('RECYCLE','Opnieuw verwerken, Engels werkwoord',3),
# somewhat trickier common Dutch
('KADER','Grens of raamwerk',2),('SPOOR','Rails of een achtergelaten teken',2),('KERN','Midden of essentie',2),('RUIMTE','Plaats of het heelal',2),('GOLF','Beweging in water of een sport',2),('STROOM','Elektriciteit of bewegend water',2),('NETWERK','Verbonden systeem van mensen of dingen',2),('BRON','Oorsprong van informatie of water',2),('SCHAKEL','Verbindend onderdeel',2),('SLEUTEL','Opent een slot of biedt de oplossing',2),('SPOILER','Verklapt plot of zit op een auto',2),('VOLUME','Geluidssterkte of inhoud',2),('FORMAT','Vaste vorm of bestandsindeling',2),('VLAK','Plat gebied of zonder reliëf',2),('RAND','Buitenkant van een oppervlak',2),('LAAG','Niet hoog of een niveau',2),('DRAAD','Dunne streng of online gesprek',2),('KANAAL','Waterweg of mediakanaal',2),('PLATFORM','Ondergrond of digitaal systeem',2),('SIGNAL','Engels voor signaal',3),('BUFFER','Tijdelijke opslag of tussenruimte',3),('CACHE','Tijdelijk opgeslagen computerdata',3),('TOKEN','Digitaal toegangsbewijs of speelstuk',2),('SEED','Startwaarde voor willekeur, Engels',3),('GRID','Raster, Engels',2),('LEVEL','Niveau in een spel',1),('QUEST','Opdracht in een game',2),('LOOT','Buit of beloning in een game',2),('BOSS','Sterke eindtegenstander in een game',2),('COOP','Samen spelen, verkort',2),('PATCH','Software-update met reparaties',2),('BUG','Programmeerfout',1),('GLITCH','Korte technische hapering',2),('MOD','Aanpassing van een game',2),('INDIE','Onafhankelijk gemaakt, vaak van games of muziek',2),
# extra brede Nederlandse mix: alledaags, cultuur, natuur, techniek en actuele taal
('ANKER','Houdt een schip op zijn plek',1),('BAKKER','Maakt brood en gebak',1),('BRIL','Draag je om beter te zien',1),('BUREAU','Werktafel of kantoor',1),('CAMPING','Vakantieplek voor tent of caravan',1),('DANSEN','Bewegen op muziek',1),('DREMPEL','Verhoging bij een deur of in de weg',1),('DOUCHE','Plek om je af te spoelen',1),('DRUPPEL','Heel klein beetje vloeistof',1),('FLES','Houder voor drank',1),('FLUIT','Blaasinstrument of scheidsrechtersmiddel',1),('FRUIT','Verzamelnaam voor appels en bananen',1),('GORDIJN','Hangt voor een raam',1),('HAVEN','Plek waar schepen aanleggen',1),('IJSJE','Koude zoete traktatie',1),('JAS','Draag je buiten over je kleren',1),('KAST','Meubel met planken of deuren',1),('KUSSEN','Zacht ding onder je hoofd',1),('LAMP','Geeft kunstlicht',1),('LEPEL','Bestek voor soep',1),('MUSEUM','Plek met kunst of erfgoed',1),('NACHT','De donkere helft van een etmaal',1),('OCHTEND','Begin van de dag',1),('PAUZE','Korte onderbreking',1),('PEPER','Kruid dat ook behoorlijk heet kan zijn',1),('POSTER','Grote afbeelding voor aan de muur',1),('RECEPT','Instructie om een gerecht te maken',1),('RUGZAK','Tas die je op je rug draagt',1),('SJAAL','Draag je om je nek',1),('SOKKEN','Draag je aan je voeten',1),('SPIEGEL','Hierin zie je jezelf',1),('TAS','Draagbare houder voor spullen',1),('TENT','Tijdelijk onderkomen van doek',1),('VLINDER','Insect met opvallende vleugels',1),('VORK','Bestek met tanden',1),('WEEKEND','Zaterdag en zondag samen',1),('ZOLDER','Ruimte direct onder het dak',1),('KAMER','Afgesloten ruimte in een gebouw',1),('BANK','Meubel voor meerdere zitters',1),('BED','Meubel om in te slapen',1),('KLOK','Geeft de tijd aan',1),('BORD','Hier eet je vaak van',1),('PAN','Keukengerei om in te koken',1),('OVEN','Verwarmt voedsel rondom',1),('KOELKAST','Houdt eten en drinken koud',1),('HANDDOEK','Gebruik je om je af te drogen',1),('TRAP','Brengt je naar een andere verdieping',1),('DAK','Bovenkant van een gebouw',1),('MUUR','Verticale afscheiding van steen of hout',1),('STRAAT','Weg tussen gebouwen',1),('STEeg'.upper(),'Smalle straat tussen gebouwen',2),('ROTONDE','Rond verkeersknooppunt',1),('STOPLICHT','Rood, oranje en groen in het verkeer',1),('BUS','Openbaar vervoer over de weg',1),('METRO','Stadstrein, vaak ondergronds',1),('TRAM','Rijdt op rails door de stad',1),('TAXI','Auto die je tegen betaling vervoert',1),('HELM','Beschermt je hoofd',1),('REMMEN','Een voertuig langzamer laten gaan',1),('STUREN','Richting geven aan een voertuig',1),('PASPOORT','Reisdocument met persoonsgegevens',1),('Koffer'.upper(),'Bagage voor op reis',1),('HOTEL','Betaalde plek om te overnachten',1),('VAKANTIE','Tijd vrij van werk of school',1),('VLIEGTUIG','Vervoermiddel door de lucht',1),('PERRON','Plek waar je op de trein wacht',1),('TICKET','Toegangsbewijs of vervoerbewijs',1),('ROUTE','Weg van begin naar bestemming',1),('KAART','Plattegrond of speelkaart',1),('KOMPAS','Wijst windrichtingen aan',1),('BROWSER','Programma om websites te openen',2),('COOKIE','Klein webbestandje in je browser',2),('SERVER','Computer die diensten aanbiedt',2),('ROUTER','Verdeelt netwerkverkeer thuis',2),('WEBCAM','Camera voor videobellen',2),('WEBSHOP','Online winkel',1),('PINCODE','Geheime cijfercode',1),('BACKUP','Reservekopie van digitale gegevens',2),('UPLOAD','Bestand naar internet sturen',2),('DOWNLOAD','Bestand naar je apparaat halen',2),('LINK','Klikbare verwijzing',1),('TAB','Apart blad in een browser',1),('MAP','Digitale of papieren verzameling bestanden',1),('BESTAND','Opgeslagen document of data',1),('CURSOR','Aanwijzer op een scherm',2),('TOETSEN','Knoppen op een toetsenbord',1),('WACHTWOORD','Geheime tekst voor toegang',1),('ACCOUNT','Persoonlijk profiel bij een dienst',1),('MELDING','Bericht dat op je scherm verschijnt',1),('PRIVACY','Bescherming van persoonlijke gegevens',2),('STREAMER','Iemand die live online uitzendt',2),('SHORTS','Korte verticale videos',2),('TRENDING','Op dat moment veel bekeken of besproken',2),('ALGORITME','Stappenplan dat een computer uitvoert',2),('DASHBOARD','Scherm met belangrijkste informatie',2),('WIDGET','Klein interactief onderdeel op een scherm',2),('PLUGIN','Uitbreiding voor software',2),('SYNC','Gegevens gelijk houden tussen apparaten',2),('CLOUDS'.replace('S','',1),'Digitale opslag via internet',3),('LASER','Zeer gerichte lichtbundel',1),('MAGNEET','Trekt bepaalde metalen aan',1),('PLANEET','Hemellichaam dat rond een ster draait',1),('KOMEET','IJsachtig hemellichaam met soms een staart',2),('VULKAAN','Berg waar magma uit kan komen',1),('OCEAAN','Enorme hoeveelheid zout water',1),('WOESTIJN','Zeer droog landschap',1),('KORAAL','Kolonie van kleine zeedieren met kalkskelet',2),('MOS','Kleine groene plant zonder bloemen',1),('EIK','Boom die eikels draagt',1),('BEUK','Boom met gladde grijze stam',1),('DEN','Naaldboom',1),('DUIN','Zandheuvel bij kust of woestijn',1),('VALLEI','Laag gebied tussen heuvels of bergen',1),('WATerval'.upper(),'Water dat van een hoogte naar beneden valt',1),('GROT','Natuurlijke holte in gesteente',1),('KLIMAAT','Gemiddeld weer over lange tijd',1),('ONWEER','Weer met bliksem en donder',1),('BLIKSEM','Felle elektrische ontlading in de lucht',1),('DONDER','Geluid dat volgt op bliksem',1),('MIST','Wolk vlak boven de grond',1),('VORST','Temperatuur onder het vriespunt',1),('SCHADUW','Donkere plek waar licht wordt tegengehouden',1),('QUIZ','Spel met vragen en antwoorden',1),('PUZZEL','Opgave die je moet oplossen',1),('RAADSEL','Vraag waarvan je de oplossing moet vinden',1),('BINGO','Spel waarbij getallen worden afgevinkt',1),('SCHAKEN','Bordspel met koning en dame',1),('DAMMEN','Bordspel met ronde stenen',1),('KAARTEN','Spelen met een kaartspel',1),('DOBBELEN','Spelen met dobbelstenen',1),('ARCADE','Speelhal of snelle gamestijl',2),('CONSOLE','Apparaat speciaal voor videogames',1),('CONTROLLER','Handapparaat om games te besturen',1),('SAVE','Opgeslagen spelvoortgang, Engels',2),('SCORE','Behaald puntenaantal',1),('COMBO','Combinatie van acties',2),('SKIN','Uiterlijk voor een gamepersonage',2),('MULTI','Verkort voor met meerdere spelers',3),('PUZZELEN','Bezig zijn met puzzels',1),('FOTO','Stilstaand beeld van een camera',1),('CAMERA','Apparaat om fotos of video te maken',1),('VIDEO','Bewegend beeld met of zonder geluid',1),('RADIO','Medium voor geluid via uitzending',1),('BOEKEN','Meervoud van boek',1),('ROMAN','Lang verhalend boek',1),('STRIP','Verhaal in getekende vakjes',1),('THEATER','Plek voor toneel en voorstellingen',1),('PODIUM','Verhoogde plek voor een optreden',1),('ACTEUR','Speelt een rol in film of toneel',1),('REGIE','Leiding over een film of voorstelling',2),('SCENE','Afzonderlijk deel van een film of toneelstuk',1),('ALBUM','Verzameling nummers of fotos',1),('NUMMER','Muziektrack of getal',1),('RITME','Regelmatige beweging of maat in muziek',1),('MELODIE','Opeenvolging van muzikale tonen',1),('DJ','Draait muziek voor publiek',2),('FEEST','Bijeenkomst om iets te vieren',1),('DANSVLOER','Plek waarop wordt gedanst',1),('KUNST','Creatief werk om te bekijken of beleven',1),('SCHILDER','Maakt kunst met verf',1),('PENSEEL','Gereedschap om mee te schilderen',1),('KLEUR','Eigenschap zoals rood of blauw',1),('FOTOLIJST','Rand waarin een foto wordt geplaatst',1),('SALSA','Dansstijl of pittige saus',2),('CURRY','Gerecht of kruidenmengsel',1),('PASTA','Italiaans deegproduct',1),('PIZZA','Ronde deegbodem met beleg',1),('BURGER','Broodje met een schijf ertussen',1),('WRAP','Opgerolde tortilla met vulling',1),('SALade'.upper(),'Koud gerecht met gemengde ingrediënten',1),('SOEP','Vloeibaar gerecht',1),('KOEKJE','Klein gebakken zoet hapje',1),('CHOCOLA','Zoet product van cacao',1),('IJSKOFFIE','Koude koffievariant',1),('ESPRESSO','Kleine sterke koffie',1),('CAPPUCCINO','Koffie met melkschuim',1),('LIMOEN','Groene citrusvrucht',1),('MANGO','Tropische vrucht',1),('AVOCADO','Groene vrucht met grote pit',1),('NOEDELS','Lange deegslieren uit de Aziatische keuken',1),('HUMMUS','Puree van kikkererwten',1),('FALAFEL','Gefrituurd balletje van kikkererwten',1),('MORGEN','Dag na vandaag',1),('GISTEREN','Dag voor vandaag',1),('VANDAAG','Deze dag',1),('AFSPRAAK','Iets wat op een bepaald moment gepland staat',1),('AGENDA','Overzicht van afspraken',1),('PLANNEN','Vooraf bedenken wat je gaat doen',1),('FOCUS','Gerichte aandacht',1),('RUST','Afwezigheid van drukte',1),('ENERGIE','Vermogen om arbeid te verrichten of actief te zijn',1),('IDEE','Gedachte of ingeving',1),('KEUZE','Beslissing tussen mogelijkheden',1),('DOEL','Iets wat je wilt bereiken',1),('START','Beginpunt',1),('FINISH','Eindpunt van een race',1),('MOMENT','Kort tijdstip',1),('GEHEUGEN','Vermogen om informatie te onthouden',2),('GEWOONTE','Gedrag dat vaak automatisch terugkomt',2),('NIEUWS','Actuele informatie over gebeurtenissen',1),('KOPTEKST','Titel boven een artikel',2),('INTERVIEW','Gesprek met vragen en antwoorden',1),('COLUMN','Regelmatig opiniërend krantenstuk',2),('PUBLIEK','Mensen die ergens naar kijken of luisteren',1),('REACTIE','Antwoord of respons',1),('BERICHT','Korte mededeling',1),('GRAP','Iets bedoeld om te laten lachen',1),('TAAL','Systeem van woorden en regels',1),('WOORD','Eenheid van taal',1),('LETTER','Teken uit het alfabet',1),('ZIN','Reeks woorden met betekenis',1),('VRAAG','Zin waarop een antwoord wordt verwacht',1),('ANTWOORD','Reactie op een vraag',1),('BETEKENIS','Wat een woord of teken inhoudt',1),('VERTALEN','Tekst omzetten naar een andere taal',1),('DIALECT','Regionale variant van een taal',2),('SLANG','Informele groepstaal',2),('SARCASME','Spot waarbij vaak het tegenovergestelde wordt gezegd',2),('IRONIE','Stijl waarbij iets anders wordt bedoeld dan letterlijk gezegd',2),
]

# Remove awkward entries that aren't Dutch-ish enough for main pool on easy levels.

def can_place(grid, clues, word, r, c, d, require_cross=True):
    R=len(grid); C=len(grid[0]); dr,dc=(0,1) if d=='H' else (1,0)
    cr,cc=r-dr,c-dc
    if not (0<=cr<R and 0<=cc<C): return False
    if clues[cr][cc] is not None or grid[cr][cc] is not None: return False
    er=r+dr*(len(word)-1); ec=c+dc*(len(word)-1)
    if not (0<=er<R and 0<=ec<C): return False
    nr,nc=er+dr,ec+dc
    if 0<=nr<R and 0<=nc<C and grid[nr][nc] is not None: return False
    crosses=0
    for i,ch in enumerate(word):
        rr=r+dr*i; c2=c+dc*i
        if clues[rr][c2] is not None: return False
        existing=grid[rr][c2]
        if existing is not None:
            if existing!=ch: return False
            crosses+=1
        else:
            # avoid parallel touching that creates visual ambiguity
            for ar,ac in ((-dc,-dr),(dc,dr)):
                tr,tc=rr+ar,c2+ac
                if 0<=tr<R and 0<=tc<C and grid[tr][tc] is not None:
                    return False
    return (crosses>0) if require_cross else True

def place(grid, clues, item, r,c,d):
    word, clue, diff=item
    dr,dc=(0,1) if d=='H' else (1,0)
    cr,cc=r-dr,c-dc
    clues[cr][cc]=(clue,d)
    for i,ch in enumerate(word):
        rr=r+dr*i; c2=c+dc*i
        grid[rr][c2]=ch
    return {'answer':word,'clue':clue,'dir':d,'start':[r,c],'clueCell':[cr,cc]}

def generate(seed, target, maxdiff, size=17, exclude=None):
    rnd=random.Random(seed)
    exclude=exclude or set()
    pool=[x for x in BANK if x[2]<=maxdiff and 3<=len(x[0])<=10 and x[0] not in exclude]
    best=None
    for attempt in range(500):
        grid=[[None]*size for _ in range(size)]
        clues=[[None]*size for _ in range(size)]
        placements=[]
        first=rnd.choice([x for x in pool if 5<=len(x[0])<=8])
        r=size//2; c=max(1,(size-len(first[0]))//2)
        placements.append(place(grid,clues,first,r,c,'H'))
        used={first[0]}
        shuffled=pool[:]; rnd.shuffle(shuffled)
        progress=True
        while len(placements)<target and progress:
            progress=False
            # try candidates, preferring modern after first few
            for item in shuffled:
                word=item[0]
                if word in used: continue
                candidates=[]
                for i,ch in enumerate(word):
                    for rr in range(size):
                        for cc in range(size):
                            if grid[rr][cc]!=ch: continue
                            # H: word index i lands at rr,cc
                            sr,sc=rr,cc-i
                            if can_place(grid,clues,word,sr,sc,'H',True): candidates.append((sr,sc,'H'))
                            sr,sc=rr-i,cc
                            if can_place(grid,clues,word,sr,sc,'V',True): candidates.append((sr,sc,'V'))
                if candidates:
                    sr,sc,d=rnd.choice(candidates)
                    placements.append(place(grid,clues,item,sr,sc,d)); used.add(word); progress=True
                    if len(placements)>=target: break
            rnd.shuffle(shuffled)
        score=len(placements)
        if best is None or score>len(best[2]): best=(grid,clues,placements)
        if score>=target:
            # crop to used letters + clue cells
            usedcells=[]
            for rr in range(size):
                for cc in range(size):
                    if grid[rr][cc] is not None or clues[rr][cc] is not None:
                        usedcells.append((rr,cc))
            minr=max(0,min(r for r,c in usedcells)-1); maxr=min(size-1,max(r for r,c in usedcells)+1)
            minc=max(0,min(c for r,c in usedcells)-1); maxc=min(size-1,max(c for r,c in usedcells)+1)
            # remap placements
            out=[]
            for p in placements:
                q=dict(p)
                q['start']=[p['start'][0]-minr,p['start'][1]-minc]
                q['clueCell']=[p['clueCell'][0]-minr,p['clueCell'][1]-minc]
                out.append(q)
            return {'rows':maxr-minr+1,'cols':maxc-minc+1,'words':out}
    raise RuntimeError(f'Could not generate seed {seed}; best {len(best[2]) if best else 0}')

levels=[]
used_global=set()
for i in range(1,25):
    if i<=6:
        diff='Instap'; maxd=1; target=8 + (i%2)
    elif i<=12:
        diff='Normaal'; maxd=2; target=9 + (i%3==0)
    elif i<=18:
        diff='Pittig'; maxd=3; target=10 + (i%2)
    else:
        diff='Expert'; maxd=3; target=11
    got=None
    for off in range(260):
        try:
            p=generate(7000+i*131+off,target,maxd,exclude=used_global)
            if p['rows']<=15 and p['cols']<=15:
                got=p; break
        except (RuntimeError, IndexError):
            pass
    if not got:
        raise RuntimeError(f'level {i}; remaining pool could not make a compact grid')
    got.update({'id':i,'difficulty':diff})
    levels.append(got)
    used_global.update(w['answer'] for w in got['words'])

print('Generated',len(levels),'levels with',len(used_global),'unique answers')
for l in levels:
    print(l['id'],l['difficulty'],l['rows'],l['cols'],len(l['words']))

with open('/mnt/data/tectonic_puzzlehub/games/swedish/levels.js','w',encoding='utf8') as f:
    f.write('window.SWEDISH_LEVELS = ')
    json.dump(levels,f,ensure_ascii=False,separators=(',',':'))
    f.write(';\n')
