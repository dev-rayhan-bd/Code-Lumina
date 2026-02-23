import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { analyzeCodeWithAI } from "../Services/ai.service";
import { CodeReviewModel } from "./codereview.model";
import { CodeReviewServices } from "./codereview.sevices";

// for code review and save on db
const processCodeReview = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.body;

  
  const aiResult = await analyzeCodeWithAI(code);


  const savedData = await CodeReviewModel.create({
    user: req.user?.userId,
    codeSnippet: code,
    modelName: "Llama-3.3-70b (Groq)", 
    analysis: aiResult,
    status: 'analyzed' // default status
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AI Analysis Completed!",
    data: savedData,
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

// review status update after comparing ai given result for detecting Accuracy ,this is the part for thesis
const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await CodeReviewModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review status updated successfully",
    data: result,
  });
});

export const CodeReviewControllers = {
  processCodeReview,
  getMyReviews,
  getSingleReview,
  updateReviewStatus,
  getAllReviews
};