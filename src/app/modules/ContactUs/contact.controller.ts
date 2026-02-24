/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';  
import httpStatus from 'http-status';

import AppError from '../../errors/AppError';
import config from '../../config';

import { UserModel } from '../User/user.model'; 

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.userId; 

 
    const user = await UserModel.findById(userId);
    
    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    const senderEmail = user.email; 

    if (!subject || !message) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Subject and message are required.',
      });
      return;
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${user.firstName}" <${config.SMTP_USER}>`, 
      to: config.SMTP_USER,
      replyTo: senderEmail,
      subject: `[Contact Form] ${subject}`,
      text: `Message from ${user.firstName} ${user.lastName} (${senderEmail}):\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Message sent successfully!',
    });

  } catch (error: any) {
    console.error('Email Error:', error); 
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error sending email.',
      error: error.message
    });
  }
};

export const contactControllers = { sendMessage };
