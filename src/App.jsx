import { useEffect, useRef, useState } from "react";
import { EUROPEAN_VOLLEYBALL_TEAMS } from "./data/europeanVolleyball.js";
import { calculateEfficiency } from "./utils/sheetParser.js";

const STORAGE_KEY = "scouting_volley_state_v30";
const LANG_STORAGE_KEY = "scouting_volley_lang_v30";

const SETURI = [1, 2, 3, 4, 5];
const ORDINE_TEREN = ["Z4", "Z3", "Z2", "Z5", "Z6", "Z1"];
const ORDINE_ZONE_1_LA_6 = ["Z1", "Z2", "Z3", "Z4", "Z5", "Z6"];
const POZITII_RIDICATOR = [1, 2, 3, 4, 5, 6];
const POSTURI_DISPONIBILE = [
  "Ridicător",
  "Atacant",
  "Centru",
  "Opus",
  "Libero",
];

const DIRECTII_SERVICIU_PUNCT = [
  "Z1 (Linie dr. spate)",
  "Z6 (Centru spate)",
  "Z5 (Linie st. spate)",
  "Z4 (Linie st. față)",
  "Z3 (Centru față)",
  "Z2 (Linie dr. față)",
  "Scurt / Zonă scurtă",
];

const DIRECTII_ATAC_ADVERSAR_PUNCT = [
  "Z4 Linie",
  "Z4 Diagonală",
  "Z3 Centru",
  "Z2 Linie",
  "Z2 Diagonală",
  "Z6 / Z1 Pipe (Spate)",
];

const TEMA_PLATFORMA = {
  pageBg: "#f1f5f9",
  surfaceBg: "#ffffff",
  toolbarBg: "#e2e8f0",
  subtleBg: "#f8fafc",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  border: "#cbd5e1",
  borderStrong: "#94a3b8",
  accent: "#1e3a5f",
  accentText: "#ffffff",
};

const TEMA_NAWARO = {
  cardBg: "#fff3e4",
  cardBorder: "#d97706",
  barBg: "#ea7b15",
  headerBg: "#ffe3c2",
  badgeBg: "#fed09b",
  badgeText: "#6c2d00",
};

const TEMA_OASPETI = {
  cardBg: "#eaf3ff",
  cardBorder: "#2563eb",
  barBg: "#2563eb",
  headerBg: "#d4e6ff",
  badgeBg: "#bfd9ff",
  badgeText: "#0f2f6b",
};

const ZONE_PASA = [
  "Pipe",
  "Urcare față",
  "Urcare spate",
  "Afară",
  "Fuge față",
  "Fuge spate",
];

const CALITATI_PASA = ["+", "0", "-"];

const ZONE_ATAC_GENERALE = [
  "Z4 (Stânga)",
  "Z3 (Centru)",
  "Z2 (Dreapta)",
  "Z1 (Linie spate dr.)",
  "Z6 (Pipe)",
];

const ZONE_ATAC_CENTRU = [
  "Urcare față",
  "Urcare spate",
  "Fuge față",
  "Fuge spate",
  "Pe un picior",
];

const TOATE_ZONELE_ATAC = Array.from(
  new Set([...ZONE_ATAC_GENERALE, ...ZONE_ATAC_CENTRU])
);

const LIMBI = [
  { code: "ro", label: "RO", flag: "🇷🇴", name: "Română" },
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "de", label: "DE", flag: "🇩🇪", name: "Deutsch" },
  { code: "nl", label: "NL", flag: "🇳🇱", name: "Nederlands" },
  { code: "el", label: "EL", flag: "🇬🇷", name: "Ελληνικά" },
  { code: "tr", label: "TR", flag: "🇹🇷", name: "Türkçe" },
  { code: "it", label: "IT", flag: "🇮🇹", name: "Italiano" },
  { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
];

const TRADUCERI = {
  ro: {
    appTitle: "Scouting Volley",
    league: "Ligă",
    activeScout: "Scout activ",
    scoutingOn: "Scouting pe",
    opponent: "Adversar / Oaspeți",
    ourTeam: "Echipa noastră",
    activeSet: "Set activ",
    set: "Setul",
    tieBreak: "Tie-break",
    setShort: "Set",
    setterPos: "Ridicător poz.",
    reportDate: "Data raport",
    scoreTitle: "SCOR",
    setsWon: "Seturi",
    setFinished: "Set încheiat",
    targetPtsShort: "țintă",
    serve: "Serviciu",
    undo: "Undo Scor & Acțiune",
    scoutingMode: "Scouting activ",
    parallelOn: "Paralel pe ecran: ACTIV",
    parallelOff: "Paralel pe ecran: OPRIT",
    operator: "Operator",
    scout1: "Scout 1 (Echipa noastră)",
    scout2: "Scout 2 (Adversar / Paralel)",
    view: "Vizualizare",
    totalMatch: "Total Meci (Set 1–5)",
    ourTeamSelect: "Echipa noastră",
    opponentSelect: "Echipa oaspete / adversă",
    pointFor: "+ Punct",
    autoRotate: "Rotește la primire",
    setterFor: "Ridicător",
    position: "Poziția",
    rotateManual: "Rotește manual",
    exportPdf: "Exportă PDF",
    reloadRoster: "Reîncarcă lotul din fișier",
    resetSets: "Resetează seturile",
    simCourtTitle: "Teren Simulat de Volei — Față în Față",
    simCourtHint:
      "Rotația se actualizează automat la câștigarea serviciului (conform scorului), iar jucătoarea din Z1 trece automat pe poziția de serviciu când echipa servește.",
    netLabel: "FILEU",
    servingBadge: "SERVICIU (Z1)",
    receivingBadge: "PRIMIRE",
    frontRowShort: "Linia față",
    backRowShort: "Linia spate",
    serverTag: "SERVER",
    scoringDirsTitle:
      "Direcții Câștigătoare de Punct — Serviciu (Ambele Echipe) & Atac Adversar",
    scoringDirsHint:
      "Se înregistrează exclusiv pe fazele care produc punct: As la serviciu (Srv +) pentru ambele echipe și Atac-Punct (Atk +) pentru adversar.",
    srvAceDirLabel: "Direcție Serviciu-As (Punct)",
    oppAtkDirLabel: "Direcție Atac-Punct Adversar",
    noScoringDirsYet: "Nicio direcție câștigătoare înregistrată încă.",
    scoringDirsCol: "Direcții Punct (Srv As / Atk Pct)",
    importTitle: "Importă listă jucătoare din Foto sau PDF",
    importHint:
      "Selectează o Foto (OCR) sau un fișier PDF cu lista jucătoarelor, ori verifică/editează textul extras înainte de import.",
    importPhotoBtn: "Importă din Foto",
    importPdfBtn: "Importă din PDF",
    importTextBtn: "Aplică din text",
    importClearTextBtn: "Golește textul",
    importPlaceholder:
      "Textul extras din Foto sau PDF apare aici (sau poți lipi manual):\n1 Popescu Ana Ridicător\n4 Ionescu Mara Atacant\n9 Marin Elena Centru\n12 Radu Sofia Libero",
    importReplaceLabel: "Înlocuiește lotul actual al echipei",
    importAppendLabel: "Adaugă la lotul existent",
    importStatusReady: "Pregătit pentru import din Foto sau PDF.",
    importStatusWorking: "Se extrag și se procesează datele...",
    importStatusSuccess: "Jucătoare importate cu succes",
    importStatusEmpty:
      "Nu s-au găsit rânduri valide cu jucătoare în fișierul selectat.",
    importStatusError:
      "Nu s-a putut extrage textul din fișier. Verifică fișierul Foto/PDF sau lipește textul manual.",
    teamSummary: "Rezumat echipă",
    attack: "Atac",
    pctShort: "pct",
    effShort: "ef.",
    reception: "Preluare",
    posShort: "poz",
    errShort: "er",
    aces: "ași",
    totShort: "tot",
    block: "Blocaj",
    inPlay: "se joacă",
    setterPasses: "Pase ridicător",
    qualityPlus: "calitate +",
    compTitle: "Comparație Statistică & Eficiență Echipe",
    catIndicator: "Categorie / Indicator",
    totalDetail: "(Total / Detaliu)",
    pctEff: "(% / Eficiență)",
    atkRow: "Atac (Pct / Er / Neutru / Total)",
    neutralShort: "0",
    recRow: "Preluare (Poz + / Er / 0 / Total)",
    srvRow: "Serviciu (Ași / Er / 0 / Total)",
    blkRow: "Blocaj (Pct + / Er / Joacă / Total)",
    passRow: "Pase Ridicător (+ / 0 / - / Total)",
    chartTitle: "Grafic Jucătoare & Performanțe",
    metricLabel: "Indicator grafic",
    metricAtkKills: "Atac — Puncte (Pct)",
    metricAtkEff: "Atac — Eficiență (%)",
    metricRecPos: "Preluare — Pozitivă (%)",
    metricSrvAce: "Serviciu — Ași",
    metricBlkPts: "Blocaj — Puncte",
    metricPassQual: "Pase Ridicător — Calitate + (%)",
    noChartData: "Nu există date înregistrate pentru graficul acestui set/mod.",
    courtRotTitle: "Așezare în Teren & Eficiență pe Rotații — Paralel",
    netFront: "Fileu (Linia din față: Z4 · Z3 · Z2)",
    zone: "Zona",
    freeSlot: "Liber",
    changeBtn: "Schimbă",
    cancelBtn: "Anulează",
    choosePlayer: "Alege jucătoare...",
    reserveTag: "Rezervă",
    onCourtTag: "În teren",
    putPlayer: "Pune jucătoare...",
    backRowInfo: "Linia din spate: Z5 · Z6 · Z1 (Serviciu) · Rezerve",
    rotEffTitle: "Eficiență pe Rotații",
    setterCol: "Ridicător Poz.",
    atkTotCol: "Atk Tot",
    pctCol: "Pct",
    errCol: "Er",
    effCol: "Eficiență %",
    activeRot: "(Activă)",
    rotateBtn: "Rotește",
    addTo: "Adaugă la",
    jerseyPh: "Nr.",
    namePh: "Nume jucătoare",
    addPlayerBtn: "Adaugă jucătoare",
    statsTableTitle: "Tabel Statistici",
    teamCol: "Echipă",
    numCol: "Nr.",
    playerCol: "Jucătoare",
    roleCol: "Post",
    atkPctCol: "Atk %",
    atkEffCol: "Atk Ef%",
    recTotCol: "Rec Tot",
    recPosCol: "Rec Poz%",
    recErrCol: "Rec Er",
    recDetailCol: "Detaliu Preluare (Libero Serv / Atac)",
    srvTotCol: "Srv Tot",
    srvAceCol: "Srv Ași",
    srvErrCol: "Srv Er",
    blkPctCol: "Blk Pct",
    blkErrCol: "Blk Er",
    blkPlayCol: "Blk Joacă",
    atkZonesCol: "Zone Atac",
    passZonesCol: "Zone & Calitate Pase (Ridicător)",
    quickPanelTitle: "Panou Rapid de Înregistrare",
    libero1Label: "Libero în teren (Poziția 1)",
    noLibero: "— Fără Libero —",
    libero2Label: "Al 2-lea Libero în teren (Poziția 2)",
    singleLibero: "Doar un singur Libero",
    emptyRoster:
      "Nu sunt jucătoare în lotul acestei echipe. Importă din Foto/PDF sau adaugă jucătoare mai sus.",
    deleteBtn: "Șterge",
    recServ: "Rec Serv",
    recAtk: "Rec Atk",
    passesLabel: "Pase",
    liberoZone: "Libero",
    benchZone: "Lot / Bancă",
    posts: {
      Ridicător: "Ridicător",
      Atacant: "Atacant",
      Centru: "Centru",
      Opus: "Opus",
      Libero: "Libero",
    },
    passZones: {
      "Pipe": "Pipe",
      "Urcare față": "Urcare față",
      "Urcare spate": "Urcare spate",
      "Afară": "Afară",
      "Fuge față": "Fuge față",
      "Fuge spate": "Fuge spate",
    },
    attackZones: {
      "Z4 (Stânga)": "Z4 (Stânga)",
      "Z3 (Centru)": "Z3 (Centru)",
      "Z2 (Dreapta)": "Z2 (Dreapta)",
      "Z1 (Linie spate dr.)": "Z1 (Linie spate dr.)",
      "Z6 (Pipe)": "Z6 (Pipe)",
      "Urcare față": "Urcare față",
      "Urcare spate": "Urcare spate",
      "Fuge față": "Fuge față",
      "Fuge spate": "Fuge spate",
      "Pe un picior": "Pe un picior",
    },
  },
  en: {
    appTitle: "Scouting Volley",
    league: "League",
    activeScout: "Active Scout",
    scoutingOn: "Scouting",
    opponent: "Opponent / Guests",
    ourTeam: "Our Team",
    activeSet: "Active Set",
    set: "Set",
    tieBreak: "Tie-break",
    setShort: "Set",
    setterPos: "Setter pos.",
    reportDate: "Report date",
    scoreTitle: "SCORE",
    setsWon: "Sets",
    setFinished: "Set finished",
    targetPtsShort: "target",
    serve: "Serve",
    undo: "Undo Score & Action",
    scoutingMode: "Active scouting",
    parallelOn: "Parallel view: ON",
    parallelOff: "Parallel view: OFF",
    operator: "Operator",
    scout1: "Scout 1 (Our Team)",
    scout2: "Scout 2 (Opponent / Parallel)",
    view: "View",
    totalMatch: "Match Total (Sets 1–5)",
    ourTeamSelect: "Our Team",
    opponentSelect: "Guest / Opponent Team",
    pointFor: "+ Point",
    autoRotate: "Rotate on receive",
    setterFor: "Setter",
    position: "Position",
    rotateManual: "Rotate manual",
    exportPdf: "Export PDF",
    reloadRoster: "Reload roster from file",
    resetSets: "Reset sets",
    simCourtTitle: "Simulated Volleyball Court — Face to Face",
    simCourtHint:
      "Rotation updates automatically on break points (score logic), and the player in Z1 moves automatically into the serving position when serving.",
    netLabel: "NET",
    servingBadge: "SERVING (Z1)",
    receivingBadge: "RECEIVING",
    frontRowShort: "Front row",
    backRowShort: "Back row",
    serverTag: "SERVER",
    scoringDirsTitle:
      "Scoring Directions — Serve Aces (Both Teams) & Opponent Attack Kills",
    scoringDirsHint:
      "Recorded exclusively on point-scoring plays: Serve Ace (Srv +) for both teams and Attack Kill (Atk +) for the opponent.",
    srvAceDirLabel: "Serve Ace Direction (Point)",
    oppAtkDirLabel: "Opponent Attack Kill Direction",
    noScoringDirsYet: "No point-scoring directions recorded yet.",
    scoringDirsCol: "Point Directions (Srv Ace / Atk Kill)",
    importTitle: "Import Roster from Photo or PDF",
    importHint:
      "Select a Photo (OCR) or PDF file with the player list, or review/edit extracted lines before importing.",
    importPhotoBtn: "Import from Photo",
    importPdfBtn: "Import from PDF",
    importTextBtn: "Import from Text",
    importClearTextBtn: "Clear Text",
    importPlaceholder:
      "Extracted text from Photo or PDF appears here (or paste manually):\n1 Anna Smith Setter\n4 Maya Jones Outside Hitter\n9 Elena Miller Middle Blocker\n12 Sofia Brown Libero",
    importReplaceLabel: "Replace current team roster",
    importAppendLabel: "Append to existing roster",
    importStatusReady: "Ready to import from Photo or PDF.",
    importStatusWorking: "Extracting and processing file...",
    importStatusSuccess: "Players imported successfully",
    importStatusEmpty: "No valid player rows found in the selected file.",
    importStatusError:
      "Unable to extract text from file. Check Photo/PDF or paste text manually.",
    teamSummary: "Team summary",
    attack: "Attack",
    pctShort: "kill%",
    effShort: "eff.",
    reception: "Reception",
    posShort: "pos",
    errShort: "err",
    aces: "aces",
    totShort: "tot",
    block: "Block",
    inPlay: "in play",
    setterPasses: "Setter passes",
    qualityPlus: "quality +",
    compTitle: "Team Statistical & Efficiency Comparison",
    catIndicator: "Category / Metric",
    totalDetail: "(Total / Breakdown)",
    pctEff: "(% / Efficiency)",
    atkRow: "Attack (Kill / Err / Neutral / Total)",
    neutralShort: "0",
    recRow: "Reception (Pos + / Err / 0 / Total)",
    srvRow: "Serve (Aces / Err / 0 / Total)",
    blkRow: "Block (Kill + / Err / Play / Total)",
    passRow: "Setter Passes (+ / 0 / - / Total)",
    chartTitle: "Players & Performance Chart",
    metricLabel: "Chart metric",
    metricAtkKills: "Attack — Kills",
    metricAtkEff: "Attack — Efficiency (%)",
    metricRecPos: "Reception — Positive (%)",
    metricSrvAce: "Serve — Aces",
    metricBlkPts: "Block — Kills",
    metricPassQual: "Setter Passes — Quality + (%)",
    noChartData: "No recorded stats for this chart view yet.",
    courtRotTitle: "Court Lineup & Rotation Efficiency — Parallel",
    netFront: "Net (Front row: Z4 · Z3 · Z2)",
    zone: "Zone",
    freeSlot: "Open",
    changeBtn: "Sub",
    cancelBtn: "Cancel",
    choosePlayer: "Select player...",
    reserveTag: "Bench",
    onCourtTag: "On court",
    putPlayer: "Place player...",
    backRowInfo: "Back row: Z5 · Z6 · Z1 (Serve) · Bench",
    rotEffTitle: "Rotation Efficiency",
    setterCol: "Setter Pos.",
    atkTotCol: "Atk Tot",
    pctCol: "Kill",
    errCol: "Err",
    effCol: "Efficiency %",
    activeRot: "(Active)",
    rotateBtn: "Rotate",
    addTo: "Add to",
    jerseyPh: "#",
    namePh: "Player name",
    addPlayerBtn: "Add player",
    statsTableTitle: "Statistics Table",
    teamCol: "Team",
    numCol: "#",
    playerCol: "Player",
    roleCol: "Role",
    atkPctCol: "Atk %",
    atkEffCol: "Atk Eff%",
    recTotCol: "Rec Tot",
    recPosCol: "Rec Pos%",
    recErrCol: "Rec Err",
    recDetailCol: "Reception Detail (Libero Serve / Attack)",
    srvTotCol: "Srv Tot",
    srvAceCol: "Srv Aces",
    srvErrCol: "Srv Err",
    blkPctCol: "Blk Kill",
    blkErrCol: "Blk Err",
    blkPlayCol: "Blk Play",
    atkZonesCol: "Attack Zones",
    passZonesCol: "Setter Pass Zones & Quality",
    quickPanelTitle: "Quick Recording Panel",
    libero1Label: "Libero on court (Position 1)",
    noLibero: "— No Libero —",
    libero2Label: "2nd Libero on court (Position 2)",
    singleLibero: "Single Libero only",
    emptyRoster:
      "No players in this team roster. Import from Photo/PDF or add players above.",
    deleteBtn: "Delete",
    recServ: "Rec Srv",
    recAtk: "Rec Atk",
    passesLabel: "Passes",
    liberoZone: "Libero",
    benchZone: "Roster / Bench",
    posts: {
      Ridicător: "Setter",
      Atacant: "Outside Hitter",
      Centru: "Middle Blocker",
      Opus: "Opposite",
      Libero: "Libero",
    },
    passZones: {
      "Pipe": "Pipe",
      "Urcare față": "Front Quick",
      "Urcare spate": "Back Quick",
      "Afară": "High Ball",
      "Fuge față": "Slide Front",
      "Fuge spate": "Slide Back",
    },
    attackZones: {
      "Z4 (Stânga)": "Z4 (Left)",
      "Z3 (Centru)": "Z3 (Middle)",
      "Z2 (Dreapta)": "Z2 (Right)",
      "Z1 (Linie spate dr.)": "Z1 (Back right)",
      "Z6 (Pipe)": "Z6 (Pipe)",
      "Urcare față": "Front Quick",
      "Urcare spate": "Back Quick",
      "Fuge față": "Slide Front",
      "Fuge spate": "Slide Back",
      "Pe un picior": "One-leg",
    },
  },
  de: {
    appTitle: "Scouting Volley",
    league: "Liga",
    activeScout: "Aktiver Scout",
    scoutingOn: "Scouting für",
    opponent: "Gegner / Gäste",
    ourTeam: "Eigenes Team",
    activeSet: "Aktiver Satz",
    set: "Satz",
    tieBreak: "Tie-Break",
    setShort: "Satz",
    setterPos: "Zuspieler Pos.",
    reportDate: "Berichtsdatum",
    scoreTitle: "STAND",
    setsWon: "Sätze",
    setFinished: "Satz beendet",
    targetPtsShort: "Ziel",
    serve: "Aufschlag",
    undo: "Undo Punkt & Aktion",
    scoutingMode: "Aktives Scouting",
    parallelOn: "Parallelansicht: AN",
    parallelOff: "Parallelansicht: AUS",
    operator: "Bediener",
    scout1: "Scout 1 (Eigenes Team)",
    scout2: "Scout 2 (Gegner / Parallel)",
    view: "Ansicht",
    totalMatch: "Gesamtspiel (Satz 1–5)",
    ourTeamSelect: "Eigenes Team",
    opponentSelect: "Gast- / Gegnerteam",
    pointFor: "+ Punkt",
    autoRotate: "Rotation bei Annahme",
    setterFor: "Zuspieler",
    position: "Position",
    rotateManual: "Manuell rotieren",
    exportPdf: "PDF exportieren",
    reloadRoster: "Kader aus Datei laden",
    resetSets: "Sätze zurücksetzen",
    simCourtTitle: "Simuliertes Volleyballfeld — Gegenüber",
    simCourtHint:
      "Die Rotation folgt automatisch der Punktelogik bei Aufschlaggewinn, und die Spielerin auf Z1 rückt bei Aufschlag automatisch in die Aufschlagposition.",
    netLabel: "NETZ",
    servingBadge: "AUFSCHLAG (Z1)",
    receivingBadge: "ANNAHME",
    frontRowShort: "Vorderreihe",
    backRowShort: "Hinterreihe",
    serverTag: "AUFSCHLÄGER",
    scoringDirsTitle:
      "Punktrichtungen — Aufschlag-Asse (Beide Teams) & Gegner-Angriffspunkte",
    scoringDirsHint:
      "Wird ausschließlich bei punktbringenden Aktionen erfasst: Aufschlag-Ass (Srv +) für beide Teams und Angriffspunkt (Atk +) beim Gegner.",
    srvAceDirLabel: "Aufschlag-Ass Richtung (Punkt)",
    oppAtkDirLabel: "Gegner Angriffspunkt Richtung",
    noScoringDirsYet: "Noch keine Punktrichtungen erfasst.",
    scoringDirsCol: "Punktrichtungen (Srv Ass / Atk Pkt)",
    importTitle: "Kader aus Foto oder PDF importieren",
    importHint:
      "Foto (OCR) oder PDF mit Spielerinnen-Liste wählen oder extrahierten Text vor dem Import prüfen.",
    importPhotoBtn: "Aus Foto importieren",
    importPdfBtn: "Aus PDF importieren",
    importTextBtn: "Aus Text importieren",
    importClearTextBtn: "Text leeren",
    importPlaceholder:
      "Extrahierter Text aus Foto oder PDF erscheint hier (oder manuell einfügen):\n1 Anna Weber Zuspieler\n4 Maya Klein Außenangreifer\n9 Elena Becker Mittelblocker\n12 Sofia Braun Libero",
    importReplaceLabel: "Aktuellen Kader ersetzen",
    importAppendLabel: "Zum Kader hinzufügen",
    importStatusReady: "Bereit für Foto- oder PDF-Import.",
    importStatusWorking: "Datei wird extrahiert und verarbeitet...",
    importStatusSuccess: "Spielerinnen erfolgreich importiert",
    importStatusEmpty:
      "Keine gültigen Spielerinnen-Zeilen in der gewählten Datei gefunden.",
    importStatusError:
      "Text konnte nicht aus der Datei extrahiert werden. Foto/PDF prüfen oder Text einfügen.",
    teamSummary: "Teamübersicht",
    attack: "Angriff",
    pctShort: "pkt%",
    effShort: "eff.",
    reception: "Annahme",
    posShort: "pos",
    errShort: "feh",
    aces: "Asse",
    totShort: "ges",
    block: "Block",
    inPlay: "im Spiel",
    setterPasses: "Zuspiel-Pässe",
    qualityPlus: "Qualität +",
    compTitle: "Statistischer Vergleich & Effizienz der Teams",
    catIndicator: "Kategorie / Kennzahl",
    totalDetail: "(Gesamt / Detail)",
    pctEff: "(% / Effizienz)",
    atkRow: "Angriff (Pkt / Feh / Neutral / Gesamt)",
    neutralShort: "0",
    recRow: "Annahme (Pos + / Feh / 0 / Gesamt)",
    srvRow: "Aufschlag (Asse / Feh / 0 / Gesamt)",
    blkRow: "Block (Pkt + / Feh / Spiel / Gesamt)",
    passRow: "Zuspieler-Pässe (+ / 0 / - / Gesamt)",
    chartTitle: "Spielerinnen & Leistungsgrafik",
    metricLabel: "Kennzahl",
    metricAtkKills: "Angriff — Punkte",
    metricAtkEff: "Angriff — Effizienz (%)",
    metricRecPos: "Annahme — Positiv (%)",
    metricSrvAce: "Aufschlag — Asse",
    metricBlkPts: "Block — Punkte",
    metricPassQual: "Zuspiel — Qualität + (%)",
    noChartData: "Keine erfassten Daten für diese Grafikansicht.",
    courtRotTitle: "Feldaufstellung & Rotationseffizienz — Parallel",
    netFront: "Netz (Vorderreihe: Z4 · Z3 · Z2)",
    zone: "Zone",
    freeSlot: "Frei",
    changeBtn: "Wechsel",
    cancelBtn: "Abbrechen",
    choosePlayer: "Spielerin wählen...",
    reserveTag: "Bank",
    onCourtTag: "Im Feld",
    putPlayer: "Spielerin einsetzen...",
    backRowInfo: "Hinterreihe: Z5 · Z6 · Z1 (Aufschlag) · Bank",
    rotEffTitle: "Rotationseffizienz",
    setterCol: "Zuspieler Pos.",
    atkTotCol: "Ang Ges",
    pctCol: "Pkt",
    errCol: "Feh",
    effCol: "Effizienz %",
    activeRot: "(Aktiv)",
    rotateBtn: "Rotieren",
    addTo: "Hinzufügen zu",
    jerseyPh: "Nr.",
    namePh: "Name der Spielerin",
    addPlayerBtn: "Spielerin hinzufügen",
    statsTableTitle: "Statistiktabelle",
    teamCol: "Team",
    numCol: "Nr.",
    playerCol: "Spielerin",
    roleCol: "Position",
    atkPctCol: "Ang %",
    atkEffCol: "Ang Eff%",
    recTotCol: "Ann Ges",
    recPosCol: "Ann Pos%",
    recErrCol: "Ann Feh",
    recDetailCol: "Annahme-Detail (Libero Aufschl / Angr)",
    srvTotCol: "Auf Ges",
    srvAceCol: "Auf Asse",
    srvErrCol: "Auf Feh",
    blkPctCol: "Blk Pkt",
    blkErrCol: "Blk Feh",
    blkPlayCol: "Blk Spiel",
    atkZonesCol: "Angriffszonen",
    passZonesCol: "Zuspiel-Zonen & Qualität",
    quickPanelTitle: "Schnellerfassungs-Panel",
    libero1Label: "Libero im Feld (Position 1)",
    noLibero: "— Kein Libero —",
    libero2Label: "2. Libero im Feld (Position 2)",
    singleLibero: "Nur ein Libero",
    emptyRoster:
      "Keine Spielerinnen in diesem Kader. Aus Foto/PDF importieren oder oben hinzufügen.",
    deleteBtn: "Löschen",
    recServ: "Ann Auf",
    recAtk: "Ann Ang",
    passesLabel: "Pässe",
    liberoZone: "Libero",
    benchZone: "Kader / Bank",
    posts: {
      Ridicător: "Zuspieler",
      Atacant: "Außenangreifer",
      Centru: "Mittelblocker",
      Opus: "Diagonalangreifer",
      Libero: "Libero",
    },
    passZones: {
      "Pipe": "Pipe",
      "Urcare față": "Kurzer Ball vorn",
      "Urcare spate": "Kurzer Ball hinten",
      "Afară": "Hochball",
      "Fuge față": "Slide vorn",
      "Fuge spate": "Slide hinten",
    },
    attackZones: {
      "Z4 (Stânga)": "Z4 (Links)",
      "Z3 (Centru)": "Z3 (Mitte)",
      "Z2 (Dreapta)": "Z2 (Rechts)",
      "Z1 (Linie spate dr.)": "Z1 (Hinten rechts)",
      "Z6 (Pipe)": "Z6 (Pipe)",
      "Urcare față": "Kurzer Ball vorn",
      "Urcare spate": "Kurzer Ball hinten",
      "Fuge față": "Slide vorn",
      "Fuge spate": "Slide hinten",
      "Pe un picior": "Einbeinig",
    },
  },
};

