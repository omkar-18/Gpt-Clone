import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";


dotenv.config();

const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// const openai = new OpenAI({apiKey: GPT_API_KEY});

app.get('/health', (_, res) => {
    res.send('Server is up and healthy 🚀');
})

app.post('/askGpt/:userId', async (req, res) => {    
    const userId = req.params.userId;
    const question = req.body.question;
    const history = req.body.history;

    if (!question) {
        return res.status(400).send('Question is required, PLs provide the same');
    }

    try {
        // const completion = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         { role: "system", content: "You are a helpful assistant." },
        //         {
        //             role: "user",
        //             content: question,
        //         },
        //     ],
        // });
        
        // console.log("MOdel response : ",completion.choices[0].message);
        
        const prompt = `You are a helpful assistant.\nquestion ${question} \n give me the answer for question considering my prevoius qna history ${JSON.stringify(history)}`;
        const result = await model.generateContent(prompt);
        res.json({
            userId: userId,
            question: question,
            answer: result.response.text()
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error calling GPT API');
    }
});

app.listen(3000, () => {
  console.log('Server is up and running on port 3000  🚀');
});