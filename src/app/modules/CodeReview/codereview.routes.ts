import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { CodeReviewControllers } from './codereview.controller';

const router = express.Router();

//code analysis for dev only
router.post(
  '/code', 
  auth(USER_ROLE.user, USER_ROLE.superAdmin), 
  CodeReviewControllers.processCodeReview
);
router.get(
  '/all-reviews', 
  auth( USER_ROLE.superAdmin), 
  CodeReviewControllers.getAllReviews
);
// code review history for dev
router.get(
  '/my-history', 
  auth(USER_ROLE.user, USER_ROLE.superAdmin), 
  CodeReviewControllers.getMyReviews
);

// 
router.get(
  '/analytics', 
  // auth(USER_ROLE.superAdmin,USER_ROLE.user), 
  CodeReviewControllers.getAnalytics
);
// single review details
router.get(
  '/:id', 
  auth(USER_ROLE.user, USER_ROLE.superAdmin), 
  CodeReviewControllers.getSingleReview
);

// isVerified true
router.patch(
  '/verify/:id', 
  auth(USER_ROLE.superAdmin), 
  CodeReviewControllers.verifyReview
);





export const ReviewRoutes = router;