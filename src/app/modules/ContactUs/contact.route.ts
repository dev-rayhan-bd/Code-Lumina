/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';


import { contactControllers } from './contact.controller';
import { USER_ROLE } from '../Auth/auth.constant';
import auth from '../../middleware/auth';



const router = express.Router();


    
router.post('/send-message',  auth(USER_ROLE.user, USER_ROLE.superAdmin),contactControllers.sendMessage)


export const ContactRoutes = router;
