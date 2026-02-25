

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
          content: `You are a strict Security Auditor. 
          Return ONLY a JSON object. 
          
          STRICT RULES:
          - If rating is 1-3: Severity MUST be "Critical".
          - If rating is 4-6: Severity MUST be "High".
          - If rating is 7-8: Severity MUST be "Medium".
          
          Example Output:
          {
            "vulnerabilities": [{"type": "SQL Injection", "severity": "Critical", "description": "..."}],
            "rating": 2,
            "suggestions": ["Use parameterized queries"]
          }`
        },
        {
          role: "user",
          content: `Audit this Node.js code: ${code}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0, 
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {    console.error("Groq AI Error:", error);
    throw error; }
};