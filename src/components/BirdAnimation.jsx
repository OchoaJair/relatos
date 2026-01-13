import { useState, useEffect, useRef } from "react";

const SingleBird = ({ frames }) => {
    const [animFrame, setAnimFrame] = useState(0);
    const birdRef = useRef(null); // Ref para la imagen del pájaro
    const animationRef = useRef(null);
    const hasStartedRef = useRef(false); // To track if we've done the initial start

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
        isFlying: false,
        targetScale: 0.5,
        currentScale: 0,
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
            state.amplitude =
                viewportWidth * 0.45 + Math.random() * (viewportWidth * 0.05);
            // Frecuencia baja para que sea un barrido largo y dramático de lado a lado, no un zig-zag rápido
            state.frequency = Math.random() * 0.005 + 0.005;
            state.time = Math.random() * 1000;
            state.time = Math.random() * 1000;
            state.targetScale = Math.random() * 0.4 + 0.6; // Escala objetivo
            state.currentScale = 0; // Iniciar desde 0 para efecto de escala
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
                const offsetX =
                    Math.sin(state.time * state.frequency) * state.amplitude;
                state.x = state.centerX + offsetX;

                // 3. Calcular dirección (Flip horizontal)
                // La derivada de sin es cos. Si cos > 0 va a la derecha, si < 0 va a la izquierda.
                const dx = Math.cos(state.time * state.frequency);
                const direction = dx >= 0 ? 1 : -1; // 1 = Normal (Derecha), -1 = Invertido (Izquierda)

                // 4. Aplicar transformación SOLO A LA IMAGEN
                // scale(x, y) -> Invertimos X si direction es -1
                // 4. Aplicar transformación SOLO A LA IMAGEN
                // Efecto de escala suave (entrance)
                state.currentScale += (state.targetScale - state.currentScale) * 0.02;

                // scale(x, y) -> Invertimos X si direction es -1
                element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.currentScale * direction}, ${state.currentScale})`;

                // 5. Verificar límites
                if (state.y < -200) {
                    state.isFlying = false;
                    setTimeout(resetFlight, Math.random() * 1000 + 500);
                }
            } else if (!state.isFlying && !animationRef.current && hasStartedRef.current) {
                resetFlight();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        // Random start delay for the *first* appearance
        // Range between 0ms and 5000ms (5 seconds) to spread them out
        const startDelay = Math.random() * 5000;

        const initialTimeout = setTimeout(() => {
            hasStartedRef.current = true;
            resetFlight();
            animate();
        }, startDelay);

        const frameInterval = setInterval(() => {
            setAnimFrame((prev) => (prev + 1) % frames.length);
        }, 120);

        return () => {
            clearTimeout(initialTimeout);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            clearInterval(frameInterval);
        };
    }, [frames]);

    if (!frames || frames.length === 0) return null;

    return (
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
                willChange: "transform",
                filter: "contrast(200%) brightness(50%)",
                // Move it offscreen initially so it doesn't flash
                transform: "translate3d(0, 200vh, 0)"
            }}
        />
    );
};

const BirdAnimation = ({ frames, count = 6 }) => {
    if (!frames || frames.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 9999,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <SingleBird key={i} frames={frames} />
            ))}
        </div>
    );
};

export default BirdAnimation;
