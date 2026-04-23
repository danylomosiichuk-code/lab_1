// src/repositories.ts
import { User, AccessRequest } from './dtos';

// Репозиторій для Користувачів
class UserRepository {
  private users: User[] = []; // Масив, де зберігаються користувачі

  getAll() { return this.users; }
  
  getById(id: string) { return this.users.find(u => u.id === id); }
  
  create(user: User) { 
    this.users.push(user); 
    return user; 
  }
  
  delete(id: string) {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length !== initialLength; // Повертає true, якщо видалено успішно
  }
}

// Репозиторій для Заявок на доступ
class AccessRequestRepository {
  private requests: AccessRequest[] = []; // Масив, де зберігаються заявки

  getAll() { return this.requests; }
  
  getById(id: string) { return this.requests.find(r => r.id === id); }
  
  create(request: AccessRequest) { 
    this.requests.push(request); 
    return request; 
  }
  
  update(id: string, data: Partial<AccessRequest>) {
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return null; // Якщо не знайдено
    
    // Оновлюємо існуючий запис новими даними
    this.requests[index] = { ...this.requests[index], ...data };
    return this.requests[index];
  }
  
  delete(id: string) {
    const initialLength = this.requests.length;
    this.requests = this.requests.filter(r => r.id !== id);
    return this.requests.length !== initialLength;
  }
}

// Експортуємо готові об'єкти для використання в інших файлах
export const userRepo = new UserRepository();
export const requestRepo = new AccessRequestRepository();