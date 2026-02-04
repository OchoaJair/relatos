# Script de Prerendering

Este script genera HTML estático para todas las rutas de la aplicación usando Puppeteer. Esto es esencial para SEO porque permite que los motores de búsqueda indexen el contenido de las páginas dinámicas.

## Uso

### 1. Build de producción
```bash
pnpm run build
```

### 2. Iniciar servidor de preview
```bash
pnpm run preview
```

### 3. Ejecutar prerendering (en otra terminal)
```bash
pnpm run prerender
```

## ¿Cómo funciona?

1. Inicia un navegador headless (Puppeteer)
2. Navega a cada ruta de la aplicación
3. Espera a que React renderice completamente
4. Captura el HTML generado
5. Guarda el HTML estático en la carpeta `dist/`

## Rutas incluidas

- Páginas principales: `/`, `/About`, `/Interactive`
- Historias: 16 historias individuales

## Notas

- Asegúrate de que el servidor de preview esté corriendo antes de ejecutar el prerendering
- El servidor de preview debe estar en el puerto 4173 (puerto por defecto de Vite preview)
- Las páginas prerenderizadas mantienen la hidratación de React para funcionamiento normal

## Alternativas

Si prefieres no usar Puppeteer, considera estas alternativas:

1. **Netlify Prerendering**: Configura `netlify.toml` con prerendering integrado
2. **Rendertron**: Servicio de Google para prerendering dinámico
3. **Prerender.io**: Servicio de terceros
4. **Vercel**: Tiene prerendering automático para SPAs
