import QueryBuilder from "../../builder/QueryBuilder";
import { CodeReviewModel } from "./codereview.model";



const getAllReviewsFromDB = async (userId: string, query: Record<string, unknown>) => {
  const queryObj = { ...query };
  const filters: any = { user: userId };

  //  isVerified 
  if (queryObj.isVerified !== undefined) {
    filters.isVerified = queryObj.isVerified === 'true'; 
  }

  // confussion matrix Classification  (TP, TN, FP, FN)
  if (queryObj.classification) {
    filters.classification = queryObj.classification;
  }

  

  //  Severity (Nested Path)
  if (queryObj.severity) {
    filters['analysis.vulnerabilities.severity'] = queryObj.severity;
  }

  const excludeFields = ['isVerified', 'classification', 'status', 'severity'];
  excludeFields.forEach((el) => delete queryObj[el]);

  const modelQuery = CodeReviewModel.find(filters);

  const reviewQuery = new QueryBuilder(modelQuery, queryObj)
    .search(['codeSnippet', 'modelName']) 
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return { meta, result };
};


const getAllReviewsForAdminFromDB = async (query: Record<string, unknown>) => {

  const modelQuery = CodeReviewModel.find().populate('user', 'firstName lastName email');


  const reviewQuery = new QueryBuilder(modelQuery, query)
    .search(['modelName', 'status', 'codeSnippet'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return { meta, result };
};

const getSingleReviewFromDB = async (id: string) => {
  const result = await CodeReviewModel.findById(id);
  return result;
};



// analytics

const getAnalyticsFromDB = async () => {
  const stats = await CodeReviewModel.aggregate([
    {
      $group: {
        _id: "$classification",
        count: { $sum: 1 }
      }
    }
  ]);

  //set default value
  const data = { TP: 0, TN: 0, FP: 0, FN: 0 };
  stats.forEach(item => {
    if (item._id) data[item._id as keyof typeof data] = item.count;
  });

  const total = data.TP + data.TN + data.FP + data.FN;

  //  (Division by zero )
  const accuracy = total > 0 ? (data.TP + data.TN) / total : 0;
  const precision = (data.TP + data.FP) > 0 ? data.TP / (data.TP + data.FP) : 0;
  const recall = (data.TP + data.FN) > 0 ? data.TP / (data.TP + data.FN) : 0;
  
  // F1 Score 
  const f1Score = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

  return {
    counts: data,
    metrics: {
      accuracy: (accuracy * 100).toFixed(2) + "%",
      precision: (precision * 100).toFixed(2) + "%",
      recall: (recall * 100).toFixed(2) + "%",
      f1Score: (f1Score * 100).toFixed(2) + "%",
      totalSamples: total
    }
  };
};


const verifyReviewInDB = async (id: string) => {
  const result = await CodeReviewModel.findByIdAndUpdate(
    id,
    { isVerified: true }, 
    { 
      new: true, 
      runValidators: true 
    }
  );
  return result;
};





export const CodeReviewServices = {
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  getAllReviewsForAdminFromDB,
  getAnalyticsFromDB,verifyReviewInDB
};