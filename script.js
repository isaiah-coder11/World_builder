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
        .replace(/[^a-z0-9 ]/g, "")
        .split(" ")
        .filter(word => word.length > 2 && !ignore.includes(word));
}

function clusterKeywords(keywords) {
    const clusters = {};

    keywords.forEach(word => {
        const firstLetter = word[0];
        if (!clusters[firstLetter]) clusters[firstLetter] = [];
        clusters[firstLetter].push(word);
    });

    return clusters;
}

function findMainCluster(clusters) {
    let biggest = null;
    let size = 0;

    for (const key in clusters) {
        if (clusters[key].length > size) {
            size = clusters[key].length;
            biggest = clusters[key];
        }
    }

    return biggest;
}

function formatMindMap(userMsg, botMsg) {
    const allText = userMsg + " " + botMsg;

    const keywords = extractKeywords(allText);
    const clusters = clusterKeywords(keywords);
    const mainCluster = findMainCluster(clusters);

    const title = mainCluster[0].toUpperCase() + " — IDEA SNAPSHOT";

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

