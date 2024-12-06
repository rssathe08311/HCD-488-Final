require('dotenv').config();
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/translate', async (req, res) => {
    const { text, level } = req.body;

    try {
        const prompt = `
            Adjust the following text to match the reading level of a ${level}:
            ${text}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: `You are a helpful assistant.` },
                { role: "user", content: prompt },
            ],
            max_tokens: 1000,
        });

        // Extract translated text from the response
        const translatedText = response.choices[0].message.content.trim();
        res.json({ translatedText });
    } catch (err) {
        console.error('Error', err.message);
        res.status(500).json({ error: 'Failed to translate the text' });
    }
});

module.exports = router;
