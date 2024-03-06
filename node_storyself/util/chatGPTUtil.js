const ss = require("@ss");
const { OpenAI } = require("openai");
const fs = require("fs");
var pattern3 = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글

const openai = new OpenAI({
  apiKey: ss.configs.apiServer.openaiApiKey
});

const ask = async (content) => {
  if(!pattern3.test(content)) return content;
  const system = JSON.parse(fs.readFileSync(`${__dirname}/../data/chatgpt.json`));
  
  const messages = [
    system,
    { role: 'user', content },
  ]

  const response = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo'
  })
  
  try {
    const { role, content } = response.choices[0].message;
    return content;
  } catch {
    return "error"
  }
}

module.exports = { ask }