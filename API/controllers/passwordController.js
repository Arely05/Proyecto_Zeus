import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_RECUPERACION;

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (email, link) => {
  try {
    const mailOptions = {
      from: `"Soporte de Zeus Vet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <h3>Hola</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${link}" target="_blank">${link}</a>
        <br><br>
        <p>Este enlace expirará en 1 hora</p>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Correo de recuperación enviado a ${email}`);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const [results] = await db.query('SELECT id FROM usuario WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.json({ message: 'Si la cuenta existe, se ha enviado un enlace de recuperación.' });
    }

    const userId = results[0].id;
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:4200/reset-password/${token}`;

    await sendEmail(email, resetLink);

    res.json({ message: 'Si la cuenta existe, se ha enviado un enlace de recuperación.' });
  } catch (err) {
    console.error('Error en solicitud de recuperación:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena || nuevaContrasena.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

    const [result] = await db.query('UPDATE usuario SET contrasena = ? WHERE id = ?', [hashedPassword, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Contraseña actualizada con éxito.' });
  } catch (err) {
    console.error('Error en restablecimiento:', err);
    res.status(400).json({ error: 'Token inválido o expirado. Solicita un nuevo enlace.' });
  }
};
