import { useState, useEffect, useRef } from "react";

const BirdAnimation = ({ frames }) => {
    const [animFrame, setAnimFrame] = useState(0);
    const [style, setStyle] = useState({
        position: "absolute",
        left: "-150px", // Inicio fuera de la pantalla (izquierda)
        top: "10%",
        width: "150px",
        height: "auto",
        zIndex: 20,
        pointerEvents: "none",
        transition: "none", // Sin transición inicial para el reset instantáneo
        opacity: 0, // Oculto inicialmente
    });

    useEffect(() => {
        if (!frames || frames.length === 0) return;

        let timeoutId;
        let frameInterval;

        const startFlight = () => {
            // 1. Configurar parámetros aleatorios para el vuelo
            const randomTop = Math.floor(Math.random() * 60 + 5); // 5% a 65% de altura
            const randomDuration = Math.floor(Math.random() * 7000 + 8000); // 8s a 15s
            const randomScale = Math.random() * 0.4 + 0.5; // 0.5 a 0.9 escala

            // 2. Resetear posición (inicio)
            setStyle((prev) => ({
                ...prev,
                left: "-200px", // Asegurar que esté fuera
                top: `${randomTop}%`,
                transform: `scale(${randomScale})`,
                transition: "none",
                opacity: 1, // Hacer visible
            }));

            // 3. Iniciar el movimiento después de un pequeño frame para que el navegador procese el reset
            setTimeout(() => {
                setStyle((prev) => ({
                    ...prev,
                    left: "calc(100% + 200px)", // Destino (fuera derecha)
                    transition: `left ${randomDuration}ms linear`, // Movimiento lineal
                }));

                // 4. Programar el siguiente vuelo cuando este termine
                timeoutId = setTimeout(() => {
                    // Ocultar y resetear (opcional, aunque el reset del startFlight maneja la posición)
                    setStyle((prev) => ({ ...prev, opacity: 0, transition: "opacity 0.5s" }));

                    // Esperar un tiempo aleatorio antes del siguiente vuelo
                    const nextFlightDelay = Math.floor(Math.random() * 5000 + 2000);
                    timeoutId = setTimeout(startFlight, nextFlightDelay);

                }, randomDuration);
            }, 100);
        };

        // Iniciar el ciclo de animación de frames (aleteo)
        frameInterval = setInterval(() => {
            setAnimFrame((prev) => (prev + 1) % frames.length);
        }, 120); // Velocidad de aleteo

        // Iniciar el primer vuelo con un pequeño delay
        timeoutId = setTimeout(startFlight, 1000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(frameInterval);
        };
    }, [frames]);

    if (!frames || frames.length === 0) return null;

    return (
        <div style={style}>
            <img
                src={frames[animFrame]}
                alt="Animación usuario"
                style={{ width: "100%", height: "auto" }}
            />
        </div>
    );
};

export default BirdAnimation;
