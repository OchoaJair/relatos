import style from "../styles/pages/About.module.css";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";

//imágenes
import Logo from "../assets/RelatosLogo.svg";

function About() {
  const video = ({ videoId }) => {
    const width = Math.min(window.innerWidth * 0.9, 550);
    const height = (width * 9) / 16; // Mantiene relación 16:9

    const opts = {
      height: height.toString(),
      width: width.toString(),
    };

    return <YouTube videoId={videoId} opts={opts} />;
  };

  return (
    <div className={style.root}>
      <header className={style.header}>
        <Link to="/">
          <img src={Logo} alt="Logo de Relatos" />
        </Link>
      </header>
      <main className={style.main}>
        <section className={style.section}>
          <h1>Sobre el Proyecto</h1>
          <p>
            En Relatos de Reconciliación se encuentran las memorias de personas
            que han convivido con la violencia y el horror de la guerra y buscan
            con esperanza el diálogo, la reconciliación y la paz.
          </p>
          <p>
            Sus testimonios son una oportunidad para crear nuevos caminos que
            permitan aportar a la construcción de una sociedad en donde estos
            hechos no se repitan.
          </p>
        </section>
        <section className={style.section}>
          <h2>Trailer</h2>
          {video({ videoId: "RYw-IjhvBys" })}
        </section>
        <section className={style.section}>
          <h2>Créditos</h2>
          <p>
            <strong>Dirección:</strong> Carlos Santa y Rubén Monroy
          </p>
          <p>
            <strong>Dirección Multimedia:</strong> Juan Camilo Gonzalez y Rubén
            Monroy
          </p>
          <p>
            <strong>Composición Musical:</strong> Fabio Miguel Fuentes.
          </p>
          <p>
            <strong>Diseño gráfico:</strong> Gustavo Cardenas y Rubén Monroy
          </p>
          <p>
            <strong>Desarrollo web:</strong> Jair Leonardo Ochoa Medina
          </p>
        </section>
        <section className={style.section}>
          <h2>Making-of</h2>
          {video({ videoId: "9qItRTUocXM" })}
        </section>
        <section className={style.section}>
          <h2>Contáctenos</h2>
          <p>rubenmonroylopez@gmail.com</p>
        </section>
      </main>
    </div>
  );
}

export default About;
