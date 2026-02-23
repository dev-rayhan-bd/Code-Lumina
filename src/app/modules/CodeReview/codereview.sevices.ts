import QueryBuilder from "../../builder/QueryBuilder";
import { CodeReviewModel } from "./codereview.model";

const getAllReviewsFromDB = async (userId: string, query: Record<string, unknown>) => {
  const queryObj = { ...query };


  if (queryObj.severity) {
    queryObj['analysis.vulnerabilities.severity'] = queryObj.severity;
    delete queryObj.severity; 
  }

  if (queryObj.rating) {
    queryObj['analysis.rating'] = queryObj.rating;
    delete queryObj.rating;
  }

  if (queryObj.type) {
    queryObj['analysis.vulnerabilities.type'] = queryObj.type;
    delete queryObj.type;
  }


  const modelQuery = CodeReviewModel.find({ user: userId });

  const reviewQuery = new QueryBuilder(modelQuery, queryObj) 
    .search(['modelName', 'status']) 
    .filter() 
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

export const CodeReviewServices = {
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  getAllReviewsForAdminFromDB
};