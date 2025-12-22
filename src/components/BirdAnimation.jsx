import { useState, useEffect, useRef } from "react";

const BirdAnimation = ({ frames }) => {
    const [animFrame, setAnimFrame] = useState(0);
    const birdRef = useRef(null); // Ref para la imagen del pájaro
    const animationRef = useRef(null);

    // Referencias para el estado de la animación
    const stateRef = useRef({
        x: 0,
        y: 0,
        speed: 0,
        centerX: 0,
        amplitude: 0,
        frequency: 0,
        time: 0,
        isFlying: false,
        scale: 0.5
    });

    useEffect(() => {
        if (!frames || frames.length === 0) return;

        // Inicializar vuelo
        const resetFlight = () => {
            const { current: state } = stateRef;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            state.speed = Math.random() * 2 + 2;
            state.y = viewportHeight + 150;
            state.centerX = viewportWidth / 2; // Centrado
            // Amplitud muy grande: casi el 50% del ancho (cubre TODO el ancho de lado a lado)
            state.amplitude = (viewportWidth * 0.45) + Math.random() * (viewportWidth * 0.05);
            // Frecuencia baja para que sea un barrido largo y dramático de lado a lado, no un zig-zag rápido
            state.frequency = Math.random() * 0.005 + 0.005;
            state.time = Math.random() * 1000;
            state.scale = Math.random() * 0.4 + 0.6; // Un poco más grande (0.6 a 1.0)
            state.isFlying = true;
        };

        // Bucle de animación principal
        const animate = () => {
            const { current: state } = stateRef;
            const element = birdRef.current; // Usamos la ref de la IMAGEN

            if (state.isFlying && element) {
                // 1. Movimiento Vertical
                state.y -= state.speed;

                // 2. Movimiento Horizontal
                state.time += 1;
                const offsetX = Math.sin(state.time * state.frequency) * state.amplitude;
                state.x = state.centerX + offsetX;

                // 3. Calcular dirección (Flip horizontal)
                // La derivada de sin es cos. Si cos > 0 va a la derecha, si < 0 va a la izquierda.
                const dx = Math.cos(state.time * state.frequency);
                const direction = dx >= 0 ? 1 : -1; // 1 = Normal (Derecha), -1 = Invertido (Izquierda)

                // 4. Aplicar transformación SOLO A LA IMAGEN
                // scale(x, y) -> Invertimos X si direction es -1
                element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale * direction}, ${state.scale})`;

                // 5. Verificar límites
                if (state.y < -200) {
                    state.isFlying = false;
                    setTimeout(resetFlight, Math.random() * 1000 + 500);
                }
            } else if (!state.isFlying && !animationRef.current) {
                resetFlight();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        resetFlight();
        animate();

        const frameInterval = setInterval(() => {
            setAnimFrame((prev) => (prev + 1) % frames.length);
        }, 120);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            clearInterval(frameInterval);
        };
    }, [frames]);

    if (!frames || frames.length === 0) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "85dvh",
                zIndex: 50,
                pointerEvents: "none",
                overflow: "hidden"
            }}
        >
            <img
                ref={birdRef} // Ref asignado a la imagen
                src={frames[animFrame]}
                alt="Animación usuario"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "150px",
                    height: "auto",
                    display: "block",
                    willChange: "transform"
                }}
            />
        </div>
    );
};

export default BirdAnimation;
