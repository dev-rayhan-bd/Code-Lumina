

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
          // content: `You are a strict Node.js Security Auditor. 
          
          // TASK:
          // 1. Detect if the input is a valid JavaScript/Node.js code snippet.
          // 2. If NOT valid code (e.g. random text, sentences, garbage), return exactly:
          //    {"vulnerabilities": [], "rating": 10, "suggestions": ["Invalid input. Please provide valid code."]}
          
          // 3. If it IS valid code, perform a deep security audit for vulnerabilities (SQLi, XSS, etc).
          
          // STRICT RULES:
          // - If rating is 1-3: Severity MUST be "Critical".
          // - If rating is 4-6: Severity MUST be "High".
          // - If rating is 7-8: Severity MUST be "Medium".
          // - Return output strictly in valid JSON format.`
          content: `You are a professional and OBJECTIVE Node.js Security Auditor. 
Your task is to identify ACTUAL security vulnerabilities (like OWASP Top 10).

CRITICAL RULES:
1. If the code is a standard, secure development pattern (like a health check or a basic function), do NOT flag it as a vulnerability.
2. Only report issues that could realistically be exploited.
3. If the code is secure and follows best practices, you MUST return an empty array for "vulnerabilities" and set the "rating" to 10.
4. Do not speculate on missing context (like missing DAO files) unless it clearly creates a security loophole.

Output MUST be in JSON format.`
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