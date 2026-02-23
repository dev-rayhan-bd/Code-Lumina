import { Schema, model } from 'mongoose';

const codeReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  codeSnippet: { type: String, required: true },
  modelName: { type: String},
  analysis: {
    vulnerabilities: [{ type: Object }], // bugs find by ai
    rating: Number, // give marking out of 10
    suggestions: [String]
  },
  iteration: { type: Number, default: 1 }, //total iteration for Reliability check
}, { timestamps: true });

export const CodeReviewModel = model('CodeReview', codeReviewSchema);