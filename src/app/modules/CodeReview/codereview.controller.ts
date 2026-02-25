import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { analyzeCodeWithAI } from "../Services/ai.service";
import { CodeReviewModel } from "./codereview.model";
import { CodeReviewServices } from "./codereview.sevices";
import AppError from "../../errors/AppError";

// for code review and save on db


// const processCodeReview = catchAsync(async (req: Request, res: Response) => {
//   const { code, groundTruth } = req.body;

//   //  AI analysys
//   const aiResult = await analyzeCodeWithAI(code);
//   const aiFoundBugs = aiResult.vulnerabilities && aiResult.vulnerabilities.length > 0;

//   // ২. Confusion Matrix Logic (Auto-Classification)
//   let classification: 'TP' | 'TN' | 'FP' | 'FN';
//   if (groundTruth === 'Vulnerable') {
//     classification = aiFoundBugs ? 'TP' : 'FN';
//   } else {
//     classification = aiFoundBugs ? 'FP' : 'TN';
//   }

 
//   const savedData = await CodeReviewModel.create({
//     user: req.user?.userId,
//     codeSnippet: code,
//     modelName: "Llama-3.3-70b (Groq)",
//     analysis: aiResult,
//     groundTruth,
//     classification
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `Analysis Completed! Classified as ${classification}`,
//     data: savedData,
//   });
// });
// codereview.controller.ts

const processCodeReview = catchAsync(async (req: Request, res: Response) => {
  const { code, groundTruth } = req.body;
  const userId = req.user?.userId;
  if (!code || code.trim().length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have to submit your code.");
  }
  if ( code.trim().length < 5) {
    throw new AppError(httpStatus.BAD_REQUEST, "Input is too short to be analyzed.");
  }
  const lastAudit = await CodeReviewModel.findOne({ 
    user: userId, 
    codeSnippet: code 
  }).sort({ createdAt: -1 }).lean(); 


  const iteration = lastAudit ? lastAudit.iteration + 1 : 1;


  const aiResult = await analyzeCodeWithAI(code);
// solid data normalization for prevent ui errors and ensure consistent DB entries
 const vulnerabilities = aiResult.vulnerabilities || [];
  const rating = Number(aiResult.rating) || 10;
  const suggestions = aiResult.suggestions || [];

  const aiFoundBugs = aiResult.vulnerabilities && aiResult.vulnerabilities.length > 0;

  // Classification Logic
  let classification: 'TP' | 'TN' | 'FP' | 'FN';
  if (groundTruth === 'Vulnerable') {
    classification = aiFoundBugs ? 'TP' : 'FN';
  } else {
    classification = aiFoundBugs ? 'FP' : 'TN';
  }


  const savedData = await CodeReviewModel.create({
    user: userId,
    codeSnippet: code,
    modelName: "Llama-3.3-70b (Groq)",
    analysis: {
      vulnerabilities,
      rating,
      suggestions
    },
    groundTruth,
    classification,
    iteration
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Audit Success!",
    data: savedData,
  });
});
// analytics
const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await CodeReviewServices.getAnalyticsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Research metrics retrieved successfully",
    data: result,
  });
});


//code review history
const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await CodeReviewServices.getAllReviewsFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review history retrieved successfully",
    data: result,
  });
});
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await CodeReviewServices.getAllReviewsForAdminFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review history retrieved successfully",
    data: result,
  });
});

//single code review
const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CodeReviewServices.getSingleReviewFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review details retrieved successfully",
    data: result,
  });
});

const verifyReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await CodeReviewServices.verifyReviewInDB(id as string);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Review record not found!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review verified successfully",
    data: result,
  });
});

export const CodeReviewControllers = {
  processCodeReview,
  getMyReviews,
  getSingleReview,
  verifyReview,
  getAllReviews,getAnalytics
};