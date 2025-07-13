# 🧱 NestJS Monorepo Starter

A robust monorepo boilerplate built with **NestJS**, featuring:

* Dockerized services (SQLite)
* Centralized **Auth** (JWT)
* **Role-based access control** (admin/editor/viewer)
* Modular structure with shared **libs/** for clean architecture
* API documentation using **Swagger**
* Scoped **unit + e2e tests** with coverage

---

## 📁 Repository Structure

```
nestjs-monorepo/                    
├── apps/
│   ├── user-api/
│   ├── document-api/
│   └── ingestion-api/
├── libs/
│   └── common-library/
├── package.json
├── nest-cli.json
├── tsconfig.json
```

---

## 🛠 Prerequisites

* **Node.js** 16+
* **Docker** & **docker-compose**
* Installed CLI:

  ```bash
  npm install -g @nestjs/cli
  ```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Services

```bash
docker-compose up --build
```

Or run apps individually:

```bash
nest start user-api
nest start document-api
nest start ingestion-api

```

---

## 🐳 Docker Services

* **user-api** → `http://localhost:3001`
* **document-api** → `http://localhost:3002`
* **ingestion-api** → `http://localhost:3003`
**SQLite**, **Swagger** UI

---

## 🔐 Auth Endpoints

| Endpoint              | Description                                |
| --------------------- | ------------------------------------------ |
| `POST /auth/register` | Creates new user (role defaults to viewer) |
| `POST /auth/login`    | Returns JWT stored in session cookie       |
| `POST /auth/logout`   | Destroys current session & JWT             |

All protected routes require `Authorization: Bearer <token>` or session.

---

## 👤 Role-Based Routes

With roles `admin`, `editor`, `viewer`, usage:

```ts
@Roles('admin', 'editor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('protected')
getProtected() {
  return { message: 'Access granted' };
}
```

---

## 🧩 Shared Libraries

* **libs/auth**: JWT configuration, Passport strategy, `JwtAuthGuard`
* **libs/common**: DTOs (CreateUserDto, UpdateUserDto), interfaces, access guards
* **libs/utils**: Helpers like `stripUndefined()`, logger utilities

---

## 📄 Swagger Documentation

Available at each service’s `/api` route, e.g.:

```
http://localhost:3001/api
http://localhost:3002/api  
http://localhost:3003/api
```

---

## 🧪 Testing

* **Unit tests** (per-app and per-lib):

  ```bash
  npm run test user-api
  ```
* **E2E tests**:

  ```bash
  npm run test:e2e
  ```
* **Coverage report**:

  ```bash
  npm run test:coverage
  ```

---

## ⚙️ Extending the Monorepo

* Add new apps: `nest g app <name>`
* Create new shared libraries: `nest g lib <name>`
* Use shared modules via path aliases in `tsconfig.base.json`
* Leverage patterns like Dependency Inversion, Anti-Corruption Layers, Adapter pattern across libs

---
