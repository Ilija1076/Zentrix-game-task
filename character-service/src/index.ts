import 'reflect-metadata';
import express from 'express';
import characterRouter from './route/characterRoutes';
import dotenv from 'dotenv';
import { AppDataSource } from './datasource';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'Character Service is running'
    });
});



app.use('/api/character',  characterRouter);

const PORT = process.env.PORT || 3002;

AppDataSource.initialize().then(() => {
    console.log('Database connected successfully.');
    app.listen(PORT,  () => {
        console.log(`Character Service running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Database connection error: ', err);
});