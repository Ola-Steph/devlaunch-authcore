import { Request, Response } from 'express';

export class HealthController {
  static check(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'AuthCore API is running.',
      timestamp: new Date().toISOString(),
    });
  }
}