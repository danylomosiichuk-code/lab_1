// src/controllers.ts
import { Request, Response, NextFunction } from 'express';
import { AccessRequestService, UserService } from './services';

// Контролер для Користувачів
export const UserController = {
  getAll: (req: Request, res: Response, next: NextFunction) => {
    try { res.json({ items: UserService.getAll() }); } catch (e) { next(e); }
  },
  getById: (req: Request, res: Response, next: NextFunction) => {
    try { res.json(UserService.getById(req.params.id as string)); } catch (e) { next(e); }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(UserService.create(req.body)); } catch (e) { next(e); }
  },
  delete: (req: Request, res: Response, next: NextFunction) => {
    try { UserService.delete(req.params.id as string); res.status(204).send(); } catch (e) { next(e); }
  }
};

// Контролер для Заявок
export const AccessRequestController = {
  getAll: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, sortBy } = req.query; // Отримуємо параметри для фільтрації та сортування
      res.json({ items: AccessRequestService.getAll(status as string, sortBy as string) });
    } catch (e) { next(e); }
  },
  getById: (req: Request, res: Response, next: NextFunction) => {
    try { res.json(AccessRequestService.getById(req.params.id as string)); } catch (e) { next(e); }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(AccessRequestService.create(req.body)); } catch (e) { next(e); }
  },
  update: (req: Request, res: Response, next: NextFunction) => {
    try { res.json(AccessRequestService.update(req.params.id as string, req.body)); } catch (e) { next(e); }
  },
  delete: (req: Request, res: Response, next: NextFunction) => {
    try { AccessRequestService.delete(req.params.id as string); res.status(204).send(); } catch (e) { next(e); }
  }
};