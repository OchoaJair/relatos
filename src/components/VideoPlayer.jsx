import { useRef, useState, useEffect } from "react";
import styles from "../styles/components/VideoPlayer.module.css";
import {
  loadSubtitles,
  availableLanguages,
  getLanguageName,
} from "../utils/subtitleLoader";
import { getCurrentSubtitle } from "../utils/srtParser";

const VideoPlayer = ({ videoUrl, videoId }) => {
  const videoRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Puntos de salto (puedes personalizarlos)
  const jumpPoints = [
    { time: 15, label: "Intro" },
    { time: 30, label: "Demo" },
    { time: 45, label: "Explicación" },
    { time: 60, label: "Conclusión" },
    { time: 70, label: "Conclusión" },
  ];

  // Cargar subtítulos cuando cambia el video o el idioma
  useEffect(() => {
    if (videoId && selectedLanguage && showSubtitles) {
      loadSubtitles(videoId, selectedLanguage).then(setSubtitles);
    } else {
      setSubtitles([]);
      setCurrentSubtitle("");
    }
  }, [videoId, selectedLanguage, showSubtitles]);

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
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
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
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className={styles.videoElement}
          />
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
