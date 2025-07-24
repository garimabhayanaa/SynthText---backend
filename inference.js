const axios = require('axios');
require('dotenv').config();

async function runInference(text, task = 'summarize', tone = 'standard') {
  const prompt = `${capitalize(task)} this text in a ${tone} tone: ${text}`;

  const data = JSON.stringify({
    inputs: prompt,
    parameters: {
      max_length: 200,
      temperature: 0.7
    }
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return response.data[0].generated_text;
  } catch (error) {
    console.error('Inference error:', error.message);
    return 'Something went wrong. Please try again.';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = runInference;
