import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import styles from "../styles/pages/Home.module.css";
import Button from "../components/Button.jsx";
import SEO from "../components/SEO.jsx";
import { seoConfig, getCanonicalUrl, siteConfig } from "../utils/seoConfig.js";

//imágenes
import RelatosLogoBlanco from "../assets/RelatosLogoWhite.svg";
import RelatosLogoNegro from "../assets/RelatosLogo.svg";

function Home() {
  const { imgs } = useData();
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (imgs.length > 0) {
      const intervalo = setInterval(() => {
        setIndice((prevIndice) => (prevIndice + 1) % imgs.length);
      }, 5000);

      return () => clearInterval(intervalo);
    }
  }, [imgs]);

  if (imgs.length === 0) {
    return <div>Loading...</div>;
  }

  // Structured Data para la página de inicio
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: seoConfig.home.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.siteUrl}/Interactive?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SEO
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        url={getCanonicalUrl()}
        structuredData={homeStructuredData}
      />
      <div
        className={styles.root}
        style={{ backgroundImage: `url(${imgs[indice]})` }}
      >
      <figcaption className={styles.header}>
        <img src={RelatosLogoNegro} alt="Logo de Relatos" />
      </figcaption>
      <section className={styles.container}>
        <figcaption className={styles.container_header}>
          <img src={RelatosLogoBlanco} alt="Logo de Relatos" />
        </figcaption>
        <aside className={styles.container_content}>
          <></>
          <Button text="Interactivo" url="Interactive" />
          <Button text="Sobre el proyecto" url="About" />
        </aside>
      </section>
    </div>
    </>
  );
}

export default Home;
