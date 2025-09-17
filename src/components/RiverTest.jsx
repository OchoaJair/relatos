import React from 'react';
import AnimatedRivers from './AnimatedRivers';

const RiverTest = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <h1 style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        zIndex: 10, 
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        Prueba de Ríos Animados
      </h1>
      <AnimatedRivers />
    </div>
  );
};

export default RiverTest;