import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import catalogoRoutes from './routes/catalogoRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import paymentRoutes from './routes/paymentRoutes.js'; 
import passwordRoutes from './routes/passwordRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/catalogo', catalogoRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/payment', paymentRoutes);
app.use('/api/password', passwordRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));