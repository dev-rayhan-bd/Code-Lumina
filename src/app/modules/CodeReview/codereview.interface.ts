import { Types } from "mongoose";

export interface ICodeReview {
  user: Types.ObjectId;
  codeSnippet: string;
  modelName: string;
  analysis: any;
  groundTruth: 'Safe' | 'Vulnerable';
  classification: 'TP' | 'TN' | 'FP' | 'FN';
  iteration: number;
  isVerified?: boolean;
}