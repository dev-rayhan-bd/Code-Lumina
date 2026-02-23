import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

import { CodeReviewModel } from "../CodeReview/codereview.model";
import sendResponse from "../../utils/sendResponse";
import { analyzeCodeWithAI } from "../Services/ai.service";



const processCodeReview = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.body;

  // analysys using ai
const aiResult = await analyzeCodeWithAI(code);
  //save data
  const savedData = await CodeReviewModel.create({
    user: req.user?.userId,
    codeSnippet: code,
     modelName: "Llama-3.3-70b (Groq)",
    analysis: aiResult
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AI Analysis Completed!",
    data: savedData,
  });
});

export const ReviewControllers = { processCodeReview };