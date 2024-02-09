const ss = require("@ss");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: ss.configs.apiServer.openaiApiKey
});

const ask = async (content) => {
  const messages = [
    { role: 'system', content: "You should translate Korean to English. If it English just repeat. It can be wrote by child so it could be mistaken words. please translate into the English word that sounds most similar to the Korean pronunciation and is most similar in meaning.  If there is only one consonant in a specific position, it might be a final consonant on the preceding character." },
    { role: 'user', content },
  ]

  const response = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo'
  })
  
  try {
    const { role, content } = response.choices[0].message;
    return content
  } catch {
    return "error"
  }
  
  
}

module.exports = { ask }