# Proyecto SIS257: Sistema de Gestión y Ventas para Librería (`sis257_libreria`)

## 1. Descripción del Negocio
Sistema web orientado a la gestión de inventario y el proceso de compra/venta de libros en una librería. Permite administrar los catálogos de publicaciones, categorías y autores, controlar el stock disponible, registrar clientes y realizar transacciones de venta con autenticación segura mediante JWT.

## 2. Problemática
Las librerías locales suelen registrar sus transacciones manuales o mediante herramientas no centralizadas, lo que genera descontrol en el stock de libros, lentitud en el proceso de atención en caja y falta de reportes precisos sobre los títulos más vendidos o la disponibilidad por categorías.

## 3. Tecnologías
- **Backend:** NestJS (TypeScript), TypeORM, class-validator, Swagger, PostgreSQL o MySQL (se elige con `DB_TYPE` en `.env`)
- **Frontend:** HTML + JavaScript + Bootstrap 5 (template personalizado)
- **Autenticación:** JWT (etapa de noviembre)

## 4. Entidades (consolidadas)

### 4.1 Usuario (`usuarios`)
- `id` (PK, Int, Auto-increment)
- `usuario` (Varchar, Unique)
- `clave` (Varchar, Encrypted/Hashed)
- `email` (Varchar, Unique)
- `rol` (Varchar: `admin`, `cliente`)

### 4.2 Categoría (`categorias`)
- `id` (PK, Int, Auto-increment)
- `nombre` (Varchar 100, Unique)
- `descripcion` (Varchar 255, opcional)

### 4.3 Autor (`autores`)
- `id` (PK, Int, Auto-increment)
- `nombre` (Varchar 100)
- `nacionalidad` (Varchar 100, opcional)

### 4.4 Libro (`libros`)
- `id` (PK, Int, Auto-increment)
- `titulo` (Varchar 200)
- `isbn` (Varchar 20, Unique, opcional)
- `precio` (Decimal 10,2)
- `stock` (Int)
- `id_categoria` (FK → categorias)
- `id_autor` (FK → autores)

### 4.5 Cliente (`clientes`)
- `id` (PK, Int, Auto-increment)
- `nombre` (Varchar 100)
- `documento` (Varchar 20, opcional)
- `email` (Varchar 100, opcional)
- `telefono` (Varchar 20, opcional)

### 4.6 Venta (`ventas`)
- `id` (PK, Int, Auto-increment)
- `fecha` (Timestamp, automática)
- `total` (Decimal 10,2)
- `id_cliente` (FK → clientes)

### 4.7 Detalle de venta (`detalle_ventas`)
- `id` (PK, Int, Auto-increment)
- `id_venta` (FK → ventas)
- `id_libro` (FK → libros)
- `cantidad` (Int)
- `precio_unitario` (Decimal 10,2)
- `subtotal` (Decimal 10,2)

### Relaciones
- Una **categoría** tiene muchos **libros**; un **autor** tiene muchos **libros**.
- Un **cliente** tiene muchas **ventas**; una **venta** tiene muchos **detalles**; cada **detalle** apunta a un **libro**.

## 5. Cómo ejecutar

### Backend
```bash
cd backend_libreria
npm install
cp .env.example .env      # y editar con los datos de tu base de datos
npm run start:dev
```
- Crear antes una base de datos vacía llamada `libreria`. Las tablas se generan solas a partir de las entities.
- Swagger: http://localhost:3000/api

### Frontend
Abrir `frontend_libreria/index.html` con la extensión *Live Server* de VS Code, o:
```bash
cd frontend_libreria
npx serve .
```
El backend debe estar corriendo en `http://localhost:3000` (se cambia en `js/config.js`).

## 6. Endpoints principales
| Recurso | Endpoints |
|---|---|
| Categorías | `POST/GET /categorias`, `GET/PATCH/DELETE /categorias/:id` |
| Autores | `POST/GET /autores`, `GET/PATCH/DELETE /autores/:id` |
| Libros | `POST/GET /libros`, `GET/PATCH/DELETE /libros/:id` |
| Clientes | `POST/GET /clientes`, `GET/PATCH/DELETE /clientes/:id` |
| Ventas | `POST /ventas` (descuenta stock), `GET /ventas`, `GET /ventas/:id` |

## 7. Avance
- [x] Repositorio y README con entidades
- [x] Proyecto backend y entidades consolidadas
- [x] Base de datos generada desde las entities, validaciones y Swagger
- [x] CRUD de 3 catálogos (categorías, autores, libros) en el backend
- [x] Proyecto frontend con Bootstrap y endpoint de venta
- [x] CRUD frontend integrado con el backend
- [ ] JWT y login (noviembre)
- [ ] Documentación inicial y pruebas con usuarios finales (noviembre)
