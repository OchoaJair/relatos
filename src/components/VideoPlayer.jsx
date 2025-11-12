import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Hls from "hls.js";
import styles from "../styles/components/VideoPlayer.module.css";
import {
  loadSubtitles,
  availableLanguages,
  getLanguageName,
} from "../utils/subtitleLoader";
import { getCurrentSubtitle } from "../utils/srtParser";
import Timeline from "./Timeline"; // Importar el componente Timeline

const VideoPlayer = ({ videoUrl, videoId, themeStr, onVideoEnd }) => {
  const videoRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeJumpLabel, setActiveJumpLabel] = useState(null);
  const [currentJumpIndex, setCurrentJumpIndex] = useState(0);
  const currentJumpIndexRef = useRef(currentJumpIndex);
  const [currentTime, setCurrentTime] = useState(0); // Estado para el tiempo actual del video
  const [duration, setDuration] = useState(0); // Estado para la duración total del video

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

    const cleanup = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };

    const isHlsSupported = () => {
      return (
        video.canPlayType("application/vnd.apple.mpegurl") ||
        video.canPlayType("audio/mpegurl")
      );
    };

    if (videoUrl.includes(".m3u8") || videoUrl.includes("bunnycdn")) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
      } else if (isHlsSupported()) {
        video.src = videoUrl;
      } else {
        console.error("Tu navegador no soporta este formato de video");
      }
    } else {
      video.src = videoUrl;
    }

    return () => {
      cleanup();
    };
  }, [videoUrl]);

  const handleJump = useCallback((label) => {
    const points = groupedJumpPoints[label];
    if (videoRef.current && points && points.length > 0) {
      setActiveJumpLabel(label);
      setCurrentJumpIndex(0);
      videoRef.current.currentTime = points[0].start;
      videoRef.current.play();
      localStorage.setItem("lastSelectedLabel", label);
    } else {
      console.warn(`No se encontraron puntos de salto para la etiqueta: ${label}`);
    }
  }, [groupedJumpPoints]); // Dependencia de groupedJumpPoints

  // Efecto para cargar el último label seleccionado desde localStorage
  useEffect(() => {
    const lastSelectedLabel = localStorage.getItem("lastSelectedLabel");
    if (lastSelectedLabel && groupedJumpPoints[lastSelectedLabel]) {
      // Pequeño retraso para asegurar que el video esté listo para buscar
      const timer = setTimeout(() => {
        handleJump(lastSelectedLabel);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [groupedJumpPoints, handleJump]);

  // Manejar la actualización de subtítulos y la lógica de salto automático durante la reproducción
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (showSubtitles && subtitles.length > 0) {
        const currentSubtitleText = getCurrentSubtitle(subtitles, video.currentTime);
        setCurrentSubtitle(currentSubtitleText || "");
      }

      if (activeJumpLabel && groupedJumpPoints[activeJumpLabel]) {
        const currentIdx = currentJumpIndexRef.current;
        const currentSegment = groupedJumpPoints[activeJumpLabel][currentIdx];

        if (currentSegment && video.currentTime >= currentSegment.end - 0.05) {
          const nextIndex = currentIdx + 1;
          if (nextIndex < groupedJumpPoints[activeJumpLabel].length) {
            setTimeout(() => {
              setCurrentJumpIndex(nextIndex);
              video.currentTime = groupedJumpPoints[activeJumpLabel][nextIndex].start;
              video.play();
            }, 100);
          } else {
            setActiveJumpLabel(null);
            setCurrentJumpIndex(0);
            onVideoEnd && onVideoEnd();
          }
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [showSubtitles, subtitles, activeJumpLabel, groupedJumpPoints, onVideoEnd]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
    if (!showSubtitles) {
      loadSubtitles(videoId, selectedLanguage).then(setSubtitles);
    } else {
      setCurrentSubtitle("");
    }
  };

  const handleRemoveFilter = () => {
    localStorage.removeItem("lastSelectedLabel");
    setActiveJumpLabel(null);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      onVideoEnd && onVideoEnd();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onVideoEnd]);

  return (
    <div className={styles.videoPlayerContainer}>
      <div className={styles.videoWrapper}>
        <div className={styles.videoContainer}>
          <video ref={videoRef} controls className={styles.videoElement} />
          {showSubtitles && currentSubtitle && (
            <div className={styles.subtitleOverlay}>{currentSubtitle}</div>
          )}
        </div>
        <Timeline
          intervals={activeJumpLabel ? groupedJumpPoints[activeJumpLabel] : []}
          currentTime={currentTime}
          duration={duration}
        />

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
            {activeJumpLabel && (
              <button
                onClick={handleRemoveFilter}
                className={`${styles.jumpButton} ${styles.removeFilterButton}`}
              >
                Remover filtro
              </button>
            )}
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
