# PicMeTogether - Red Social de Rallies Fotográficos

PicMeTogether es una plataforma web donde los usuarios pueden crear, participar y votar en rallies fotográficos. El frontend está desarrollado con React, TypeScript, Vite y Tailwind CSS, siguiendo buenas prácticas de accesibilidad, usabilidad y clean code.

## Características principales

- Registro, login y recuperación de contraseña con validaciones avanzadas.
- Creación y gestión de rallies fotográficos.
- Subida de publicaciones con imágenes.
- Votación y comentarios en publicaciones.
- Panel de administración para usuarios con roles elevados.
- Accesibilidad y diseño responsive.
- Restricciones funcionales (ej: no se puede votar en publicaciones pendientes).

## Tecnologías utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

## Estructura del proyecto

```
/src
  /components         # Componentes reutilizables y específicos
  /context            # Contextos globales
  /pages              # Páginas principales
  /services           # Lógica de comunicación con el backend
  /types              # Definiciones TypeScript
  App.tsx, main.tsx   # Entradas principales
  index.css           # Estilos globales
```

## Instalación y ejecución

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Accede a [http://localhost:5173](http://localhost:5173) en tu navegador.

## Variables de entorno

Crea un archivo `.env` en la raíz con la URL del backend:
```
VITE_API_URL=https://tubackend.com/api
```

## Buenas prácticas y optimización

- Código limpio y sin comentarios innecesarios.
- Validaciones y feedback visual en formularios.
- Accesibilidad: labels, aria, navegación por teclado.
- Uso de hooks y tipado explícito.
- Componentes reutilizables y lógica separada.

## Despliegue

El proyecto está preparado para desplegarse en Vercel, Netlify o cualquier hosting estático compatible con Vite.

## Mejoras futuras

- Notificaciones en tiempo real.
- Mensajería privada entre usuarios.
- Feed personalizado y sistema de seguidores.
- Soporte multilenguaje.
- Moderación y reporte de contenidos.

## Autoría

Desarrollado como parte del TFG.

---

