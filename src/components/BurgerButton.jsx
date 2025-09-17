import { useState } from "react";
import styles from "../styles/components/BurgerButton.module.css";
import { Link } from "react-router-dom";
import iconHome from "../assets/iconHome.svg";
import iconPlay from "../assets/iconPlay.svg";
import iconDraw from "../assets/iconDraw.svg";

function BurgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className={styles.button}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <div className={`${styles.line} ${isOpen ? styles.line1 : ""}`} />
        <div className={`${styles.line} ${isOpen ? styles.line2 : ""}`} />
        <div className={`${styles.line} ${isOpen ? styles.line3 : ""}`} />
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                <img src={iconHome} alt="icono de casa" />
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/Interactive" onClick={toggleMenu}>
                <img src={iconPlay} alt="Icono de play" />
                Relatos
              </Link>
            </li>
            <li>
              <Link to="/participa" onClick={toggleMenu}>
                <img src={iconDraw} alt="icono de dibujo" />
                Participa
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay (se cierra al tocar fuera) */}
      {isOpen && <div className={styles.overlay} onClick={toggleMenu} />}
    </>
  );
}

export default BurgerButton;
