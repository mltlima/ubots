import { Request, Response } from 'express';
import * as attendanceService from '../services/attendanceService';

export function createAttendance(req: Request, res: Response): void {
  try {
    const { customerName, subject } = req.body;
    
    if (typeof customerName !== 'string' || typeof subject !== 'string') {
      res.status(400).json({ error: 'customerName and subject must be strings' });
      return;
    }

    if (!customerName.trim() || !subject.trim()) {
      res.status(400).json({ error: 'customerName and subject are required' });
      return;
    }

    const attendance = attendanceService.createAttendance(customerName, subject);
    res.status(201).json({ attendance });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export function finishAttendance(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'Attendance ID is required' });
      return;
    }

    const result = attendanceService.finishAttendance(id);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Attendance not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

export function getTeams(req: Request, res: Response): void {
  try {
    const teams = attendanceService.getTeams();
    res.status(200).json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function getDashboard(req: Request, res: Response): void {
  try {
    const dashboard = attendanceService.getDashboard();
    res.status(200).json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
