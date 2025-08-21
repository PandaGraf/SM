import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import imageRoutes from './routes/images.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
