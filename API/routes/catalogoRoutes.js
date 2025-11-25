import express from 'express';
import { 
    obtenerProductos, 
    obtenerTodosProductos, 
    actualizarStock, 
    actualizarProductoCompleto, 
    crearProducto,
    cambiarEstadoProducto 
} from '../controllers/catalogoController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.get('/producto', obtenerProductos); 
router.get('/producto-admin', obtenerTodosProductos);
router.put('/update-stock', actualizarStock);
router.put('/update-status', cambiarEstadoProducto);
router.put('/update-full', upload.single('imagen'), actualizarProductoCompleto);
router.post('/create', upload.single('imagen'), crearProducto);

export default router;