function getTraduceriLimba(code) {
  return TRADUCERI[code] || TRADUCERI.ro;
}

function getPuncteTintaSet(nrSet) {
  return Number(nrSet) === 5 ? 15 : 25;
}

function evalueazaStareSet(nrSet, scorNoi, scorAdversar) {
  const tinta = getPuncteTintaSet(nrSet);
  const a = Number(scorNoi) || 0;
  const b = Number(scorAdversar) || 0;
  const diferenta = Math.abs(a - b);

  if ((a >= tinta || b >= tinta) && diferenta >= 2) {
    return {
      esteIncheiat: true,
      castigator: a > b ? "noi" : "adversar",
      tinta,
    };
  }

  return {
    esteIncheiat: false,
    castigator: null,
    tinta,
  };
}

function calculeazaScorSeturiMeci(seturiObj) {
  let seturiNoi = 0;
  let seturiAdversar = 0;

  SETURI.forEach((nrSet) => {
    const s = seturiObj?.[nrSet];
    if (!s) return;
    const stare = evalueazaStareSet(nrSet, s.noi, s.adversar);
    if (stare.esteIncheiat) {
      if (stare.castigator === "noi") seturiNoi += 1;
      else if (stare.castigator === "adversar") seturiAdversar += 1;
    }
  });

  return { seturiNoi, seturiAdversar };
}

function esteEchipaNawaro(echipa) {
  const nume = String(echipa?.teamName || "").toLowerCase();
  const id = String(echipa?.id || "").toLowerCase();
  return nume.includes("nawaro") || id.includes("nawaro");
}

function getTemaEchipa(echipa) {
  return esteEchipaNawaro(echipa) ? TEMA_NAWARO : TEMA_OASPETI;
}

function getZoneAtacPentruPost(post) {
  return post === "Centru" ? ZONE_ATAC_CENTRU : ZONE_ATAC_GENERALE;
}

function calculeazaProcent(parte, total) {
  if (!total || total <= 0) return 0;
  return Number(((parte / total) * 100).toFixed(1));
}

function creeazaDirectiiServiciuPunctGoale() {
  const obj = {};
  DIRECTII_SERVICIU_PUNCT.forEach((dir) => {
    obj[dir] = 0;
  });
  return obj;
}

function creeazaDirectiiAtacAdversarPunctGoale() {
  const obj = {};
  DIRECTII_ATAC_ADVERSAR_PUNCT.forEach((dir) => {
    obj[dir] = 0;
  });
  return obj;
}

function normalizeazaDirectiiServiciuPunct(raw) {
  const baza = creeazaDirectiiServiciuPunctGoale();
  if (!raw || typeof raw !== "object") return baza;
  DIRECTII_SERVICIU_PUNCT.forEach((dir) => {
    baza[dir] = Number(raw[dir]) || 0;
  });
  return baza;
}

function normalizeazaDirectiiAtacAdversarPunct(raw) {
  const baza = creeazaDirectiiAtacAdversarPunctGoale();
  if (!raw || typeof raw !== "object") return baza;
  DIRECTII_ATAC_ADVERSAR_PUNCT.forEach((dir) => {
    baza[dir] = Number(raw[dir]) || 0;
  });
  return baza;
}

function creeazaStructuraPaseGoala() {
  const obj = {};
  ZONE_PASA.forEach((zona) => {
    obj[zona] = { "+": 0, "0": 0, "-": 0 };
  });
  return obj;
}

function creeazaStructuraZoneAtacGoala() {
  const obj = {};
  TOATE_ZONELE_ATAC.forEach((zona) => {
    obj[zona] = { pct: 0, er: 0, neutru: 0 };
  });
  return obj;
}

function creeazaRotatiiGoale() {
  const obj = {};
  POZITII_RIDICATOR.forEach((pos) => {
    obj[pos] = { pct: 0, er: 0, neutru: 0 };
  });
  return obj;
}

function creeazaStatisticiGoaleJucatoare(post = "Atacant") {
  const esteLibero = post === "Libero";
  return {
    atkReusit: 0,
    atkEroare: 0,
    atkNeutru: 0,
    srvAs: 0,
    srvEroare: 0,
    srvNeutru: 0,
    recPozitiv: 0,
    recEroare: 0,
    recNeutru: 0,
    libRecServPoz: 0,
    libRecServEr: 0,
    libRecServNeutru: 0,
    libRecAtkPoz: 0,
    libRecAtkEr: 0,
    libRecAtkNeutru: 0,
    blkPunct: 0,
    blkEroare: 0,
    blkJoaca: 0,
    pase: esteLibero ? creeazaStructuraPaseGoala() : creeazaStructuraPaseGoala(),
    zoneAtac: esteLibero
      ? creeazaStructuraZoneAtacGoala()
      : creeazaStructuraZoneAtacGoala(),
    directiiSrvPunct: creeazaDirectiiServiciuPunctGoale(),
    directiiAtkAdversarPunct: creeazaDirectiiAtacAdversarPunctGoale(),
  };
}

function normalizeazaRotatii(rawRotatii) {
  const baza = creeazaRotatiiGoale();
  if (!rawRotatii || typeof rawRotatii !== "object") return baza;
  POZITII_RIDICATOR.forEach((pos) => {
    const val = rawRotatii[pos];
    if (val && typeof val === "object") {
      baza[pos] = {
        pct: Number(val.pct) || 0,
        er: Number(val.er) || 0,
        neutru: Number(val.neutru) || 0,
      };
    }
  });
  return baza;
}

function normalizeazaPase(rawPase) {
  const baza = creeazaStructuraPaseGoala();
  if (!rawPase || typeof rawPase !== "object") return baza;

  ZONE_PASA.forEach((zona) => {
    const val = rawPase[zona];
    if (val && typeof val === "object") {
      baza[zona] = {
        "+": Number(val["+"]) || 0,
        "0": Number(val["0"]) || 0,
        "-": Number(val["-"]) || 0,
      };
    } else if (typeof val === "number") {
      baza[zona] = { "+": Number(val) || 0, "0": 0, "-": 0 };
    }
  });

  return baza;
}

function normalizeazaZoneAtac(rawZone) {
  const baza = creeazaStructuraZoneAtacGoala();
  if (!rawZone || typeof rawZone !== "object") return baza;

  TOATE_ZONELE_ATAC.forEach((zona) => {
    const val = rawZone[zona];
    if (val && typeof val === "object") {
      baza[zona] = {
        pct: Number(val.pct) || 0,
        er: Number(val.er) || 0,
        neutru: Number(val.neutru) || 0,
      };
    }
  });

  return baza;
}

function normalizeazaStatSet(rawStat, post = "Atacant") {
  const esteLibero = post === "Libero";
  const s = rawStat && typeof rawStat === "object" ? rawStat : {};

  return {
    atkReusit: esteLibero ? 0 : Number(s.atkReusit) || 0,
    atkEroare: esteLibero ? 0 : Number(s.atkEroare) || 0,
    atkNeutru: esteLibero ? 0 : Number(s.atkNeutru) || 0,
    srvAs: esteLibero ? 0 : Number(s.srvAs) || 0,
    srvEroare: esteLibero ? 0 : Number(s.srvEroare) || 0,
    srvNeutru: esteLibero ? 0 : Number(s.srvNeutru) || 0,
    recPozitiv: Number(s.recPozitiv) || 0,
    recEroare: Number(s.recEroare) || 0,
    recNeutru: Number(s.recNeutru) || 0,
    libRecServPoz: Number(s.libRecServPoz) || 0,
    libRecServEr: Number(s.libRecServEr) || 0,
    libRecServNeutru: Number(s.libRecServNeutru) || 0,
    libRecAtkPoz: Number(s.libRecAtkPoz) || 0,
    libRecAtkEr: Number(s.libRecAtkEr) || 0,
    libRecAtkNeutru: Number(s.libRecAtkNeutru) || 0,
    blkPunct: esteLibero ? 0 : Number(s.blkPunct) || 0,
    blkEroare: esteLibero ? 0 : Number(s.blkEroare) || 0,
    blkJoaca: esteLibero ? 0 : Number(s.blkJoaca) || 0,
    pase: esteLibero ? creeazaStructuraPaseGoala() : normalizeazaPase(s.pase),
    zoneAtac: esteLibero
      ? creeazaStructuraZoneAtacGoala()
      : normalizeazaZoneAtac(s.zoneAtac),
    directiiSrvPunct: normalizeazaDirectiiServiciuPunct(s.directiiSrvPunct),
    directiiAtkAdversarPunct: normalizeazaDirectiiAtacAdversarPunct(
      s.directiiAtkAdversarPunct
    ),
  };
}

function normalizeazaJucatoare(j) {
  const post = j.post ?? "Atacant";
  const statsPeSet = {};
  SETURI.forEach((nrSet) => {
    statsPeSet[nrSet] = normalizeazaStatSet(j.statsPeSet?.[nrSet], post);
  });

  return {
    id: j.id,
    numar: j.numar ?? "-",
    nume: j.nume ?? "",
    post,
    statsPeSet,
  };
}

function detecteazaPostDinText(text) {
  const curat = String(text || "").toLowerCase();
  if (!curat) return "Atacant";
  if (
    curat.includes("libero") ||
    curat.includes("líbero") ||
    curat.includes("λίμπερο")
  ) {
    return "Libero";
  }
  if (
    curat.includes("ridic") ||
    curat.includes("setter") ||
    curat.includes("zuspiel") ||
    curat.includes("passeur") ||
    curat.includes("pallegg") ||
    curat.includes("colocador") ||
    curat.includes("pasör")
  ) {
    return "Ridicător";
  }
  if (
    curat.includes("centru") ||
    curat.includes("middle") ||
    curat.includes("mittel") ||
    curat.includes("central") ||
    curat.includes("orta")
  ) {
    return "Centru";
  }
  if (
    curat.includes("opus") ||
    curat.includes("opposite") ||
    curat.includes("diagonal") ||
    curat.includes("pointu") ||
    curat.includes("opposto") ||
    curat.includes("opuesto")
  ) {
    return "Opus";
  }
  return "Atacant";
}

