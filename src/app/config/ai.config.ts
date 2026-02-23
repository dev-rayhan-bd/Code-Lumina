// src/app/config/ai.config.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "./index";

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

export const googleModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" } // for json output
});