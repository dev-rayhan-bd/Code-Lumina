

// import { groq } from "../../config/ai.config";




// export const analyzeCodeWithAI = async (code: string) => {
//   try {
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: "You are a professional Node.js security auditor. Return the analysis strictly in JSON format."
//         },
//         {
//           role: "user",
//           content: `Analyze this code and return JSON with keys: 
//           "vulnerabilities" (array with type, severity, description), 
//           "rating" (0-10), 
//           "suggestions" (array). 
          
//           Code: ${code}`
//         }
//       ],
//       model: "llama-3.3-70b-versatile",
//       response_format: { type: "json_object" }
//     });

//     const responseText = chatCompletion.choices[0]?.message?.content;
//     return JSON.parse(responseText || "{}");
//   } catch (error) {
//     console.error("Groq AI Error:", error);
//     throw error;
//   }
// };

import { groq } from "../../config/ai.config";

export const analyzeCodeWithAI = async (code: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Security Auditor. 
          Return ONLY a JSON object.
          {
            "vulnerabilities": [{"type": "...", "severity": "...", "description": "..."}],
            "rating": number (1-10),
            "suggestions": ["..."]
          }`
        },
        {
          role: "user",
          content: `Analyze this Node.js code for security: ${code}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, 
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {    console.error("Groq AI Error:", error);
    throw error; }
};