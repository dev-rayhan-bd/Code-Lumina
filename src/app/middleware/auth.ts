import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config'; 
import { TUserRole } from '../modules/User/user.interface';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { verifyToken } from '../modules/Auth/auth.utils';
import { UserModel } from '../modules/User/user.model';


const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const decodedUser = verifyToken(token, config.jwt_access_secret as Secret);
    const { role, userId } = decodedUser;
    
 
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

  
    if (user.status === 'pending') {
      throw new AppError(
        httpStatus.FORBIDDEN, 
        'Your account is pending admin approval. You cannot access this feature yet.'
      );
    }


    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account is blocked by admin!');
    }

    if (requiredRoles && !requiredRoles.includes(role as TUserRole)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    req.user = decodedUser as JwtPayload & { role: string };
    next();
  });
};
export default auth;
