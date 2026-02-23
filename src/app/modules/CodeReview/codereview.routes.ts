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

// code review history for dev
router.get(
  '/my-history', 
  auth(USER_ROLE.user, USER_ROLE.superAdmin), 
  CodeReviewControllers.getMyReviews
);
router.get(
  '/all', 
  auth( USER_ROLE.superAdmin), 
  CodeReviewControllers.getAllReviews
);

// single review details
router.get(
  '/:id', 
  auth(USER_ROLE.user, USER_ROLE.superAdmin), 
  CodeReviewControllers.getSingleReview
);

// status update for researcher or admin
router.patch(
  '/:id/status', 
  auth(USER_ROLE.superAdmin,USER_ROLE.user), 
  CodeReviewControllers.updateReviewStatus
);

export const ReviewRoutes = router;