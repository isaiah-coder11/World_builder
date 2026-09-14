/* ============================================================
   CHATBOT MEMORY
   ============================================================ */

let memory = [];
/* ============================================================
   CATEGORY KEYWORDS
   ============================================================ */

const characterKeywords = [
  "he","she","they","him","her","them","his","hers","their","theirs",
  "hero","villain","mentor","friend","enemy","leader","follower",
  "warrior","mage","thief","ruler","king","queen","prince","princess",
  "soldier","guardian","hunter","wanderer","outsider","stranger",
  "chosen","orphan","trickster","sage","champion","rebel","visionary",
  "survivor","healer","scholar","artist","inventor","explorer",
  "brave","fearful","kind","cruel","loyal","selfish","curious","angry",
  "calm","shy","bold","clever","wise","naive","stubborn","gentle",
  "ambitious","cautious","reckless","patient","impatient",
  "motivation","goal","fear","flaw","strength","weakness","backstory",
  "growth","change","conflict","belief","dream","destiny","choice",
  "challenge","struggle","journey","transformation",
  "family","brother","sister","mother","father","friendship","rival",
  "partner","team","group","clan","tribe","bond","connection"
];

const settingKeywords = [
  "forest","desert","mountain","valley","river","lake","ocean","island",
  "coast","canyon","swamp","tundra","plains","jungle","hill","cliff",
  "city","village","town","castle","fort","temple","tower","market",
  "harbor","bridge","road","ruins","palace","camp","farm","port",
  "tradition","festival","custom","language","clothing","food","music",
  "religion","beliefs","ritual","holiday","society","community","trade",
  "rain","storm","snow","wind","fog","heat","cold","season","sunset",
  "sunrise","night","day","drought","flood","cloud","sky",
  "dark","bright","quiet","busy","crowded","empty","peaceful","chaotic",
  "ancient","modern","rural","urban","isolated","remote","wild",
  "cave","mine","field","meadow","savanna","glacier","volcano",
  "reef","shore","bay","delta","grove","path","trail"
];

const categoryPrompts = {
    environment: [
        "How does this environment shape the people who live there?",
        "What hidden dangers or wonders exist in this landscape?",
        "How has the climate influenced local culture or survival?",
        "What stories or myths are tied to this place?"
    ],
    character: [
        "What drives this character forward despite their challenges?",
        "How do their relationships shape their destiny?",
        "What flaw or strength defines them the most?",
        "How has their past shaped who they are now?"
    ],
    history: [
        "What ancient event still echoes through the present?",
        "Who recorded this history, and who tried to erase it?",
        "What relics or ruins remain from this era?",
        "How do different cultures interpret this historical moment?"
    ],
    culture: [
        "What traditions define this society?",
        "How do beliefs shape daily life here?",
        "What conflicts arise between different cultural groups?",
        "What rituals mark important life events?"
    ],
    conflict: [
        "What sparked this conflict originally?",
        "Who benefits from the fighting, and who suffers?",
        "How might this struggle reshape the world?",
        "What alliances or betrayals define this war?"
    ],
    misc: [
        "What deeper meaning might this idea hold?",
        "How could this concept evolve over time?",
        "What consequences might arise from this detail?",
        "Who is most affected by this idea?"
    ]
};


/* ============================================================
   MAIN CHATBOT RESPONSE LOGIC
   ============================================================ */

function generateResponse(userMessage) {
    // store memory
    memory.push(userMessage);
    if (memory.length > 20) memory.shift();

    lastUserMessage = userMessage;

    const msg = userMessage.toLowerCase().trim();
    const isQ = detectQuestion(msg);

    let botReply;

    if (isQ) {
        botReply = guidingAdvice();
    } else {
        botReply = socraticPrompt(userMessage);
    }

    lastBotMessage = botReply;
    return botReply;
}


/* ============================================================
   QUESTION DETECTION
   ============================================================ */

function detectQuestion(msg) {
    const questionWords = ["who", "what", "where", "when", "why", "how"];

    const endsWithQM = msg.endsWith("?");
    const startsWithQWord = questionWords.some(w => msg.startsWith(w + " "));

    return endsWithQM || startsWithQWord;
}


/* ============================================================
   GUIDING ANSWERS (for questions)
   ============================================================ */

function guidingAdvice() {
    const advice = [
        "Try grounding this idea in a cultural tradition or myth. What purpose does it serve in the world?",
        "Think about how this element affects daily life. Who benefits from it, and who fears it?",
        "Consider the history behind this concept. What event shaped it into what it is now?",
        "Ask yourself how this detail ties into the world’s larger themes. Does it reinforce or challenge them?",
        "Imagine how different groups interpret this phenomenon. Are there conflicting beliefs?"
    ];
    return advice[Math.floor(Math.random() * advice.length)];
}


/* ============================================================
   SOCRATIC PROMPTS (for statements)
   Now keyword‑aware
   ============================================================ */

function socraticPrompt(userMessage) {
    const keywords = extractKeywords(userMessage);
    const clusters = clusterKeywords(keywords);
    const main = findMainCluster(clusters);

    const group = main.name; // environment, character, history, etc.

    const prompts = categoryPrompts[group] || categoryPrompts.misc;

    return prompts[Math.floor(Math.random() * prompts.length)];
}



