import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";
import { useMemo } from "react";
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

// URLs de videos en Bunny.net - Formato: {guid}/index.m3u8 para HLS
const bunnyVideoData = {
  acacia: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/e3c0f7ca-4dab-4c81-beed-ea426e0de4e8/playlist.m3u8",
  },
  alamo: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/2c7483e3-d46c-48bf-91fd-bc8e3e211efe/playlist.m3u8",
  },
  araucaria: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/a60bd608-2524-4d87-ac4a-cec079bec463/playlist.m3u8",
  },
  "des-esperanza": {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/33f295a4-4e2f-42cb-bd8b-874e2a4413b9/playlist.m3u8",
  },
  floramarillo: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/fd2c8b69-2483-4373-bddc-ee44daf956ba/playlist.m3u8",
  },
  gustavo: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/3db28aa9-764e-4b50-90f3-af3f49e9572f/playlist.m3u8",
  },
  jazmin: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/7c1918b3-958d-4822-a81f-2a4dff55daf2/playlist.m3u8",
  },
  magnolia: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/76e60063-7bfe-4317-a55c-9d2d6b835e58/playlist.m3u8",
  },
  "natalia-puerto": {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/524045e5-b3bf-4e81-a8d1-65d86bcefe39/playlist.m3u8",
  },
  olga: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/7e51987f-c800-48c8-b025-a2a303e22a1b/playlist.m3u8",
  },
  sauco: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/ce1d5e8a-b65b-4bfa-b775-6fe21f7e5827/playlist.m3u8",
  },
  urapan: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/84d2293e-e2b6-4c4d-8cca-0ff54ddb6097/playlist.m3u8",
  },
  victor: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/189a5560-d7a4-44f2-b632-e5b4d32b0207/playlist.m3u8",
  },
  "virgelina-chara": {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/5bb2d77d-6fb2-44f1-baae-011808a5a038/playlist.m3u8",
  },
  yovana: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/78ac6ffd-e604-452f-9634-25626104d560/playlist.m3u8",
  },
  zilbaro: {
    hlsUrl:
      "https://vz-5504f54b-251.b-cdn.net/02f781cd-ddbe-4a0f-93ae-0953893ed805/playlist.m3u8",
  },
};

function History() {
  const { id } = useParams();
  const { data, selectedViolence, violenceSlugs, extraData } = useData();
  const navigate = useNavigate();

  const item = data.find((item) => item.slug === id);

  const relatedStories = (violenceSlugs.length > 0
    ? violenceSlugs.map(slug => data.find(d => d.slug === slug)).filter(Boolean)
    : (item ? [item] : [])
  ).filter(story => story && bunnyVideoData[story.slug]?.hlsUrl);

  const groupName = useMemo(() => {
    if (!extraData || !extraData.violencia || !selectedViolence || selectedViolence.length === 0) {
      return null;
    }
    const selectedNames = selectedViolence
      .map(id => extraData.violencia.find(v => v.id === id)?.name)
      .filter(Boolean);
    return selectedNames.join(', ');
  }, [extraData, selectedViolence]);


  const handleVideoEnd = () => {
    if (nextItem && nextItem.slug) {
      navigate('/' + nextItem.slug);
    }
  };
  
  let nextItem, prevItem;
  if (violenceSlugs.length > 0) {
    const currentIndex = violenceSlugs.findIndex((slug) => slug === id);
    const nextIndex = (currentIndex + 1) % violenceSlugs.length;
    const prevIndex =
      (currentIndex - 1 + violenceSlugs.length) % violenceSlugs.length;

    nextItem = data.find((item) => item.slug === violenceSlugs[nextIndex]);
    prevItem = data.find((item) => item.slug === violenceSlugs[prevIndex]);
  } else {
    const currentIndex = data.findIndex((item) => item.slug === id);
    nextItem = data[(currentIndex + 1) % data.length];
    prevItem = data[(currentIndex - 1 + data.length) % data.length];
  }

  const videoData = bunnyVideoData[id] || {}; 
  const videoUrl = videoData.hlsUrl || ""; 

  if (!item) {
    return <div>Ítem no encontrado</div>;
  }

  const galleryPhotos = item.gallery ? Object.values(item.gallery).map(g => g.large) : [];

  const removeHTMLTags = (html) => {
    if (!html) return "";
    return html
      .replace(/<\/(p|div|br|li|h[1-6])>/gi, "\n\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const randomIndex = Math.floor(Math.random() * trees.length);
  const treeImage = trees[randomIndex];

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

        <section className={styles.videoContainer}>
          {videoUrl ? (
            <VideoPlayer
              videoUrl={videoUrl}
              activeStory={item}
              relatedStories={relatedStories}
              onVideoEnd={handleVideoEnd}
              groupName={groupName}
            />
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
        <WaveAnimation
          numWaves={7}
          height="80px"
          violenceTypes={item.violencia}
        />
      </div>

      <div className={styles.forest}>
        <Bosque />
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
