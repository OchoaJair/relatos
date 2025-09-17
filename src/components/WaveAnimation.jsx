// src/components/WaveAnimation.jsx
import React from 'react';
import './WaveAnimation.css';

// Mapeo de IDs de tipos de violencia a paletas de colores
const violenceTypeColors = {
  // Delincuencia Común (ID: 3)
  3: ['#8B0000', '#B22222', '#DC143C', '#FF6347', '#FF4500'],
  
  // Desaparición Forzada (ID: 46)
  46: ['#2F4F4F', '#556B2F', '#6B8E23', '#808000', '#9ACD32'],
  
  // Desplazamiento (ID: 7)
  7: ['#4B0082', '#800080', '#9932CC', '#8A2BE2', '#DA70D6'],
  
  // Ejército (ID: 45)
  45: ['#2F4F4F', '#708090', '#696969', '#A9A9A9', '#C0C0C0'],
  
  // Guerrilla (ID: 2)
  2: ['#000080', '#0000CD', '#4169E1', '#1E90FF', '#87CEEB'],
  
  // Maltrato Familiar (ID: 6)
  6: ['#8B4513', '#A52A2A', '#CD853F', '#D2691E', '#DEB887'],
  
  // Maltrato Infantil (ID: 18)
  18: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'],
  
  // Paramilitarismo (ID: 26)
  26: ['#4B0082', '#483D8B', '#6A5ACD', '#7B68EE', '#9370DB'],
  
  // Prostitución Forzada (ID: 5)
  5: ['#8B0000', '#A52A2A', '#B22222', '#CD5C5C', '#F08080'],
  
  // Terrorismo (ID: 20)
  20: ['#2F4F4F', '#556B2F', '#6B8E23', '#808000', '#9ACD32'],
  
  // Victimaria (ID: 32)
  32: ['#4B0082', '#800080', '#9932CC', '#8A2BE2', '#DA70D6'],
  
  // Violencia Sexual (ID: 4)
  4: ['#8B0000', '#B22222', '#DC143C', '#FF6347', '#FF4500'],
  
  // Violencia Social (ID: 19)
  19: ['#2F4F4F', '#708090', '#696969', '#A9A9A9', '#C0C0C0'],
  
  // Color por defecto
  'default': ['#39a8b4', '#2893d6', '#69cbd6']
};

const WaveAnimation = ({ 
  height = '100px', 
  colors = null, 
  numWaves = 3, 
  violenceTypes = [] 
}) => {
  // Paleta de colores con tonos de azul y morado sutiles (por defecto)
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

  // Determinar los colores a usar
  // Prioridad: 1. colores explícitamente pasados, 2. colores basados en tipos de violencia, 3. colores por defecto
  let waveColors = baseColors;
  
  if (colors && colors.length > 0) {
    // Si se pasan colores explícitamente, usar esos
    waveColors = colors;
  } else if (violenceTypes && violenceTypes.length > 0) {
    // Si se proporcionan tipos de violencia, usar los colores correspondientes
    // Por ahora, usamos el primer tipo de violencia para determinar los colores
    // En el futuro, podríamos combinar colores de múltiples tipos de violencia
    const primaryViolenceType = violenceTypes[0];
    waveColors = violenceTypeColors[primaryViolenceType] || violenceTypeColors['default'];
  }

  // Generar un array de colores si se necesitan más olas de las que hay en el array de colores
  const generateColors = (count) => {
    const generatedColors = [];
    for (let i = 0; i < count; i++) {
      generatedColors.push(waveColors[i % waveColors.length]);
    }
    return generatedColors;
  };

  const finalWaveColors = numWaves > waveColors.length ? generateColors(numWaves) : waveColors;

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
          {finalWaveColors.slice(0, numWaves).map((color, index) => (
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