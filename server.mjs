import fs from 'fs/promises';
import dotenv from 'dotenv';
import OpenAI from "openai";
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static HTML page
app.use(express.static('public'));

app.get('/original', async (req, res) => {
    try {
        const text = await fs.readFile('essay.txt', 'utf8');
        res.json({ originalText: text });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "There was an error retrieving the original essay." });
    }
})

// Endpoint to process the form and adjust reading level
app.post('/adjust', async (req, res) => {
    const { readingLevel } = req.body;

    try {
        const text = await fs.readFile('essay.txt', 'utf8');

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an editor that simplifies text to a specific reading level." },
                { role: "user", content: `Simplify this text to a ${readingLevel} reading level while somewhat retaining its length:\n\n${text}` },
            ],
        });

        const adjustedText = response.choices[0].message.content;

        res.json({ 
            readingLevel, 
            adjustedText 
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("There was an error processing your request.");
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