function parseazaJucatoareDinText(textBrut) {
  const linii = String(textBrut || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rezultate = [];
  const cuvinteExcluse =
    /\b(kader|roster|lot|mannschaft|team|echipa|verein|club|trainer|coach|liga|set|satz|datum|date|bericht|report|spiel|match|tabelle|position|nummer|nr\.?|name|spieler|jucatoare|libero|setter|zuspieler|mittelblocker|außenangreifer|diagonalangreifer|atacant|centru|opus)\b/i;

  for (const linie of linii) {
    if (rezultate.length >= 30) break;

    const curatLinie = linie.replace(/^[•\-–—*]+\s*/, "").trim();
    if (!curatLinie || curatLinie.length > 80) continue;

    if (/[\\^~`{}[\]<>|_=+*#@$%]{2,}/.test(curatLinie)) continue;

    let numar = "";
    let nume = "";
    let post = "Atacant";

    const potrivireNrInceput = curatLinie.match(
      /^#?([1-9]\d?)\s*(?:[-–—:|;,\t]+|\s+)\s*(.+)$/
    );

    const potrivireNrFinal = curatLinie.match(
      /^(.+?)\s*(?:[-–—:|;,\t]+|\s+)#?([1-9]\d?)$/
    );

    if (potrivireNrInceput) {
      numar = potrivireNrInceput[1];
      nume = potrivireNrInceput[2];
    } else if (potrivireNrFinal) {
      nume = potrivireNrFinal[1];
      numar = potrivireNrFinal[2];
    } else {
      continue;
    }

    const bucatiNume = nume.split(/[;\t|]+/);
    nume = bucatiNume[0];
    if (bucatiNume[1]) {
      post = detecteazaPostDinText(bucatiNume[1]);
    }

    nume = nume
      .replace(
        /\b(libero|líbero|ridicător|setter|zuspieler|zuspiel|passeur|palleggiatore|colocador|centru|middle\s*blocker|mittelblocker|central|opus|opposite|diagonalangreifer|diagonal|atacant|outside\s*hitter|außenangreifer)\b/gi,
        " "
      )
      .replace(/[^A-Za-zÀ-žȘșȚțĂăÂâÎî .'-]/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/^[-–—:.,'\s]+|[-–—:.,'\s]+$/g, "")
      .trim();

    const cuvinteNume = nume.split(/\s+/).filter(Boolean);
    const areLitere = /[A-Za-zÀ-žȘșȚțĂăÂâÎî]{2,}/.test(nume);

    const nrVal = Number(numar);
    if (
      !Number.isInteger(nrVal) ||
      nrVal < 1 ||
      nrVal > 99 ||
      !areLitere ||
      nume.length < 3 ||
      cuvinteNume.length > 4 ||
      (cuvinteNume.length === 1 && cuvinteExcluse.test(cuvinteNume[0]))
    ) {
      continue;
    }

    rezultate.push(
      normalizeazaJucatoare({
        id: `${Date.now()}-${rezultate.length}-${Math.random().toString(36).slice(2, 7)}`,
        numar: String(nrVal),
        nume,
        post,
      })
    );
  }

  return rezultate;
}

async function extrageTextDinPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");

  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
      const workerUrl = (
        await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
      ).default;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } catch (_) {}
  }

  const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const paginiText = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const randuri = [];
    let randCurent = "";
    let ultimY = null;

    for (const item of content.items || []) {
      if (!("str" in item)) continue;
      const y = Array.isArray(item.transform) ? item.transform[5] : null;
      if (ultimY !== null && y !== null && Math.abs(y - ultimY) > 4) {
        if (randCurent.trim()) randuri.push(randCurent.trim());
        randCurent = item.str;
      } else {
        randCurent += (randCurent ? " " : "") + item.str;
      }
      if (y !== null) ultimY = y;
    }

    if (randCurent.trim()) randuri.push(randCurent.trim());
    paginiText.push(randuri.join("\n"));
  }

  return paginiText.join("\n").trim();
}

async function extrageTextDinImagineOcr(file) {
  try {
    const tesseractModule = await import("tesseract.js");
    const recognizeFn =
      tesseractModule.recognize || tesseractModule.default?.recognize;
    if (typeof recognizeFn === "function") {
      const res = await recognizeFn(file, "ron+eng+deu");
      return String(res?.data?.text || "").trim();
    }
  } catch (_) {}
  return "";
}

function cumuleazaStatSet(listaStats) {
  const baza = normalizeazaStatSet({}, "Atacant");
  listaStats.forEach((s) => {
    const n = normalizeazaStatSet(s, "Atacant");
    baza.atkReusit += n.atkReusit;
    baza.atkEroare += n.atkEroare;
    baza.atkNeutru += n.atkNeutru;
    baza.srvAs += n.srvAs;
    baza.srvEroare += n.srvEroare;
    baza.srvNeutru += n.srvNeutru;
    baza.recPozitiv += n.recPozitiv;
    baza.recEroare += n.recEroare;
    baza.recNeutru += n.recNeutru;
    baza.libRecServPoz += n.libRecServPoz;
    baza.libRecServEr += n.libRecServEr;
    baza.libRecServNeutru += n.libRecServNeutru;
    baza.libRecAtkPoz += n.libRecAtkPoz;
    baza.libRecAtkEr += n.libRecAtkEr;
    baza.libRecAtkNeutru += n.libRecAtkNeutru;
    baza.blkPunct += n.blkPunct;
    baza.blkEroare += n.blkEroare;
    baza.blkJoaca += n.blkJoaca;

    ZONE_PASA.forEach((zona) => {
      CALITATI_PASA.forEach((cal) => {
        baza.pase[zona][cal] += n.pase[zona][cal] || 0;
      });
    });

    TOATE_ZONELE_ATAC.forEach((zona) => {
      baza.zoneAtac[zona].pct += n.zoneAtac[zona]?.pct || 0;
      baza.zoneAtac[zona].er += n.zoneAtac[zona]?.er || 0;
      baza.zoneAtac[zona].neutru += n.zoneAtac[zona]?.neutru || 0;
    });

    DIRECTII_SERVICIU_PUNCT.forEach((dir) => {
      baza.directiiSrvPunct[dir] += n.directiiSrvPunct?.[dir] || 0;
    });

    DIRECTII_ATAC_ADVERSAR_PUNCT.forEach((dir) => {
      baza.directiiAtkAdversarPunct[dir] +=
        n.directiiAtkAdversarPunct?.[dir] || 0;
    });
  });
  return baza;
}

function getStatJucatoarePentruMod(j, modVizualizare) {
  const post = j.post ?? "Atacant";
  if (modVizualizare === "total") {
    const lista = SETURI.map((nrSet) => j.statsPeSet?.[nrSet]);
    return normalizeazaStatSet(cumuleazaStatSet(lista), post);
  }
  const nrSet = SETURI.includes(Number(modVizualizare))
    ? Number(modVizualizare)
    : 1;
  return normalizeazaStatSet(j.statsPeSet?.[nrSet], post);
}

function getStatisticiCalculateDinStat(stat, post) {
  const esteLibero = post === "Libero";
  const atkTotal =
    (Number(stat.atkReusit) || 0) +
    (Number(stat.atkEroare) || 0) +
    (Number(stat.atkNeutru) || 0);

  const libServTotal =
    (Number(stat.libRecServPoz) || 0) +
    (Number(stat.libRecServEr) || 0) +
    (Number(stat.libRecServNeutru) || 0);

  const libAtkTotal =
    (Number(stat.libRecAtkPoz) || 0) +
    (Number(stat.libRecAtkEr) || 0) +
    (Number(stat.libRecAtkNeutru) || 0);

  const recTotal = esteLibero
    ? libServTotal + libAtkTotal
    : (Number(stat.recPozitiv) || 0) +
      (Number(stat.recEroare) || 0) +
      (Number(stat.recNeutru) || 0);

  const recPozitivTotal = esteLibero
    ? (Number(stat.libRecServPoz) || 0) + (Number(stat.libRecAtkPoz) || 0)
    : Number(stat.recPozitiv) || 0;

  const recEroareTotal = esteLibero
    ? (Number(stat.libRecServEr) || 0) + (Number(stat.libRecAtkEr) || 0)
    : Number(stat.recEroare) || 0;

  const srvTotal =
    (Number(stat.srvAs) || 0) +
    (Number(stat.srvEroare) || 0) +
    (Number(stat.srvNeutru) || 0);
  const blkTotal =
    (Number(stat.blkPunct) || 0) +
    (Number(stat.blkEroare) || 0) +
    (Number(stat.blkJoaca) || 0);

  return {
    atkTotal,
    recTotal,
    recPozitivTotal,
    recEroareTotal,
    libServTotal,
    libAtkTotal,
    srvTotal,
    blkTotal,
  };
}

function getLotPredefinitEchipa(echipaId) {
  const echipaDinData = EUROPEAN_VOLLEYBALL_TEAMS.find((e) => e.id === echipaId);
  const lista = Array.isArray(echipaDinData?.players)
    ? echipaDinData.players
    : [];
  return lista.map((j) => normalizeazaJucatoare(j));
}

function construiesteSloturiTerenDinLot(listaJucatoare) {
  const sloturi = {};
  ORDINE_TEREN.forEach((zona, idx) => {
    sloturi[zona] = listaJucatoare[idx]?.id || null;
  });
  return sloturi;
}

function construiesteLoturiInitiale() {
  const initial = {};
  EUROPEAN_VOLLEYBALL_TEAMS.forEach((echipa) => {
    initial[echipa.id] = getLotPredefinitEchipa(echipa.id);
  });
  return initial;
}

function construiesteTerenInitialPeEchipe(loturiObj) {
  const terenPeEchipe = {};
  EUROPEAN_VOLLEYBALL_TEAMS.forEach((echipa) => {
    const juc = loturiObj[echipa.id] || [];
    terenPeEchipe[echipa.id] = construiesteSloturiTerenDinLot(juc);
  });
  return terenPeEchipe;
}

function construiesteSeturiStatePeEchipe() {
  const obj = {};
  EUROPEAN_VOLLEYBALL_TEAMS.forEach((echipa) => {
    const seturiObj = {};
    SETURI.forEach((nrSet) => {
      seturiObj[nrSet] = {
        noi: 0,
        adversar: 0,
        serviciu: "noi",
        pozitieRidicator: 1,
        rotatii: creeazaRotatiiGoale(),
        directiiSrvPunct: creeazaDirectiiServiciuPunctGoale(),
        directiiAtkAdversarPunct: creeazaDirectiiAtacAdversarPunctGoale(),
      };
    });
    obj[echipa.id] = {
      setActiv: 1,
      modVizualizare: "1",
      seturi: seturiObj,
    };
  });
  return obj;
}

function normalizeazaSeturiStateEchipa(raw) {
  const baza = {
    setActiv: 1,
    modVizualizare: "1",
    seturi: {},
  };
  SETURI.forEach((nrSet) => {
    baza.seturi[nrSet] = {
      noi: 0,
      adversar: 0,
      serviciu: "noi",
      pozitieRidicator: 1,
      rotatii: creeazaRotatiiGoale(),
      directiiSrvPunct: creeazaDirectiiServiciuPunctGoale(),
      directiiAtkAdversarPunct: creeazaDirectiiAtacAdversarPunctGoale(),
    };
  });

  if (!raw || typeof raw !== "object") return baza;

  const setActivNum = SETURI.includes(Number(raw.setActiv))
    ? Number(raw.setActiv)
    : 1;
  const modViz =
    raw.modVizualizare === "total" || SETURI.includes(Number(raw.modVizualizare))
      ? String(raw.modVizualizare)
      : String(setActivNum);

  baza.setActiv = setActivNum;
  baza.modVizualizare = modViz;

  SETURI.forEach((nrSet) => {
    const s = raw.seturi?.[nrSet];
    if (s && typeof s === "object") {
      const pos = Number(s.pozitieRidicator);
      baza.seturi[nrSet] = {
        noi: Number(s.noi) || 0,
        adversar: Number(s.adversar) || 0,
        serviciu: s.serviciu === "adversar" ? "adversar" : "noi",
        pozitieRidicator: POZITII_RIDICATOR.includes(pos) ? pos : 1,
        rotatii: normalizeazaRotatii(s.rotatii),
        directiiSrvPunct: normalizeazaDirectiiServiciuPunct(
          s.directiiSrvPunct
        ),
        directiiAtkAdversarPunct: normalizeazaDirectiiAtacAdversarPunct(
          s.directiiAtkAdversarPunct
        ),
      };
    }
  });

  return baza;
}

function getRotatiiCumulateMeci(seturiStateEchipa) {
  const cumulat = creeazaRotatiiGoale();
  SETURI.forEach((nrSet) => {
    const rot = normalizeazaRotatii(seturiStateEchipa.seturi?.[nrSet]?.rotatii);
    POZITII_RIDICATOR.forEach((pos) => {
      cumulat[pos].pct += rot[pos].pct || 0;
      cumulat[pos].er += rot[pos].er || 0;
      cumulat[pos].neutru += rot[pos].neutru || 0;
    });
  });
  return cumulat;
}

function getDirectiiSrvPunctCumulate(seturiStateEchipa) {
  const cumulat = creeazaDirectiiServiciuPunctGoale();
  SETURI.forEach((nrSet) => {
    const d = normalizeazaDirectiiServiciuPunct(
      seturiStateEchipa.seturi?.[nrSet]?.directiiSrvPunct
    );
    DIRECTII_SERVICIU_PUNCT.forEach((dir) => {
      cumulat[dir] += d[dir] || 0;
    });
  });
  return cumulat;
}

function getDirectiiAtkAdversarPunctCumulate(seturiStateEchipa) {
  const cumulat = creeazaDirectiiAtacAdversarPunctGoale();
  SETURI.forEach((nrSet) => {
    const d = normalizeazaDirectiiAtacAdversarPunct(
      seturiStateEchipa.seturi?.[nrSet]?.directiiAtkAdversarPunct
    );
    DIRECTII_ATAC_ADVERSAR_PUNCT.forEach((dir) => {
      cumulat[dir] += d[dir] || 0;
    });
  });
  return cumulat;
}

function rezumaDirectiiPunct(srvObj, atkAdversarObj, t) {
  const srvNorm = normalizeazaDirectiiServiciuPunct(srvObj);
  const atkNorm = normalizeazaDirectiiAtacAdversarPunct(atkAdversarObj);

  const srvTot = DIRECTII_SERVICIU_PUNCT.reduce(
    (acc, d) => acc + (srvNorm[d] || 0),
    0
  );
  const atkTot = DIRECTII_ATAC_ADVERSAR_PUNCT.reduce(
    (acc, d) => acc + (atkNorm[d] || 0),
    0
  );

  const srvLista = DIRECTII_SERVICIU_PUNCT.filter((d) => (srvNorm[d] || 0) > 0)
    .map((d) => `${d}: ${srvNorm[d]} (${calculeazaProcent(srvNorm[d], srvTot)}%)`)
    .join(" | ");

  const atkLista = DIRECTII_ATAC_ADVERSAR_PUNCT.filter(
    (d) => (atkNorm[d] || 0) > 0
  )
    .map((d) => `${d}: ${atkNorm[d]} (${calculeazaProcent(atkNorm[d], atkTot)}%)`)
    .join(" | ");

  if (!srvLista && !atkLista) return t.noScoringDirsYet;
  return [
    srvLista ? `${t.serve} +: ${srvLista}` : "",
    atkLista ? `${t.opponent} ${t.attack} +: ${atkLista}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function rezumaPaseJucatoare(pase, t) {
  const normalizat = normalizeazaPase(pase);
  let total = 0;
  let plus = 0;
  let zero = 0;
  let minus = 0;
  const peZone = [];

  ZONE_PASA.forEach((zona) => {
    const zPlus = normalizat[zona]["+"] || 0;
    const zZero = normalizat[zona]["0"] || 0;
    const zMinus = normalizat[zona]["-"] || 0;
    const zTot = zPlus + zZero + zMinus;

    total += zTot;
    plus += zPlus;
    zero += zZero;
    minus += zMinus;

    if (zTot > 0) {
      const zCalPct = calculeazaProcent(zPlus, zTot);
      const zonaTrad = t.passZones?.[zona] || zona;
      peZone.push(
        `${zonaTrad}: ${zTot} (+${zPlus}/0${zZero}/-${zMinus}, ${zCalPct}%+)`
      );
    }
  });

  const calitatePlusPct = calculeazaProcent(plus, total);
  return {
    total,
    plus,
    zero,
    minus,
    calitatePlusPct,
    textDetaliat: peZone.length > 0 ? peZone.join(" | ") : "-",
  };
}

function rezumaZoneAtacJucatoare(zoneAtac, post, t) {
  const normalizat = normalizeazaZoneAtac(zoneAtac);
  const zonePermise =
    post === "Centru"
      ? ZONE_ATAC_CENTRU
      : TOATE_ZONELE_ATAC.filter((z) => z !== "Pipe");
  const elemente = [];

  zonePermise.forEach((zona) => {
    const z = normalizat[zona];
    const zTot =
      (Number(z?.pct) || 0) + (Number(z?.er) || 0) + (Number(z?.neutru) || 0);
    if (z && zTot > 0) {
      const pctAtac = calculeazaProcent(z.pct, zTot);
      const zonaTrad = t.attackZones?.[zona] || zona;
      elemente.push(
        `${zonaTrad}: ${z.pct}/${zTot} (${pctAtac}%, ${z.er} ${t.errShort})`
      );
    }
  });

  return elemente.length > 0 ? elemente.join(" | ") : "-";
}

function rotesteObiectTeren(actual) {
  return {
    Z4: actual.Z5 || null,
    Z3: actual.Z4 || null,
    Z2: actual.Z3 || null,
    Z5: actual.Z6 || null,
    Z6: actual.Z1 || null,
    Z1: actual.Z2 || null,
  };
}

function determinaImpactPunctDinActiune(categorie, tip) {
  if (categorie === "atk" && tip === "reusit") return "noi";
  if (categorie === "srv" && tip === "as") return "noi";
  if (categorie === "blk" && tip === "punct") return "noi";

  if (categorie === "atk" && tip === "eroare") return "adversar";
  if (categorie === "srv" && tip === "eroare") return "adversar";
  if (categorie === "blk" && tip === "eroare") return "adversar";
  if (categorie === "rec" && tip === "eroare") return "adversar";

  return null;
}

function getLiberoImplicitiDinLot(listaJucatoare) {
  const liberi = (listaJucatoare || []).filter((j) => j.post === "Libero");
  return {
    primarId: liberi[0]?.id ?? null,
    secundarId: null,
  };
}

function calculeazaTotalEchipaDinLot(jucatoareLista, modVizualizare, t) {
  const acc = (jucatoareLista || []).reduce(
    (sum, j) => {
      const stat = getStatJucatoarePentruMod(j, modVizualizare);
      const calc = getStatisticiCalculateDinStat(stat, j.post);
      sum.atkReusit += stat.atkReusit;
      sum.atkEroare += stat.atkEroare;
      sum.atkNeutru += stat.atkNeutru;
      sum.atkTotal += calc.atkTotal;

      sum.srvAs += stat.srvAs;
      sum.srvEroare += stat.srvEroare;
      sum.srvNeutru += stat.srvNeutru;
      sum.srvTotal += calc.srvTotal;

      sum.recPozitiv += calc.recPozitivTotal;
      sum.recEroare += calc.recEroareTotal;
      sum.recNeutru += Math.max(
        0,
        calc.recTotal - calc.recPozitivTotal - calc.recEroareTotal
      );
      sum.recTotal += calc.recTotal;

      sum.blkPunct += stat.blkPunct;
      sum.blkEroare += stat.blkEroare;
      sum.blkJoaca += stat.blkJoaca;
      sum.blkTotal += calc.blkTotal;

      const rezPasa = rezumaPaseJucatoare(stat.pase, t);
      sum.paseTotal += rezPasa.total;
      sum.pasePlus += rezPasa.plus;
      sum.paseZero += rezPasa.zero;
      sum.paseMinus += rezPasa.minus;
      return sum;
    },
    {
      atkReusit: 0,
      atkEroare: 0,
      atkNeutru: 0,
      atkTotal: 0,
      srvAs: 0,
      srvEroare: 0,
      srvNeutru: 0,
      srvTotal: 0,
      recPozitiv: 0,
      recEroare: 0,
      recNeutru: 0,
      recTotal: 0,
      blkPunct: 0,
      blkEroare: 0,
      blkJoaca: 0,
      blkTotal: 0,
      paseTotal: 0,
      pasePlus: 0,
      paseZero: 0,
      paseMinus: 0,
    }
  );

  return {
    ...acc,
    atkPct: calculeazaProcent(acc.atkReusit, acc.atkTotal),
    atkEf: calculateEfficiency(acc.atkReusit, acc.atkEroare, acc.atkTotal),
    recPozPct: calculeazaProcent(acc.recPozitiv, acc.recTotal),
    recErPct: calculeazaProcent(acc.recEroare, acc.recTotal),
    srvAsPct: calculeazaProcent(acc.srvAs, acc.srvTotal),
    srvErPct: calculeazaProcent(acc.srvEroare, acc.srvTotal),
    srvEf: calculateEfficiency(acc.srvAs, acc.srvEroare, acc.srvTotal),
    blkPct: calculeazaProcent(acc.blkPunct, acc.blkTotal),
    blkEf: calculateEfficiency(acc.blkPunct, acc.blkEroare, acc.blkTotal),
    pasePlusPct: calculeazaProcent(acc.pasePlus, acc.paseTotal),
  };
}

export default function App() {
  const [limba, setLimba] = useState(() => {
    try {
      const salvata = localStorage.getItem(LANG_STORAGE_KEY);
      if (salvata && TRADUCERI[salvata]) return salvata;
    } catch (_) {}
    return "ro";
  });
  const [meniuLimbaDeschis, setMeniuLimbaDeschis] = useState(false);
  const langDropdownRef = useRef(null);
  const photoFileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

  const [indicatorGrafic, setIndicatorGrafic] = useState("atkReusit");
  const [textImportJucatoare, setTextImportJucatoare] = useState("");
  const [inlocuiesteLotImport, setInlocuiesteLotImport] = useState(false);
  const [mesajImport, setMesajImport] = useState("");
  const [seProceseazaImport, setSeProceseazaImport] = useState(false);

  const [directieSrvPunctSelectata, setDirectieSrvPunctSelectata] = useState(
    DIRECTII_SERVICIU_PUNCT[0]
  );
  const [directieAtkAdversarPunctSelectata, setDirectieAtkAdversarPunctSelectata] =
    useState(DIRECTII_ATAC_ADVERSAR_PUNCT[0]);

  const t = getTraduceriLimba(limba);
  const limbaCurentaObj = LIMBI.find((l) => l.code === limba) || LIMBI[0];

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, limba);
    } catch (_) {}
  }, [limba]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target)
      ) {
        setMeniuLimbaDeschis(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const [loturi, setLoturi] = useState(() => {
    const initial = construiesteLoturiInitiale();
    try {
      const salvat = localStorage.getItem(STORAGE_KEY);
      if (salvat) {
        const parsed = JSON.parse(salvat);
        if (parsed?.loturi) {
          Object.keys(initial).forEach((echipaId) => {
            const salvatLot = parsed.loturi[echipaId];
            if (Array.isArray(salvatLot) && salvatLot.length > 0) {
              initial[echipaId] = salvatLot.map((j) => normalizeazaJucatoare(j));
            }
          });
        }
      }
    } catch (_) {}
    return initial;
  });

  const [terenPeEchipe, setTerenPeEchipe] = useState(() => {
    const initial = construiesteTerenInitialPeEchipe(loturi);
    try {
      const salvat = localStorage.getItem(STORAGE_KEY);
      if (salvat) {
        const parsed = JSON.parse(salvat);
        if (parsed?.terenPeEchipe) {
          Object.keys(initial).forEach((echipaId) => {
            if (parsed.terenPeEchipe[echipaId]) {
              const areSlotOcupat = ORDINE_TEREN.some(
                (z) => Boolean(parsed.terenPeEchipe[echipaId][z])
              );
              initial[echipaId] = areSlotOcupat
                ? {
                    ...initial[echipaId],
                    ...parsed.terenPeEchipe[echipaId],
                  }
                : construiesteSloturiTerenDinLot(initial[echipaId] || []);
            }
          });
        }
      }
    } catch (_) {}
    return initial;
  });

  const [seturiPeEchipe, setSeturiPeEchipe] = useState(() => {
    const initial = construiesteSeturiStatePeEchipe();
    try {
      const salvat = localStorage.getItem(STORAGE_KEY);
      if (salvat) {
        const parsed = JSON.parse(salvat);
        if (parsed?.seturiPeEchipe) {
          Object.keys(initial).forEach((echipaId) => {
            if (parsed.seturiPeEchipe[echipaId]) {
              initial[echipaId] = normalizeazaSeturiStateEchipa(
                parsed.seturiPeEchipe[echipaId]
              );
            }
          });
        }
      }
    } catch (_) {}
    return initial;
  });

  const [liberoPeEchipe, setLiberoPeEchipe] = useState(() => {
    const initial = {};
    EUROPEAN_VOLLEYBALL_TEAMS.forEach((echipa) => {
      initial[echipa.id] = getLiberoImplicitiDinLot(loturi[echipa.id] || []);
    });
    try {
      const salvat = localStorage.getItem(STORAGE_KEY);
      if (salvat) {
        const parsed = JSON.parse(salvat);
        if (parsed?.liberoPeEchipe) {
          Object.keys(initial).forEach((echipaId) => {
            if (parsed.liberoPeEchipe[echipaId]) {
              initial[echipaId] = {
                primarId: parsed.liberoPeEchipe[echipaId].primarId ?? null,
                secundarId: parsed.liberoPeEchipe[echipaId].secundarId ?? null,
              };
            }
          });
        }
      }
    } catch (_) {}
    return initial;
  });

  const [istoric, setIstoric] = useState([]);
  const [echipaSelectataId, setEchipaSelectataId] = useState(
    EUROPEAN_VOLLEYBALL_TEAMS[0]?.id || ""
  );
  const [adversarId, setAdversarId] = useState(
    EUROPEAN_VOLLEYBALL_TEAMS[1]?.id || EUROPEAN_VOLLEYBALL_TEAMS[0]?.id || ""
  );
  const [tintaScouting, setTintaScouting] = useState("noi");
  const [modParalelEcran, setModParalelEcran] = useState(false);
  const [scoutActiv, setScoutActiv] = useState("Scout 1");
  const [jucatoareInSchimbareId, setJucatoareInSchimbareId] = useState(null);
  const [numarTricou, setNumarTricou] = useState("");
  const [numeJucatoare, setNumeJucatoare] = useState("");
  const [postJucatoare, setPostJucatoare] = useState("Atacant");

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          loturi,
          terenPeEchipe,
          seturiPeEchipe,
          liberoPeEchipe,
        })
      );
    } catch (_) {}
  }, [loturi, terenPeEchipe, seturiPeEchipe, liberoPeEchipe]);

  useEffect(() => {
    function handleStorage(e) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed?.loturi) {
          setLoturi((prev) => {
            const next = { ...prev };
            Object.keys(parsed.loturi).forEach((id) => {
              if (Array.isArray(parsed.loturi[id])) {
                next[id] = parsed.loturi[id].map((j) => normalizeazaJucatoare(j));
              }
            });
            return next;
          });
        }
        if (parsed?.terenPeEchipe) {
          setTerenPeEchipe((prev) => ({ ...prev, ...parsed.terenPeEchipe }));
        }
        if (parsed?.seturiPeEchipe) {
          setSeturiPeEchipe((prev) => {
            const next = { ...prev };
            Object.keys(parsed.seturiPeEchipe).forEach((id) => {
              next[id] = normalizeazaSeturiStateEchipa(parsed.seturiPeEchipe[id]);
            });
            return next;
          });
        }
        if (parsed?.liberoPeEchipe) {
          setLiberoPeEchipe((prev) => ({ ...prev, ...parsed.liberoPeEchipe }));
        }
      } catch (_) {}
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const echipaNoastra =
    EUROPEAN_VOLLEYBALL_TEAMS.find((e) => e.id === echipaSelectataId) ||
    EUROPEAN_VOLLEYBALL_TEAMS[0];

  const echipaAdversa =
    EUROPEAN_VOLLEYBALL_TEAMS.find((e) => e.id === adversarId) ||
    EUROPEAN_VOLLEYBALL_TEAMS.find((e) => e.id !== echipaNoastra?.id) ||
    EUROPEAN_VOLLEYBALL_TEAMS[0];

  const echipaPrincipalaId = echipaNoastra?.id || "";
  const echipaAdversaId = echipaAdversa?.id || "";

  const echipaActivaObj =
    tintaScouting === "adversar" ? echipaAdversa : echipaNoastra;
  const echipaId = echipaActivaObj?.id || "";

  const temaEchipaActiva = getTemaEchipa(echipaActivaObj);
  const temaEchipaNoastra = getTemaEchipa(echipaNoastra);
  const temaEchipaAdversa = getTemaEchipa(echipaAdversa);

  const jucatoareNoastre = loturi[echipaPrincipalaId] || [];
  const jucatoareAdverse = loturi[echipaAdversaId] || [];
  const jucatoareCurente = loturi[echipaId] || [];

  const stareSeturiMeci = normalizeazaSeturiStateEchipa(
    seturiPeEchipe[echipaPrincipalaId]
  );
  const stareSeturiAdversar = normalizeazaSeturiStateEchipa(
    seturiPeEchipe[echipaAdversaId]
  );

  const setActiv = stareSeturiMeci.setActiv;
  const modVizualizare = stareSeturiMeci.modVizualizare;
  const infoSetActiv = stareSeturiMeci.seturi[setActiv];
  const stareSetActiv = evalueazaStareSet(
    setActiv,
    infoSetActiv.noi,
    infoSetActiv.adversar
  );
  const scorSeturiMeci = calculeazaScorSeturiMeci(stareSeturiMeci.seturi);
  const pozitieRidicatorCurenta = infoSetActiv.pozitieRidicator || 1;
  const pozitieRidicatorAdversar =
    stareSeturiAdversar.seturi?.[setActiv]?.pozitieRidicator || 1;

  const echipaNoastraServeste = infoSetActiv.serviciu === "noi";
  const echipaAdversaServeste = infoSetActiv.serviciu === "adversar";

  const directiiSrvPunctNoastre =
    modVizualizare === "total"
      ? getDirectiiSrvPunctCumulate(stareSeturiMeci)
      : normalizeazaDirectiiServiciuPunct(
          stareSeturiMeci.seturi?.[Number(modVizualizare)]?.directiiSrvPunct
        );

  const directiiSrvPunctAdversar =
    modVizualizare === "total"
      ? getDirectiiSrvPunctCumulate(stareSeturiAdversar)
      : normalizeazaDirectiiServiciuPunct(
          stareSeturiAdversar.seturi?.[Number(modVizualizare)]
            ?.directiiSrvPunct
        );

  const directiiAtkAdversarPunctAfisate =
    modVizualizare === "total"
      ? getDirectiiAtkAdversarPunctCumulate(stareSeturiMeci)
      : normalizeazaDirectiiAtacAdversarPunct(
          stareSeturiMeci.seturi?.[Number(modVizualizare)]
            ?.directiiAtkAdversarPunct
        );

  const jucatoareLiberoLot = jucatoareCurente.filter((j) => j.post === "Libero");
  const stareLiberoEchipa = liberoPeEchipe[echipaId] || {
    primarId: jucatoareLiberoLot[0]?.id ?? null,
    secundarId: null,
  };

  const liberoPrimarActiv =
    jucatoareLiberoLot.find(
      (j) => String(j.id) === String(stareLiberoEchipa.primarId)
    ) ||
    jucatoareLiberoLot[0] ||
    null;

  const liberoSecundarActiv =
    stareLiberoEchipa.secundarId &&
    String(stareLiberoEchipa.secundarId) !== String(liberoPrimarActiv?.id)
      ? jucatoareLiberoLot.find(
          (j) => String(j.id) === String(stareLiberoEchipa.secundarId)
        ) || null
      : null;

  function aplicaListaImportataPeEchipa(listaImportata) {
    if (!echipaId) return;
    if (!Array.isArray(listaImportata) || listaImportata.length === 0) {
      setMesajImport(t.importStatusEmpty);
      return;
    }

    salveazaSnapshot();

    const lotExistent = loturi[echipaId] || [];
    const lotNou = inlocuiesteLotImport
      ? listaImportata
      : [...lotExistent, ...listaImportata];

    setLoturi((prev) => ({
      ...prev,
      [echipaId]: lotNou,
    }));

    setTerenPeEchipe((prev) => {
      const terenActual = { ...(prev[echipaId] || {}) };
      if (inlocuiesteLotImport) {
        return {
          ...prev,
          [echipaId]: construiesteSloturiTerenDinLot(lotNou),
        };
      }
      const ocupate = new Set(
        ORDINE_TEREN.map((z) => terenActual[z]).filter(Boolean)
      );
      listaImportata.forEach((j) => {
        if (j.post !== "Libero" && !ocupate.has(j.id)) {
          const zonaLibera = ORDINE_TEREN.find((z) => !terenActual[z]);
          if (zonaLibera) {
            terenActual[zonaLibera] = j.id;
            ocupate.add(j.id);
          }
        }
      });
      return {
        ...prev,
        [echipaId]: terenActual,
      };
    });

    setLiberoPeEchipe((prev) => {
      const actual = prev[echipaId] || { primarId: null, secundarId: null };
      const impliciti = getLiberoImplicitiDinLot(lotNou);
      return {
        ...prev,
        [echipaId]: {
          primarId: actual.primarId || impliciti.primarId,
          secundarId: actual.secundarId,
        },
      };
    });

    setMesajImport(
      `${t.importStatusSuccess}: +${listaImportata.length} (${echipaActivaObj?.teamName})`
    );
  }

  function handleImportDinText() {
    const lista = parseazaJucatoareDinText(textImportJucatoare);
    aplicaListaImportataPeEchipa(lista);
  }

  async function handleImportDinFisier(e, tipFortat) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setSeProceseazaImport(true);
    setMesajImport(t.importStatusWorking);

    try {
      const numeLower = String(file.name || "").toLowerCase();
      const tipMime = String(file.type || "").toLowerCase();
      let textExtras = "";

      const estePdf =
        tipFortat === "pdf" ||
        numeLower.endsWith(".pdf") ||
        tipMime.includes("pdf");

      if (estePdf) {
        textExtras = await extrageTextDinPdf(file);
      } else {
        textExtras = await extrageTextDinImagineOcr(file);
      }

      if (textExtras) {
        setTextImportJucatoare(textExtras);
      }

      const lista = parseazaJucatoareDinText(textExtras);
      if (lista.length === 0) {
        setMesajImport(textExtras ? t.importStatusEmpty : t.importStatusError);
      } else {
        aplicaListaImportataPeEchipa(lista);
      }
    } catch (_) {
      setMesajImport(t.importStatusError);
    } finally {
      setSeProceseazaImport(false);
    }
  }

  function schimbaPostJucatoarePeEchipa(
    targetEchipaId,
    idJucatoare,
    postNou
  ) {
    if (!targetEchipaId || !POSTURI_DISPONIBILE.includes(postNou)) return;
    salveazaSnapshot();

    let lotActualizat = [];
    setLoturi((prev) => {
      const lista = (prev[targetEchipaId] || []).map((j) => {
        if (String(j.id) !== String(idJucatoare)) return j;
        const statsPeSet = {};
        SETURI.forEach((nrSet) => {
          statsPeSet[nrSet] = normalizeazaStatSet(
            j.statsPeSet?.[nrSet],
            postNou
          );
        });
        return {
          ...j,
          post: postNou,
          statsPeSet,
        };
      });
      lotActualizat = lista;
      return {
        ...prev,
        [targetEchipaId]: lista,
      };
    });

    if (postNou === "Libero") {
      setTerenPeEchipe((prev) => {
        const terenActual = { ...(prev[targetEchipaId] || {}) };
        ORDINE_TEREN.forEach((z) => {
          if (String(terenActual[z]) === String(idJucatoare)) {
            terenActual[z] = null;
          }
        });
        return {
          ...prev,
          [targetEchipaId]: terenActual,
        };
      });

      setLiberoPeEchipe((prev) => {
        const actual = prev[targetEchipaId] || {
          primarId: null,
          secundarId: null,
        };
        return {
          ...prev,
          [targetEchipaId]: {
            primarId: actual.primarId || idJucatoare,
            secundarId: actual.secundarId,
          },
        };
      });
    } else {
      setLiberoPeEchipe((prev) => {
        const actual = prev[targetEchipaId] || {
          primarId: null,
          secundarId: null,
        };
        const primarNou =
          String(actual.primarId) === String(idJucatoare)
            ? null
            : actual.primarId;
        const secundarNou =
          String(actual.secundarId) === String(idJucatoare)
            ? null
            : actual.secundarId;
        return {
          ...prev,
          [targetEchipaId]: {
            primarId: primarNou,
            secundarId: secundarNou,
          },
        };
      });

      setTerenPeEchipe((prev) => {
        const terenActual = { ...(prev[targetEchipaId] || {}) };
        const dejaPeTeren = ORDINE_TEREN.some(
          (z) => String(terenActual[z]) === String(idJucatoare)
        );
        if (!dejaPeTeren && lotActualizat.length > 0) {
          const zonaLibera = ORDINE_TEREN.find((z) => !terenActual[z]);
          if (zonaLibera) {
            terenActual[zonaLibera] = idJucatoare;
          }
        }
        return {
          ...prev,
          [targetEchipaId]: terenActual,
        };
      });
    }
  }

  function seteazaLiberoPrimar(idNou) {
    if (!echipaId) return;
    salveazaSnapshot();
    setLiberoPeEchipe((prev) => {
      const actual = prev[echipaId] || { primarId: null, secundarId: null };
      const nouPrimarId = idNou ? idNou : null;
      const nouSecundarId =
        nouPrimarId && String(actual.secundarId) === String(nouPrimarId)
          ? null
          : actual.secundarId;
      return {
        ...prev,
        [echipaId]: {
          primarId: nouPrimarId,
          secundarId: nouSecundarId,
        },
      };
    });
  }

  function seteazaLiberoSecundar(idNou) {
    if (!echipaId) return;
    salveazaSnapshot();
    setLiberoPeEchipe((prev) => {
      const actual = prev[echipaId] || { primarId: null, secundarId: null };
      const nouSecundarId =
        idNou && String(idNou) !== String(liberoPrimarActiv?.id) ? idNou : null;
      return {
        ...prev,
        [echipaId]: {
          primarId: liberoPrimarActiv?.id ?? actual.primarId,
          secundarId: nouSecundarId,
        },
      };
    });
  }

  function asiguraLotIncarcat(targetEchipaId) {
    if (!targetEchipaId) return;
    const lotDinFisier = getLotPredefinitEchipa(targetEchipaId);
    let lotFolosit = loturi[targetEchipaId] || [];

    if (lotFolosit.length === 0 && lotDinFisier.length > 0) {
      lotFolosit = lotDinFisier;
      setLoturi((prev) => ({
        ...prev,
        [targetEchipaId]: lotDinFisier,
      }));
    }

    const terenActual = terenPeEchipe[targetEchipaId] || {};
    const areJucatoarePeTeren = ORDINE_TEREN.some((z) => Boolean(terenActual[z]));
    if (!areJucatoarePeTeren && lotFolosit.length > 0) {
      setTerenPeEchipe((prev) => ({
        ...prev,
        [targetEchipaId]: construiesteSloturiTerenDinLot(lotFolosit),
      }));
    }

    setLiberoPeEchipe((prev) => {
      if (prev[targetEchipaId]) return prev;
      return {
        ...prev,
        [targetEchipaId]: getLiberoImplicitiDinLot(lotFolosit),
      };
    });
  }

  function sincronizeazaEchipaLaSelectare(nouEchipaId) {
    setEchipaSelectataId(nouEchipaId);
    setJucatoareInSchimbareId(null);
    asiguraLotIncarcat(nouEchipaId);
  }

  function sincronizeazaAdversarLaSelectare(nouAdversarId) {
    setAdversarId(nouAdversarId);
    setJucatoareInSchimbareId(null);
    asiguraLotIncarcat(nouAdversarId);
  }

  const rotatiiAfisate =
    modVizualizare === "total"
      ? getRotatiiCumulateMeci(stareSeturiMeci)
      : normalizeazaRotatii(
          stareSeturiMeci.seturi?.[Number(modVizualizare)]?.rotatii
        );

  const rotatiiAdversarAfisate =
    modVizualizare === "total"
      ? getRotatiiCumulateMeci(stareSeturiAdversar)
      : normalizeazaRotatii(
          stareSeturiAdversar.seturi?.[Number(modVizualizare)]?.rotatii
        );

  function salveazaSnapshot() {
    setIstoric((prev) => [
      ...prev.slice(-29),
      {
        loturi,
        terenPeEchipe,
        seturiPeEchipe,
        liberoPeEchipe,
        scout: scoutActiv,
      },
    ]);
  }

  function anuleazaUltimaActiune() {
    setIstoric((prev) => {
      if (prev.length === 0) return prev;
      const ultim = prev[prev.length - 1];
      setLoturi(ultim.loturi);
      setTerenPeEchipe(ultim.terenPeEchipe);
      setSeturiPeEchipe(ultim.seturiPeEchipe);
      if (ultim.liberoPeEchipe) {
        setLiberoPeEchipe(ultim.liberoPeEchipe);
      }
      setJucatoareInSchimbareId(null);
      return prev.slice(0, -1);
    });
  }

  function schimbaSetActiv(nrSet) {
    if (!echipaPrincipalaId || !SETURI.includes(nrSet)) return;
    setSeturiPeEchipe((prev) => {
      const actualNoi = normalizeazaSeturiStateEchipa(prev[echipaPrincipalaId]);
      const actualAdv = normalizeazaSeturiStateEchipa(prev[echipaAdversaId]);
      return {
        ...prev,
        [echipaPrincipalaId]: {
          ...actualNoi,
          setActiv: nrSet,
          modVizualizare: String(nrSet),
        },
        [echipaAdversaId]: {
          ...actualAdv,
          setActiv: nrSet,
          modVizualizare: String(nrSet),
        },
      };
    });
  }

  function schimbaModVizualizare(nouMod) {
    if (!echipaPrincipalaId) return;
    setSeturiPeEchipe((prev) => {
      const actualNoi = normalizeazaSeturiStateEchipa(prev[echipaPrincipalaId]);
      const actualAdv = normalizeazaSeturiStateEchipa(prev[echipaAdversaId]);
      return {
        ...prev,
        [echipaPrincipalaId]: {
          ...actualNoi,
          modVizualizare: String(nouMod),
        },
        [echipaAdversaId]: {
          ...actualAdv,
          modVizualizare: String(nouMod),
        },
      };
    });
  }

  function aplicaPunctPeEchipa(cineMarcheaza, optiuniDirectie = {}) {
    let sNumCurent = 1;
    let sInfoCurent = null;

    setSeturiPeEchipe((prev) => {
      const actual = normalizeazaSeturiStateEchipa(prev[echipaPrincipalaId]);
      const sNum = actual.setActiv;
      const sInfo = actual.seturi[sNum];
      sNumCurent = sNum;
      sInfoCurent = sInfo;

      const stareSetCurent = evalueazaStareSet(
        sNum,
        sInfo.noi,
        sInfo.adversar
      );
      if (stareSetCurent.esteIncheiat) {
        return prev;
      }

      const srvPunctActual = normalizeazaDirectiiServiciuPunct(
        sInfo.directiiSrvPunct
      );
      const atkAdvPunctActual = normalizeazaDirectiiAtacAdversarPunct(
        sInfo.directiiAtkAdversarPunct
      );

      if (optiuniDirectie.directieSrvPunct) {
        const dirSrv = optiuniDirectie.directieSrvPunct;
        srvPunctActual[dirSrv] = (Number(srvPunctActual[dirSrv]) || 0) + 1;
      }

      if (optiuniDirectie.directieAtkAdversarPunct) {
        const dirAtkAdv = optiuniDirectie.directieAtkAdversarPunct;
        atkAdvPunctActual[dirAtkAdv] =
          (Number(atkAdvPunctActual[dirAtkAdv]) || 0) + 1;
      }

      const nouScorSet = {
        ...sInfo,
        noi: cineMarcheaza === "noi" ? sInfo.noi + 1 : sInfo.noi,
        adversar:
          cineMarcheaza === "adversar" ? sInfo.adversar + 1 : sInfo.adversar,
        serviciu: cineMarcheaza,
        directiiSrvPunct: srvPunctActual,
        directiiAtkAdversarPunct: atkAdvPunctActual,
      };

      const trebuieRotatieNoi =
        sInfo.serviciu === "adversar" && cineMarcheaza === "noi";
      const trebuieRotatieAdversar =
        sInfo.serviciu === "noi" && cineMarcheaza === "adversar";

      if (trebuieRotatieNoi) {
        const posActuala = Number(sInfo.pozitieRidicator) || 1;
        nouScorSet.pozitieRidicator = posActuala === 6 ? 1 : posActuala + 1;
        setTerenPeEchipe((prevTeren) => ({
          ...prevTeren,
          [echipaPrincipalaId]: rotesteObiectTeren(
            prevTeren[echipaPrincipalaId] || {}
          ),
        }));
      }

      const actualAdv = normalizeazaSeturiStateEchipa(prev[echipaAdversaId]);
      const sInfoAdv = actualAdv.seturi[sNum];
      const posAdvActuala = Number(sInfoAdv?.pozitieRidicator) || 1;
      const nouaPosAdv = trebuieRotatieAdversar
        ? posAdvActuala === 6
          ? 1
          : posAdvActuala + 1
        : posAdvActuala;

      if (trebuieRotatieAdversar) {
        setTerenPeEchipe((prevTeren) => ({
          ...prevTeren,
          [echipaAdversaId]: rotesteObiectTeren(
            prevTeren[echipaAdversaId] || {}
          ),
        }));
      }

      const srvPunctAdv = normalizeazaDirectiiServiciuPunct(
        sInfoAdv?.directiiSrvPunct
      );
      if (optiuniDirectie.directieSrvPunctAdversar) {
        const dirSrvAdv = optiuniDirectie.directieSrvPunctAdversar;
        srvPunctAdv[dirSrvAdv] = (Number(srvPunctAdv[dirSrvAdv]) || 0) + 1;
      }

      const nouScorAdv = {
        ...sInfoAdv,
        noi: cineMarcheaza === "adversar" ? sInfoAdv.noi + 1 : sInfoAdv.noi,
        adversar:
          cineMarcheaza === "noi" ? sInfoAdv.adversar + 1 : sInfoAdv.adversar,
        serviciu: cineMarcheaza === "adversar" ? "noi" : "adversar",
        pozitieRidicator: nouaPosAdv,
        directiiSrvPunct: srvPunctAdv,
        directiiAtkAdversarPunct: atkAdvPunctActual,
      };

      return {
        ...prev,
        [echipaPrincipalaId]: {
          ...actual,
          seturi: {
            ...actual.seturi,
            [sNum]: nouScorSet,
          },
        },
        [echipaAdversaId]: {
          ...actualAdv,
          seturi: {
            ...actualAdv.seturi,
            [sNum]: nouScorAdv,
          },
        },
      };
    });

    if (
      sInfoCurent &&
      !evalueazaStareSet(sNumCurent, sInfoCurent.noi, sInfoCurent.adversar)
        .esteIncheiat
    ) {
      return true;
    }
    return false;
  }

  function marcheazaPunct(cineMarcheaza, optiuniDirectie = {}) {
    if (!echipaPrincipalaId) return;
    if (stareSetActiv.esteIncheiat) return;
    salveazaSnapshot();
    aplicaPunctPeEchipa(cineMarcheaza, optiuniDirectie);
  }

  function inregistreazaPunctCuDirectie(cineMarcheaza, tipDirectie, directie) {
    if (!echipaPrincipalaId || !directie) return;
    if (stareSetActiv.esteIncheiat) return;
    salveazaSnapshot();

    const optiuniDirectie = {};
    if (tipDirectie === "srvPunct") {
      if (cineMarcheaza === "noi") {
        optiuniDirectie.directieSrvPunct = directie;
      } else {
        optiuniDirectie.directieSrvPunctAdversar = directie;
      }
    } else if (tipDirectie === "atkAdversarPunct") {
      optiuniDirectie.directieAtkAdversarPunct = directie;
    }

    aplicaPunctPeEchipa(cineMarcheaza, optiuniDirectie);

    if (tipDirectie === "srvPunct") {
      const targetId =
        cineMarcheaza === "noi" ? echipaPrincipalaId : echipaAdversaId;
      const listaJuc = loturi[targetId] || [];
      const jucTinta =
        listaJuc.find((item) => item.post !== "Libero") || listaJuc[0];
      if (jucTinta) {
        setLoturi((prev) => ({
          ...prev,
          [targetId]: (prev[targetId] || []).map((item) => {
            if (item.id !== jucTinta.id) return item;
            const sAct = normalizeazaStatSet(
              item.statsPeSet?.[setActiv],
              item.post
            );
            const dirSrv = normalizeazaDirectiiServiciuPunct(
              sAct.directiiSrvPunct
            );
            dirSrv[directie] = (Number(dirSrv[directie]) || 0) + 1;
            return {
              ...item,
              statsPeSet: {
                ...item.statsPeSet,
                [setActiv]: {
                  ...sAct,
                  srvAs: (Number(sAct.srvAs) || 0) + 1,
                  directiiSrvPunct: dirSrv,
                },
              },
            };
          }),
        }));
      }
    } else if (tipDirectie === "atkAdversarPunct") {
      const listaAdv = loturi[echipaAdversaId] || [];
      const jucAdvTinta =
        listaAdv.find((item) => item.post !== "Libero") || listaAdv[0];
      if (jucAdvTinta) {
        setLoturi((prev) => ({
          ...prev,
          [echipaAdversaId]: (prev[echipaAdversaId] || []).map((item) => {
            if (item.id !== jucAdvTinta.id) return item;
            const sAct = normalizeazaStatSet(
              item.statsPeSet?.[setActiv],
              item.post
            );
            const dirAtkAdv = normalizeazaDirectiiAtacAdversarPunct(
              sAct.directiiAtkAdversarPunct
            );
            dirAtkAdv[directie] = (Number(dirAtkAdv[directie]) || 0) + 1;
            return {
              ...item,
              statsPeSet: {
                ...item.statsPeSet,
                [setActiv]: {
                  ...sAct,
                  atkReusit: (Number(sAct.atkReusit) || 0) + 1,
                  directiiAtkAdversarPunct: dirAtkAdv,
                },
              },
            };
          }),
        }));
      }
    }
  }

  function seteazaServiciuCurent(cineServeste) {
    if (!echipaPrincipalaId) return;
    salveazaSnapshot();
    setSeturiPeEchipe((prev) => {
      const actual = normalizeazaSeturiStateEchipa(prev[echipaPrincipalaId]);
      const actualAdv = normalizeazaSeturiStateEchipa(prev[echipaAdversaId]);
      const sNum = actual.setActiv;
      return {
        ...prev,
        [echipaPrincipalaId]: {
          ...actual,
          seturi: {
            ...actual.seturi,
            [sNum]: {
              ...actual.seturi[sNum],
              serviciu: cineServeste,
            },
          },
        },
        [echipaAdversaId]: {
          ...actualAdv,
          seturi: {
            ...actualAdv.seturi,
            [sNum]: {
              ...actualAdv.seturi[sNum],
              serviciu: cineServeste === "noi" ? "adversar" : "noi",
            },
          },
        },
      };
    });
  }

  function seteazaPozitieRidicatorPeEchipa(targetEchipaId, nouaPozitie) {
    if (!targetEchipaId || !POZITII_RIDICATOR.includes(nouaPozitie)) return;
    salveazaSnapshot();
    setSeturiPeEchipe((prev) => {
      const actual = normalizeazaSeturiStateEchipa(prev[targetEchipaId]);
      const sNum = actual.setActiv;
      return {
        ...prev,
        [targetEchipaId]: {
          ...actual,
          seturi: {
            ...actual.seturi,
            [sNum]: {
              ...actual.seturi[sNum],
              pozitieRidicator: nouaPozitie,
            },
          },
        },
      };
    });
  }

  function seteazaPozitieRidicator(nouaPozitie) {
    seteazaPozitieRidicatorPeEchipa(echipaId, nouaPozitie);
  }

  function rotesteTerenPeEchipa(targetEchipaId) {
    if (!targetEchipaId) return;
    salveazaSnapshot();

    setTerenPeEchipe((prev) => ({
      ...prev,
      [targetEchipaId]: rotesteObiectTeren(prev[targetEchipaId] || {}),
    }));

    setSeturiPeEchipe((prev) => {
      const actual = normalizeazaSeturiStateEchipa(prev[targetEchipaId]);
      const sNum = actual.setActiv;
      const posActuala = Number(actual.seturi[sNum]?.pozitieRidicator) || 1;
      const urmPos = posActuala === 6 ? 1 : posActuala + 1;
      return {
        ...prev,
        [targetEchipaId]: {
          ...actual,
          seturi: {
            ...actual.seturi,
            [sNum]: {
              ...actual.seturi[sNum],
              pozitieRidicator: urmPos,
            },
          },
        },
      };
    });
  }

  function rotesteTeren() {
    rotesteTerenPeEchipa(echipaId);
  }

  function plaseazaInZonaTerenPeEchipa(targetEchipaId, zona, idJucatoare) {
    if (!targetEchipaId) return;
    salveazaSnapshot();
    setTerenPeEchipe((prev) => {
      const actual = { ...(prev[targetEchipaId] || {}) };
      ORDINE_TEREN.forEach((z) => {
        if (actual[z] === idJucatoare) {
          actual[z] = null;
        }
      });
      actual[zona] = idJucatoare || null;
      return {
        ...prev,
        [targetEchipaId]: actual,
      };
    });
  }

  function efectueazaSchimbarePeEchipa(
    targetEchipaId,
    idJucatoarePeTeren,
    idJucatoareNoua
  ) {
    if (
      !targetEchipaId ||
      !idJucatoarePeTeren ||
      !idJucatoareNoua ||
      idJucatoarePeTeren === idJucatoareNoua
    ) {
      setJucatoareInSchimbareId(null);
      return;
    }

    salveazaSnapshot();
    setTerenPeEchipe((prev) => {
      const actual = { ...(prev[targetEchipaId] || {}) };
      let zonaSursa = null;
      let zonaDestinatie = null;

      ORDINE_TEREN.forEach((z) => {
        if (actual[z] === idJucatoarePeTeren) zonaSursa = z;
        if (actual[z] === idJucatoareNoua) zonaDestinatie = z;
      });

      if (zonaSursa) {
        actual[zonaSursa] = idJucatoareNoua;
        if (zonaDestinatie) {
          actual[zonaDestinatie] = idJucatoarePeTeren;
        }
      }

      return {
        ...prev,
        [targetEchipaId]: actual,
      };
    });
    setJucatoareInSchimbareId(null);
  }

  const totalEchipa = calculeazaTotalEchipaDinLot(
    jucatoareNoastre,
    modVizualizare,
    t
  );
  const totalAdversar = calculeazaTotalEchipaDinLot(
    jucatoareAdverse,
    modVizualizare,
    t
  );
  const totalEchipaActiva =
    tintaScouting === "adversar" ? totalAdversar : totalEchipa;

  const eficientaAtacEchipa = totalEchipaActiva.atkEf;
  const procentAtacEchipa = totalEchipaActiva.atkPct;
  const procentPreluareEchipa = totalEchipaActiva.recPozPct;
  const procentCalitatePaseEchipa = totalEchipaActiva.pasePlusPct;

  function adaugaJucatoare(e) {
    e.preventDefault();
    const numeCurat = numeJucatoare.trim();
    if (!numeCurat || !echipaId) return;

    salveazaSnapshot();

    const nouaJucatoare = normalizeazaJucatoare({
      id: Date.now(),
      numar: numarTricou.trim() || "-",
      nume: numeCurat,
      post: postJucatoare,
    });

    setLoturi((prev) => ({
      ...prev,
      [echipaId]: [...(prev[echipaId] || []), nouaJucatoare],
    }));

    if (nouaJucatoare.post === "Libero") {
      setLiberoPeEchipe((prev) => {
        const actual = prev[echipaId] || { primarId: null, secundarId: null };
        if (!actual.primarId) {
          return {
            ...prev,
            [echipaId]: { ...actual, primarId: nouaJucatoare.id },
          };
        }
        return prev;
      });
    } else {
      setTerenPeEchipe((prev) => {
        const actual = { ...(prev[echipaId] || {}) };
        const zonaLibera = ORDINE_TEREN.find((z) => !actual[z]);
        if (zonaLibera) {
          actual[zonaLibera] = nouaJucatoare.id;
        }
        return {
          ...prev,
          [echipaId]: actual,
        };
      });
    }

    setNumarTricou("");
    setNumeJucatoare("");
  }

  function stergeJucatoare(idJucatoare, targetEchipaId = echipaId) {
    if (!targetEchipaId) return;
    salveazaSnapshot();
    setLoturi((prev) => ({
      ...prev,
      [targetEchipaId]: (prev[targetEchipaId] || []).filter(
        (j) => j.id !== idJucatoare
      ),
    }));
    setTerenPeEchipe((prev) => {
      const actual = { ...(prev[targetEchipaId] || {}) };
      ORDINE_TEREN.forEach((z) => {
        if (actual[z] === idJucatoare) actual[z] = null;
      });
      return { ...prev, [targetEchipaId]: actual };
    });
    setLiberoPeEchipe((prev) => {
      const actual = prev[targetEchipaId] || {
        primarId: null,
        secundarId: null,
      };
      return {
        ...prev,
        [targetEchipaId]: {
          primarId:
            String(actual.primarId) === String(idJucatoare)
              ? null
              : actual.primarId,
          secundarId:
            String(actual.secundarId) === String(idJucatoare)
              ? null
              : actual.secundarId,
        },
      };
    });
    if (jucatoareInSchimbareId === idJucatoare) {
      setJucatoareInSchimbareId(null);
    }
  }

  function inregistreazaActiunePeEchipa(
    targetEchipaId,
    idJucatoare,
    categorie,
    tip,
    optiuneExtra
  ) {
    if (!targetEchipaId) return;
    salveazaSnapshot();

    const esteEchipaNoastra = targetEchipaId === echipaPrincipalaId;
    const impactPunct = determinaImpactPunctDinActiune(categorie, tip);
    if (impactPunct && !stareSetActiv.esteIncheiat) {
      const cineMarcheazaScor = esteEchipaNoastra
        ? impactPunct
        : impactPunct === "noi"
        ? "adversar"
        : "noi";
      aplicaPunctPeEchipa(cineMarcheazaScor);
    }

    if (categorie === "atk") {
      setSeturiPeEchipe((prev) => {
        const actual = normalizeazaSeturiStateEchipa(prev[targetEchipaId]);
        const sNum = actual.setActiv;
        const posRid = Number(actual.seturi[sNum]?.pozitieRidicator) || 1;
        const rotActuale = normalizeazaRotatii(actual.seturi[sNum]?.rotatii);
        const rStat = rotActuale[posRid] || { pct: 0, er: 0, neutru: 0 };

        const nouRStat = {
          pct: tip === "reusit" ? rStat.pct + 1 : rStat.pct,
          er: tip === "eroare" ? rStat.er + 1 : rStat.er,
          neutru: tip === "neutru" ? rStat.neutru + 1 : rStat.neutru,
        };

        return {
          ...prev,
          [targetEchipaId]: {
            ...actual,
            seturi: {
              ...actual.seturi,
              [sNum]: {
                ...actual.seturi[sNum],
                rotatii: {
                  ...rotActuale,
                  [posRid]: nouRStat,
                },
              },
            },
          },
        };
      });
    }

    setLoturi((prev) => ({
      ...prev,
      [targetEchipaId]: (prev[targetEchipaId] || []).map((j) => {
        if (j.id !== idJucatoare) return j;
        const esteLibero = j.post === "Libero";
        const sActual = normalizeazaStatSet(j.statsPeSet?.[setActiv], j.post);

        let nouStat = { ...sActual };

        if (categorie === "atk") {
          if (esteLibero) return j;
          const zoneValide = getZoneAtacPentruPost(j.post);
          const zonaAleasa = optiuneExtra?.zonaAtac || zoneValide[0];
          const zona = zoneValide.includes(zonaAleasa)
            ? zonaAleasa
            : zoneValide[0];

          const zoneCurente = normalizeazaZoneAtac(sActual.zoneAtac);
          const zonaInfo = zoneCurente[zona] || { pct: 0, er: 0, neutru: 0 };

          if (tip === "reusit") {
            nouStat = {
              ...sActual,
              atkReusit: sActual.atkReusit + 1,
              zoneAtac: {
                ...zoneCurente,
                [zona]: {
                  ...zonaInfo,
                  pct: (Number(zonaInfo.pct) || 0) + 1,
                },
              },
            };
          } else if (tip === "eroare") {
            nouStat = {
              ...sActual,
              atkEroare: sActual.atkEroare + 1,
              zoneAtac: {
                ...zoneCurente,
                [zona]: {
                  ...zonaInfo,
                  er: (Number(zonaInfo.er) || 0) + 1,
                },
              },
            };
          } else {
            nouStat = {
              ...sActual,
              atkNeutru: sActual.atkNeutru + 1,
              zoneAtac: {
                ...zoneCurente,
                [zona]: {
                  ...zonaInfo,
                  neutru: (Number(zonaInfo.neutru) || 0) + 1,
                },
              },
            };
          }
        } else if (categorie === "srv") {
          if (esteLibero) return j;
          if (tip === "as") {
            const dirSrv = normalizeazaDirectiiServiciuPunct(
              sActual.directiiSrvPunct
            );
            const dirAleasa =
              optiuneExtra?.directieSrvPunct || directieSrvPunctSelectata;
            dirSrv[dirAleasa] = (Number(dirSrv[dirAleasa]) || 0) + 1;
            nouStat = {
              ...sActual,
              srvAs: sActual.srvAs + 1,
              directiiSrvPunct: dirSrv,
            };
          } else if (tip === "eroare")
            nouStat = { ...sActual, srvEroare: sActual.srvEroare + 1 };
          else nouStat = { ...sActual, srvNeutru: sActual.srvNeutru + 1 };
        } else if (categorie === "rec") {
          if (esteLibero) {
            const sursa = optiuneExtra?.sursa || "serv";
            if (sursa === "atk") {
              if (tip === "pozitiv")
                nouStat = { ...sActual, libRecAtkPoz: sActual.libRecAtkPoz + 1 };
              else if (tip === "eroare")
                nouStat = { ...sActual, libRecAtkEr: sActual.libRecAtkEr + 1 };
              else
                nouStat = {
                  ...sActual,
                  libRecAtkNeutru: sActual.libRecAtkNeutru + 1,
                };
            } else {
              if (tip === "pozitiv")
                nouStat = { ...sActual, libRecServPoz: sActual.libRecServPoz + 1 };
              else if (tip === "eroare")
                nouStat = { ...sActual, libRecServEr: sActual.libRecServEr + 1 };
              else
                nouStat = {
                  ...sActual,
                  libRecServNeutru: sActual.libRecServNeutru + 1,
                };
            }
          } else {
            if (tip === "pozitiv")
              nouStat = { ...sActual, recPozitiv: sActual.recPozitiv + 1 };
            else if (tip === "eroare")
              nouStat = { ...sActual, recEroare: sActual.recEroare + 1 };
            else nouStat = { ...sActual, recNeutru: sActual.recNeutru + 1 };
          }
        } else if (categorie === "blk") {
          if (esteLibero) return j;
          if (tip === "punct")
            nouStat = { ...sActual, blkPunct: sActual.blkPunct + 1 };
          else if (tip === "eroare")
            nouStat = { ...sActual, blkEroare: sActual.blkEroare + 1 };
          else nouStat = { ...sActual, blkJoaca: sActual.blkJoaca + 1 };
        } else if (categorie === "pasa") {
          if (esteLibero) return j;
          const zona = optiuneExtra?.zona || ZONE_PASA[0];
          const calitate = optiuneExtra?.calitate || "+";
          const paseCurente = normalizeazaPase(sActual.pase);
          const zonaCurenta = paseCurente[zona] || { "+": 0, "0": 0, "-": 0 };

          nouStat = {
            ...sActual,
            pase: {
              ...paseCurente,
              [zona]: {
                ...zonaCurenta,
                [calitate]: (Number(zonaCurenta[calitate]) || 0) + 1,
              },
            },
          };
        }

        return {
          ...j,
          statsPeSet: {
            ...j.statsPeSet,
            [setActiv]: nouStat,
          },
        };
      }),
    }));
  }

  function reseteazaStatisticiEchipa() {
    if (!echipaPrincipalaId) return;
    salveazaSnapshot();
    const echipeDeResetat = [echipaPrincipalaId, echipaAdversaId].filter(Boolean);
    setLoturi((prev) => {
      const next = { ...prev };
      echipeDeResetat.forEach((id) => {
        next[id] = (prev[id] || []).map((j) => {
          const statsPeSet = {};
          SETURI.forEach((nrSet) => {
            statsPeSet[nrSet] = creeazaStatisticiGoaleJucatoare(j.post);
          });
          return { ...j, statsPeSet };
        });
      });
      return next;
    });
    setSeturiPeEchipe((prev) => {
      const next = { ...prev };
      const fresh = construiesteSeturiStatePeEchipe();
      echipeDeResetat.forEach((id) => {
        next[id] = fresh[id];
      });
      return next;
    });
  }

  function reincarcaLotPredefinit() {
    if (!echipaId) return;
    salveazaSnapshot();
    const lista = getLotPredefinitEchipa(echipaId);

    setLoturi((prev) => ({
      ...prev,
      [echipaId]: lista,
    }));

    setTerenPeEchipe((prev) => ({
      ...prev,
      [echipaId]: construiesteSloturiTerenDinLot(lista),
    }));

    setLiberoPeEchipe((prev) => ({
      ...prev,
      [echipaId]: getLiberoImplicitiDinLot(lista),
    }));
    setJucatoareInSchimbareId(null);
  }

  function exportaPDF() {
    window.print();
  }

  function construiesteListaOrdonataPentruEchipa(targetEchipaId) {
    const jucLista = loturi[targetEchipaId] || [];
    const terenObj = terenPeEchipe[targetEchipaId] || {};
    const liberiLot = jucLista.filter((j) => j.post === "Libero");
    const stareLib = liberoPeEchipe[targetEchipaId] || {
      primarId: liberiLot[0]?.id ?? null,
      secundarId: null,
    };
    const primar =
      liberiLot.find((j) => String(j.id) === String(stareLib.primarId)) ||
      liberiLot[0] ||
      null;
    const secundar =
      stareLib.secundarId && String(stareLib.secundarId) !== String(primar?.id)
        ? liberiLot.find((j) => String(j.id) === String(stareLib.secundarId)) ||
          null
        : null;

    const intrariLib = [];
    if (primar) {
      intrariLib.push({
        jucatoare: primar,
        etichetaZona: secundar ? `${t.liberoZone} 1` : t.liberoZone,
        esteLiberoInTeren: true,
      });
    }
    if (secundar) {
      intrariLib.push({
        jucatoare: secundar,
        etichetaZona: `${t.liberoZone} 2`,
        esteLiberoInTeren: true,
      });
    }

    const idsLib = new Set(intrariLib.map((item) => String(item.jucatoare.id)));

    const intrariZ = ORDINE_ZONE_1_LA_6.map((zona) => {
      const idJ = terenObj[zona];
      if (!idJ || idsLib.has(String(idJ))) return null;
      const juc = jucLista.find((j) => String(j.id) === String(idJ));
      return juc
        ? {
            jucatoare: juc,
            etichetaZona: `${t.zone} ${zona}`,
            esteLiberoInTeren: false,
          }
        : null;
    }).filter(Boolean);

    const idsAfisati = new Set([
      ...idsLib,
      ...intrariZ.map((item) => String(item.jucatoare.id)),
    ]);

    const intrariRest = jucLista
      .filter((j) => !idsAfisati.has(String(j.id)))
      .map((j) => ({
        jucatoare: j,
        etichetaZona: t.benchZone,
        esteLiberoInTeren: false,
      }));

    return [...intrariLib, ...intrariZ, ...intrariRest];
  }

  const jucatoareOrdonatePentruInregistrare =
    construiesteListaOrdonataPentruEchipa(echipaId);

  const etichetaVizualizare =
    modVizualizare === "total"
      ? t.totalMatch
      : `${t.set} ${modVizualizare}`;

  const tableBaseStyle = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    fontSize: "12px",
    textAlign: "center",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  };

  function renderJumătateTerenSimulat({
    targetEchipa,
    esteEchipaDeJos,
    esteLaServiciu,
    pozRidicator,
  }) {
    const idEchipaBloc = targetEchipa?.id || "";
    const jucLista = loturi[idEchipaBloc] || [];
    const terenObj = terenPeEchipe[idEchipaBloc] || {};
    const temaBloc = getTemaEchipa(targetEchipa);

    const randuriZone = esteEchipaDeJos
      ? [
          ["Z4", "Z3", "Z2"],
          ["Z5", "Z6", "Z1"],
        ]
      : [
          ["Z2", "Z3", "Z4"],
          ["Z1", "Z6", "Z5"],
        ];

    const jucServer = jucLista.find(
      (j) => String(j.id) === String(terenObj.Z1)
    );

    return (
      <div
        style={{
          boxSizing: "border-box",
          border: `2px solid ${temaBloc.cardBorder}`,
          borderRadius: "10px",
          padding: "10px",
          background: temaBloc.cardBg,
          display: "grid",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "6px",
            fontSize: "12px",
          }}
        >
          <div>
            <strong>{targetEchipa?.teamName}</strong> · {t.setterPos}{" "}
            <strong>{pozRidicator}</strong>
          </div>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "bold",
              background: esteLaServiciu ? temaBloc.barBg : "#ffffff",
              color: esteLaServiciu ? "#ffffff" : temaBloc.badgeText,
              border: `1px solid ${temaBloc.cardBorder}`,
            }}
          >
            {esteLaServiciu ? t.servingBadge : t.receivingBadge}
          </span>
        </div>

        <div style={{ display: "grid", gap: "6px" }}>
          {randuriZone.map((randZone, idxRand) => {
            const esteLiniaFata =
              (esteEchipaDeJos && idxRand === 0) ||
              (!esteEchipaDeJos && idxRand === 1);

            return (
              <div
                key={`${idEchipaBloc}-${idxRand}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "6px",
                  padding: "6px",
                  borderRadius: "8px",
                  background: esteLiniaFata
                    ? "rgba(255, 255, 255, 0.72)"
                    : "rgba(255, 255, 255, 0.42)",
                  border: esteLiniaFata
                    ? `1px solid ${temaBloc.cardBorder}`
                    : `1px dashed ${temaBloc.cardBorder}`,
                }}
              >
                {randZone.map((zona) => {
                  const juc = jucLista.find(
                    (item) => String(item.id) === String(terenObj[zona])
                  );
                  const esteZonaServiciu = esteLaServiciu && zona === "Z1";

                  return (
                    <div
                      key={zona}
                      style={{
                        boxSizing: "border-box",
                        minWidth: 0,
                        padding: "7px",
                        borderRadius: "7px",
                        background: esteZonaServiciu
                          ? temaBloc.headerBg
                          : "#ffffff",
                        border: esteZonaServiciu
                          ? `2px solid ${temaBloc.barBg}`
                          : `1px solid ${TEMA_PLATFORMA.border}`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "74px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: esteZonaServiciu
                            ? temaBloc.badgeText
                            : TEMA_PLATFORMA.textSecondary,
                        }}
                      >
                        <span>
                          {zona} ·{" "}
                          {esteLiniaFata
                            ? t.frontRowShort
                            : t.backRowShort}
                        </span>
                        {esteZonaServiciu && (
                          <span
                            style={{
                              padding: "1px 5px",
                              borderRadius: "4px",
                              background: temaBloc.barBg,
                              color: "#ffffff",
                              fontSize: "9px",
                            }}
                          >
                            {t.serverTag}
                          </span>
                        )}
                      </div>

                      {juc ? (
                        <div style={{ marginTop: "4px", minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "24px",
                                height: "22px",
                                padding: "0 5px",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                fontSize: "12px",
                                background: temaBloc.barBg,
                                color: "#ffffff",
                              }}
                            >
                              #{juc.numar}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: TEMA_PLATFORMA.textPrimary,
                              }}
                            >
                              {juc.nume}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: TEMA_PLATFORMA.textSecondary,
                              marginTop: "2px",
                            }}
                          >
                            {t.posts[juc.post] || juc.post}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            marginTop: "6px",
                          }}
                        >
                          {t.freeSlot}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {esteLaServiciu && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              borderRadius: "7px",
              background: temaBloc.headerBg,
              border: `2px solid ${temaBloc.barBg}`,
              fontSize: "12px",
              fontWeight: "bold",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            <span>{t.serve}:</span>
            {jucServer ? (
              <span>
                #{jucServer.numar} {jucServer.nume} (
                {t.posts[jucServer.post] || jucServer.post})
              </span>
            ) : (
              <span>{t.freeSlot}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  function renderBlocDireciiPunct() {
    const srvTotNoi = DIRECTII_SERVICIU_PUNCT.reduce(
      (acc, d) => acc + (directiiSrvPunctNoastre[d] || 0),
      0
    );
    const srvTotAdv = DIRECTII_SERVICIU_PUNCT.reduce(
      (acc, d) => acc + (directiiSrvPunctAdversar[d] || 0),
      0
    );
    const atkTotAdv = DIRECTII_ATAC_ADVERSAR_PUNCT.reduce(
      (acc, d) => acc + (directiiAtkAdversarPunctAfisate[d] || 0),
      0
    );

    return (
      <section
        style={{
          boxSizing: "border-box",
          border: `1px solid ${TEMA_PLATFORMA.border}`,
          borderRadius: "10px",
          padding: "14px",
          marginBottom: "20px",
          background: TEMA_PLATFORMA.surfaceBg,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            {t.scoringDirsTitle} ({etichetaVizualizare})
          </h2>
          <div
            style={{
              fontSize: "12px",
              color: TEMA_PLATFORMA.textSecondary,
              marginTop: "2px",
            }}
          >
            {t.scoringDirsHint}
          </div>
        </div>

        <div
          className="no-print"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${TEMA_PLATFORMA.border}`,
              background: TEMA_PLATFORMA.subtleBg,
              display: "grid",
              gap: "8px",
            }}
          >
            <strong style={{ fontSize: "12px" }}>{t.srvAceDirLabel}</strong>
            <select
              value={directieSrvPunctSelectata}
              onChange={(e) => setDirectieSrvPunctSelectata(e.target.value)}
              style={{
                padding: "6px 8px",
                fontSize: "12px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                background: "#fff",
              }}
            >
              {DIRECTII_SERVICIU_PUNCT.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={stareSetActiv.esteIncheiat}
                onClick={() =>
                  inregistreazaPunctCuDirectie(
                    "noi",
                    "srvPunct",
                    directieSrvPunctSelectata
                  )
                }
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  cursor: stareSetActiv.esteIncheiat ? "not-allowed" : "pointer",
                  background: temaEchipaNoastra.badgeBg,
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${temaEchipaNoastra.cardBorder}`,
                  opacity: stareSetActiv.esteIncheiat ? 0.5 : 1,
                }}
              >
                +1 {t.serve} ({echipaNoastra?.teamName})
              </button>
              <button
                type="button"
                disabled={stareSetActiv.esteIncheiat}
                onClick={() =>
                  inregistreazaPunctCuDirectie(
                    "adversar",
                    "srvPunct",
                    directieSrvPunctSelectata
                  )
                }
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  cursor: stareSetActiv.esteIncheiat ? "not-allowed" : "pointer",
                  background: temaEchipaAdversa.badgeBg,
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${temaEchipaAdversa.cardBorder}`,
                  opacity: stareSetActiv.esteIncheiat ? 0.5 : 1,
                }}
              >
                +1 {t.serve} ({echipaAdversa?.teamName})
              </button>
            </div>
          </div>

          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${temaEchipaAdversa.cardBorder}`,
              background: temaEchipaAdversa.cardBg,
              display: "grid",
              gap: "8px",
            }}
          >
            <strong style={{ fontSize: "12px" }}>{t.oppAtkDirLabel}</strong>
            <select
              value={directieAtkAdversarPunctSelectata}
              onChange={(e) =>
                setDirectieAtkAdversarPunctSelectata(e.target.value)
              }
              style={{
                padding: "6px 8px",
                fontSize: "12px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                background: "#fff",
              }}
            >
              {DIRECTII_ATAC_ADVERSAR_PUNCT.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
            <div>
              <button
                type="button"
                disabled={stareSetActiv.esteIncheiat}
                onClick={() =>
                  inregistreazaPunctCuDirectie(
                    "adversar",
                    "atkAdversarPunct",
                    directieAtkAdversarPunctSelectata
                  )
                }
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  cursor: stareSetActiv.esteIncheiat ? "not-allowed" : "pointer",
                  background: temaEchipaAdversa.barBg,
                  color: "#ffffff",
                  border: "none",
                  opacity: stareSetActiv.esteIncheiat ? 0.5 : 1,
                }}
              >
                +1 {t.attack} ({echipaAdversa?.teamName})
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "14px",
          }}
        >
          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${temaEchipaNoastra.cardBorder}`,
              background: temaEchipaNoastra.cardBg,
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {echipaNoastra?.teamName} — {t.serve} + ({srvTotNoi})
            </div>
            <div style={{ display: "grid", gap: "4px", fontSize: "12px" }}>
              {DIRECTII_SERVICIU_PUNCT.map((dir) => {
                const val = directiiSrvPunctNoastre[dir] || 0;
                const pct = calculeazaProcent(val, srvTotNoi);
                return (
                  <div
                    key={dir}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: "5px",
                      background: val > 0 ? "#ffffff" : "rgba(255,255,255,0.6)",
                      border: `1px solid ${temaEchipaNoastra.cardBorder}`,
                    }}
                  >
                    <span>{dir}</span>
                    <strong>
                      {val} ({pct}%)
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${temaEchipaAdversa.cardBorder}`,
              background: temaEchipaAdversa.cardBg,
              display: "grid",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                {echipaAdversa?.teamName} — {t.attack} + ({atkTotAdv})
              </div>
              <div style={{ display: "grid", gap: "4px", fontSize: "12px" }}>
                {DIRECTII_ATAC_ADVERSAR_PUNCT.map((dir) => {
                  const val = directiiAtkAdversarPunctAfisate[dir] || 0;
                  const pct = calculeazaProcent(val, atkTotAdv);
                  return (
                    <div
                      key={dir}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 8px",
                        borderRadius: "5px",
                        background:
                          val > 0 ? "#ffffff" : "rgba(255,255,255,0.6)",
                        border: `1px solid ${temaEchipaAdversa.cardBorder}`,
                      }}
                    >
                      <span>{dir}</span>
                      <strong>
                        {val} ({pct}%)
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                {echipaAdversa?.teamName} — {t.serve} + ({srvTotAdv})
              </div>
              <div style={{ display: "grid", gap: "4px", fontSize: "12px" }}>
                {DIRECTII_SERVICIU_PUNCT.filter(
                  (dir) => (directiiSrvPunctAdversar[dir] || 0) > 0
                ).length === 0 ? (
                  <div
                    style={{
                      fontSize: "11px",
                      color: TEMA_PLATFORMA.textSecondary,
                    }}
                  >
                    {t.noScoringDirsYet}
                  </div>
                ) : (
                  DIRECTII_SERVICIU_PUNCT.filter(
                    (dir) => (directiiSrvPunctAdversar[dir] || 0) > 0
                  ).map((dir) => {
                    const val = directiiSrvPunctAdversar[dir] || 0;
                    const pct = calculeazaProcent(val, srvTotAdv);
                    return (
                      <div
                        key={dir}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "4px 8px",
                          borderRadius: "5px",
                          background: "#ffffff",
                          border: `1px solid ${temaEchipaAdversa.cardBorder}`,
                        }}
                      >
                        <span>{dir}</span>
                        <strong>
                          {val} ({pct}%)
                        </strong>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function getValoareGraficJucatoare(j) {
    const stat = getStatJucatoarePentruMod(j, modVizualizare);
    const calc = getStatisticiCalculateDinStat(stat, j.post);
    const rezPase = rezumaPaseJucatoare(stat.pase, t);

    if (indicatorGrafic === "atkEf") {
      return {
        valoare: calculateEfficiency(
          stat.atkReusit,
          stat.atkEroare,
          calc.atkTotal
        ),
        sufix: "%",
      };
    }
    if (indicatorGrafic === "recPozPct") {
      return {
        valoare: calculeazaProcent(calc.recPozitivTotal, calc.recTotal),
        sufix: "%",
      };
    }
    if (indicatorGrafic === "srvAs") {
      return {
        valoare: stat.srvAs || 0,
        sufix: "",
      };
    }
    if (indicatorGrafic === "blkPunct") {
      return {
        valoare: stat.blkPunct || 0,
        sufix: "",
      };
    }
    if (indicatorGrafic === "pasePlusPct") {
      return {
        valoare: rezPase.calitatePlusPct || 0,
        sufix: "%",
      };
    }
    return {
      valoare: stat.atkReusit || 0,
      sufix: "",
    };
  }

  const randuriGraficAcasa = jucatoareNoastre.map((j) => {
    const { valoare, sufix } = getValoareGraficJucatoare(j);
    return {
      jucatoare: j,
      valoare,
      sufix,
    };
  });

  const randuriGraficAdversar = jucatoareAdverse.map((j) => {
    const { valoare, sufix } = getValoareGraficJucatoare(j);
    return {
      jucatoare: j,
      valoare,
      sufix,
    };
  });

  const maximGrafic = Math.max(
    1,
    ...randuriGraficAcasa.map((r) => Math.max(0, Number(r.valoare) || 0)),
    ...randuriGraficAdversar.map((r) => Math.max(0, Number(r.valoare) || 0))
  );

  function renderCardGraficEchipa({ targetEchipa, randuriGrafic, etichetaRol }) {
    const temaBloc = getTemaEchipa(targetEchipa);

    return (
      <div
        style={{
          boxSizing: "border-box",
          minWidth: 0,
          width: "100%",
          border: `2px solid ${temaBloc.cardBorder}`,
          borderRadius: "10px",
          padding: "14px",
          background: temaBloc.cardBg,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            {t.chartTitle} — {targetEchipa?.teamName}
          </h3>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "bold",
              background: temaBloc.badgeBg,
              color: temaBloc.badgeText,
              border: `1px solid ${temaBloc.cardBorder}`,
            }}
          >
            {etichetaRol}
          </span>
        </div>

        {randuriGrafic.length === 0 ? (
          <p
            style={{
              color: TEMA_PLATFORMA.textSecondary,
              margin: 0,
              fontSize: "13px",
            }}
          >
            {t.noChartData}
          </p>
        ) : (
          <div style={{ display: "grid", gap: "7px" }}>
            {randuriGrafic.map(({ jucatoare: j, valoare, sufix }) => {
              const latimePct = Math.max(
                0,
                Math.min(
                  100,
                  (Math.max(0, Number(valoare) || 0) / maximGrafic) * 100
                )
              );
              return (
                <div
                  key={j.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(130px, 195px) minmax(90px, 1fr) auto",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    padding: "5px 8px",
                    borderRadius: "6px",
                    background: "#ffffff",
                    border: `1px solid ${temaBloc.cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: TEMA_PLATFORMA.textPrimary,
                    }}
                  >
                    <strong>#{j.numar}</strong> {j.nume}
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "16px",
                      background: temaBloc.headerBg,
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${latimePct}%`,
                        height: "100%",
                        background: temaBloc.barBg,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      flexShrink: 0,
                      color: TEMA_PLATFORMA.textPrimary,
                    }}
                  >
                    <strong>
                      {valoare}
                      {sufix}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderBlocTerenSiRotatiiEchipa({
    targetEchipa,
    rotatiiObj,
    pozRidicator,
    etichetaRol,
  }) {
    const idEchipaBloc = targetEchipa?.id || "";
    const jucLista = loturi[idEchipaBloc] || [];
    const terenObj = terenPeEchipe[idEchipaBloc] || {};
    const idsPeTeren = new Set(
      ORDINE_TEREN.map((z) => terenObj[z]).filter(Boolean)
    );
    const rezerveNr = jucLista.filter((j) => !idsPeTeren.has(j.id)).length;
    const temaBloc = getTemaEchipa(targetEchipa);

    return (
      <div
        style={{
          boxSizing: "border-box",
          minWidth: 0,
          width: "100%",
          border: `2px solid ${temaBloc.cardBorder}`,
          borderRadius: "10px",
          padding: "12px",
          background: temaBloc.cardBg,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
          display: "grid",
          gap: "12px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: TEMA_PLATFORMA.textPrimary,
              }}
            >
              {etichetaRol}: {targetEchipa?.teamName} ({t.setterFor}{" "}
              {t.position.toLowerCase()} {pozRidicator})
            </div>
            <div
              className="no-print"
              style={{ display: "flex", gap: "6px", alignItems: "center" }}
            >
              <select
                value={pozRidicator}
                onChange={(e) =>
                  seteazaPozitieRidicatorPeEchipa(
                    idEchipaBloc,
                    Number(e.target.value)
                  )
                }
                style={{
                  boxSizing: "border-box",
                  padding: "4px 7px",
                  fontSize: "12px",
                  background: "#fff",
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "5px",
                }}
              >
                {POZITII_RIDICATOR.map((pos) => (
                  <option key={pos} value={pos}>
                    {t.position} {pos}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => rotesteTerenPeEchipa(idEchipaBloc)}
                style={{
                  boxSizing: "border-box",
                  padding: "4px 9px",
                  fontSize: "12px",
                  cursor: "pointer",
                  background: "#fff",
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "5px",
                }}
              >
                {t.rotateBtn}
              </button>
            </div>
          </div>

          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "6px",
              color: TEMA_PLATFORMA.textSecondary,
            }}
          >
            {t.netFront}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            {ORDINE_TEREN.map((zona) => {
              const jId = terenObj[zona];
              const jucZona = jucLista.find((j) => j.id === jId);
              const esteInSchimbare =
                jucZona &&
                jucatoareInSchimbareId === `${idEchipaBloc}-${jucZona.id}`;

              return (
                <div
                  key={zona}
                  style={{
                    boxSizing: "border-box",
                    minWidth: 0,
                    border: `1px solid ${temaBloc.cardBorder}`,
                    borderRadius: "7px",
                    padding: "8px",
                    background: "#ffffff",
                    minHeight: "98px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: temaBloc.badgeText,
                      }}
                    >
                      {t.zone} {zona}
                    </div>
                    {jucZona ? (
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "12px",
                          color: TEMA_PLATFORMA.textPrimary,
                        }}
                      >
                        <strong>#{jucZona.numar}</strong> {jucZona.nume}
                        <div
                          style={{
                            fontSize: "11px",
                            color: TEMA_PLATFORMA.textSecondary,
                          }}
                        >
                          {t.posts[jucZona.post] || jucZona.post}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#94a3b8",
                        }}
                      >
                        {t.freeSlot}
                      </div>
                    )}
                  </div>

                  <div className="no-print" style={{ marginTop: "6px", minWidth: 0 }}>
                    {jucZona ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setJucatoareInSchimbareId(
                              esteInSchimbare
                                ? null
                                : `${idEchipaBloc}-${jucZona.id}`
                            )
                          }
                          style={{
                            boxSizing: "border-box",
                            padding: "3px 7px",
                            fontSize: "11px",
                            cursor: "pointer",
                            background: "#f8fafc",
                            color: TEMA_PLATFORMA.textPrimary,
                            border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                            borderRadius: "4px",
                          }}
                        >
                          {esteInSchimbare ? t.cancelBtn : t.changeBtn}
                        </button>

                        {esteInSchimbare && (
                          <div style={{ marginTop: "6px" }}>
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  efectueazaSchimbarePeEchipa(
                                    idEchipaBloc,
                                    jucZona.id,
                                    e.target.value
                                  );
                                }
                              }}
                              style={{
                                boxSizing: "border-box",
                                width: "100%",
                                padding: "4px",
                                fontSize: "11px",
                                borderRadius: "4px",
                              }}
                            >
                              <option value="">{t.choosePlayer}</option>
                              {jucLista
                                .filter((alt) => alt.id !== jucZona.id)
                                .map((alt) => {
                                  const eRezerva = !idsPeTeren.has(alt.id);
                                  return (
                                    <option key={alt.id} value={alt.id}>
                                      #{alt.numar} {alt.nume} (
                                      {eRezerva ? t.reserveTag : t.onCourtTag})
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        )}
                      </>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            plaseazaInZonaTerenPeEchipa(
                              idEchipaBloc,
                              zona,
                              e.target.value
                            );
                          }
                        }}
                        style={{
                          boxSizing: "border-box",
                          width: "100%",
                          padding: "4px",
                          fontSize: "11px",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="">{t.putPlayer}</option>
                        {jucLista.map((alt) => (
                          <option key={alt.id} value={alt.id}>
                            #{alt.numar} {alt.nume}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              fontSize: "12px",
              marginTop: "6px",
              color: TEMA_PLATFORMA.textSecondary,
            }}
          >
            {t.backRowInfo}: <strong>{rezerveNr}</strong>
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "6px",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            {t.rotEffTitle} — {targetEchipa?.teamName} ({etichetaVizualizare})
          </div>
          <table style={tableBaseStyle}>
            <thead>
              <tr style={{ background: temaBloc.headerBg }}>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.setterCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.atkTotCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.pctCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.errCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.effCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {POZITII_RIDICATOR.map((pos) => {
                const r = rotatiiObj[pos] || { pct: 0, er: 0, neutru: 0 };
                const tot = (r.pct || 0) + (r.er || 0) + (r.neutru || 0);
                const ef = calculateEfficiency(r.pct || 0, r.er || 0, tot);
                const esteActiv =
                  modVizualizare !== "total" && pozRidicator === pos;

                return (
                  <tr
                    key={pos}
                    style={{ background: esteActiv ? temaBloc.badgeBg : "#fff" }}
                  >
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      <strong>
                        {t.position.slice(0, 3)}. {pos}
                      </strong>{" "}
                      {esteActiv ? t.activeRot : ""}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {tot}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {r.pct || 0}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {r.er || 0}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      <strong>{ef}%</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderPanouInregistrareEchipa(targetEchipa, listaOrdonata, titluBloc) {
    const idEchipaBloc = targetEchipa?.id || "";
    const temaBloc = getTemaEchipa(targetEchipa);
    const esteBlocAdversar = idEchipaBloc === echipaAdversaId;

    return (
      <div
        style={{
          boxSizing: "border-box",
          minWidth: 0,
          width: "100%",
          border: `2px solid ${temaBloc.cardBorder}`,
          borderRadius: "10px",
          padding: "12px",
          background: temaBloc.cardBg,
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <h3 style={{ margin: 0, color: TEMA_PLATFORMA.textPrimary }}>
            {titluBloc}
          </h3>
          <button
            type="button"
            onClick={() => rotesteTerenPeEchipa(idEchipaBloc)}
            style={{
              boxSizing: "border-box",
              padding: "4px 10px",
              fontSize: "12px",
              cursor: "pointer",
              background: "#fff",
              color: TEMA_PLATFORMA.textPrimary,
              border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
              borderRadius: "5px",
            }}
          >
            {t.rotateBtn} — {targetEchipa?.teamName}
          </button>
        </div>

        {listaOrdonata.length === 0 ? (
          <p style={{ color: TEMA_PLATFORMA.textSecondary, margin: 0 }}>
            {t.emptyRoster}
          </p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {listaOrdonata.map(
              ({ jucatoare: j, etichetaZona, esteLiberoInTeren }) => {
                const esteRidicator = j.post === "Ridicător";
                const esteLibero = j.post === "Libero";
                const stat = normalizeazaStatSet(
                  j.statsPeSet?.[setActiv],
                  j.post
                );
                const calc = getStatisticiCalculateDinStat(stat, j.post);
                const zoneAtacJucatoare = getZoneAtacPentruPost(j.post);
                const zoneNormalizate = normalizeazaZoneAtac(stat.zoneAtac);
                const rezPase = rezumaPaseJucatoare(stat.pase, t);
                const paseNormalizate = normalizeazaPase(stat.pase);
                const esteInTeren =
                  esteLiberoInTeren || etichetaZona.includes("Z");

                return (
                  <div
                    key={j.id}
                    style={{
                      boxSizing: "border-box",
                      minWidth: 0,
                      border: `1px solid ${temaBloc.cardBorder}`,
                      borderLeft: `5px solid ${temaBloc.barBg}`,
                      borderRadius: "7px",
                      padding: "10px",
                      background: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            background: esteInTeren
                              ? temaBloc.badgeBg
                              : "#f1f5f9",
                            color: esteInTeren
                              ? temaBloc.badgeText
                              : TEMA_PLATFORMA.textSecondary,
                          }}
                        >
                          {etichetaZona}
                        </span>
                        <strong>#{j.numar}</strong> <strong>{j.nume}</strong>
                        <select
                          aria-label={`${t.roleCol} ${j.nume}`}
                          value={j.post}
                          onChange={(e) =>
                            schimbaPostJucatoarePeEchipa(
                              idEchipaBloc,
                              j.id,
                              e.target.value
                            )
                          }
                          style={{
                            boxSizing: "border-box",
                            padding: "2px 6px",
                            fontSize: "11px",
                            borderRadius: "4px",
                            border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                            background: TEMA_PLATFORMA.subtleBg,
                            color: TEMA_PLATFORMA.textPrimary,
                            cursor: "pointer",
                          }}
                        >
                          {POSTURI_DISPONIBILE.map((postOpt) => (
                            <option key={postOpt} value={postOpt}>
                              {t.posts[postOpt] || postOpt}
                            </option>
                          ))}
                        </select>
                        {esteRidicator && (
                          <span style={{ fontSize: "12px" }}>
                            ({t.passesLabel}: <strong>{rezPase.total}</strong>{" "}
                            · +: <strong>{rezPase.calitatePlusPct}%</strong>)
                          </span>
                        )}
                        {esteLibero && (
                          <span style={{ fontSize: "12px" }}>
                            ({t.recServ}: <strong>{calc.libServTotal}</strong>{" "}
                            · {t.recAtk}: <strong>{calc.libAtkTotal}</strong> ·{" "}
                            {t.totShort}: <strong>{calc.recTotal}</strong>)
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => stergeJucatoare(j.id, idEchipaBloc)}
                        style={{
                          boxSizing: "border-box",
                          padding: "3px 8px",
                          fontSize: "12px",
                          cursor: "pointer",
                          background: "#f8fafc",
                          color: TEMA_PLATFORMA.textPrimary,
                          border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                          borderRadius: "4px",
                        }}
                      >
                        {t.deleteBtn}
                      </button>
                    </div>

                    {!esteLibero && (
                      <div
                        style={{
                          display: "grid",
                          gap: "5px",
                          marginTop: "8px",
                          paddingTop: "6px",
                          borderTop: "1px dashed #cbd5e1",
                        }}
                      >
                        {zoneAtacJucatoare.map((zona) => {
                          const zStat = zoneNormalizate[zona] || {
                            pct: 0,
                            er: 0,
                            neutru: 0,
                          };
                          const zTot =
                            (Number(zStat.pct) || 0) +
                            (Number(zStat.er) || 0) +
                            (Number(zStat.neutru) || 0);
                          const zonaTrad = t.attackZones?.[zona] || zona;
                          return (
                            <div
                              key={zona}
                              style={{
                                display: "flex",
                                gap: "5px",
                                flexWrap: "wrap",
                                alignItems: "center",
                                fontSize: "12px",
                              }}
                            >
                              <strong style={{ minWidth: "145px" }}>
                                {t.attack} {zonaTrad} ({zTot}):
                              </strong>
                              <button
                                type="button"
                                onClick={() =>
                                  inregistreazaActiunePeEchipa(
                                    idEchipaBloc,
                                    j.id,
                                    "atk",
                                    "reusit",
                                    { zonaAtac: zona }
                                  )
                                }
                                style={{
                                  padding: "2px 7px",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                }}
                              >
                                {t.pctCol} + ({zStat.pct || 0})
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  inregistreazaActiunePeEchipa(
                                    idEchipaBloc,
                                    j.id,
                                    "atk",
                                    "eroare",
                                    { zonaAtac: zona }
                                  )
                                }
                                style={{
                                  padding: "2px 7px",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                }}
                              >
                                {t.errCol} ({zStat.er || 0})
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  inregistreazaActiunePeEchipa(
                                    idEchipaBloc,
                                    j.id,
                                    "atk",
                                    "neutru",
                                    { zonaAtac: zona }
                                  )
                                }
                                style={{
                                  padding: "2px 7px",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                }}
                              >
                                {t.neutralShort} ({zStat.neutru || 0})
                              </button>
                            </div>
                          );
                        })}

                        {esteBlocAdversar && (
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              flexWrap: "wrap",
                              alignItems: "center",
                              fontSize: "12px",
                              marginTop: "2px",
                            }}
                          >
                            <strong>{t.oppAtkDirLabel}:</strong>
                            <select
                              value={directieAtkAdversarPunctSelectata}
                              onChange={(e) =>
                                setDirectieAtkAdversarPunctSelectata(
                                  e.target.value
                                )
                              }
                              style={{
                                padding: "2px 6px",
                                fontSize: "11px",
                                borderRadius: "4px",
                                border: "1px solid #94a3b8",
                                background: "#fff",
                              }}
                            >
                              {DIRECTII_ATAC_ADVERSAR_PUNCT.map((dir) => (
                                <option key={dir} value={dir}>
                                  {dir}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                inregistreazaPunctCuDirectie(
                                  "adversar",
                                  "atkAdversarPunct",
                                  directieAtkAdversarPunctSelectata
                                )
                              }
                              style={{
                                padding: "2px 8px",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: `1px solid ${temaBloc.cardBorder}`,
                                background: temaBloc.badgeBg,
                                fontWeight: "bold",
                              }}
                            >
                              {t.pctCol} + ({t.serve} / Punct)
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                        marginTop: "8px",
                        paddingTop: "6px",
                        borderTop: "1px dashed #cbd5e1",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      {esteLibero ? (
                        <>
                          <strong>{t.recServ}:</strong>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "pozitiv",
                                { sursa: "serv" }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.posShort} + ({stat.libRecServPoz})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "eroare",
                                { sursa: "serv" }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.errShort} ({stat.libRecServEr})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "neutru",
                                { sursa: "serv" }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            0 ({stat.libRecServNeutru})
                          </button>

                          <strong style={{ marginLeft: "6px" }}>
                            {t.recAtk}:
                          </strong>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "pozitiv",
                                { sursa: "atk" }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.posShort} + ({stat.libRecAtkPoz})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "eroare",
                                { sursa: "atk" }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.errShort} ({stat.libRecAtkEr})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "neutru",
                                { sursa: "atk" }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            0 ({stat.libRecAtkNeutru})
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "pozitiv"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.reception} {t.posShort} + ({stat.recPozitiv})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "eroare"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.reception} {t.errShort} ({stat.recEroare})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "rec",
                                "neutru"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.reception} 0 ({stat.recNeutru})
                          </button>

                          <select
                            aria-label={`${t.srvAceDirLabel} ${j.nume}`}
                            value={directieSrvPunctSelectata}
                            onChange={(e) =>
                              setDirectieSrvPunctSelectata(e.target.value)
                            }
                            style={{
                              padding: "3px 6px",
                              fontSize: "11px",
                              borderRadius: "4px",
                              border: "1px solid #94a3b8",
                              background: "#fff",
                            }}
                          >
                            {DIRECTII_SERVICIU_PUNCT.map((dir) => (
                              <option key={dir} value={dir}>
                                {dir}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "srv",
                                "as",
                                {
                                  directieSrvPunct: directieSrvPunctSelectata,
                                }
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                              fontWeight: "bold",
                            }}
                          >
                            {t.serve} + ({stat.srvAs})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "srv",
                                "eroare"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.serve} {t.errShort} ({stat.srvEroare})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "srv",
                                "neutru"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.serve} 0 ({stat.srvNeutru})
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "blk",
                                "punct"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.block} + ({stat.blkPunct})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "blk",
                                "eroare"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.block} {t.errShort} ({stat.blkEroare})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              inregistreazaActiunePeEchipa(
                                idEchipaBloc,
                                j.id,
                                "blk",
                                "joaca"
                              )
                            }
                            style={{
                              padding: "4px 8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              background: "#f8fafc",
                            }}
                          >
                            {t.block} 0 ({stat.blkJoaca})
                          </button>
                        </>
                      )}
                    </div>

                    {esteRidicator && (
                      <div
                        style={{
                          display: "grid",
                          gap: "5px",
                          marginTop: "8px",
                          paddingTop: "6px",
                          borderTop: "1px dashed #cbd5e1",
                        }}
                      >
                        {ZONE_PASA.map((zona) => {
                          const dateZona = paseNormalizate[zona] || {
                            "+": 0,
                            "0": 0,
                            "-": 0,
                          };
                          const zonaTrad = t.passZones?.[zona] || zona;
                          return (
                            <div
                              key={zona}
                              style={{
                                display: "flex",
                                gap: "5px",
                                flexWrap: "wrap",
                                alignItems: "center",
                                fontSize: "12px",
                              }}
                            >
                              <strong style={{ minWidth: "115px" }}>
                                {zonaTrad}:
                              </strong>
                              {CALITATI_PASA.map((cal) => (
                                <button
                                  key={cal}
                                  type="button"
                                  onClick={() =>
                                    inregistreazaActiunePeEchipa(
                                      idEchipaBloc,
                                      j.id,
                                      "pasa",
                                      "calitate",
                                      { zona, calitate: cal }
                                    )
                                  }
                                  style={{
                                    padding: "2px 7px",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                    background: "#f8fafc",
                                  }}
                                >
                                  {cal} ({dateZona[cal] || 0})
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: TEMA_PLATFORMA.pageBg,
        color: TEMA_PLATFORMA.textPrimary,
      }}
    >
      <main
        className="scouting-app"
        style={{
          boxSizing: "border-box",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "20px",
          maxWidth: "1440px",
          margin: "0 auto",
          lineHeight: 1.45,
        }}
      >
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .scouting-app { padding: 0 !important; max-width: 100% !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 9px; }
            th, td { border: 1px solid #444 !important; padding: 3px 4px !important; }
          }
        `}</style>

        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <div ref={langDropdownRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setMeniuLimbaDeschis((v) => !v)}
              style={{
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 11px",
                fontSize: "12px",
                fontWeight: "bold",
                background: TEMA_PLATFORMA.surfaceBg,
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "7px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
              }}
            >
              <span style={{ fontSize: "14px", lineHeight: 1 }}>
                {limbaCurentaObj.flag}
              </span>
              <span>{limbaCurentaObj.label}</span>
              <span style={{ fontSize: "10px", opacity: 0.75 }}>▾</span>
            </button>

            {meniuLimbaDeschis && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 4px)",
                  zIndex: 50,
                  minWidth: "145px",
                  background: TEMA_PLATFORMA.surfaceBg,
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "7px",
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.14)",
                  padding: "4px",
                  display: "grid",
                  gap: "2px",
                }}
              >
                {LIMBI.map((item) => {
                  const esteActiva = item.code === limba;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setLimba(item.code);
                        setMeniuLimbaDeschis(false);
                      }}
                      style={{
                        boxSizing: "border-box",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        padding: "6px 8px",
                        fontSize: "12px",
                        fontWeight: esteActiva ? "bold" : "normal",
                        background: esteActiva ? "#e2e8f0" : "transparent",
                        color: TEMA_PLATFORMA.textPrimary,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span style={{ fontSize: "13px", lineHeight: 1 }}>
                          {item.flag}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: TEMA_PLATFORMA.textSecondary,
                        }}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "center",
            gap: "16px",
            background: TEMA_PLATFORMA.surfaceBg,
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                color: TEMA_PLATFORMA.textPrimary,
              }}
            >
              {t.appTitle} — {echipaNoastra?.teamName} vs.{" "}
              {echipaAdversa?.teamName}
            </h1>
            <p
              style={{
                margin: "6px 0 0 0",
                color: TEMA_PLATFORMA.textSecondary,
                fontSize: "13px",
              }}
            >
              {t.league}: <strong>{echipaNoastra?.league}</strong> ·{" "}
              {t.activeScout}: <strong>{scoutActiv}</strong> · {t.scoutingOn}:{" "}
              <strong>
                {tintaScouting === "adversar"
                  ? `${t.opponent} (${echipaAdversa?.teamName})`
                  : `${t.ourTeam} (${echipaNoastra?.teamName})`}
              </strong>{" "}
              · {t.activeSet}:{" "}
              <strong>
                {setActiv === 5
                  ? `${t.set} 5 (${t.tieBreak})`
                  : `${t.set} ${setActiv}`}
              </strong>{" "}
              ({t.targetPtsShort}: <strong>{stareSetActiv.tinta}</strong>) ·{" "}
              {t.setterPos} <strong>{pozitieRidicatorCurenta}</strong> ·{" "}
              {t.reportDate}:{" "}
              <strong>{new Date().toLocaleDateString("ro-RO")}</strong>
            </p>
          </div>

          <div
            style={{
              boxSizing: "border-box",
              justifySelf: "stretch",
              border: `2px solid ${TEMA_PLATFORMA.accent}`,
              borderRadius: "8px",
              padding: "10px 16px",
              background: TEMA_PLATFORMA.subtleBg,
              textAlign: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: TEMA_PLATFORMA.textSecondary,
                fontWeight: "bold",
              }}
            >
              {t.scoreTitle}{" "}
              {setActiv === 5
                ? `${t.set} 5 (${t.tieBreak})`
                : `${t.set} ${setActiv}`.toUpperCase()}{" "}
              ({t.serve}:{" "}
              {infoSetActiv.serviciu === "noi"
                ? echipaNoastra?.teamName
                : echipaAdversa?.teamName}
              )
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "4px",
                color: TEMA_PLATFORMA.textPrimary,
              }}
            >
              {echipaNoastra?.teamName} {infoSetActiv.noi} —{" "}
              {infoSetActiv.adversar} {echipaAdversa?.teamName}
            </div>
            <div
              style={{
                fontSize: "12px",
                marginTop: "3px",
                color: TEMA_PLATFORMA.textSecondary,
              }}
            >
              {t.setsWon}:{" "}
              <strong>
                {scorSeturiMeci.seturiNoi} — {scorSeturiMeci.seturiAdversar}
              </strong>{" "}
              · {t.targetPtsShort}: <strong>{stareSetActiv.tinta}</strong>
              {stareSetActiv.esteIncheiat ? ` · ${t.setFinished}` : ""}
            </div>
            <div className="no-print" style={{ marginTop: "8px" }}>
              <button
                type="button"
                onClick={anuleazaUltimaActiune}
                disabled={istoric.length === 0}
                style={{
                  boxSizing: "border-box",
                  padding: "4px 10px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: TEMA_PLATFORMA.accent,
                  color: TEMA_PLATFORMA.accentText,
                  border: "none",
                  borderRadius: "5px",
                  opacity: istoric.length === 0 ? 0.5 : 1,
                }}
              >
                {t.undo} ({istoric.length})
              </button>
            </div>
          </div>
        </div>

        <section
          className="no-print"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: "14px",
            marginBottom: "10px",
            padding: "12px",
            background: TEMA_PLATFORMA.surfaceBg,
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <strong>{t.scoutingMode}:</strong>
            <button
              type="button"
              onClick={() => setTintaScouting("noi")}
              style={{
                boxSizing: "border-box",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: tintaScouting === "noi" ? "bold" : "normal",
                background:
                  tintaScouting === "noi" ? temaEchipaNoastra.badgeBg : "#fff",
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${temaEchipaNoastra.cardBorder}`,
                borderRadius: "5px",
              }}
            >
              {t.ourTeam} ({echipaNoastra?.teamName})
            </button>
            <button
              type="button"
              onClick={() => {
                setTintaScouting("adversar");
                asiguraLotIncarcat(echipaAdversaId);
              }}
              style={{
                boxSizing: "border-box",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: tintaScouting === "adversar" ? "bold" : "normal",
                background:
                  tintaScouting === "adversar"
                    ? temaEchipaAdversa.badgeBg
                    : "#fff",
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${temaEchipaAdversa.cardBorder}`,
                borderRadius: "5px",
              }}
            >
              {t.opponent} ({echipaAdversa?.teamName})
            </button>
            <button
              type="button"
              onClick={() => {
                setModParalelEcran((v) => !v);
                asiguraLotIncarcat(echipaAdversaId);
              }}
              style={{
                boxSizing: "border-box",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: modParalelEcran ? "bold" : "normal",
                background: modParalelEcran ? TEMA_PLATFORMA.accent : "#fff",
                color: modParalelEcran ? "#fff" : TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "5px",
              }}
            >
              {modParalelEcran ? t.parallelOn : t.parallelOff}
            </button>
          </div>

          <div>
            <label htmlFor="select-scout" style={{ marginRight: "6px" }}>
              <strong>{t.operator}:</strong>
            </label>
            <select
              id="select-scout"
              value={scoutActiv}
              onChange={(e) => setScoutActiv(e.target.value)}
              style={{
                boxSizing: "border-box",
                padding: "5px 8px",
                fontSize: "13px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                background: "#fff",
              }}
            >
              <option value="Scout 1">{t.scout1}</option>
              <option value="Scout 2">{t.scout2}</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              alignItems: "center",
            }}
          >
            <strong>{t.activeSet}:</strong>
            {SETURI.map((nrSet) => {
              const s = stareSeturiMeci.seturi[nrSet];
              const esteActiv = setActiv === nrSet;
              const stareS = evalueazaStareSet(nrSet, s.noi, s.adversar);
              return (
                <button
                  key={nrSet}
                  type="button"
                  onClick={() => schimbaSetActiv(nrSet)}
                  style={{
                    boxSizing: "border-box",
                    padding: "5px 9px",
                    cursor: "pointer",
                    fontWeight: esteActiv ? "bold" : "normal",
                    background: esteActiv
                      ? TEMA_PLATFORMA.accent
                      : stareS.esteIncheiat
                      ? "#e2e8f0"
                      : "#fff",
                    color: esteActiv ? "#fff" : TEMA_PLATFORMA.textPrimary,
                    border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                    borderRadius: "5px",
                  }}
                >
                  {t.setShort} {nrSet} ({s.noi}-{s.adversar})
                  {stareS.esteIncheiat ? " ✓" : ""}
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="select-vizualizare" style={{ marginRight: "6px" }}>
              <strong>{t.view}:</strong>
            </label>
            <select
              id="select-vizualizare"
              value={modVizualizare}
              onChange={(e) => schimbaModVizualizare(e.target.value)}
              style={{
                boxSizing: "border-box",
                padding: "5px 8px",
                fontSize: "13px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                background: "#fff",
              }}
            >
              {SETURI.map((nrSet) => (
                <option key={nrSet} value={String(nrSet)}>
                  {t.set} {nrSet}
                  {nrSet === 5 ? ` (${t.tieBreak})` : ""}
                </option>
              ))}
              <option value="total">{t.totalMatch}</option>
            </select>
          </div>
        </section>

        <section
          className="no-print"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "flex-end",
            marginTop: "12px",
            marginBottom: "20px",
            padding: "12px",
            background: TEMA_PLATFORMA.surfaceBg,
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div>
            <label
              htmlFor="select-echipa"
              style={{ display: "block", marginBottom: "6px" }}
            >
              <strong>{t.ourTeamSelect}:</strong>
            </label>
            <select
              id="select-echipa"
              value={echipaPrincipalaId}
              onChange={(e) => sincronizeazaEchipaLaSelectare(e.target.value)}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                fontSize: "13px",
                minWidth: "210px",
                background: temaEchipaNoastra.cardBg,
                border: `1px solid ${temaEchipaNoastra.cardBorder}`,
                borderRadius: "6px",
              }}
            >
              {EUROPEAN_VOLLEYBALL_TEAMS.map((echipa) => (
                <option key={echipa.id} value={echipa.id}>
                  {echipa.teamName} ({echipa.league})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="select-adversar"
              style={{ display: "block", marginBottom: "6px" }}
            >
              <strong>{t.opponentSelect}:</strong>
            </label>
            <select
              id="select-adversar"
              value={echipaAdversaId}
              onChange={(e) => sincronizeazaAdversarLaSelectare(e.target.value)}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                fontSize: "13px",
                minWidth: "210px",
                background: temaEchipaAdversa.cardBg,
                border: `1px solid ${temaEchipaAdversa.cardBorder}`,
                borderRadius: "6px",
              }}
            >
              {EUROPEAN_VOLLEYBALL_TEAMS.map((echipa) => (
                <option key={echipa.id} value={echipa.id}>
                  {echipa.teamName} ({echipa.league})
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              disabled={stareSetActiv.esteIncheiat}
              onClick={() => marcheazaPunct("noi")}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                cursor: stareSetActiv.esteIncheiat ? "not-allowed" : "pointer",
                fontWeight: "bold",
                background: temaEchipaNoastra.badgeBg,
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${temaEchipaNoastra.cardBorder}`,
                borderRadius: "6px",
                opacity: stareSetActiv.esteIncheiat ? 0.5 : 1,
              }}
            >
              {t.pointFor} {echipaNoastra?.teamName}{" "}
              {!echipaNoastraServeste ? `(${t.autoRotate})` : ""}
            </button>
            <button
              type="button"
              disabled={stareSetActiv.esteIncheiat}
              onClick={() => marcheazaPunct("adversar")}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                cursor: stareSetActiv.esteIncheiat ? "not-allowed" : "pointer",
                fontWeight: "bold",
                background: temaEchipaAdversa.badgeBg,
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${temaEchipaAdversa.cardBorder}`,
                borderRadius: "6px",
                opacity: stareSetActiv.esteIncheiat ? 0.5 : 1,
              }}
            >
              {t.pointFor} {echipaAdversa?.teamName}{" "}
              {!echipaAdversaServeste ? `(${t.autoRotate})` : ""}
            </button>
            <button
              type="button"
              onClick={anuleazaUltimaActiune}
              disabled={istoric.length === 0}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: "bold",
                background: "#fff",
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "6px",
                opacity: istoric.length === 0 ? 0.5 : 1,
              }}
            >
              {t.undo}
            </button>
            <button
              type="button"
              onClick={() =>
                seteazaServiciuCurent(
                  infoSetActiv.serviciu === "noi" ? "adversar" : "noi"
                )
              }
              style={{
                boxSizing: "border-box",
                padding: "8px 10px",
                cursor: "pointer",
                background: "#fff",
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "6px",
              }}
            >
              {t.serve}:{" "}
              {infoSetActiv.serviciu === "noi"
                ? echipaNoastra?.teamName
                : echipaAdversa?.teamName}
            </button>
          </div>

          <div>
            <label
              htmlFor="select-poz-ridicator"
              style={{ display: "block", marginBottom: "6px" }}
            >
              <strong>
                {t.setterFor} ({echipaActivaObj?.teamName}):
              </strong>
            </label>
            <select
              id="select-poz-ridicator"
              value={pozitieRidicatorCurenta}
              onChange={(e) => seteazaPozitieRidicator(Number(e.target.value))}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                fontSize: "13px",
                minWidth: "125px",
                background: "#fff",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "6px",
              }}
            >
              {POZITII_RIDICATOR.map((pos) => (
                <option key={pos} value={pos}>
                  {t.position} {pos}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={rotesteTeren}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                cursor: "pointer",
                background: "#fff",
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "6px",
              }}
            >
              {t.rotateManual}
            </button>

            <button
              type="button"
              onClick={exportaPDF}
              style={{
                boxSizing: "border-box",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: "bold",
                background: TEMA_PLATFORMA.accent,
                color: TEMA_PLATFORMA.accentText,
                border: "none",
                borderRadius: "6px",
              }}
            >
              {t.exportPdf}
            </button>

            <button
              type="button"
              onClick={reincarcaLotPredefinit}
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                cursor: "pointer",
                background: "#fff",
                color: TEMA_PLATFORMA.textPrimary,
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                borderRadius: "6px",
              }}
            >
              {t.reloadRoster}
            </button>

            {(jucatoareNoastre.length > 0 || jucatoareAdverse.length > 0) && (
              <button
                type="button"
                onClick={reseteazaStatisticiEchipa}
                style={{
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: "#fff",
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "6px",
                }}
              >
                {t.resetSets}
              </button>
            )}
          </div>
        </section>

        <section
          style={{
            boxSizing: "border-box",
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "20px",
            background: TEMA_PLATFORMA.surfaceBg,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: TEMA_PLATFORMA.textPrimary,
                }}
              >
                {t.simCourtTitle} ({t.setShort} {setActiv}: {infoSetActiv.noi} -{" "}
                {infoSetActiv.adversar})
              </h2>
              <div
                style={{
                  fontSize: "12px",
                  color: TEMA_PLATFORMA.textSecondary,
                  marginTop: "2px",
                }}
              >
                {t.simCourtHint}
              </div>
            </div>
            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
              {t.setsWon}: {scorSeturiMeci.seturiNoi} —{" "}
              {scorSeturiMeci.seturiAdversar}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "10px",
              maxWidth: "880px",
              margin: "0 auto",
            }}
          >
            {renderJumătateTerenSimulat({
              targetEchipa: echipaAdversa,
              esteEchipaDeJos: false,
              esteLaServiciu: echipaAdversaServeste,
              pozRidicator: pozitieRidicatorAdversar,
            })}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  background: TEMA_PLATFORMA.accent,
                  borderRadius: "999px",
                }}
              />
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: "999px",
                  background: TEMA_PLATFORMA.accent,
                  color: TEMA_PLATFORMA.accentText,
                  fontSize: "11px",
                  fontWeight: "bold",
                  letterSpacing: "0.06em",
                }}
              >
                {t.netLabel}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  background: TEMA_PLATFORMA.accent,
                  borderRadius: "999px",
                }}
              />
            </div>

            {renderJumătateTerenSimulat({
              targetEchipa: echipaNoastra,
              esteEchipaDeJos: true,
              esteLaServiciu: echipaNoastraServeste,
              pozRidicator: pozitieRidicatorCurenta,
            })}
          </div>
        </section>

        {renderBlocDireciiPunct()}

        <section
          className="no-print"
          style={{
            boxSizing: "border-box",
            marginBottom: "20px",
            padding: "14px",
            background: TEMA_PLATFORMA.surfaceBg,
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "10px",
            boxShadow: "0 1px 4px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  color: TEMA_PLATFORMA.textPrimary,
                }}
              >
                {t.importTitle} — {echipaActivaObj?.teamName}
              </h2>
              <div
                style={{
                  fontSize: "12px",
                  color: TEMA_PLATFORMA.textSecondary,
                  marginTop: "2px",
                }}
              >
                {t.importHint}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                ref={photoFileInputRef}
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.webp,.heic"
                onChange={(e) => handleImportDinFisier(e, "photo")}
                style={{ display: "none" }}
              />
              <input
                ref={pdfFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => handleImportDinFisier(e, "pdf")}
                style={{ display: "none" }}
              />
              <button
                type="button"
                disabled={seProceseazaImport}
                onClick={() => photoFileInputRef.current?.click()}
                style={{
                  boxSizing: "border-box",
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: TEMA_PLATFORMA.accent,
                  color: TEMA_PLATFORMA.accentText,
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                {seProceseazaImport ? t.importStatusWorking : t.importPhotoBtn}
              </button>
              <button
                type="button"
                disabled={seProceseazaImport}
                onClick={() => pdfFileInputRef.current?.click()}
                style={{
                  boxSizing: "border-box",
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: "#ffffff",
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "6px",
                }}
              >
                {seProceseazaImport ? t.importStatusWorking : t.importPdfBtn}
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            value={textImportJucatoare}
            onChange={(e) => setTextImportJucatoare(e.target.value)}
            placeholder={t.importPlaceholder}
            style={{
              boxSizing: "border-box",
              width: "100%",
              padding: "8px 10px",
              fontSize: "12px",
              borderRadius: "6px",
              border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
              background: TEMA_PLATFORMA.subtleBg,
              color: TEMA_PLATFORMA.textPrimary,
              resize: "vertical",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                flexWrap: "wrap",
                fontSize: "12px",
              }}
            >
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="modImportLot"
                  checked={!inlocuiesteLotImport}
                  onChange={() => setInlocuiesteLotImport(false)}
                />
                {t.importAppendLabel}
              </label>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="modImportLot"
                  checked={inlocuiesteLotImport}
                  onChange={() => setInlocuiesteLotImport(true)}
                />
                {t.importReplaceLabel}
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleImportDinText}
                style={{
                  boxSizing: "border-box",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: "#fff",
                  color: TEMA_PLATFORMA.textPrimary,
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "6px",
                }}
              >
                {t.importTextBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTextImportJucatoare("");
                  setMesajImport("");
                }}
                style={{
                  boxSizing: "border-box",
                  padding: "6px 10px",
                  fontSize: "12px",
                  cursor: "pointer",
                  background: "#fff",
                  color: TEMA_PLATFORMA.textSecondary,
                  border: `1px solid ${TEMA_PLATFORMA.border}`,
                  borderRadius: "6px",
                }}
              >
                {t.importClearTextBtn}
              </button>
            </div>
          </div>

          {mesajImport && (
            <div
              style={{
                marginTop: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "bold",
                background: temaEchipaActiva.cardBg,
                border: `1px solid ${temaEchipaActiva.cardBorder}`,
                color: TEMA_PLATFORMA.textPrimary,
              }}
            >
              {mesajImport}
            </div>
          )}
        </section>

        <section
          style={{
            boxSizing: "border-box",
            border: `2px solid ${temaEchipaActiva.cardBorder}`,
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "24px",
            background: temaEchipaActiva.cardBg,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
            fontSize: "13px",
          }}
        >
          <strong>
            {t.teamSummary} ({echipaActivaObj?.teamName} — {etichetaVizualizare}):
          </strong>{" "}
          {t.setShort} {setActiv}:{" "}
          <strong>
            {infoSetActiv.noi} - {infoSetActiv.adversar}
          </strong>{" "}
          ({t.setsWon}:{" "}
          <strong>
            {scorSeturiMeci.seturiNoi}-{scorSeturiMeci.seturiAdversar}
          </strong>
          ) · {t.attack}:{" "}
          <strong>
            {totalEchipaActiva.atkReusit}/{totalEchipaActiva.atkTotal}
          </strong>{" "}
          ({procentAtacEchipa}% {t.pctShort} ·{" "}
          <strong>{eficientaAtacEchipa}%</strong> {t.effShort}) · {t.reception}:{" "}
          <strong>
            {totalEchipaActiva.recPozitiv}/{totalEchipaActiva.recTotal}
          </strong>{" "}
          (<strong>{procentPreluareEchipa}%</strong> {t.posShort},{" "}
          {totalEchipaActiva.recEroare} {t.errShort}) · {t.serve}:{" "}
          <strong>{totalEchipaActiva.srvAs}</strong> {t.aces} /{" "}
          {totalEchipaActiva.srvEroare} {t.errShort} / {totalEchipaActiva.srvTotal}{" "}
          {t.totShort} · {t.block}: <strong>{totalEchipaActiva.blkPunct}</strong>{" "}
          {t.pctShort} / <strong>{totalEchipaActiva.blkEroare}</strong>{" "}
          {t.errShort} / <strong>{totalEchipaActiva.blkJoaca}</strong>{" "}
          {t.inPlay} · {t.setterPasses}:{" "}
          <strong>{totalEchipaActiva.paseTotal}</strong> (
          <strong>{procentCalitatePaseEchipa}%</strong> {t.qualityPlus})
        </section>

        <section style={{ marginBottom: "24px", minWidth: 0 }}>
          <h2
            style={{
              marginTop: 0,
              fontSize: "18px",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            {t.compTitle} ({etichetaVizualizare})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <table style={tableBaseStyle}>
                <thead>
                  <tr style={{ background: temaEchipaNoastra.headerBg }}>
                    <th
                      style={{
                        border: "1px solid #94a3b8",
                        padding: "7px",
                        textAlign: "left",
                      }}
                    >
                      {t.catIndicator}
                    </th>
                    <th style={{ border: "1px solid #94a3b8", padding: "7px" }}>
                      {echipaNoastra?.teamName} {t.totalDetail}
                    </th>
                    <th style={{ border: "1px solid #94a3b8", padding: "7px" }}>
                      {echipaNoastra?.teamName} {t.pctEff}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: temaEchipaNoastra.cardBg }}>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.atkRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.atkReusit} / {totalEchipa.atkEroare} /{" "}
                      {totalEchipa.atkNeutru} ·{" "}
                      <strong>{totalEchipa.atkTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.atkPct}% ·{" "}
                      <strong>{totalEchipa.atkEf}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.recRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.recPozitiv} / {totalEchipa.recEroare} /{" "}
                      {totalEchipa.recNeutru} ·{" "}
                      <strong>{totalEchipa.recTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      <strong>{totalEchipa.recPozPct}%</strong> ·{" "}
                      {t.errShort}: {totalEchipa.recErPct}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.srvRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.srvAs} / {totalEchipa.srvEroare} /{" "}
                      {totalEchipa.srvNeutru} ·{" "}
                      <strong>{totalEchipa.srvTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.srvAsPct}% ·{" "}
                      <strong>{totalEchipa.srvEf}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.blkRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.blkPunct} / {totalEchipa.blkEroare} /{" "}
                      {totalEchipa.blkJoaca} ·{" "}
                      <strong>{totalEchipa.blkTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalEchipa.blkPct}% ·{" "}
                      <strong>{totalEchipa.blkEf}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.passRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      +{totalEchipa.pasePlus} / 0:{totalEchipa.paseZero} / -
                      {totalEchipa.paseMinus} ·{" "}
                      <strong>{totalEchipa.paseTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      <strong>{totalEchipa.pasePlusPct}%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ minWidth: 0 }}>
              <table style={tableBaseStyle}>
                <thead>
                  <tr style={{ background: temaEchipaAdversa.headerBg }}>
                    <th
                      style={{
                        border: "1px solid #94a3b8",
                        padding: "7px",
                        textAlign: "left",
                      }}
                    >
                      {t.catIndicator}
                    </th>
                    <th style={{ border: "1px solid #94a3b8", padding: "7px" }}>
                      {echipaAdversa?.teamName} {t.totalDetail}
                    </th>
                    <th style={{ border: "1px solid #94a3b8", padding: "7px" }}>
                      {echipaAdversa?.teamName} {t.pctEff}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: temaEchipaAdversa.cardBg }}>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.atkRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.atkReusit} / {totalAdversar.atkEroare} /{" "}
                      {totalAdversar.atkNeutru} ·{" "}
                      <strong>{totalAdversar.atkTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.atkPct}% ·{" "}
                      <strong>{totalAdversar.atkEf}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.recRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.recPozitiv} / {totalAdversar.recEroare} /{" "}
                      {totalAdversar.recNeutru} ·{" "}
                      <strong>{totalAdversar.recTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      <strong>{totalAdversar.recPozPct}%</strong> ·{" "}
                      {t.errShort}: {totalAdversar.recErPct}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.srvRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.srvAs} / {totalAdversar.srvEroare} /{" "}
                      {totalAdversar.srvNeutru} ·{" "}
                      <strong>{totalAdversar.srvTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.srvAsPct}% ·{" "}
                      <strong>{totalAdversar.srvEf}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.blkRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.blkPunct} / {totalAdversar.blkEroare} /{" "}
                      {totalAdversar.blkJoaca} ·{" "}
                      <strong>{totalAdversar.blkTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      {totalAdversar.blkPct}% ·{" "}
                      <strong>{totalAdversar.blkEf}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "6px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{t.passRow}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      +{totalAdversar.pasePlus} / 0:{totalAdversar.paseZero} / -
                      {totalAdversar.paseMinus} ·{" "}
                      <strong>{totalAdversar.paseTotal}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px" }}>
                      <strong>{totalAdversar.pasePlusPct}%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          style={{
            boxSizing: "border-box",
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "24px",
            background: TEMA_PLATFORMA.surfaceBg,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                color: TEMA_PLATFORMA.textPrimary,
              }}
            >
              {t.chartTitle} ({etichetaVizualizare})
            </h2>

            <div
              className="no-print"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <label
                htmlFor="select-indicator-grafic"
                style={{ fontSize: "12px" }}
              >
                <strong>{t.metricLabel}:</strong>
              </label>
              <select
                id="select-indicator-grafic"
                value={indicatorGrafic}
                onChange={(e) => setIndicatorGrafic(e.target.value)}
                style={{
                  boxSizing: "border-box",
                  padding: "5px 8px",
                  fontSize: "12px",
                  background: "#fff",
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "5px",
                }}
              >
                <option value="atkReusit">{t.metricAtkKills}</option>
                <option value="atkEf">{t.metricAtkEff}</option>
                <option value="recPozPct">{t.metricRecPos}</option>
                <option value="srvAs">{t.metricSrvAce}</option>
                <option value="blkPunct">{t.metricBlkPts}</option>
                <option value="pasePlusPct">{t.metricPassQual}</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "16px",
              alignItems: "start",
            }}
          >
            {renderCardGraficEchipa({
              targetEchipa: echipaNoastra,
              randuriGrafic: randuriGraficAcasa,
              etichetaRol: t.ourTeam,
            })}

            {renderCardGraficEchipa({
              targetEchipa: echipaAdversa,
              randuriGrafic: randuriGraficAdversar,
              etichetaRol: t.opponent,
            })}
          </div>
        </section>

        <section style={{ marginBottom: "24px", minWidth: 0 }}>
          <h2
            style={{
              marginTop: 0,
              fontSize: "18px",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            {t.courtRotTitle} ({etichetaVizualizare})
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "16px",
              alignItems: "start",
            }}
          >
            {renderBlocTerenSiRotatiiEchipa({
              targetEchipa: echipaNoastra,
              rotatiiObj: rotatiiAfisate,
              pozRidicator: pozitieRidicatorCurenta,
              etichetaRol: t.ourTeam,
            })}

            {renderBlocTerenSiRotatiiEchipa({
              targetEchipa: echipaAdversa,
              rotatiiObj: rotatiiAdversarAfisate,
              pozRidicator: pozitieRidicatorAdversar,
              etichetaRol: t.opponent,
            })}
          </div>
        </section>

        <section
          className="no-print"
          style={{
            marginBottom: "20px",
            padding: "12px",
            background: TEMA_PLATFORMA.surfaceBg,
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "8px",
          }}
        >
          <form
            onSubmit={adaugaJucatoare}
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "bold" }}>
              {t.addTo} {echipaActivaObj?.teamName}:
            </span>
            <input
              type="text"
              placeholder={t.jerseyPh}
              value={numarTricou}
              onChange={(e) => setNumarTricou(e.target.value)}
              style={{
                boxSizing: "border-box",
                width: "65px",
                padding: "8px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
              }}
            />
            <input
              type="text"
              placeholder={t.namePh}
              value={numeJucatoare}
              onChange={(e) => setNumeJucatoare(e.target.value)}
              style={{
                boxSizing: "border-box",
                flex: "1",
                minWidth: "180px",
                padding: "8px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
              }}
            />
            <select
              value={postJucatoare}
              onChange={(e) => setPostJucatoare(e.target.value)}
              style={{
                boxSizing: "border-box",
                padding: "8px",
                borderRadius: "5px",
                border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                background: "#fff",
              }}
            >
              {POSTURI_DISPONIBILE.map((postOpt) => (
                <option key={postOpt} value={postOpt}>
                  {t.posts[postOpt] || postOpt}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                boxSizing: "border-box",
                padding: "8px 14px",
                cursor: "pointer",
                background: TEMA_PLATFORMA.accent,
                color: TEMA_PLATFORMA.accentText,
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              {t.addPlayerBtn}
            </button>
          </form>
        </section>

        <section
          style={{
            overflowX: "auto",
            marginBottom: "24px",
            minWidth: 0,
            background: TEMA_PLATFORMA.surfaceBg,
            border: `1px solid ${TEMA_PLATFORMA.border}`,
            borderRadius: "10px",
            padding: "14px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "18px",
              color: TEMA_PLATFORMA.textPrimary,
            }}
          >
            {t.statsTableTitle} ({etichetaVizualizare})
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ background: TEMA_PLATFORMA.toolbarBg }}>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.teamCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.numCol}
                </th>
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "6px",
                    textAlign: "left",
                  }}
                >
                  {t.playerCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.roleCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.atkTotCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.pctCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.errCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.atkPctCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.atkEffCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.recTotCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.recPosCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.recErrCol}
                </th>
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "6px",
                    textAlign: "left",
                  }}
                >
                  {t.recDetailCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.srvTotCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.srvAceCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.srvErrCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.blkPctCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.blkErrCol}
                </th>
                <th style={{ border: "1px solid #94a3b8", padding: "6px" }}>
                  {t.blkPlayCol}
                </th>
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "6px",
                    textAlign: "left",
                  }}
                >
                  {t.atkZonesCol}
                </th>
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "6px",
                    textAlign: "left",
                  }}
                >
                  {t.passZonesCol}
                </th>
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "6px",
                    textAlign: "left",
                  }}
                >
                  {t.scoringDirsCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ...jucatoareNoastre.map((j) => ({
                  j,
                  numeEchipa: echipaNoastra?.teamName,
                  temaRand: temaEchipaNoastra,
                  srvDirs: directiiSrvPunctNoastre,
                  atkAdvDirs: {},
                })),
                ...jucatoareAdverse.map((j) => ({
                  j,
                  numeEchipa: echipaAdversa?.teamName,
                  temaRand: temaEchipaAdversa,
                  srvDirs: directiiSrvPunctAdversar,
                  atkAdvDirs: directiiAtkAdversarPunctAfisate,
                })),
              ].map(({ j, numeEchipa, temaRand, srvDirs, atkAdvDirs }) => {
                const esteLibero = j.post === "Libero";
                const stat = getStatJucatoarePentruMod(j, modVizualizare);
                const calc = getStatisticiCalculateDinStat(stat, j.post);
                const atkPct = calculeazaProcent(stat.atkReusit, calc.atkTotal);
                const atkEf = calculateEfficiency(
                  stat.atkReusit,
                  stat.atkEroare,
                  calc.atkTotal
                );
                const recPozPct = calculeazaProcent(
                  calc.recPozitivTotal,
                  calc.recTotal
                );
                const rezPase = rezumaPaseJucatoare(stat.pase, t);
                const rezZoneAtac = rezumaZoneAtacJucatoare(
                  stat.zoneAtac,
                  j.post,
                  t
                );
                const rezDirectiiPunct = rezumaDirectiiPunct(
                  srvDirs,
                  atkAdvDirs,
                  t
                );

                const servPozPct = calculeazaProcent(
                  stat.libRecServPoz,
                  calc.libServTotal
                );
                const atkRecPozPct = calculeazaProcent(
                  stat.libRecAtkPoz,
                  calc.libAtkTotal
                );
                const detaliuLibero = esteLibero
                  ? `${t.recServ}: ${stat.libRecServPoz}/${calc.libServTotal} (${servPozPct}%+, ${stat.libRecServEr} ${t.errShort}) | ${t.recAtk}: ${stat.libRecAtkPoz}/${calc.libAtkTotal} (${atkRecPozPct}%+, ${stat.libRecAtkEr} ${t.errShort})`
                  : "-";

                return (
                  <tr
                    key={`${numeEchipa}-${j.id}`}
                    style={{ background: temaRand.cardBg }}
                  >
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      <strong>{numeEchipa}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {j.numar}
                    </td>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{j.nume}</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {t.posts[j.post] || j.post}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : calc.atkTotal}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.atkReusit}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.atkEroare}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : `${atkPct}%`}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : <strong>{atkEf}%</strong>}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {calc.recTotal}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      <strong>{recPozPct}%</strong>
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {calc.recEroareTotal}
                    </td>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {detaliuLibero}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : calc.srvTotal}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.srvAs}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.srvEroare}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.blkPunct}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.blkEroare}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "5px" }}>
                      {esteLibero ? "-" : stat.blkJoaca}
                    </td>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {esteLibero ? "-" : rezZoneAtac}
                    </td>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {j.post === "Ridicător"
                        ? `${rezPase.calitatePlusPct}%+ (${rezPase.textDetaliat})`
                        : "-"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {rezDirectiiPunct}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="no-print" style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: "18px", color: TEMA_PLATFORMA.textPrimary }}>
            {t.quickPanelTitle} ({echipaActivaObj?.teamName} — {t.set}{" "}
            {setActiv})
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
              padding: "10px 12px",
              marginBottom: "12px",
              background: temaEchipaActiva.cardBg,
              border: `1px solid ${temaEchipaActiva.cardBorder}`,
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            <div>
              <label htmlFor="select-libero-1" style={{ marginRight: "6px" }}>
                <strong>{t.libero1Label}:</strong>
              </label>
              <select
                id="select-libero-1"
                value={liberoPrimarActiv?.id ?? ""}
                onChange={(e) => seteazaLiberoPrimar(e.target.value)}
                style={{
                  boxSizing: "border-box",
                  padding: "5px 8px",
                  fontSize: "13px",
                  background: "#fff",
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "5px",
                }}
              >
                <option value="">{t.noLibero}</option>
                {jucatoareLiberoLot.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    #{lib.numar} {lib.nume}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-libero-2" style={{ marginRight: "6px" }}>
                <strong>{t.libero2Label}:</strong>
              </label>
              <select
                id="select-libero-2"
                value={liberoSecundarActiv?.id ?? ""}
                onChange={(e) => seteazaLiberoSecundar(e.target.value)}
                style={{
                  boxSizing: "border-box",
                  padding: "5px 8px",
                  fontSize: "13px",
                  background: "#fff",
                  border: `1px solid ${TEMA_PLATFORMA.borderStrong}`,
                  borderRadius: "5px",
                }}
              >
                <option value="">{t.singleLibero}</option>
                {jucatoareLiberoLot
                  .filter(
                    (lib) => String(lib.id) !== String(liberoPrimarActiv?.id)
                  )
                  .map((lib) => (
                    <option key={lib.id} value={lib.id}>
                      #{lib.numar} {lib.nume}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {modParalelEcran ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "16px",
                alignItems: "start",
              }}
            >
              {renderPanouInregistrareEchipa(
                echipaNoastra,
                construiesteListaOrdonataPentruEchipa(echipaPrincipalaId),
                `${t.ourTeam}: ${echipaNoastra?.teamName}`
              )}
              {renderPanouInregistrareEchipa(
                echipaAdversa,
                construiesteListaOrdonataPentruEchipa(echipaAdversaId),
                `${t.opponent}: ${echipaAdversa?.teamName}`
              )}
            </div>
          ) : (
            renderPanouInregistrareEchipa(
              echipaActivaObj,
              jucatoareOrdonatePentruInregistrare,
              `${echipaActivaObj?.teamName} — ${t.set} ${setActiv}`
            )
          )}
        </section>
      </main>
    </div>
  );
}
