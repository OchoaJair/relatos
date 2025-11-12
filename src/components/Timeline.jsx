import React from 'react';
import styles from '../styles/components/Timeline.module.css';

const Timeline = ({ intervals, currentTime, duration }) => {
  if (!duration || intervals.length === 0) {
    return null; // No renderizar si no hay duración o intervalos
  }

  // Función para generar un color consistente basado en el 'source'
  const getColorForSource = (source) => {
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      hash = source.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`; // HSL para colores vibrantes
    return color;
  };

  return (
    <div className={styles.timelineContainer}>
      {intervals.map((segment, index) => {
        const left = (segment.start / duration) * 100;
        const width = ((segment.end - segment.start) / duration) * 100;
        const isActive = currentTime >= segment.start && currentTime < segment.end;

        const segmentStyle = {
          left: `${left}%`,
          width: `${width}%`,
          backgroundColor: segment.source ? getColorForSource(segment.source) : '#555', // Color dinámico o por defecto
        };

        return (
          <div
            key={index}
            className={`${styles.timelineSegment} ${isActive ? styles.activeSegment : ''}`}
            style={segmentStyle}
            title={`${segment.label} (${segment.start.toFixed(1)}s - ${segment.end.toFixed(1)}s) - Source: ${segment.source || 'N/A'}`}
          ></div>
        );
      })}
      <div
        className={styles.timelineCursor}
        style={{ left: `${(currentTime / duration) * 100}%` }}
      ></div>
    </div>
  );
};

export default Timeline;
