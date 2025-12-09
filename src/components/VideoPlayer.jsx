import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import styles from "../styles/components/VideoPlayer.module.css";
import {
  loadSubtitles,
  availableLanguages,
} from "../utils/subtitleLoader";
import { getCurrentSubtitle } from "../utils/srtParser";
import Timeline from "./Timeline";
import TimelineTabs from "./TimelineTabs";
import AnnouncementBanner from "./AnnouncementBanner";

const VideoPlayer = ({ videoUrl, onVideoEnd, activeStory, relatedStories, groupName }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeJumpLabel, setActiveJumpLabel] = useState(null);
  const [currentJumpIndex, setCurrentJumpIndex] = useState(0);
  const currentJumpIndexRef = useRef(currentJumpIndex);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { videoId, themesSrt } = useMemo(() => ({
    videoId: activeStory.slug,
    themesSrt: activeStory.themesSrt,
  }), [activeStory]);

  const groupedJumpPoints = useMemo(() => {
    const groups = {};
    if (themesSrt && Array.isArray(themesSrt)) {
      themesSrt.forEach((theme, index) => {
        const hasValidProps = ('startTime' in theme || 'StartTime' in theme) && 'text' in theme && ('endTime' in theme || 'EndTime' in theme);
        if (!theme || typeof theme !== 'object' || !hasValidProps) {
          console.warn(`Elemento de themesSrt en índice ${index} no tiene estructura válida:`, theme);
          return;
        }

        const startTimeValue = 'startTime' in theme ? theme.startTime : theme.StartTime;
        const endTimeValue = 'endTime' in theme ? theme.endTime : theme.EndTime;
        const rawLabels = theme.text;

        const start = parseFloat(startTimeValue);
        const end = parseFloat(endTimeValue);

        if (!isNaN(start) && isFinite(start) && start >= 0 && !isNaN(end) && isFinite(end) && end >= 0) {
          const individualLabels = rawLabels.split(',').map(l => l.trim()).filter(l => l.length > 0);
          individualLabels.forEach(label => {
            if (!groups[label]) {
              groups[label] = [];
            }
            groups[label].push({ start, end, label });
          });
        }
      });
    }
    for (const label in groups) {
      groups[label].sort((a, b) => a.start - b.start);
    }
    return groups;
  }, [themesSrt]);

  useEffect(() => {
    currentJumpIndexRef.current = currentJumpIndex;
  }, [currentJumpIndex]);

  useEffect(() => {
    if (videoId && selectedLanguage && showSubtitles) {
      loadSubtitles(videoId, selectedLanguage).then(setSubtitles);
    } else {
      setSubtitles([]);
      setCurrentSubtitle("");
    }
  }, [videoId, selectedLanguage, showSubtitles]);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;
    const video = videoRef.current;
    let hls = null;

    const playVideo = () => {
      const lastSelectedLabel = localStorage.getItem("lastSelectedLabel");
      if (lastSelectedLabel) {
        video.play().catch((error) => {
          console.log("La reproducción automática fue prevenida:", error);
        });
      }
    };

    if (videoUrl.includes(".m3u8") || videoUrl.includes("bunnycdn")) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          playVideo();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
      } else {
        console.error("Tu navegador no soporta este formato de video");
      }
    } else {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener("loadedmetadata", playVideo);
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
  }, [groupedJumpPoints]);

  useEffect(() => {
    const lastSelectedLabel = localStorage.getItem("lastSelectedLabel");
    if (lastSelectedLabel && groupedJumpPoints[lastSelectedLabel]) {
      const timer = setTimeout(() => {
        handleJump(lastSelectedLabel);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [groupedJumpPoints, handleJump]);

  const handleStoryClick = (story) => {
    navigate('/' + story.slug);
  };

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
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [showSubtitles, subtitles, activeJumpLabel, groupedJumpPoints, onVideoEnd]);

  const handleLanguageChange = (event) => setSelectedLanguage(event.target.value);
  const toggleSubtitles = () => setShowSubtitles(!showSubtitles);

  const handleRemoveFilter = () => {
    localStorage.removeItem("lastSelectedLabel");
    setActiveJumpLabel(null);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => onVideoEnd && onVideoEnd();

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
    };
  }, [onVideoEnd]);

  return (
    <div className={styles.videoPlayerContainer}>
      <div className={styles.videoWrapper}>
        <AnnouncementBanner storyName={activeStory.title} />
        <div className={styles.videoContainer}>
          <video ref={videoRef} controls className={styles.videoElement} />
          {showSubtitles && currentSubtitle && (
            <div className={styles.subtitleOverlay}>{currentSubtitle}</div>
          )}
          <Timeline
            intervals={activeJumpLabel ? groupedJumpPoints[activeJumpLabel] : []}
            currentTime={currentTime}
            duration={duration}
          />
        </div>
        <section className={styles.sectionImportant}>
          <TimelineTabs
            stories={relatedStories}
            activeStory={activeStory}
            onStoryClick={handleStoryClick}
            groupName={groupName}
          />


          <div className={styles.controls}>
            <div className={styles.jumpButtonFlex}>
              <p className={styles.jumpButtonsExplanation}>
                Explora el video por temas y ve sus momentos clave.
              </p>
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
        </section>




      </div>
    </div>
  );
};

export default VideoPlayer;