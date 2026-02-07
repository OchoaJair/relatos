import { useState, useRef, useEffect } from "react";
import styles from "../styles/components/Credits.module.css";
import { creditsData } from "../data/credits";

function CreditSection({ title, names, subsections }) {
  if (subsections) {
    return (
      <div className={styles.creditSection}>
        <h4 className={styles.sectionTitle}>{title}</h4>
        <div className={styles.subsectionsGrid}>
          {Object.values(subsections).map((sub, idx) => (
            <div key={idx} className={styles.subsection}>
              {sub.title && <h5 className={styles.subsectionTitle}>{sub.title}</h5>}
              <ul className={styles.namesList}>
                {sub.names.map((name, nameIdx) => (
                  <li key={nameIdx} className={styles.nameItem}>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.creditSection}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <ul className={styles.namesList}>
        {names.map((name, idx) => (
          <li key={idx} className={styles.nameItem}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Credits() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const fullCreditsRef = useRef(null);

  useEffect(() => {
    if (!isExpanded) {
      setShowCloseButton(false);
      return;
    }

    const handleScroll = () => {
      if (!fullCreditsRef.current) return;
      
      const rect = fullCreditsRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      const hasScrolledPast = rect.top < 100;
      
      setShowCloseButton(isInViewport && hasScrolledPast);
    };

    // Check immediately after expansion
    setTimeout(handleScroll, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  const handleClose = () => {
    setIsExpanded(false);
    setShowCloseButton(false);
  };

  return (
    <div className={styles.creditsContainer}>
      <div 
        className={`${styles.closeButtonWrapper} ${showCloseButton ? styles.visible : ""}`}
      >
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Cerrar créditos"
        >
          Cerrar créditos
        </button>
      </div>

      <div className={styles.toggleContainer}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Ver menos créditos" : "Ver todos los créditos"}
        </button>
      </div>

      <div 
        ref={fullCreditsRef}
        className={`${styles.fullCredits} ${isExpanded ? styles.expanded : ""}`}
      >
        <div className={styles.creditsGrid}>
          <CreditSection {...creditsData.directores} />
          <CreditSection {...creditsData.productores} />
          <CreditSection {...creditsData.musicaOriginal} />
          <CreditSection {...creditsData.directorAnimacion} />
          <CreditSection {...creditsData.disenoPersonajes} />
          <CreditSection {...creditsData.montajistaSonido} />
          <CreditSection {...creditsData.disenoEscenarios} />
          <CreditSection {...creditsData.guion} />
          <CreditSection {...creditsData.disenoProduccion} />
          <CreditSection {...creditsData.ilustrador} />
          <CreditSection {...creditsData.directorArte} />
          <CreditSection {...creditsData.mezclador} />
          <CreditSection {...creditsData.directorTecnico} />
          <CreditSection {...creditsData.produccionMusical} />
          <CreditSection {...creditsData.diseno} />
          <CreditSection {...creditsData.disenoWeb} />
          <CreditSection {...creditsData.piezasMusicales} />
        </div>

        <div className={styles.fullWidthSection}>
          <CreditSection {...creditsData.animacion} />
        </div>

        <div className={styles.fullWidthSection}>
          <CreditSection {...creditsData.orquestaSinfonica} />
        </div>

        <div className={styles.fullWidthSection}>
          <CreditSection {...creditsData.agradecimientos} />
        </div>
      </div>
    </div>
  );
}
