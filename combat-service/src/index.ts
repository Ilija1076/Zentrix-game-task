import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'Combat Service is running'
    });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT,  () => {
    console.log(`Combat Service running on port ${PORT}`);
})