import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import characterRouter from './route/characterRoutes';
import itemRouter from './route/itemRoutes';
import dotenv from 'dotenv';
import { AppDataSource } from './datasource';

console.log("Running from file:", __filename);
dotenv.config();
console.log('JWT_SECRET in character service:', process.env.JWT_SECRET);

const app = express();

app.use(express.json());
app.use('/api/character', characterRouter);
app.use('/api/items', itemRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'Character Service is running' });
});

const PORT = process.env.PORT || 3002;
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected successfully.');
      app.listen(PORT, () => {
        console.log(`Character Service running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection error: ', err);
    });
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err && err.message });
});

export { app };