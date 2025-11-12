import { useRef, useState, useEffect, useMemo } from "react";
import Hls from "hls.js";
import styles from "../styles/components/VideoPlayer.module.css";
import {
  loadSubtitles,
  availableLanguages,
  getLanguageName,
} from "../utils/subtitleLoader";
import { getCurrentSubtitle } from "../utils/srtParser";

const VideoPlayer = ({ videoUrl, videoId, themeStr = [] }) => {
  const videoRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeJumpLabel, setActiveJumpLabel] = useState(null);
  const [currentJumpIndex, setCurrentJumpIndex] = useState(0);
  const currentJumpIndexRef = useRef(currentJumpIndex);

  // Procesar themeStr para agrupar los puntos de salto por etiqueta
  const groupedJumpPoints = useMemo(() => {
    const groups = {};
    if (themeStr && Array.isArray(themeStr)) {
      themeStr.forEach((theme, index) => {
        const hasValidProps = ('startTime' in theme || 'StartTime' in theme) && 'text' in theme && ('endTime' in theme || 'EndTime' in theme);
        if (!theme || typeof theme !== 'object' || !hasValidProps) {
          console.warn(`Elemento de themeStr en índice ${index} no tiene estructura válida:`, theme);
          return;
        }

              const startTimeValue = 'startTime' in theme ? theme.startTime : theme.StartTime;
              const endTimeValue = 'endTime' in theme ? theme.endTime : theme.EndTime;
              const rawLabels = theme.text; // Get the raw label string
        
              const start = parseFloat(startTimeValue);
              const end = parseFloat(endTimeValue);
        
              if (!isNaN(start) && isFinite(start) && start >= 0 && !isNaN(end) && isFinite(end) && end >= 0) {
                // Split labels by comma and trim whitespace
                const individualLabels = rawLabels.split(',').map(l => l.trim()).filter(l => l.length > 0);
        
                individualLabels.forEach(label => {
                  if (!groups[label]) {
                    groups[label] = [];
                  }
                  // Add the interval to each individual label's group
                  groups[label].push({ start, end, label });
                });
              }      });
    }
    // Ordenar los puntos dentro de cada grupo por tiempo de inicio
    for (const label in groups) {
      groups[label].sort((a, b) => a.start - b.start);
    }
    return groups;
  }, [themeStr]);

  console.log("themeStr recibido:", themeStr);
  console.log("groupedJumpPoints generados:", groupedJumpPoints);

  // Sincronizar currentJumpIndexRef con currentJumpIndex
  useEffect(() => {
    currentJumpIndexRef.current = currentJumpIndex;
  }, [currentJumpIndex]);

  // Cargar subtítulos cuando cambia el video o el idioma
  useEffect(() => {
    if (videoId && selectedLanguage && showSubtitles) {
      loadSubtitles(videoId, selectedLanguage).then(setSubtitles);
    } else {
      setSubtitles([]);
      setCurrentSubtitle("");
    }
  }, [videoId, selectedLanguage, showSubtitles]);

  // Manejar la reproducción de video con HLS
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;
    let hls = null;

    // Función para limpiar el reproductor
    const cleanup = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };

    // Detectar si el navegador soporta HLS de forma nativa (como Safari)
    const isHlsSupported = () => {
      return (
        video.canPlayType("application/vnd.apple.mpegurl") ||
        video.canPlayType("audio/mpegurl")
      );
    };

    // Si el video es un stream HLS (extensión .m3u8 o URL de Bunny.net)
    if (videoUrl.includes(".m3u8") || videoUrl.includes("bunnycdn")) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // console.log("Manifesto HLS cargado");
        });
      } else if (isHlsSupported()) {
        // Navegadores como Safari que soportan HLS de forma nativa
        video.src = videoUrl;
      } else {
        console.error("Tu navegador no soporta este formato de video");
      }
    } else {
      // Si es un video directo (mp4, webm, etc.)
      video.src = videoUrl;
    }

    // Cleanup al desmontar
    return () => {
      cleanup();
    };
  }, [videoUrl]);

  // Manejar la actualización de subtítulos y la lógica de salto automático durante la reproducción
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Lógica de subtítulos
      if (showSubtitles && subtitles.length > 0) {
        const currentSubtitle = getCurrentSubtitle(subtitles, video.currentTime);
        setCurrentSubtitle(currentSubtitle || "");
      }

      // Lógica de salto automático
      if (activeJumpLabel && groupedJumpPoints[activeJumpLabel]) {
        const currentIdx = currentJumpIndexRef.current; // Usar la referencia mutable
        const currentSegment = groupedJumpPoints[activeJumpLabel][currentIdx];

        // Añadir tolerancia y envolver en setTimeout para evitar saltos múltiples y problemas de redondeo
        if (currentSegment && video.currentTime >= currentSegment.end - 0.05) {
          const nextIndex = currentIdx + 1;
          if (nextIndex < groupedJumpPoints[activeJumpLabel].length) {
            setTimeout(() => {
              setCurrentJumpIndex(nextIndex); // Actualiza el estado, lo que sincronizará la ref
              video.currentTime = groupedJumpPoints[activeJumpLabel][nextIndex].start;
              video.play();
            }, 100); // Pequeño retraso para evitar saltos consecutivos
          } else {
            // Fin de la secuencia, detener y limpiar
            setActiveJumpLabel(null);
            setCurrentJumpIndex(0);
            video.pause(); // Opcional: pausar al final de la secuencia
          }
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [subtitles, showSubtitles, activeJumpLabel, groupedJumpPoints]); // currentJumpIndex eliminado de las dependencias

  const handleJump = (label) => {
    const points = groupedJumpPoints[label];
    if (videoRef.current && points && points.length > 0) {
      setActiveJumpLabel(label);
      setCurrentJumpIndex(0);
      videoRef.current.currentTime = points[0].start;
      videoRef.current.play();
    } else {
      console.warn(`No se encontraron puntos de salto para la etiqueta: ${label}`);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
    if (!showSubtitles) {
      // Si se habilitan los subtítulos, cargarlos
      loadSubtitles(videoId, selectedLanguage).then(setSubtitles);
    } else {
      // Si se deshabilitan, limpiar el estado
      setCurrentSubtitle("");
    }
  };

  return (
    <div className={styles.videoPlayerContainer}>
      <div className={styles.videoWrapper}>
        <div className={styles.videoContainer}>
          <video ref={videoRef} controls className={styles.videoElement} />
          {showSubtitles && currentSubtitle && (
            <div className={styles.subtitleOverlay}>{currentSubtitle}</div>
          )}
        </div>

        <div className={styles.controls}>
          <div className={styles.jumpButtons}>
            {Object.keys(groupedJumpPoints).map((label) => (
              <button
                key={label}
                onClick={() => handleJump(label)}
                className={`${styles.jumpButton} ${activeJumpLabel === label ? styles.activeJumpButton : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.subtitleControls}>
            <button onClick={toggleSubtitles} className={styles.subtitleToggle}>
              {showSubtitles ? "Ocultar subtítulos" : "Mostrar subtítulos"}
            </button>

            {showSubtitles && (
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className={styles.languageSelector}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
