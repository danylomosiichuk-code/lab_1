// src/dtos.ts

// Клас для обробки помилок
export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details: any = null) {
    super(message);
  }
}

// Модель Користувача (обов'язкова сутність для всіх)
export interface User {
  id: string;
  name: string;
  email: string;
}

// Модель Заявки (твоя головна сутність з варіанта 1)
export interface AccessRequest {
  id: string;
  userName: string;
  date: string;
  accessType: string;
  status: string;
  comments?: string;
}

// DTO для Користувачів (при створенні ID генерує сервер)
export type CreateUserDto = Omit<User, 'id'>;

// DTO для Заявок (при створенні ми не вимагаємо від клієнта id та статус)
export type CreateAccessRequestDto = Omit<AccessRequest, 'id' | 'status'>;
export type UpdateAccessRequestDto = Partial<Omit<AccessRequest, 'id'>>;