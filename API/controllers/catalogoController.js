import db from '../config/db.js';

export const obtenerProductos = async (req, res) => { 
    const sql = 'SELECT * FROM producto WHERE activo = 1'; 
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        return res.status(500).json({ error: 'Error al obtener productos.' });
    }
};

export const obtenerTodosProductos = async (req, res) => { 
    const sql = 'SELECT * FROM producto'; 
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener inventario:', err);
        return res.status(500).json({ error: 'Error al obtener inventario.' });
    }
};

export const actualizarStock = async (req, res) => {
    const { id, stock } = req.body;
    try {
        const sql = "UPDATE producto SET stock = ? WHERE id = ?";
        const [result] = await db.query(sql, [stock, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Stock actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar stock:', err);
        return res.status(500).json({ error: 'Error al actualizar el stock.' });
    }
};

export const cambiarEstadoProducto = async (req, res) => {
    const { id, activo } = req.body; 
    try {
        const sql = "UPDATE producto SET activo = ? WHERE id = ?";
        const [result] = await db.query(sql, [activo, id]);//el campito activo define si se puede ver o no un producto en el catalogo
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Estado actualizado correctamente' });
    } catch (err) {
        console.error('Error al cambiar estado:', err);
        return res.status(500).json({ error: 'Error al actualizar estado.' });
    }
};

//editamos todo la informacion de producto
export const actualizarProductoCompleto = async (req, res) => {
    const { id, nombre, descripcion, precio, stock } = req.body;
    let { imagen } = req.body; 

    if (req.file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        imagen = `${baseUrl}/uploads/${req.file.filename}`;
    }

    try {
        const sql = "UPDATE producto SET nombre=?, descripcion=?, precio=?, imagen=?, stock=? WHERE id=?";
        const [result] = await db.query(sql, [nombre, descripcion, precio, imagen, stock, id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto actualizado correctamente', nuevaImagen: imagen });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        return res.status(500).json({ error: 'Error interno al actualizar producto.' });
    }
};

export const crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    let imagen = ''; 

    if (req.file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        imagen = `${baseUrl}/uploads/${req.file.filename}`;
    }

    try {
        const sql = "INSERT INTO producto (nombre, descripcion, precio, imagen, stock, activo) VALUES (?, ?, ?, ?, ?, 1)";
        const [result] = await db.query(sql, [nombre, descripcion, precio, imagen, stock]);

        res.status(201).json({ message: 'Producto creado correctamente', id: result.insertId });
    } catch (err) {
        console.error('Error al crear producto:', err);
        return res.status(500).json({ error: 'Error interno al crear producto.' });
    }
};