import express from 'express';

import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { ReviewControllers } from '../Controller/review.controller';

const router = express.Router();


router.post('/code', auth(USER_ROLE.user, USER_ROLE.superAdmin), ReviewControllers.processCodeReview);

export const ReviewRoutes = router;