// src/components/WaveAnimation.jsx
import React from 'react';
import './WaveAnimation.css';

const WaveAnimation = ({ height = '100px', colors = ['#39a8b4', '#2893d6', '#69cbd6'], numWaves = 3 }) => {
  // Paleta de colores con tonos de azul y morado sutiles
  const baseColors = [
    '#39a8b4',  // Azul turquesa
    '#2893d6',  // Azul medio
    '#69cbd6',  // Azul claro
    '#1f7a99',  // Azul profundo
    '#4bb4c4',  // Azul cian
    '#5b8cba',  // Azul con toque de morado
    '#7a9dc9',  // Azul pizarra suave
    '#6a8bb8',  // Azul acero
    '#8cafd6',  // Azul celeste pálido
    '#4a7aa8'   // Azul marino sutil
  ];

  // Generar un array de colores si se necesitan más olas de las que hay en el array de colores
  const generateColors = (count) => {
    const generatedColors = [];
    for (let i = 0; i < count; i++) {
      generatedColors.push(baseColors[i % baseColors.length]);
    }
    return generatedColors;
  };

  const waveColors = numWaves > colors.length ? generateColors(numWaves) : colors;

  return (
    <section className="wave-container" style={{ height }}>
      <svg
        className="wave-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave-path"
            d="m -160,44.4 c 30,0 58,-18 87.7,-18 30.3,0 58.3,18 87.3,18 30,0 58,-18 88,-18 30,0 58,18 88,18 l 0,34.5 -351,0 z"
          />
        </defs>
        <g className="wave-group" fill="transparent" strokeWidth="0.4">
          {waveColors.slice(0, numWaves).map((color, index) => (
            <use
              key={index}
              href="#wave-path"
              stroke={color}
              x="50"
              y={index}
              style={{
                animationDelay: `-${(index + 1) * 2}s`,
                animationDuration: `${(index + 1) * 2 + 2}s`
              }}
            />
          ))}
        </g>
      </svg>
    </section>
  );
};

export default WaveAnimation;