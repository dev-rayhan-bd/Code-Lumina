import { Schema, model } from 'mongoose';

const codeReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  codeSnippet: { type: String, required: true },
  modelName: { type: String, required: true },
  analysis: {
    vulnerabilities: [{ 
      type: { type: String }, // issue like SQL Injection 
      severity: { type: String }, // like High, Medium
      description: { type: String }
    }],
    rating: { type: Number },
    suggestions: [String]
  },
  iteration: { type: Number, default: 1 }, //for checking Reliability 
  status: { 
    type: String, 
    enum: ['analyzed', 'verified', 'false_positive'], 
    default: 'analyzed' 
  },
}, { timestamps: true });

export const CodeReviewModel = model('CodeReview', codeReviewSchema);