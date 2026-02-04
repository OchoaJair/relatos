// Configuración base de SEO para el sitio
export const siteConfig = {
  siteName: "Relatos de Reconciliación",
  siteUrl: "https://relatosdereconciliacion.com",
  defaultImage: "/og-image.jpg",
  language: "es",
  locale: "es_CO",
  twitterHandle: "@relatosreconcil",
};

// Configuración de SEO por página
export const seoConfig = {
  home: {
    title: "Relatos de Reconciliación | Memorias de Esperanza y Paz",
    description:
      "Relatos de Reconciliación es un proyecto multimedia que recopila testimonios de personas que han convivido con la violencia y buscan el diálogo, la reconciliación y la paz en Colombia.",
    keywords:
      "reconciliación, paz, Colombia, memoria histórica, testimonios, violencia, esperanza, animación",
  },
  about: {
    title: "Sobre el Proyecto | Relatos de Reconciliación",
    description:
      "Conoce más sobre Relatos de Reconciliación, un proyecto que da voz a las víctimas del conflicto armado en Colombia a través de documentales animados.",
    keywords:
      "sobre el proyecto, documental, animación, víctimas, conflicto armado, Colombia, memoria",
  },
  interactive: {
    title: "Visualización Interactiva | Relatos de Reconciliación",
    description:
      "Explora las historias de reconciliación de manera interactiva. Navega por los testimonios filtrados por tipo de violencia y técnicas de animación.",
    keywords:
      "interactivo, visualización, historias, testimonios, filtros, animación, violencia",
  },
  history: {
    titleTemplate: (name) => `${name} - Relatos de Reconciliación`,
    descriptionTemplate: (quote) =>
      quote ||
      "Testimonio de reconciliación y memoria histórica del conflicto armado en Colombia.",
    keywords:
      "testimonio, víctima, reconciliación, memoria, historia, Colombia",
  },
};

// Helper para generar URLs canónicas
export const getCanonicalUrl = (path = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${cleanPath}`;
};

// Helper para generar imagen OG
export const getOgImage = (imagePath) => {
  if (!imagePath) return `${siteConfig.siteUrl}${siteConfig.defaultImage}`;
  if (imagePath.startsWith("http")) return imagePath;
  return `${siteConfig.siteUrl}${imagePath}`;
};
