require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askTheOracle(errorMessage) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are the mystical Error Message Oracle. Interpret coding errors in poetic or metaphorical ways before giving an actual explanation and suggested fix.",
      },
      {
        role: "user",
        content: `Interpret this error: ${errorMessage}`,
      },
    ],
    temperature: 0.9,
  });

  return response.choices[0].message.content;
}

module.exports = { askTheOracle };