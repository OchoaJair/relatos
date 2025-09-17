import React from "react";
import styles from "../styles/components/bosque.module.css";

// Importar todas las imágenes de árboles
import tree1 from "../assets/trees/1.webp";
import tree2 from "../assets/trees/2.webp";
import tree3 from "../assets/trees/3.webp";
import tree4 from "../assets/trees/4.webp";
import tree5 from "../assets/trees/5.webp";
import tree6 from "../assets/trees/6.webp";
import tree7 from "../assets/trees/7.webp";
import tree8 from "../assets/trees/8.webp";
import tree9 from "../assets/trees/9.webp";

const Bosque = () => {
  // Array con todas las imágenes de árboles
  const treeImages = [
    tree1,
    tree2,
    tree3,
    tree4,
    tree5,
    tree6,
    tree7,
    tree8,
    tree9,
  ];

  // Función para obtener un árbol aleatorio
  const getRandomTree = () => {
    const randomIndex = Math.floor(Math.random() * treeImages.length);
    return treeImages[randomIndex];
  };

  // Crear múltiples copias de árboles aleatorios sin efecto de profundidad y mismo tamaño
  const renderTrees = () => {
    const trees = [];
    const numTrees = 40; // Número de árboles
    
    // Ajustar tamaño según el ancho de la pantalla
    const isMobile = window.innerWidth <= 768;
    const maxHeight = isMobile ? "100%" : "100%"; // Usar porcentaje en lugar de vw para mantener proporciones

    // Asegurar que siempre haya árboles en los bordes
    // Árbol en el borde izquierdo
    trees.push(
      <img
        key={0}
        src={getRandomTree()}
        alt={`Árbol 1`}
        className={styles.tree}
        style={{
          opacity: 0.1 + Math.random() * 0.2,
          left: "-7%",
          maxWidth: isMobile ? "15vw" : "25vw",
          height: "auto",
          position: "absolute",
          bottom: "0",
          zIndex: 1,
          maxHeight: maxHeight,
        }}
      />
    );

    // Árbol en el borde derecho
    trees.push(
      <img
        key={1}
        src={getRandomTree()}
        alt={`Árbol 2`}
        className={styles.tree}
        style={{
          opacity: 0.1 + Math.random() * 0.2,
          left: "107%",
          maxWidth: isMobile ? "15vw" : "25vw",
          height: "auto",
          position: "absolute",
          bottom: "0",
          zIndex: 1,
          maxHeight: maxHeight,
        }}
      />
    );

    // Generar el resto de los árboles con posiciones aleatorias
    for (let i = 2; i < numTrees; i++) {
      // Opacidad baja, entre 0.1 y 0.4
      const opacity = 0.1 + Math.random() * 0.2;

      // Posición horizontal más aleatoria pero dentro de un rango que se salga por los lados
      // Distribuir entre -7% y 107% para que se salgan por los bordes
      const leftPosition = -7 + Math.random() * 114;

      trees.push(
        <img
          key={i}
          src={getRandomTree()}
          alt={`Árbol ${i + 1}`}
          className={styles.tree}
          style={{
            opacity: opacity,
            left: `${leftPosition}%`,
            maxWidth: isMobile ? "15vw" : "25vw",
            height: "auto",
            position: "absolute",
            bottom: "0",
            zIndex: 1,
            maxHeight: maxHeight,
          }}
        />
      );
    }

    return trees;
  };

  return <div className={styles.bosqueContainer}>{renderTrees()}</div>;
};

export default Bosque;
