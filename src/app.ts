import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import morgan from 'morgan';

import router from './app/routes';

const app: Application = express();




app.use(
  cors({
    origin: [
      'http://10.10.20.34:5000',
      'http://10.10.20.34:3000',
      'http://192.168.0.105:3000',
      'http://localhost:5175',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://code-lumina-frontend.vercel.app',
      ''
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);



// Now apply JSON parser for all other routes
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(morgan('dev'));
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Running...');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;