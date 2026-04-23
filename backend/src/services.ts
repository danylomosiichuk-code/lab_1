// src/services.ts
import { ApiError, CreateAccessRequestDto, CreateUserDto, UpdateAccessRequestDto } from './dtos';
import { userRepo, requestRepo } from './repositories';
import crypto from 'crypto'; // Вбудований модуль Node.js для генерації унікальних ID

// Сервіс для Користувачів
export class UserService {
  static getAll() { return userRepo.getAll(); }
  
  static getById(id: string) {
    const user = userRepo.getById(id);
    if (!user) throw new ApiError(404, 'NOT_FOUND', 'Користувача не знайдено');
    return user;
  }

  static create(dto: CreateUserDto) {
    if (!dto.name || !dto.email) throw new ApiError(400, 'VALIDATION_ERROR', 'Ім\'я та email обов\'язкові');
    
    const newUser = { id: crypto.randomUUID(), ...dto }; // Генеруємо ID
    return userRepo.create(newUser);
  }

  static delete(id: string) {
    const deleted = userRepo.delete(id);
    if (!deleted) throw new ApiError(404, 'NOT_FOUND', 'Користувача не знайдено');
  }
}

// Сервіс для Заявок
export class AccessRequestService {
  
  // Додаємо підтримку параметрів для фільтрації та сортування
  static getAll(status?: string, sortBy?: string) {
    let data = [...requestRepo.getAll()]; // Робимо копію масиву

    // ФІЧА НА ВІДМІННО 1: Фільтрація за статусом
    if (status) {
      data = data.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    // ФІЧА НА ВІДМІННО 2: Сортування за датою
    if (sortBy === 'date') {
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return data;
  }

  static getById(id: string) {
    const req = requestRepo.getById(id);
    if (!req) throw new ApiError(404, 'NOT_FOUND', 'Заявку не знайдено');
    return req;
  }

  static create(dto: CreateAccessRequestDto) {
    const errors = [];

    // ВАЛІДАЦІЯ: перевіряємо, чи правильні дані прислав користувач
    if (!dto.userName || dto.userName.length < 3) errors.push('Ім\'я має бути більше 2 символів');
    if (!dto.date) errors.push('Дата обов\'язкова');
    if (!dto.accessType) errors.push('Тип доступу обов\'язковий');
    
    // Якщо є хоч одна помилка - блокуємо створення і кидаємо помилку 400
    if (errors.length > 0) throw new ApiError(400, 'VALIDATION_ERROR', 'Помилка валідації', errors);

    // Збираємо заявку: генеруємо ID і ставимо статус Pending (В очікуванні)
    const newReq = { id: crypto.randomUUID(), status: 'Pending', ...dto };
    return requestRepo.create(newReq);
  }

  static update(id: string, dto: UpdateAccessRequestDto) {
    const updated = requestRepo.update(id, dto);
    if (!updated) throw new ApiError(404, 'NOT_FOUND', 'Заявку не знайдено');
    return updated;
  }

  static delete(id: string) {
    const deleted = requestRepo.delete(id);
    if (!deleted) throw new ApiError(404, 'NOT_FOUND', 'Заявку не знайдено');
  }
}