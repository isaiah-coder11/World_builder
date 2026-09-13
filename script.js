/* ============================================================
   CHATBOT MEMORY
   ============================================================ */

let memory = [];


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

    if (keywords.length > 0) {
        const key = keywords[Math.floor(Math.random() * keywords.length)];
        return `What deeper meaning might **${key}** hold for the people in your world?`;
    }

    const prompts = [
        "What deeper meaning might this element hold for the people who live in your world?",
        "How does this detail influence the relationships between different groups or cultures?",
        "What assumptions are you making about this part of your world, and what happens if you challenge them?",
        "How would this concept evolve over centuries of change?",
        "What hidden consequences might arise from this idea?"
    ];
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


/* ============================================================
   KEYWORD EXTRACTION
   ============================================================ */

function extractKeywords(text) {
    const ignore = ["the", "and", "a", "an", "is", "are", "was", "were", "to", "of", "in", "on", "with", "for", "that"];

    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\uFEFF]/g, "")
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length > 2 && !ignore.includes(w));
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

function clusterKeywords(keywords) {
    const clusters = {};

    keywords.forEach(word => {
        let found = false;

        for (const group in semanticGroups) {
            if (semanticGroups[group].includes(word)) {
                if (!clusters[group]) clusters[group] = [];
                clusters[group].push(word);
                found = true;
                break;
            }
        }

        if (!found) {
            if (!clusters.misc) clusters.misc = [];
            clusters.misc.push(word);
        }
    });

    return clusters;
}

function findMainCluster(clusters) {
    let biggestGroup = "misc";
    let biggestSize = 0;

    for (const group in clusters) {
        if (clusters[group].length > biggestSize) {
            biggestSize = clusters[group].length;
            biggestGroup = group;
        }
    }

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
    keywords.forEach(k => {
        bullets += "• " + k + "\n";
    });

    return (
        "╔════════════════════════════════╗\n" +
        `║   ${title}\n` +
        "╚════════════════════════════════╝\n\n" +
        bullets +
        "---------------------------------\n\n"
    );
}
