import React from "react";
import styles from "../styles/components/bosque.module.css";

const Bosque = ({ treeImage }) => {
  // Crear múltiples copias del árbol sin efecto de profundidad y mismo tamaño
  const renderTrees = () => {
    const trees = [];
    const numTrees = 20; // Número de árboles
    const treeSize = 400; // Tamaño más grande para todos los árboles

    // Asegurar que siempre haya árboles en los bordes
    // Árbol en el borde izquierdo
    trees.push(
      <img
        key={0}
        src={treeImage}
        alt={`Árbol 1`}
        className={styles.tree}
        style={{
          opacity: 0.1 + Math.random() * 0.2,
          left: "-7%",
          width: `${treeSize}px`,
          height: "auto",
          position: "absolute",
          bottom: "0",
          zIndex: 1,
        }}
      />
    );

    // Árbol en el borde derecho
    trees.push(
      <img
        key={1}
        src={treeImage}
        alt={`Árbol 2`}
        className={styles.tree}
        style={{
          opacity: 0.1 + Math.random() * 0.2,
          left: "107%",
          width: `${treeSize}px`,
          height: "auto",
          position: "absolute",
          bottom: "0",
          zIndex: 1,
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
          src={treeImage}
          alt={`Árbol ${i + 1}`}
          className={styles.tree}
          style={{
            opacity: opacity,
            left: `${leftPosition}%`,
            width: `${treeSize}px`,
            height: "auto",
            position: "absolute",
            bottom: "0",
            zIndex: 1,
          }}
        />
      );
    }

    return trees;
  };

  return <div className={styles.bosqueContainer}>{renderTrees()}</div>;
};

export default Bosque;
