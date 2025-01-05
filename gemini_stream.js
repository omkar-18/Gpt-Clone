import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";


dotenv.config();

// const app = express();

// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function callGemini(question, history) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.google.com/v1/gemini/stream', // Replace with the correct Gemini API endpoint
            data: {
                model: "gemini-1.5-flash",
                prompt: `You are a helpful assistant.\nQuestion: ${question}\nGive me the answer for the question considering my previous Q&A history: ${JSON.stringify(history)}`,
                max_tokens: 150,
                stream: true
            },
            headers: {
                'Authorization': `Bearer ${process.env.GEMENI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'stream'
        });

        response.data.on('data', (chunk) => {
            console.log("Chunk : ",chunk);
        });

        response.data.on('end', () => {
            console.log("End : ", chunk);
        });

    } catch (error) {
        console.log("Error");
        
        console.error(error.response ? error.response.data : error.message);
    }
}


callGemini("Tomorrow is my first day of job at Vayana Ltd Pune, What are the top tips you can share ?", []);