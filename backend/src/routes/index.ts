import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController';

const router = Router();

router.post('/attendances', attendanceController.createAttendance);
router.post('/attendances/:id/finish', attendanceController.finishAttendance);
router.get('/teams', attendanceController.getTeams);
router.get('/dashboard', attendanceController.getDashboard);

export default router;
