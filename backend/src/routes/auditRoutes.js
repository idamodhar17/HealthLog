import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

router.get("/", authMiddleware, getAuditLogs);

export default router;