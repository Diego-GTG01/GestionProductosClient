# Gestión de Productos - Frontend

Frontend desarrollado con **Angular 20** para el sistema de Gestión de Productos Institucionales.

La aplicación permite administrar productos, departamentos, usuarios y auditorías, consumiendo una API REST desarrollada en Spring Boot protegida mediante autenticación JWT.

---

# Tecnologías

- Angular 20
- TypeScript
- Bootstrap 5
- SweetAlert2
- RxJS
- Angular Router
- HttpClient
- JWT Authentication

---

# Características

- Inicio de sesión mediante JWT.
- Administración de productos.
- Administración de departamentos.
- Administración de usuarios.
- Consulta de auditorías.
- Exportación de reportes.
- Gestión de imágenes de productos.
- Protección de rutas mediante autenticación.
- Consumo de servicios REST.

---

# Arquitectura del Proyecto

El proyecto sigue una arquitectura modular basada en componentes y separación de responsabilidades.

```
src/
│
├── app/
│   │
│   ├── Components/
│   │   ├── vista-login/
│   │   ├── vista-producto-main/
│   │   ├── vista-add-producto/
│   │   ├── vista-detalle-producto/
│   │   ├── vista-departamentos-main/
│   │   ├── vista-usuarios/
│   │   ├── vista-auditorias-main/
│   │   └── vista-user-badge/
│   │
│   ├── Interfaces/
│   │
│   ├── Services/
│   │
│   ├── Interceptors/
│   │
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── app.ts
│   └── app.html
│
└── environments/
```

---

# Descripción de Carpetas

## Components

Contiene todos los componentes de la interfaz de usuario.

| Componente | Descripción |
|------------|-------------|
| vista-login | Inicio de sesión del sistema. |
| vista-producto-main | Listado principal de productos. |
| vista-add-producto | Registro y edición de productos. |
| vista-detalle-producto | Visualización detallada del producto. |
| vista-departamentos-main | Administración de departamentos. |
| vista-usuarios | Administración de usuarios. |
| vista-auditorias-main | Consulta de auditorías. |
| vista-user-badge | Información del usuario autenticado. |

---

## Services

Contiene los servicios encargados de consumir la API REST mediante HttpClient.

Ejemplos:

- AuthService
- ProductoService
- UsuarioService
- DepartamentoService
- AuditoriaService

---

## Interfaces

Define los modelos utilizados durante toda la aplicación.

Ejemplos:

- Producto
- Usuario
- Departamento
- AuditoriaProducto
- LoginRequest
- LoginResponse

---

## Interceptors

Contiene los interceptores HTTP.

Actualmente se utiliza un interceptor para:

- Agregar automáticamente el token JWT.
- Proteger las peticiones autenticadas.
- Centralizar el manejo de autorización.

---

## environments

Contiene la configuración por ambiente.

Ejemplo:

```
environment.development.ts
```

Aquí se configura la URL del Backend.

---

# Flujo de la aplicación

```
Usuario

↓

Login

↓

JWT

↓

Interceptor

↓

API REST (Spring Boot)

↓

Respuesta

↓

Componentes Angular
```

---

# Instalación

Instalar dependencias

```bash
npm install
```

---

# Ejecutar el proyecto

```bash
ng serve
```

La aplicación estará disponible en:

```
http://localhost:4200
```

---

# Compilar

```bash
ng build
```

El resultado se generará en:

```
dist/
```

---

# Funcionalidades principales

- Autenticación mediante JWT.
- CRUD de Productos.
- Administración de Departamentos.
- Administración de Usuarios.
- Consulta de Auditorías.
- Exportación de reportes.
- Búsqueda y filtrado de información.
- Activación e inactivación de registros.
- Visualización de detalles de productos.

---

# Backend

Este proyecto consume una API REST desarrollada con:

- Spring Boot
- Spring Security
- JWT
- JPA / Hibernate
- Oracle Database

---

# Autor

**Diego Gómez Tagle**