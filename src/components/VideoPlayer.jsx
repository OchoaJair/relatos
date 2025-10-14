import { useRef, useState, useEffect } from "react";
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

  // Usar los datos del themeStr para los puntos de salto
  const jumpPoints = themeStr && Array.isArray(themeStr) 
    ? themeStr
        .map((theme, index) => {
          // Verificar que el objeto tenga las propiedades necesarias
          // Probar ambas variantes: startTime (minúscula) y StartTime (mayúscula)
          const hasValidProps = ('startTime' in theme || 'StartTime' in theme) && 'text' in theme;
          if (!theme || typeof theme !== 'object' || !hasValidProps) {
            console.warn(`Elemento de themeStr en índice ${index} no tiene estructura válida:`, theme);
            return null;
          }
          
          // Usar startTime si existe, de lo contrario usar StartTime
          const timeValue = 'startTime' in theme ? theme.startTime : theme.StartTime;
          
          return {
            time: parseFloat(timeValue),
            label: theme.text
          };
        })
        .filter(item => 
          item !== null && 
          !isNaN(item.time) && 
          isFinite(item.time) && 
          item.time >= 0
        )
    : [];
    
  console.log("themeStr recibido:", themeStr);
  console.log("jumpPoints generados:", jumpPoints);

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

  // Manejar la actualización de subtítulos durante la reproducción
  useEffect(() => {
    if (!showSubtitles || subtitles.length === 0) return;

    const video = videoRef.current;
    if (!video) return;

    const updateSubtitle = () => {
      const currentSubtitle = getCurrentSubtitle(subtitles, video.currentTime);
      setCurrentSubtitle(currentSubtitle || "");
    };

    video.addEventListener("timeupdate", updateSubtitle);

    return () => {
      video.removeEventListener("timeupdate", updateSubtitle);
    };
  }, [subtitles, showSubtitles]);

  const handleJump = (seconds) => {
    if (videoRef.current) {
      const timeToSet = parseFloat(seconds);
      if (typeof timeToSet === 'number' && !isNaN(timeToSet) && isFinite(timeToSet) && timeToSet >= 0) {
        videoRef.current.currentTime = timeToSet;
        videoRef.current.play();
      } else {
        console.warn(`Tiempo no válido para salto: ${seconds} (convertido a: ${timeToSet})`);
      }
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
            {jumpPoints.map((point, index) => (
              <button
                key={index}
                onClick={() => handleJump(point.time)}
                className={styles.jumpButton}
              >
                {point.label}
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
