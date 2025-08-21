const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generatePosts(description) {
    try {
        const prompt = `
Masz opis: "${description}".
Stwórz kreatywne posty dostosowane do każdej platformy:
Facebook, Instagram, TikTok, LinkedIn.
Dodaj popularne hashtagi i call to action.
Zwróć wynik w formacie JSON:
{
  "facebook": "...",
  "instagram": "...",
  "tiktok": "...",
  "linkedin": "..."
}
        `;
        const response = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });
        const text = response.data.choices[0].message.content;
        return JSON.parse(text);
    } catch (err) {
        if (err.response && err.response.status === 429) {
            return { error: "Limit 429", resetTime: err.response.headers['x-ratelimit-reset'] || 60 };
        }
        throw err;
    }
}

async function generateImage(description) {
    try {
        const response = await openai.createImage({
            prompt: description,
            n: 1,
            size: "512x512"
        });
        return response.data.data[0].url;
    } catch (err) {
        if (err.response && err.response.status === 429) {
            return { error: "Limit 429", resetTime: err.response.headers['x-ratelimit-reset'] || 60 };
        }
        throw err;
    }
}

module.exports = { generatePosts, generateImage };
