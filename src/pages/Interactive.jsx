import { useData } from "../context/DataContext";
import styles from "../styles/pages/Interactive.module.css";
import BurgerButton from "../components/BurgerButton.jsx";
import Filters from "../components/Filters.jsx";
import Draw from "../components/Draw.jsx";
import StoryPoint from "../components/StoryPoint.jsx";
import AnimatedRivers from "../components/AnimatedRivers.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import WaveAnimation from "../components/WaveAnimation";

//imágenes
import relatosLogoNegro from "../assets/RelatosLogo.svg";
import arbolCenital from "../assets/arbolCenital.png";
import { Play } from "lucide-react";

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
  const [rotations, setRotations] = useState({});
  const hasInitialized = useRef(false);
  const navigate = useNavigate(); // Hook for navigation

  const mainRef = useRef(null);
  const itemRefs = useRef({});
  const [offsets, setOffsets] = useState({});
  const [mainBottomInRoot, setMainBottomInRoot] = useState(0);
  const [gridColumns, setGridColumns] = useState(0);

  const filteredData = useMemo(() => data.filter(
    (item) =>
      selectedItems.length === 0 ||
      selectedItems.every(
        (selected) =>
          item.violencia.includes(selected) ||
          item.tecnicas.includes(selected)
      )
  ), [data, selectedItems]);

  const visibleTreeIds = useMemo(() => {
    if (gridColumns <= 0 || filteredData.length === 0) return new Set();
    const selectedIds = new Set();
    for (let c = 0; c < gridColumns; c++) {
      const candidates = filteredData.filter((_, index) => index % gridColumns === c);
      if (candidates.length > 0) {
        const winner = candidates[Math.floor(Math.random() * candidates.length)];
        selectedIds.add(winner.id);
      }
    }
    return selectedIds;
  }, [filteredData, gridColumns]);

  useEffect(() => {
    const calculatedSizes = {};
    const calculatedPositions = {};
    const calculatedRotations = {};
    data.forEach((item) => {
      calculatedSizes[item.id] = Math.floor(Math.random() * (95 - 25 + 1)) + 25;
      calculatedPositions[item.id] = Math.random() * 35; // Posición en porcentaje (0% a 35%)
      // Random rotation 0 to 360 degrees
      calculatedRotations[item.id] = Math.floor(Math.random() * 360);
    });
    setSizes(calculatedSizes);
    setPositions(calculatedPositions);
    setRotations(calculatedRotations);

    // Limpiar los datos de violencia seleccionada solo en la primera carga
    // if (!hasInitialized.current) {
    //   setSelectedViolenceInContext([]);
    //   hasInitialized.current = true;
    // }
  }, [data, setSelectedViolenceInContext]);

  useEffect(() => {
    const calculateOffsets = () => {
      if (!mainRef.current) return;
      const mainRect = mainRef.current.getBoundingClientRect();



      const computedStyle = window.getComputedStyle(mainRef.current);
      const columns = computedStyle.gridTemplateColumns.split(" ").length;
      setGridColumns(columns);

      const children = Array.from(mainRef.current.children);
      // Count unique vertical positions to determine rows
      const gridRows = new Set(children.map((child) => child.offsetTop)).size;
      // console.log(`Grid Layout: ${columns} Columns, ${gridRows} Rows`);

      const newOffsets = {};

      filteredData.forEach((item) => {
        const itemEl = itemRefs.current[item.id];
        if (itemEl) {
          const itemRect = itemEl.getBoundingClientRect();
          // Distance from the bottom of the item to the bottom of the container
          const distance = mainRect.bottom - itemRect.bottom;
          newOffsets[item.id] = distance;
        }
      });
      setOffsets(newOffsets);

      // Calcular el final de main relativo al contenedor root
      const parentEl = mainRef.current.parentElement;
      if (parentEl) {
        const parentRect = parentEl.getBoundingClientRect();
        setMainBottomInRoot(mainRect.bottom - parentRect.top);
      }
    };

    calculateOffsets();
    window.addEventListener("resize", calculateOffsets);

    // Recalculate after a short delay to ensure rendering is complete
    const timeoutId = setTimeout(calculateOffsets, 100);

    return () => {
      window.removeEventListener("resize", calculateOffsets);
      clearTimeout(timeoutId);
    };
  }, [filteredData, positions, sizes]);

  return (
    <div className={styles.root}>
      <div className={styles.riversHeader}>
        <AnimatedRivers />
      </div>
      <div className={styles.burgerButtonContainer}>
        <BurgerButton />
      </div>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={relatosLogoNegro} alt="Logo de Relatos" />
        </Link>
      </div>
      <header className={styles.header}>
      </header>
      <aside className={styles.aside}>
        <Filters />
        {selectedItems.length > 0 && filteredData.length > 0 && (
          <button
            className={styles.storyExplanation}
            onClick={() => navigate(`/${filteredData[0].slug}`)}
          >
            <Play size={18} fill="currentColor" />
            <span>Mira tu largometraje</span>
          </button>
        )}
      </aside>
      <main className={`${styles.main} ${selectedItems.length > 0 ? styles.hasFilters : ""}`} ref={mainRef}>
        {filteredData.map((item) => (
          <Link
            key={item.id}
            to={`/${item.slug}`}
            ref={(el) => (itemRefs.current[item.id] = el)}
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
                    transform: `rotate(${rotations[item.id] || 0}deg)`,
                  }}
                  src={arbolCenital}
                  alt="Arbol"
                />
                <div className={styles.storyPointOverlay}></div>
              </div>
              {visibleTreeIds.has(item.id) && (
                <img
                  src={treeImages[item.id % treeImages.length]}
                  alt="Tree decoration"
                  className={styles.treeImage}
                  style={{
                    width: `${Math.floor(Math.random() * (120 - 80 + 1)) + 80}px`,
                    top: offsets[item.id] !== undefined
                      ? `calc(100% + ${offsets[item.id]}px)`
                      : "100%",
                    bottom: "auto"
                  }}
                />
              )}
            </article>
          </Link>
        ))}
      </main>
      <section
        className={styles.waves}
        style={{
          top: (window.innerWidth < 768 && selectedItems.length === 0) ? "35%" : `${mainBottomInRoot + (window.innerWidth < 768 ? 50 : 30)}px`
        }}
      >
        <WaveAnimation numWaves={10} />
      </section>
      <section className={styles.draw}>
        <Draw />
      </section>
    </div >
  );
}

export default Interactive;
