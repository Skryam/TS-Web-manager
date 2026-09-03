# WebManager

Приложение для управления задачами (Fullstack: React + Node.js + GraphQL + Prisma).

## 🛠 Требования
- Node.js (версия 18 или выше)
- PostgreSQL
- Yarn

---

## ⚙️ Запуск Backend (Сервер)

1. Перейди в папку сервера:
```bash
   cd backend
```

2. Установи зависимости:
```bash
   yarn install
   ```

3. Создай файл окружения и заполни его своими данными:
```bash
   cp .env.example .env
   ```

4. Примени миграции к базе данных (создаст таблицы):
```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Запусти сервер разработки:
```bash
   yarn dev
   ```

Сервер будет доступен по адресу: http://localhost:4000

### 📄 backend/.env.example
```env
  # Строка подключения к PostgreSQL
  # Формат: postgres://ПОЛЬЗОВАТЕЛЬ:ПАРОЛЬ@ХОСТ:ПОРТ/ИМЯ_БАЗЫ?schema=public
  DATABASE_URL="postgres://postgres:your_password_here@localhost:5432/your_db_name?schema=public"

  # Секретный ключ для сессий/JWT (должен быть длинной случайной строкой)
  SESSION_KEY="your_super_secret_random_string_here_change_me"

  # URL фронтенда (используется для настройки CORS)
  FRONTEND_URL="http://localhost:3000"
```

## 🎨 Запуск Frontend (Клиент)

1. Перейди в папку клиента (в новом терминале):
```bash
   cd frontend
   ```
2. Установи зависимости:
```bash
   yarn install
   ```
3. Создай файл окружения:
```bash
   cp .env.example .env
   ```
4. Запусти клиент разработки:
```bash
   yarn vite
   ```
Приложение будет доступно по адресу: http://localhost:5173 (или другой порт, который укажет Vite)
### 📄 frontend/.env.example
```env
# URL GraphQL API бэкенда
VITE_API_URL="http://localhost:4000"
```