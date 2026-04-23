// src/index.ts
import express from 'express';
import { UserController, AccessRequestController } from './controllers';
import { loggerMiddleware, errorHandlerMiddleware } from './middlewares';

const app = express();

// Щоб сервер розумів формат JSON у тілі запиту
app.use(express.json()); 

// Підключаємо логування (воно спрацює для кожного запиту)
app.use(loggerMiddleware);

// --- Маршрути для Користувачів ---
app.get('/api/users', UserController.getAll);
app.get('/api/users/:id', UserController.getById);
app.post('/api/users', UserController.create);
app.delete('/api/users/:id', UserController.delete);

// --- Маршрути для Заявок ---
app.get('/api/requests', AccessRequestController.getAll);
app.get('/api/requests/:id', AccessRequestController.getById);
app.post('/api/requests', AccessRequestController.create);
app.put('/api/requests/:id', AccessRequestController.update);
app.delete('/api/requests/:id', AccessRequestController.delete);

// Підключаємо глобальний обробник помилок (ВІН ПОВИНЕН БУТИ ОСТАННІМ!)
app.use(errorHandlerMiddleware);

// Запускаємо сервер
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API запущено на http://localhost:${PORT}`);
});