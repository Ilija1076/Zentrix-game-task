import 'reflect-metadata';
import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { AppDataSource } from './datasource';
import { User } from './entity/User';

dotenv.config();
console.log('JWT_SECRET in account service:', process.env.JWT_SECRET);
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'Account Service is running'
    });
});



app.post('/register', async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }
  const userRepo = AppDataSource.getRepository(User);
  const existing = await userRepo.findOneBy({ username });
  if (existing) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepo.create({ username, password: hashedPassword, role: role === "gamemaster" ? "gamemaster" : "user" });
  await userRepo.save(user);
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', async (req:Request, res: Response) => {
    const { username, password} = req.body;
    if(!username || !password){
        res.status(400).json({message: 'Username and password are required'});
        return;
    }
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ username });
    if(!user){
        res.status(401).json({message: 'Invalid credentials'});
        return;
    }
    const isPass = await bcrypt.compare(password, user.password);
    if(!isPass){
        res.status(401).json({message: 'Invalid password'});
        return;
    }
    const token = jwt.sign(
        {id: user.id, username: user.username, role: user.role},
        process.env.JWT_SECRET || "secret_secret_jwt",
        {expiresIn: '1h'}
    );
    res.json({token});
});


const PORT = process.env.PORT || 3001;

AppDataSource.initialize().then(() => {
    console.log('Database connected successfully.')
    app.listen(PORT,  () => {
    console.log(`Account Service running on port ${PORT}`);
});
}).catch((err) => {
    console.error('Database connection error: ', err);
});
