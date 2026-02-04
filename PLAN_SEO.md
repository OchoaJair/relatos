# Plan de Mejoras SEO - Relatos de Reconciliación

## 📋 Índice

1. [Fase 1: SEO Técnico Básico](#fase-1-seo-técnico-básico-prioridad-alta)
2. [Fase 2: Optimización de Contenido](#fase-2-optimización-de-contenido-prioridad-alta)
3. [Fase 3: Prerendering y Rendimiento](#fase-3-prerendering-y-rendimiento-prioridad-alta)
4. [Fase 4: Estructura y Navegación](#fase-4-estructura-y-navegación-prioridad-media)
5. [Fase 5: Contenido y Marketing](#fase-5-contenido-y-marketing-prioridad-media)
6. [Implementación Recomendada](#-implementación-recomendada-orden-de-ejecución)

---

## Análisis Inicial

### Estado Actual SEO

| Aspecto | Estado | Prioridad |
|---------|--------|-----------|
| Meta descripción | ❌ No existe | 🔴 Alta |
| Open Graph tags | ❌ No existen | 🔴 Alta |
| Twitter Cards | ❌ No existen | 🟡 Media |
| Robots.txt | ❌ No existe | 🔴 Alta |
| Sitemap.xml | ❌ No existe | 🔴 Alta |
| React Helmet | ❌ No instalado | 🔴 Alta |
| Títulos dinámicos | ❌ Todos iguales | 🔴 Alta |
| Lang attribute | ⚠️ En inglés (debe ser es) | 🟡 Media |
| Canonical URLs | ❌ No existen | 🟡 Media |
| Structured Data | ❌ No existe | 🟡 Media |
| Alt text en imágenes | ✅ Presente | ✅ OK |
| URLs amigables | ✅ Slugs implementados | ✅ OK |

### Contenido Valioso No Aprovechado
- 16 transcripciones completas de testimonios
- 16 galerías de imágenes con procesos de animación
- 13 categorías de violencia
- 6 técnicas de animación
- Múltiples temas transversales (reconciliación, territorio, familia, agua, raíz, tiempo)

---

## FASE 1: SEO Técnico Básico (Prioridad: 🔴 Alta)

### 1.1 Corregir index.html

**Cambios necesarios:**
- [ ] Cambiar `lang="en"` a `lang="es"`
- [ ] Agregar meta descripción
- [ ] Agregar Open Graph tags:
  - og:title
  - og:description
  - og:image
  - og:url
  - og:type
  - og:locale
- [ ] Agregar Twitter Card tags:
  - twitter:card
  - twitter:title
  - twitter:description
  - twitter:image
- [ ] Agregar theme-color
- [ ] Agregar canonical URL
- [ ] Link a manifest.json

### 1.2 Crear Archivos Estáticos

**robots.txt**
```
User-agent: *
Allow: /
Disallow: /RiverTest

Sitemap: https://tudominio.com/sitemap.xml
```

**sitemap.xml**
Incluir:
- Home (`/`)
- About (`/About`)
- Interactive (`/Interactive`)
- 16 historias individuales (`/:id`)
- Atributos: lastmod, changefreq, priority

**manifest.json**
- name, short_name
- icons (favicon, apple-touch-icon)
- theme_color, background_color
- display, start_url

### 1.3 Implementar SEO Dinámico

**Instalación:**
```bash
pnpm add react-helmet-async
```

**Componente SEO.jsx reutilizable:**
- Props: title, description, image, url, type
- Valores por defecto para el sitio
- Integración con react-helmet-async

**Implementación por página:**
- Home: Título y descripción del proyecto
- About: Título enfocado en "Sobre el Proyecto"
- Interactive: Título enfocado en "Visualización Interactiva"
- History (dinámico): Título y descripción únicos por historia usando datos del JSON

---

## FASE 2: Optimización de Contenido (Prioridad: 🔴 Alta)

### 2.1 Aprovechar Transcripciones

**Estrategia:**
- Asegurar que las transcripciones estén renderizadas en HTML
- Implementar schema.org Article o CreativeWork con JSON-LD
- Incluir author, datePublished, description

### 2.2 Optimizar Páginas Dinámicas (Historias)

**Por cada historia (`/:id`):**
- [ ] Título único: "{Nombre} - Relatos de Reconciliación"
- [ ] Meta descripción: Usar `quote` de cada historia
- [ ] Open Graph image: Primera imagen de la galería
- [ ] Structured Data:
  - VideoObject (para el video HLS)
  - Person (para el protagonista)
  - Article (para la historia)

### 2.3 Páginas de Categoría (Opcional pero Recomendado)

**Nuevas páginas a crear:**
- `/violencia/:tipo` - 13 páginas (uno por tipo de violencia)
- `/tecnica/:tipo` - 6 páginas (uno por técnica de animación)

**Total: 19 páginas adicionales indexables**

---

## FASE 3: Prerendering y Rendimiento (Prioridad: 🔴 Alta)

### 3.1 Configurar Prerendering

**Opciones disponibles:**

**Opción A: ViteSSG (Recomendada)**
- Generación estática completa
- Mejor para SEO
- Exporta HTML estático para cada ruta

**Opción B: Netlify Prerendering**
- Si se hospeda en Netlify
- Fácil de configurar
- Middleware de prerendering

**Opción C: Rendertron/Puppeteer**
- Servidor de prerendering
- Compatible con cualquier hosting
- Más complejo de configurar

### 3.2 Optimizar Core Web Vitals

**Tareas:**
- [ ] Implementar lazy loading en imágenes (`loading="lazy"`)
- [ ] Optimizar fondo dinámico de Home (carga progresiva)
- [ ] Minimizar JavaScript no crítico
- [ ] Usar preload para recursos críticos
- [ ] Optimizar imágenes (WebP con fallback)

### 3.3 Optimizar Videos

**Tareas:**
- [ ] Usar `preload="metadata"` en videos HLS
- [ ] Proveer poster images para cada video
- [ ] Implementar schema.org/VideoObject con:
  - name
  - description
  - thumbnailUrl
  - uploadDate
  - duration

---

## FASE 4: Estructura y Navegación (Prioridad: 🟡 Media)

### 4.1 Mejorar Navegación

**Implementar:**
- [ ] Breadcrumb con schema.org/BreadcrumbList
- [ ] Enlaces internos entre historias relacionadas
- [ ] Footer con enlaces a todas las secciones principales

### 4.2 URLs y Enlaces

**Tareas:**
- [ ] Implementar canonical URLs
- [ ] Agregar `rel="noopener noreferrer"` a enlaces externos
- [ ] Verificar que todas las URLs sean amigables (✅ ya implementado)

### 4.3 Accesibilidad

**Tareas:**
- [ ] Mejorar contraste de colores
- [ ] Agregar skip links
- [ ] Asegurar aria-labels descriptivos en botones
- [ ] Implementar focus visible

---

## FASE 5: Contenido y Marketing (Prioridad: 🟡 Media)

### 5.1 Schema.org Structured Data

**Implementar JSON-LD:**

**WebSite Schema:**
- name, url
- potentialAction (SearchAction para caja de búsqueda)

**Organization Schema:**
- name: "Relatos de Reconciliación"
- description
- url, logo
- sameAs (redes sociales)

**VideoObject Schema (por cada historia):**
- name, description
- thumbnailUrl
- uploadDate, duration
- transcript (si aplica)

**Person Schema (por cada protagonista):**
- name
- description (cita/quote)
- image

**BreadcrumbList Schema:**
- ItemList con posición y nombre de cada nivel

### 5.2 Contenido Adicional

**Tareas:**
- [ ] Crear página `/historias` con listado completo
- [ ] Agregar sección "Historias relacionadas" en cada página individual
- [ ] Implementar share buttons con meta tags correctos

### 5.3 Redes Sociales

**Verificaciones:**
- [ ] Facebook Debugger (https://developers.facebook.com/tools/debug/)
- [ ] Twitter Card Validator (https://cards-dev.twitter.com/validator)
- [ ] LinkedIn Post Inspector (https://www.linkedin.com/post-inspector/)

**Crear imagen OG por defecto:**
- Dimensiones: 1200x630px
- Incluir logo y branding
- Formato: JPG o PNG optimizado

---

## 📊 Implementación Recomendada (Orden de Ejecución)

| Orden | Tarea | Tiempo Est. | Impacto |
|-------|-------|-------------|---------|
| 1 | Corregir index.html + crear robots.txt + sitemap.xml + manifest.json | 2 horas | 🔴 Crítico |
| 2 | Instalar react-helmet-async + componente SEO | 3 horas | 🔴 Crítico |
| 3 | Implementar SEO en todas las páginas (títulos y meta dinámicos) | 4 horas | 🔴 Crítico |
| 4 | Configurar prerendering (ViteSSG o similar) | 4-8 horas | 🔴 Crítico |
| 5 | Implementar Structured Data JSON-LD | 3 horas | 🟡 Alto |
| 6 | Optimizar imágenes y videos (lazy loading, poster, etc.) | 2 horas | 🟡 Alto |
| 7 | Mejorar accesibilidad y navegación | 3 horas | 🟢 Medio |
| 8 | Crear páginas de categoría (opcional) | 4 horas | 🟢 Medio |

**Tiempo total estimado: 20-25 horas**

---

## 🎯 Resultados Esperados

- ✅ 100% de páginas indexables por Google
- ✅ Cada historia con título y descripción únicos
- ✅ Rich snippets en resultados de búsqueda
- ✅ Mejor posicionamiento para búsquedas relacionadas con reconciliación y memoria
- ✅ Mejor experiencia al compartir en redes sociales
- ✅ Mejor puntuación en Lighthouse SEO audit

---

## 📁 Archivos a Crear/Modificar

### Nuevos archivos:
- `public/robots.txt`
- `public/sitemap.xml`
- `public/manifest.json`
- `src/components/SEO.jsx`
- `src/components/StructuredData.jsx`
- `src/utils/seoConfig.js`

### Archivos a modificar:
- `index.html`
- `package.json` (agregar react-helmet-async)
- `src/main.jsx` (envolver con HelmetProvider)
- `src/App.jsx` (agregar rutas si se crean páginas de categoría)
- `src/pages/Home.jsx` (agregar componente SEO)
- `src/pages/About.jsx` (agregar componente SEO)
- `src/pages/Interactive.jsx` (agregar componente SEO)
- `src/pages/History.jsx` (agregar SEO dinámico)

---

## 🚀 Checklist de Completado

### Fase 1
- [ ] index.html actualizado con meta tags
- [ ] robots.txt creado
- [ ] sitemap.xml creado
- [ ] manifest.json creado
- [ ] react-helmet-async instalado
- [ ] Componente SEO.jsx creado
- [ ] SEO implementado en todas las páginas

### Fase 2
- [ ] Transcripciones optimizadas para indexación
- [ ] Páginas de historias con SEO dinámico
- [ ] Schema.org implementado para contenido

### Fase 3
- [ ] Prerendering configurado
- [ ] Lazy loading implementado
- [ ] Core Web Vitals optimizados
- [ ] Videos optimizados con schema

### Fase 4
- [ ] Breadcrumb implementado
- [ ] Enlaces internos mejorados
- [ ] Accesibilidad mejorada

### Fase 5
- [ ] Structured Data completo
- [ ] Página /historias creada
- [ ] Imagen OG creada
- [ ] Share buttons implementados

---

*Plan creado el: 4 de febrero de 2026*
*Próxima revisión: Después de implementar Fase 1*
