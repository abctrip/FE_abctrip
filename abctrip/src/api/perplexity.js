import axios from 'axios';

const API_URL = 'https://api.perplexity.ai/chat/completions';
const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

const sendChatMessage = (messages, success, fail) => {
  axios.post(API_URL, 
    {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  .then(success)
  .catch(fail);
};

export { sendChatMessage };