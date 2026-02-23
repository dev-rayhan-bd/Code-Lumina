import Groq from "groq-sdk";
import config from ".";


const groq_key = config.groq_api_key 

export const groq = new Groq({
  apiKey: groq_key,
});