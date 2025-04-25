import express from 'express';
import { connectDB } from '@config/db';
import dotenv from 'dotenv';
import { setupSwagger } from '@config/swagger';
import v1Routes from './routes/v1';

dotenv.config();
const app = express();

app.use(express.json());
connectDB();
setupSwagger(app);
app.use(v1Routes);

export default app;
