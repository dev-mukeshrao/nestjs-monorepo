# 🧱 NestJS Monorepo Starter

A robust monorepo boilerplate built with **NestJS**, featuring:

* Dockerized services (SQLite, Redis optional)
* Centralized **Auth** (JWT + session management)
* **Role-based access control** (admin/editor/viewer)
* Modular structure with shared **libs/** for clean architecture
* API documentation using **Swagger**
* Scoped **unit + e2e tests** with high coverage

---

## 📁 Repository Structure

```
/
├── apps/
│   ├── user-api/          # Handles users, auth, roles
│   ├── document-api/      # Document management
│   ├── ingestion-api/     # Data ingestion pipeline
│   └── api-gateway/       # Entrypoint to all services
├── libs/
│   ├── auth/              # Auth module (guards, strategies)
│   ├── common/            # Reusable DTOs, interfaces
│   └── utils/             # Helpers, validation, logging
├── docker-compose.yml
├── tsconfig.base.json
├── README.md
└── nest-cli.json
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
npm workspace auth install
npm workspace common install
npm workspace utils install
npm workspace user-api install
# Repeat for other workspaces...
```

### 2. Run Services

Start everything together:

```bash
docker-compose up --build
```

Or run apps individually:

```bash
nest start user-api
nest start api-gateway
```

---

## 🐳 Docker Services

* **user-api** → `http://localhost:3001`
* **document-api** → `http://localhost:3002`
* **ingestion-api** → `http://localhost:3003`
* **api-gateway** → `http://localhost:3000`
* (Optional) **Redis**, **SQLite**, **Swagger** UI

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
http://localhost:3000/api  # (via gateway)
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

## ✅ TL;DR

You have a **full-featured NestJS monorepo** with:

* Docker + Services
* Clean modular architecture
* JWT + Session Auth with RBAC
* Reusable libs for Auth, DTOs, Utils
* Swagger for API docs
* Testing infrastructure ready
