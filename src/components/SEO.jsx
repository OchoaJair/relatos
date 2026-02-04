import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { siteConfig, getCanonicalUrl, getOgImage } from "../utils/seoConfig";

/**
 * Componente SEO reutilizable para manejar meta tags dinámicos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Meta descripción
 * @param {string} props.keywords - Palabras clave
 * @param {string} props.image - URL de la imagen OG
 * @param {string} props.url - URL canónica
 * @param {string} props.type - Tipo de contenido (website, article)
 * @param {Object} props.structuredData - Datos estructurados JSON-LD
 */
function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData = null,
}) {
  const fullTitle = title
    ? `${title} | ${siteConfig.siteName}`
    : siteConfig.siteName;
  const canonicalUrl = url || getCanonicalUrl();
  const ogImage = getOgImage(image);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && (
        <meta property="og:description" content={description} />
      )}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:site_name" content={siteConfig.siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      {description && (
        <meta property="twitter:description" content={description} />
      )}
      <meta property="twitter:image" content={ogImage} />
      {siteConfig.twitterHandle && (
        <meta property="twitter:site" content={siteConfig.twitterHandle} />
      )}

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf(["website", "article", "video.movie"]),
  structuredData: PropTypes.object,
};

export default SEO;
