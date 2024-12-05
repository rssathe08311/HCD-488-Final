require('dotnev').config();
const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/translate', async (req, res) => {
    const {text, level} = req.body;

    try {
        const prompt = `
            Adjust the following text to match the reading level of a ${level}:
            ${text}`;

        const response = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: `You are a helpful assistant.` },
                { role: "user", content: prompt}
            ],
            max_tokens: 1000,
        });

        //cleans up the format of the response
        const translatedText = response.data.choices[0].text.trim();
        res.json({ translatedText });
    } catch (err) {
        console.error('Error', err.message);
        res.status(500).json({ error: 'Failed to translate the text' });
    }
});

module.exports = router;