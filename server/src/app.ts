import express from 'express';
import { pool } from './config/db';
import cors from 'cors';
import { env } from './config/env';
import authRouter from './modules/auth/auth.routes';
import blogRouter from './modules/blog/blog.routes';
import bookmarkRouter from './modules/bookmark/bookmark.routes';
import followRouter from './modules/follow/follow.routes';
import userRouter from './modules/user/user.routes';

const app = express();

// // Connect to database
pool.connect().then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.error('Database connection error', err);
});

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/bookmarks', bookmarkRouter);
app.use('/api/follows', followRouter);
app.use('/api/users', userRouter);

// Routes
app.get('/', (_req, res) => {
  res.send('Hello World!');
});



export default app;