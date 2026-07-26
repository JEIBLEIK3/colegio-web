# Sistema Escolar — Gestión Académica y Administrativa

Aplicación Angular para la gestión integral de un colegio, desarrollada bajo un enfoque de **gestión tecnológica**: la solución no solo resuelve el problema funcional (matrículas, notas, asistencia, etc.) sino que está diseñada desde el inicio para operar sobre infraestructura en la nube de **Amazon Web Services (AWS)**, con una ruta de migración clara del prototipo al sistema en producción.

Ver [ARQUITECTURA_AWS.md](./ARQUITECTURA_AWS.md) para el detalle de la arquitectura en la nube, el modelo de datos y la justificación de gestión tecnológica.

## Módulos

| Módulo | Descripción | Roles con acceso |
|---|---|---|
| Matrículas | Registro y ciclo de vida del estudiante (activa, pendiente, retirada, graduado) | Administrador |
| Profesores | Gestión de la planta docente y asignación a cursos | Administrador |
| Horarios | Calendario semanal de clases por curso | Todos (edición: Administrador) |
| Asistencia | Registro diario de asistencia por curso | Administrador, Profesor |
| Notas | Calificaciones por asignatura y periodo, con promedio ponderado | Todos (registro: Administrador, Profesor) |
| Observaciones | Anotaciones de convivencia y seguimiento del estudiante | Administrador, Profesor |
| Boletines | Generación de boletín académico (notas + asistencia + observaciones) | Todos |
| Pagos | Control de pensiones y matrícula, estado de cartera | Administrador, Estudiante/Acudiente |

## Modo demo (datos simulados)

Por defecto (`environment.useMockData = true`) la aplicación funciona sin backend: los datos viven en `localStorage` del navegador, simulando la latencia y el contrato de una API real. Esto permite demostrar el sistema completo sin necesidad de una cuenta de AWS.

### Usuarios de prueba

Contraseña única: `colegio123`

| Correo | Rol |
|---|---|
| admin@colegio.edu.co | Administrador |
| laura.gomez@colegio.edu.co | Profesor |
| juan.perez@estudiante.edu.co | Estudiante / Acudiente |

## Desarrollo

```bash
npm install
ng serve
```

Abrir `http://localhost:4200/`.

## Build de producción

```bash
ng build
```

Con `ng build --configuration production` se activa automáticamente `environment.prod.ts` (`useMockData: false`), por lo que la app pasa a consumir la API real en AWS (ver `environment.aws.apiBaseUrl`).

## Tests

```bash
ng test
```
