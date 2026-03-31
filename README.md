<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# API de Leads

Una API RESTful construida con NestJS para la gestión de leads, implementando **Arquitectura Hexagonal** (Ports & Adapters), **Clean Architecture** y **Domain-Driven Design**.

## Tecnologías y descripción

| Tecnología          | Descripción                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **NestJS**          | Framework progresivo de Node.js con arquitectura modular, inyección de dependencias y soporte nativo para TypeScript. Ideal para aplicaciones empresariales. |
| **Prisma ORM**      | ORM type-safe con migraciones automáticas y cliente tipado. Abstrae la complejidad de SQL y proporciona una experiencia de desarrollo superior.              |
| **PostgreSQL**      | Base de datos relacional robusta con soporte para datos estructurados y escalabilidad.                                                                       |
| **TypeScript**      | Tipado estático que previene errores en tiempo de desarrollo y mejora el mantenimiento del código.                                                           |
| **Class Validator** | Decoradores para validación de DTOs en NestJS, permitiendo validación declarativa y centralizada.                                                            |

## Requisitos Previos

- Node.js (v18+)
- npm
- PostgreSQL (local o remoto como Neon)

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repo-url>
cd leads
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_TU_PASSWORD@ep-snowy-grass-an6g7m62-pooler.c-6.us-east-1.aws.neon.tech/leads?sslmode=require"

# API de IA (DeepSeek)
DEEPSEEK_API_KEY="sk-tu-api-key-aqui"

# AXIOM
AXIOM_TOKEN="ABC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"'
```

4. **Ejecutar migraciones de Prisma**

```bash
npx prisma migrate dev --name init
```

5. **Generar el cliente de Prisma**

```bash
npx prisma generate
```

## Ejecución

### Desarrollo (con hot-reload)

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

## Deploy

https://leads-two-green.vercel.app/api/

### Puerto por defecto

La API corre en `http://localhost:3005`

## Ejecutar el Seed (Poblar datos)

El endpoint de seed carga 25 leads de ejemplo en la base de datos:

```bash
curl -X GET http://localhost:3005/api/seeder
```

Respuesta exitosa:

```json
{
  "status": "success",
  "message": "Leads created successfully",
  "data": {
    "count": 25,
    "leads": [...]
  }
}
```

> **Nota**: El seed es idempotente. Puedes ejecutarlo múltiples veces.

## Endpoints de la API

### Leads

| Método   | Endpoint         | Descripción                              |
| -------- | ---------------- | ---------------------------------------- |
| `GET`    | `/api/leads`     | Obtener todos los leads (con paginación) |
| `GET`    | `/api/leads/:id` | Obtener un lead por ID                   |
| `POST`   | `/api/leads`     | Crear un nuevo lead                      |
| `PATCH`  | `/api/leads/:id` | Actualizar un lead                       |
| `DELETE` | `/api/leads/:id` | Eliminar (soft-delete) un lead           |

### Seeder

| Método | Endpoint      | Descripción                                  |
| ------ | ------------- | -------------------------------------------- |
| `GET`  | `/api/seeder` | Poblar la base de datos con leads de ejemplo |

### Stats

| Método | Endpoint           | Descripción                   |
| ------ | ------------------ | ----------------------------- |
| `GET`  | `/api/leads/stats` | Obtener estadísticas de leads |

## Ejemplos de Uso

### 1. Crear un Lead

```bash
curl -X POST http://localhost:3005/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+573001234567",
    "source": "instagram",
    "productOfInterest": "Plan Premium",
    "budget": 150000
  }'
```

**Fuentes válidas**: `instagram`, `facebook`, `landing_page`, `referido`, `other`

### 2. Obtener Todos los Leads

```bash
curl -X GET "http://localhost:3005/api/leads?page=1&limit=10"
```

### 3. Obtener un Lead por ID

```bash
curl -X GET http://localhost:3005/api/leads/1
```

### 4. Actualizar un Lead

```bash
curl -X PATCH http://localhost:3005/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez Actualizado",
    "budget": 200000
  }'
```

### 5. Eliminar un Lead

```bash
curl -X DELETE http://localhost:3005/api/leads/1
```

### 6. Obtener Estadísticas

```bash
curl -X GET http://localhost:3005/api/leads/stats
```

## Estructura del Proyecto

```
src/
├── aplications/
│   └── use-cases/          # Casos de uso (application layer)
├── domain/
│   ├── entities/          # Entidades del dominio
│   └── ports/             # Puertos (interfaces)
├── infrastructure/
│   └── database/
│       └── prisma/        # Implementaciones de infraestructura
├── modules/               # Módulos NestJS
├── presentation/
│   ├── controllers/     # Controladores API
│   └── dtos/            # DTOs de request/response
└── shared/              # Utilidades compartidas
```

## Archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add `import "dotenv/config";` to your `prisma.config.ts` file

# Prisma supports the native connection string format for PostgreSQL
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Manejo de Errores

La API implementa un manejo de errores consistente en todos los endpoints:

- **Errores de validación**: Retornan 400 con detalles del error
- **Errores de negocio**: Retornan 400/409 con mensaje específico
- **Errores de servidor**: Retornan 500 con mensaje genérico
- **Recursos no encontrados**: Retornan 404

Estructura de respuesta de error:

```json
{
  "status": "error",
  "message": "Mensaje descriptivo del error",
  "data": null
}
```

## Licencia

MIT