/* ============================================================
   KEEPER SYSTEM
   ============================================================ */

let lastUserMessage = "";
let lastBotMessage = "";

function keeperSave() {
    document.getElementById("keeperFileSelect").style.display = "block";
}

function keeperDelete() {
    document.getElementById("keeperPanel").style.display = "none";
    document.getElementById("keeperFileSelect").style.display = "none";
}

function keeperChoose(fileName) {
    const fileDiv = document.getElementById(fileName);
    const snippet = formatMindMap(lastUserMessage, lastBotMessage);
    fileDiv.textContent += snippet;
    keeperDelete();
}

function expandKeyword(keyword, group) {
    const templates = {
        environment: [
            `A ${keyword} landscape with harsh conditions`,
            `An environment defined by ${keyword} elements`,
            `A setting shaped by ${keyword} terrain`
        ],
        character: [
            `A character influenced by ${keyword}`,
            `Someone defined by their ${keyword}`,
            `A personality shaped by ${keyword}`
        ],
        magic: [
            `A magical concept rooted in ${keyword}`,
            `An arcane idea tied to ${keyword}`,
            `A mystical force connected to ${keyword}`
        ],
        conflict: [
            `A conflict driven by ${keyword}`,
            `A struggle centered around ${keyword}`,
            `A tension caused by ${keyword}`
        ],
        misc: [
            `A general idea involving ${keyword}`,
            `A concept loosely tied to ${keyword}`,
            `An undefined thought about ${keyword}`
        ]
    };

    const options = templates[group] || templates.misc;
    return options[Math.floor(Math.random() * options.length)];
}


/* ============================================================
   KEYWORD EXTRACTION
   ============================================================ */

function findMainCluster(clusters) {
    let biggestGroup = null;
    let biggestSize = 0;

    for (const group in clusters) {
        if (group === "misc") continue; // ignore misc unless necessary

        if (clusters[group].length > biggestSize) {
            biggestSize = clusters[group].length;
            biggestGroup = group;
        }
    }

    if (!biggestGroup) biggestGroup = "misc";

    return {
        name: biggestGroup,
        words: clusters[biggestGroup]
    };
}



/* ============================================================
   SEMANTIC CLUSTERING
   ============================================================ */

const semanticGroups = {
    environment: ["tundra", "winter", "cold", "snow", "ice", "climate", "forest", "desert", "mountain"],
    history: ["ancient", "old", "past", "event", "change", "era", "age", "ruins"],
    magic: ["magic", "spell", "energy", "power", "mystic", "arcane", "crystal"],
    culture: ["tribe", "people", "ritual", "belief", "custom", "tradition"],
    conflict: ["war", "battle", "fight", "enemy", "danger", "threat"],
    emotion: ["fear", "hope", "love", "anger", "sad", "joy"]
};

for (const group in semanticGroups) {
    semanticGroups[group] = semanticGroups[group].map(w =>
        w.toLowerCase().normalize("NFKD")
    );
}
function extractKeywords(text) {
    const ignore = ["the","and","a","an","is","are","was","were","to","of","in","on","with","for","that"];

    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .split(" ")
        .map(w => w.trim())
        .filter(w => w.length > 2 && !ignore.includes(w))
        .filter((w, i, arr) => arr.indexOf(w) === i);
}

function clusterKeywords(keywords) {
    const clusters = {};

    keywords.forEach(word => {
        let found = false;

        for (const group in semanticGroups) {
            if (semanticGroups[group].includes(word)) {
                if (!clusters[group]) clusters[group] = [];
                clusters[group].push(expandKeyword(word, group));
                found = true;
                break;
            }
        }

        if (found===false) {
            if (!clusters.misc) clusters.misc = [];
            clusters.misc.push(word);
        }
    });

    return clusters;
}

function findMainCluster(clusters) {
    let biggestGroup = null;
    let biggestSize = 0;

    for (const group in clusters) {
        if (group === "misc") continue; // ignore misc unless necessary

        if (clusters[group].length > biggestSize) {
            biggestSize = clusters[group].length;
            biggestGroup = group;
        }
    }

    if (!biggestGroup) biggestGroup = "misc";

    return {
        name: biggestGroup,
        words: clusters[biggestGroup]
    };
}



/* ============================================================
   MIND MAP FORMATTER
   ============================================================ */

function formatMindMap(userMsg, botMsg) {
    const allText = userMsg + " " + botMsg;

    const keywords = extractKeywords(allText);
    const clusters = clusterKeywords(keywords);
    const main = findMainCluster(clusters);

    const title = main.name.toUpperCase() + " — IDEA SNAPSHOT";

   let bullets = "";
main.words.forEach(line => {
    bullets += "• " + line + "\n";
});


    return (
        "╔════════════════════════════════╗\n" +
        `║   ${title}\n` +
        "╚════════════════════════════════╝\n\n" +
        bullets +
        "---------------------------------\n\n"
    );
}
