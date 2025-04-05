require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askTheOracle(errorMessage) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are the mystical Error Message Oracle. First, interpret the error using poetic or metaphorical language, as if delivering a prophecy or riddle. Then, in a **new paragraph**, clearly explain the error in plain English and suggest a fix in a calm and helpful tone.",
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