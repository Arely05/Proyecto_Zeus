import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/request', requestPasswordReset);
router.post('/reset/:token', resetPassword);

export default router;
