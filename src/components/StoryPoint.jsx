import { useRef, useEffect } from "react";

function StoryPoint({
  x = 0, // coordenada x
  y = 0, // coordenada y
  size = 5, // tamaño del punto
  color = "#22c55e", // color del punto
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ajustar canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");

      // Limpiar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el punto
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Llamar la primera vez
    resizeCanvas();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [x, y, size, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw", // 100% del ancho de la ventana
        height: "100vh", // 100% del alto de la ventana
      }}
    />
  );
}

export default StoryPoint;
