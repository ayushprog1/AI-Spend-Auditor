import dotenv from 'dotenv';
dotenv.config();

async function checkModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("\n--- AVAILABLE GEMINI MODELS FOR YOUR KEY ---");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(` ${model.name.replace('models/', '')}`);
            }
        });
        console.log("--------------------------------------------\n");
    } catch (error) {
        console.error("Failed to fetch models:", error);
    }
}

checkModels();