import { useData } from "../context/DataContext";
import styles from "../styles/pages/Interactive.module.css";
import BurgerButton from "../components/BurgerButton.jsx";
import Filters from "../components/Filters.jsx";
import Draw from "../components/Draw.jsx";
import Waves from "../components/Waves.jsx";
import StoryPoint from "../components/StoryPoint.jsx";
import AnimatedRivers from "../components/AnimatedRivers.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

//imágenes
import relatosLogoNegro from "../assets/RelatosLogo.svg";
import arbolCenital from "../assets/arbolCenital.png";

function Interactive() {
  const { data, selectedItems } = useData();
  const [sizes, setSizes] = useState({});
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const calculatedSizes = {};
    const calculatedPositions = {};
    data.forEach((item) => {
      calculatedSizes[item.id] = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
      calculatedPositions[item.id] = Math.random() * 60; // Posición en porcentaje (0% a 100%)
    });
    setSizes(calculatedSizes);
    setPositions(calculatedPositions);
  }, [data]);

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
              </article>
            </Link>
          ))}
      </main>
      <section className={styles.waves}>
        <Waves count={selectedItems.length || data.length} />
      </section>
      <section className={styles.draw}>
        <Draw />
      </section>
    </div>
  );
}

export default Interactive;
