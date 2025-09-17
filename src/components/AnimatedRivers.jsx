import React, { useEffect, useRef, useState } from "react";
import Perlin from "../utils/Perlin";
import River from "./River";

const AnimatedRivers = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const perlinRef = useRef(
    new Perlin(Math.random() * 1000, Math.random() * 1000)
  );
  const riversRef = useRef([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Colores para los ríos (tonalidades muy sutiles casi imperceptibles)
  const riverColors = [
    "rgb(40, 136, 214)",
    "rgb(87, 174, 210)",
    "rgb(45, 150, 150)",
    "#24a1e6",
    "#4d5bd6",
    "#5b8ea6",
    "#39a8b4",
    "#2893d6",
    "#1400e6",
    "#2844a1",
    "#69cbd6",
    "rgb(43, 125, 138)",
    "rgb(28, 171, 193)",
    "#769faf", // Variaciones de gris
  ];

  // Manejo del redimensionamiento
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inicialización y animación
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas no disponible");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("Contexto 2D no disponible");
      return;
    }

    console.log("Dimensiones del canvas:", dimensions.width, dimensions.height);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Limpiar ríos existentes
    riversRef.current = [];

    // Crear ríos iniciales
    const createRivers = () => {
      const numRivers = 50; // Aumentamos a 80 ríos (4 veces más)
      const pad = dimensions.width / numRivers;
      console.log("Creando ríos. Pad:", pad, "Ancho:", dimensions.width);

      for (let i = 0; i < numRivers; i++) {
        const baseX = pad * i;
        const x = baseX + Math.random() * (pad - 10); // Reducimos el espacio para distribuir mejor
        const y = 100 + Math.random() * (dimensions.height - 200); // Ajustamos el rango vertical

        // Modificar la dirección de los ríos
        // Opción 1: Ríos que fluyen principalmente hacia abajo
        const rStep = Math.PI / 2 + (Math.random() * Math.PI) / 4; // Direcciones entre 90° y 135°

        // Opción 2: Ríos que fluyen principalmente hacia la derecha
        // const rStep = Math.random() * Math.PI / 4; // Direcciones entre 0° y 45°

        // Opción 3: Ríos que fluyen en direcciones más horizontales
        // const rStep = (Math.random() > 0.5 ? 0 : Math.PI) + (Math.random() * Math.PI / 4);

        const color =
          riverColors[Math.floor(Math.random() * riverColors.length)];

        console.log("Creando río en:", x, y, "con color:", color);

        riversRef.current.push(
          new River(x + rStep / 2, y, rStep, perlinRef.current, ctx, color)
        );
      }
      console.log("Ríos creados:", riversRef.current.length);
    };

    createRivers();

    // Función de animación
    const animate = () => {
      // No limpiamos el canvas para que los rastros permanezcan visibles

      // Actualizar y dibujar ríos
      for (let i = riversRef.current.length - 1; i >= 0; i--) {
        const river = riversRef.current[i];
        if (river.finished) {
          riversRef.current.splice(i, 1);
        } else {
          try {
            river.update();
          } catch (error) {
            console.error("Error actualizando río:", error);
          }
        }
      }

      // No creamos nuevos ríos - solo mantenemos los iniciales
      // La animación continuará hasta que todos los ríos iniciales terminen

      animationRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animación
    animate();

    // Limpiar en el desmontaje
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 9999999, // Aseguramos que esté detrás de todos los elementos
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {/* Puedes agregar contenido adicional aquí */}
      </div>
    </div>
  );
};

export default AnimatedRivers;
