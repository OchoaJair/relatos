import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import styles from "../styles/pages/history.module.css";
import BurgerButton from "../components/BurgerButton.jsx";
import Draw from "../components/Draw.jsx";
import WaveAnimation from "../components/WaveAnimation";
import Bosque from "../components/Bosque.jsx";

// Imágenes
import tree1 from "../assets/trees/1.webp";
import tree2 from "../assets/trees/2.webp";
import tree3 from "../assets/trees/3.webp";
import tree4 from "../assets/trees/4.webp";
import tree5 from "../assets/trees/5.webp";
import tree6 from "../assets/trees/6.webp";
import tree7 from "../assets/trees/7.webp";
import tree8 from "../assets/trees/8.webp";
import tree9 from "../assets/trees/9.webp";
import logoRelatos from "../assets/RelatosLogo.svg";
import docsPaper from "../assets/docs-papel.webp";
import polaroid from "../assets/polaroid.webp";

// Videos
const trees = [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9];

// URLs de videos en Bunny.net (ficticias para preparación)
const videoUrls = {
  acacia: "https://bunnycdn.com/path/to/acacia-final.webm",
  alamo: "https://bunnycdn.com/path/to/alamo-final.webm",
  araucaria: "https://bunnycdn.com/path/to/araucaria-final.webm",
  "des-esperanza": "https://bunnycdn.com/path/to/esperanza-final.webm",
  floramarillo: "https://bunnycdn.com/path/to/floramarillo-final.webm",
  gustavo: "https://bunnycdn.com/path/to/gustavo-final1.webm",
  jazmin: "https://bunnycdn.com/path/to/jazmin-final.webm",
  magnolia: "https://bunnycdn.com/path/to/magnolia-final.webm",
  "natalia-puerto": "https://bunnycdn.com/path/to/natali-final.webm",
  olga: "https://bunnycdn.com/path/to/olga-final.webm",
  sauco: "https://bunnycdn.com/path/to/sauco-final.webm",
  urapan: "https://bunnycdn.com/path/to/urapan-final.webm",
  victor: "https://bunnycdn.com/path/to/victor-final.webm",
  "virgelina-chara": "https://bunnycdn.com/path/to/virgelina-final.webm",
  yovana: "https://bunnycdn.com/path/to/yovana-final.webm",
  zilbaro: "https://bunnycdn.com/path/to/zilbaro-final.webm",
};

function History() {
  const { id } = useParams();
  const { data } = useData();

  const item = data.find((item) => item.slug === id);
  const currentIndex = data.findIndex((item) => item.slug === id);
  const nextItem = data[(currentIndex + 1) % data.length];
  const prevItem = data[(currentIndex - 1 + data.length) % data.length];

  console.log(item);

  // Imprimir el item en consola para depuración
  console.log("Item actual:", item);
  console.log("ID del item:", id);
  console.log("Índice actual:", currentIndex);

  const videoUrl = videoUrls[id] || ""; // Obtiene la URL del video basado en el slug

  const galleryPhotos = [];
  for (const items in item.gallery) {
    galleryPhotos.push(item.gallery[items].large);
  }

  const removeHTMLTags = (html) => {
    if (!html) return "";

    return (
      html
        // Reemplaza etiquetas que implican saltos de línea por \n\n
        .replace(/<\/(p|div|br|li|h[1-6])>/gi, "\n\n")
        // Elimina todas las demás etiquetas HTML
        .replace(/<[^>]*>/g, "")
        // Reemplaza múltiples saltos de línea por solo dos
        .replace(/\n{3,}/g, "\n\n")
        // Elimina espacios extra al principio y final
        .trim()
    );
  };

  const randomIndex = Math.floor(Math.random() * trees.length);
  const treeImage = trees[randomIndex];

  if (!item) {
    return <div>Ítem no encontrado</div>;
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <BurgerButton />
        <Link to="/">
          <img src={logoRelatos} alt="Logo de Relatos" />
        </Link>
      </header>
      <main className={styles.main}>
        <section className={styles.resume}>
          <aside className={styles.resumeContent}>
            <h1>{item.title}</h1>
            <p>
              <strong>“</strong>
              {item.quote}
              <strong>”</strong>
            </p>
          </aside>
          <aside className={styles.resumeTrees}>
            <section
              className={styles.galleryStack}
              style={{ maskImage: `url(${treeImage})` }}
            >
              {galleryPhotos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Imagen de la galería ${idx + 1}`}
                  className={styles.galleryStackImg}
                  style={{ zIndex: idx }}
                />
              ))}
            </section>
          </aside>
        </section>

        {/* Mostrar el VideoPlayer con la URL dinámica */}
        <section className={styles.videoContainer}>
          {videoUrl ? (
            <VideoPlayer videoUrl={videoUrl} videoId={id} />
          ) : (
            <div className={styles.videoPlaceholder}>
              <p>Video no disponible para este ítem</p>
            </div>
          )}
        </section>

        <section className={styles.videoSummary}>
          <aside className={styles.videoSummary_text}>
            <img src={docsPaper} alt="Hoja con resumen" />
            <div
              className={styles.videoSummary_text_box}
              style={{ whiteSpace: "pre-wrap" }}
            >
              <p>Transcripción</p>
              {removeHTMLTags(item.transcript)}
            </div>
          </aside>
          <aside className={styles.videoSummary_images}>
            <aside className={styles.videoSummary_images_container}>
              {galleryPhotos.map((imgSrc, index) => (
                <div key={index} className={styles.polaroidContainer}>
                  <img
                    src={imgSrc}
                    alt={`foto-${index}`}
                    className={styles.innerPhoto}
                  />
                  <img
                    src={polaroid}
                    alt="polaroid"
                    className={styles.polaroidFrame}
                  />
                </div>
              ))}
            </aside>
          </aside>
        </section>

        <section className={styles.draw_section}>
          <Draw />
        </section>
      </main>

      <div className={styles.waves}>
        <WaveAnimation numWaves={7} height="80px" />
      </div>

      <div className={styles.forest}>
        <Bosque treeImage={treeImage} />
      </div>

      {/* Navegación entre ítems */}
      <section className={styles.navButtons}>
        <Link to={`/${prevItem.slug}`}>
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000"
          >
            <path d="M14.71 6.71c.39.39.39 1.02 0 1.41L10.83 12l3.88 3.88c.39.39.39 1.02 0 1.41-.39.39-1.02.39-1.41 0l-4.59-4.59c-.39-.39-.39-1.02 0-1.41l4.59-4.59c.38-.38 1.02-.38 1.41.01z" />
          </svg>
        </Link>
        <Link to={`/${nextItem.slug}`}>
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="#000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41l-4.59-4.59c-.38-.38-1.02-.38-1.41.01z" />
          </svg>
        </Link>
      </section>
    </div>
  );
}

export default History;
