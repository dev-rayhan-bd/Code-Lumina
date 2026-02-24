import { Schema, model } from 'mongoose';

const codeReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  codeSnippet: { type: String, required: true },
  modelName: { type: String, required: true },
  analysis: {
    vulnerabilities: [{ type: Object }],
    rating: { type: Number },
    suggestions: [String]
  },
  groundTruth: { 
    type: String, 
    enum: ['Safe', 'Vulnerable'], 
    required: true 
  },
  classification: { 
    type: String, 
    enum: ['TP', 'TN', 'FP', 'FN'],
    required: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export const CodeReviewModel = model('CodeReview', codeReviewSchema);