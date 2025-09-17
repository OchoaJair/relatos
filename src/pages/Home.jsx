import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import styles from "../styles/pages/Home.module.css";
import Button from "../components/Button.jsx";

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

  return (
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
  );
}

export default Home;
