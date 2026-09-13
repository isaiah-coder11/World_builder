/* CHATBOT LOGIC */
function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    const questionTriggers = ["?", "who", "what", "where", "when", "how", "why"];
    const isQuestion = questionTriggers.some(trigger => msg.includes(trigger));

    if (isQuestion) {
        return guidingAdvice();
    } else {
        return socraticPrompt();
    }
}

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

function socraticPrompt() {
    const prompts = [
        "What deeper meaning might this element hold for the people who live in your world?",
        "How does this detail influence the relationships between different groups or cultures?",
        "What assumptions are you making about this part of your world, and what happens if you challenge them?",
        "How would this concept evolve over centuries of change?",
        "What hidden consequences might arise from this idea?"
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
}

/* ⭐ KEEPER VARIABLES ⭐ */
let lastUserMessage = "";
let lastBotMessage = "";

/* ⭐ KEEPER FUNCTIONS ⭐ */
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

/* ⭐ KEYWORD + CLUSTER SYSTEM ⭐ */

function extractKeywords(text) {
    const ignore = ["the", "and", "a", "an", "is", "are", "was", "were", "to", "of", "in", "on", "with", "for", "that"];

    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\uFEFF]/g, "") // remove ALL invisible chars
        .replace(/[^\w\s]/g, " ")               // punctuation → space
        .split(/\s+/)                           // split on any whitespace
        .map(w => w.trim())
        .filter(w => w.length > 2 && !ignore.includes(w));
}




/* ⭐ SEMANTIC CLUSTERING ⭐ */

const semanticGroups = {
    environment: ["tundra", "winter", "cold", "snow", "ice", "climate", "forest", "desert", "mountain"],
    history: ["ancient", "old", "past", "event", "change", "era", "age", "ruins"],
    magic: ["magic", "spell", "energy", "power", "mystic", "arcane", "crystal"],
    culture: ["tribe", "people", "ritual", "belief", "custom", "tradition"],
    conflict: ["war", "battle", "fight", "enemy", "danger", "threat"],
    emotion: ["fear", "hope", "love", "anger", "sad", "joy"]
};
// Normalize dictionary words so they match normalized extracted keywords
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

        // If no semantic group found, put it in "misc"
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


function formatMindMap(userMsg, botMsg) {
    const allText = userMsg + " " + botMsg;

    const keywords = extractKeywords(allText);
    keywords.forEach(k => console.log("WORD:", k, "CODES:", [...k].map(c => c.charCodeAt(0))));
    const clusters = clusterKeywords(keywords);
    const main = findMainCluster(clusters);

    const title = main.name.toUpperCase() + " — IDEA SNAPSHOT";

    let bullets = "";
    keywords.forEach(k => {
        bullets += "• " + k + "\n";
    });

    return (
        "=========================\n" +
        title + "\n\n" +
        bullets +
        "=========================\n\n"
    );
}