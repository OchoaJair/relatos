import { useData } from "../context/DataContext";
import styles from "../styles/pages/Interactive.module.css";
import BurgerButton from "../components/BurgerButton.jsx";
import Filters from "../components/Filters.jsx";
import Draw from "../components/Draw.jsx";
import StoryPoint from "../components/StoryPoint.jsx";
import AnimatedRivers from "../components/AnimatedRivers.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import WaveAnimation from "../components/WaveAnimation";

//imágenes
import relatosLogoNegro from "../assets/RelatosLogo.svg";
import arbolCenital from "../assets/arbolCenital.png";

// Importar imágenes de árboles
import tree1 from "../assets/trees/1.webp";
import tree2 from "../assets/trees/2.webp";
import tree3 from "../assets/trees/3.webp";
import tree4 from "../assets/trees/4.webp";
import tree5 from "../assets/trees/5.webp";
import tree6 from "../assets/trees/6.webp";
import tree7 from "../assets/trees/7.webp";
import tree8 from "../assets/trees/8.webp";
import tree9 from "../assets/trees/9.webp";

const treeImages = [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9];

function Interactive() {
  const { data, selectedItems, setSelectedViolenceInContext } = useData();
  const [sizes, setSizes] = useState({});
  const [positions, setPositions] = useState({});
  const hasInitialized = useRef(false);

  useEffect(() => {
    const calculatedSizes = {};
    const calculatedPositions = {};
    data.forEach((item) => {
      calculatedSizes[item.id] = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
      calculatedPositions[item.id] = Math.random() * 35; // Posición en porcentaje (0% a 35%)
    });
    setSizes(calculatedSizes);
    setPositions(calculatedPositions);

    // Limpiar los datos de violencia seleccionada solo en la primera carga
    // if (!hasInitialized.current) {
    //   setSelectedViolenceInContext([]);
    //   hasInitialized.current = true;
    // }
  }, [data, setSelectedViolenceInContext]);

  return (
    <div className={styles.root}>
      <div className={styles.riversHeader}>
        <AnimatedRivers />
      </div>
      <header className={styles.header}>
        <BurgerButton />
        <Link to="/">
          <img src={relatosLogoNegro} alt="Logo de Relatos" />
        </Link>
      </header>
      <aside className={styles.aside}>
        <Filters />
      </aside>
      <main className={styles.main}>
        {data
          .filter(
            (item) =>
              selectedItems.length === 0 ||
              selectedItems.every(
                (selected) =>
                  item.violencia.includes(selected) ||
                  item.tecnicas.includes(selected)
              )
          )
          .map((item) => (
            <Link
              key={item.id}
              to={`/${item.slug}`}
              style={{
                display: "flex",
                position: "relative",
                top: `${positions[item.id]}%`,
                height: `calc(100% - ${positions[item.id]}%)`,
              }}
              className={styles.item_history}
            >
              <article className={styles.item_history_content}>
                <p className={styles.item_history_title}>{item.title}</p>
                <div className={styles.storyPointContainer}>
                  <img
                    style={{
                      width: `${sizes[item.id]}px`,
                      height: "auto",
                    }}
                    src={arbolCenital}
                    alt="Arbol"
                  />
                  <div className={styles.storyPointOverlay}></div>
                </div>
                <img
                  src={treeImages[item.id % treeImages.length]}
                  alt="Tree decoration"
                  className={styles.treeImage}
                  style={{
                    width: `${Math.floor(Math.random() * (120 - 80 + 1)) + 80}px`,
                  }}
                />
              </article>
            </Link>
          ))}
      </main>
      <section className={styles.waves}>
        <WaveAnimation numWaves={10} />
      </section>
      <section className={styles.draw}>
        <Draw />
      </section>
    </div>
  );
}

export default Interactive;
