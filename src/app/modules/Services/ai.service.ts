

// import { groq } from "../../config/ai.config";

// export const analyzeCodeWithAI = async (code: string) => {
//   try {
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: `You are a strict Security Auditor.
           
//           Return ONLY a JSON object. 
          
//           STRICT RULES:
//           - If rating is 1-3: Severity MUST be "Critical".
//           - If rating is 4-6: Severity MUST be "High".
//           - If rating is 7-8: Severity MUST be "Medium".
          
//           Example Output:
//           {
//             "vulnerabilities": [{"type": "SQL Injection", "severity": "Critical", "description": "..."}],
//             "rating": 2,
//             "suggestions": ["Use parameterized queries"]
//           }`
//         },
//         {
//           role: "user",
//           content: `Audit this Node.js code: ${code}`
//         }
//       ],
//       model: "llama-3.3-70b-versatile",
//       temperature: 0, 
//       response_format: { type: "json_object" }
//     });

//     return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
//   } catch (error) {    console.error("Groq AI Error:", error);
//     throw error; }
// };

import { groq } from "../../config/ai.config";

export const analyzeCodeWithAI = async (code: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a strict Node.js Security Auditor. 
          
          TASK:
          1. Detect if the input is a valid JavaScript/Node.js code snippet.
          2. If NOT valid code (e.g. random text, sentences, garbage), return exactly:
             {"vulnerabilities": [], "rating": 10, "suggestions": ["Invalid input. Please provide valid code."]}
          
          3. If it IS valid code, perform a deep security audit for vulnerabilities (SQLi, XSS, etc).
          
          STRICT RULES:
          - If rating is 1-3: Severity MUST be "Critical".
          - If rating is 4-6: Severity MUST be "High".
          - If rating is 7-8: Severity MUST be "Medium".
          - Return output strictly in valid JSON format.`
        },
        {
          role: "user",
          content: `Audit this input: ${code}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0, // Deterministic results for research reliability
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw error;
  }
};