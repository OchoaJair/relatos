import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import styles from "../styles/pages/History.module.css";
import BurgerButton from "../components/BurgerButton.jsx";
import Draw from "../components/Draw.jsx";

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
import videoAcacia from "../assets/videos/Acacia Final.webm";
import videoAlamo from "../assets/videos/Alamo Final.webm";
import videoAraucaria from "../assets/videos/Araucaria Final.webm";
import videoEsperanza from "../assets/videos/Esperanza Final.webm";
import videoFloramarillo from "../assets/videos/Floramarillo Final.webm";
import videoGustavo from "../assets/videos/Gustavo Final1.webm";
import videoJazmin from "../assets/videos/Jazmin Final.webm";
import videoMagnolia from "../assets/videos/Magnolia Final.webm";
import videoNatali from "../assets/videos/Natali Final.webm";
import videoOlga from "../assets/videos/Olga Final.webm";
import videoSauco from "../assets/videos/Sauco Final.webm";
import videoUrapan from "../assets/videos/Urapan Final.webm";
import videoVictor from "../assets/videos/Victor Final.webm";
import videoVirgelina from "../assets/videos/Virgelina Final.webm";
import videoYovana from "../assets/videos/Yovana-Final.webm";
import videoZilbaro from "../assets/videos/Zilbaro Final.webm";

const trees = [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9];

const videos = {
  acacia: videoAcacia,
  alamo: videoAlamo,
  araucaria: videoAraucaria,
  esperanza: videoEsperanza,
  floramarillo: videoFloramarillo,
  gustavo: videoGustavo,
  jazmin: videoJazmin,
  magnolia: videoMagnolia,
  natali: videoNatali,
  olga: videoOlga,
  sauco: videoSauco,
  urapan: videoUrapan,
  victor: videoVictor,
  virgelina: videoVirgelina,
  yovana: videoYovana,
  zilbaro: videoZilbaro,
};

function History() {
  const { id } = useParams();
  const { data } = useData();

  const item = data.find((item) => item.slug === id);
  const currentIndex = data.findIndex((item) => item.slug === id);
  const nextItem = data[(currentIndex + 1) % data.length];
  const prevItem = data[(currentIndex - 1 + data.length) % data.length];

  // Imprimir el item en consola para depuración
  console.log("Item actual:", item);
  console.log("ID del item:", id);
  console.log("Índice actual:", currentIndex);

  const videoUrl = videos[id] || ""; // Obtiene la URL del video basado en el slug

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
        {videoUrl && (
          <section className={styles.videoContainer}>
            <VideoPlayer videoUrl={videoUrl} videoId={id} />
          </section>
        )}

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
