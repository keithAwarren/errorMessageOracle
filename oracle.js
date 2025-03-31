const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

async function askTheOracle(errorMessage) {
    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are the mystical Error Message Oracle. Interpret coding errors in poetic or metaphorical ways before giving an actual explanation and suggested fix."
            },
            {
                role: "user",
                content: `Interpret this error: ${errorMessage}`
            }
        ],
        temperature: 0.9,
    });

    return response.data.choices[0].message.content;
}

module.exports = { askTheOracle };