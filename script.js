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
    "What stories or myths are tied to this place?",
    "How do travelers prepare before entering this region?",
    "What rare resources or materials can only be found here?",
    "How do animals and creatures adapt to this environment?",
    "What seasonal changes dramatically affect life here?",
    "What ancient events shaped the land into what it is now?",
    "How do different cultures describe this environment in their legends?",
    "What emotions does this landscape evoke in those who see it?",
    "What secrets might be buried beneath this terrain?",
    "How does the weather challenge or empower the people living here?",
    "What unique architectural styles developed because of this climate?",
    "How do explorers or wanderers view this region differently from locals?"
],
    character: [
    "What drives this character forward despite their challenges?",
    "How do their relationships shape their destiny?",
    "What flaw or strength defines them the most?",
    "How has their past shaped who they are now?",
    "What secret does this character carry that few people know?",
    "How does this character react when their beliefs are challenged?",
    "What personal goal motivates their actions in the story?",
    "How do their fears influence the choices they make?",
    "What event in their childhood shaped their worldview?",
    "How do they change when placed under extreme pressure?",
    "What moral line would this character never cross?",
    "How do others perceive this character differently than they perceive themselves?",
    "What hidden talent or skill does this character rely on?",
    "How does this character handle betrayal or broken trust?",
    "What future does this character dream of, even if they never admit it?"
],
    history: [
    "What ancient event still echoes through the present?",
    "Who recorded this history, and who tried to erase it?",
    "What relics or ruins remain from this era?",
    "How do different cultures interpret this historical moment?",
    "What forgotten civilization once thrived here, and what caused its fall?",
    "How did a past war or disaster reshape the world as it is now?",
    "What legendary figure from history still influences modern beliefs?",
    "How do historians disagree about what truly happened in this era?",
    "What secrets lie hidden in old manuscripts, carvings, or artifacts?",
    "How did trade, migration, or exploration shape this region’s past?",
    "What myth or story from this era is actually based on a real event?",
    "How did ancient technology or magic differ from modern practices?",
    "What cultural golden age left behind lasting traditions or inventions?",
    "How do modern people misunderstand or romanticize this historical period?",
    "What long‑buried truth is waiting to be rediscovered?"
],
    culture: [
    "What traditions define this society?",
    "How do beliefs shape daily life here?",
    "What conflicts arise between different cultural groups?",
    "What rituals mark important life events?",
    "How do people celebrate seasonal changes or major holidays?",
    "What symbols or icons hold deep meaning within this culture?",
    "How do elders pass knowledge and stories to younger generations?",
    "What foods, music, or clothing are unique to this society?",
    "How do outsiders view this culture differently from those within it?",
    "What taboos or forbidden practices shape social behavior?",
    "How do art and craftsmanship reflect the values of this people?",
    "What role does religion or spirituality play in everyday life?",
    "How do social classes or roles influence interactions between people?",
    "What cultural heroes or legends inspire the population?",
    "How does this culture adapt when faced with change or outside influence?"
],
    conflict: [
    "What sparked this conflict originally?",
    "Who benefits from the fighting, and who suffers?",
    "How might this struggle reshape the world?",
    "What alliances or betrayals define this war?",
    "What long‑standing tension finally erupted into open conflict?",
    "How do ordinary people survive during this period of unrest?",
    "What leaders or factions are driving the conflict forward?",
    "How do different sides justify their actions or beliefs?",
    "What event could tip the balance and end the struggle?",
    "How has this conflict changed the landscape, cities, or culture?",
    "What rumors or propaganda spread during this time?",
    "How do individuals choose sides, and what pressures influence them?",
    "What unexpected alliances form when survival becomes more important than loyalty?",
    "How does the conflict affect trade, travel, or communication between regions?",
    "What personal stories of courage or loss emerge from this struggle?"
],

    misc: [
    "What deeper meaning might this idea hold?",
    "How could this concept evolve over time?",
    "What consequences might arise from this detail?",
    "Who is most affected by this idea?",
    "How might this idea connect to other parts of the world or story?",
    "What unexpected possibilities could grow from this concept?",
    "How might different characters interpret this idea differently?",
    "What emotions or themes does this idea naturally evoke?",
    "How could this idea become a turning point in the narrative?",
    "What hidden truth might be revealed by exploring this idea further?",
    "How might this idea influence future events or decisions?",
    "What symbolic meaning could this idea take on within the story?",
    "How could this idea be misunderstood or misused?",
    "What questions does this idea raise about the world or its people?",
    "How might this idea change depending on who discovers it?"
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
            `A ${keyword} landscape shaped by extreme conditions`,
            `A region where ${keyword} defines daily survival`,
            `A terrain molded by centuries of ${keyword}`,
            `A place where ${keyword} influences every living creature`,
            `A harsh environment dominated by ${keyword} forces`,
            `A remote area known for its intense ${keyword}`,
            `A world where ${keyword} creates unique challenges`,
            `A land whose identity is rooted in ${keyword}`,
            `A climate shaped by persistent ${keyword} patterns`,
            `A wilderness where ${keyword} determines the rhythm of life`
        ],

        character: [
            `A character whose identity is shaped by ${keyword}`,
            `Someone defined by their deep connection to ${keyword}`,
            `A personality molded through experiences with ${keyword}`,
            `An individual whose greatest challenge involves ${keyword}`,
            `A person whose worldview is influenced by ${keyword}`,
            `A character who draws strength from ${keyword}`,
            `Someone whose past is marked by ${keyword}`,
            `A figure whose destiny is tied to ${keyword}`,
            `A character who fears the consequences of ${keyword}`,
            `An individual whose relationships revolve around ${keyword}`
        ],

        magic: [
            `A magical force rooted in ${keyword}`,
            `An arcane phenomenon shaped by ${keyword}`,
            `A mystical energy connected to ${keyword}`,
            `A spellcraft tradition centered around ${keyword}`,
            `A supernatural effect triggered by ${keyword}`,
            `An enchanted power fueled by ${keyword}`,
            `A magical discipline that studies ${keyword}`,
            `A ritual that channels ${keyword} energies`,
            `A sorcery style influenced by ${keyword}`,
            `A mythic source of magic tied to ${keyword}`
        ],

        conflict: [
            `A conflict driven by ${keyword}`,
            `A struggle centered around ${keyword}`,
            `A tension caused by ${keyword}`,
            `A long‑standing feud rooted in ${keyword}`,
            `A dangerous escalation sparked by ${keyword}`,
            `A rivalry intensified by ${keyword}`,
            `A battle fought over control of ${keyword}`,
            `A dispute fueled by differing views on ${keyword}`,
            `A crisis emerging from ${keyword}`,
            `A war whose origins trace back to ${keyword}`
        ],

        misc: [
            `A general idea involving ${keyword}`,
            `A concept loosely tied to ${keyword}`,
            `An undefined thought about ${keyword}`,
            `A theme subtly influenced by ${keyword}`,
            `An abstract notion connected to ${keyword}`,
            `A creative spark inspired by ${keyword}`,
            `A symbolic idea represented through ${keyword}`,
            `A possibility emerging from ${keyword}`,
            `A detail that hints at ${keyword}`,
            `An element that adds nuance through ${keyword}`
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
