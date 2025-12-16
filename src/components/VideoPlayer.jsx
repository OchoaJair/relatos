import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { Maximize, Minimize, Settings, Captions, CaptionsOff, XCircle, Filter } from "lucide-react";
import styles from "../styles/components/VideoPlayer.module.css";
import {
  loadSubtitles,
  availableLanguages,
} from "../utils/subtitleLoader";
import { getCurrentSubtitle } from "../utils/srtParser";
import Timeline from "./Timeline";
import TimelineTabs from "./TimelineTabs";
import AnnouncementBanner from "./AnnouncementBanner";
import StoryTitle from "./StoryTitle";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [subtitleUrl, setSubtitleUrl] = useState(null);

  // Helper to convert internal subtitle format to WebVTT
  const convertToVTT = (subs) => {
    let vttContent = "WEBVTT\n\n";
    subs.forEach((sub, index) => {
      const start = new Date(sub.start * 1000).toISOString().substr(11, 12);
      const end = new Date(sub.end * 1000).toISOString().substr(11, 12);
      // Add size:80% align:center to cues
      vttContent += `${index + 1}\n${start} --> ${end} size:80% align:center\n${sub.text}\n\n`;
    });
    return vttContent;
  };

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
    if (videoId && selectedLanguage) {
      loadSubtitles(videoId, selectedLanguage).then((subs) => {
        setSubtitles(subs);
        // Create Blob URL for WebVTT
        const vttText = convertToVTT(subs);
        const blob = new Blob([vttText], { type: "text/vtt" });
        const url = URL.createObjectURL(blob);
        setSubtitleUrl(url);
      });
    } else {
      setSubtitles([]);
      setSubtitleUrl(null);
    }
    // Cleanup blob url
    return () => {
      if (subtitleUrl) URL.revokeObjectURL(subtitleUrl);
    };
  }, [videoId, selectedLanguage]);

  useEffect(() => {
    // Control track visibility
    if (videoRef.current && videoRef.current.textTracks[0]) {
      videoRef.current.textTracks[0].mode = showSubtitles ? "showing" : "hidden";
    }
  }, [showSubtitles, subtitleUrl]);


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
      // Custom subtitle logic restored
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

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setShowSettings(false);
  }
  const toggleSubtitles = () => setShowSubtitles(!showSubtitles);

  const videoContainerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className={styles.videoPlayerContainer}>
      <div className={styles.videoWrapper}>
        <AnnouncementBanner storyName={activeStory.title} />
        <div className={styles.videoContainer} ref={videoContainerRef}>
          <video ref={videoRef} controls className={styles.videoElement} controlsList="nofullscreen" />
          {showSubtitles && currentSubtitle && (
            <div className={styles.subtitleOverlay}>{currentSubtitle}</div>
          )}
          <Timeline
            intervals={activeJumpLabel ? groupedJumpPoints[activeJumpLabel] : []}
            currentTime={currentTime}
            duration={duration}
          />
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className={styles.floatingExitButton}
              title="Salir de pantalla completa"
            >
              <Minimize size={24} />
            </button>
          )}
        </div>

        {/* Unified Control Bar & Jump Points */}
        <section className={styles.controlsSection}>
          <div className={styles.controlBar}>
            <div className={styles.leftControls}>
              <button onClick={toggleSubtitles} className={styles.textIconButton} title={showSubtitles ? "Ocultar subtítulos" : "Mostrar subtítulos"}>
                {showSubtitles ? <Captions size={18} /> : <CaptionsOff size={18} />}
                <span className={styles.buttonLabel}>Subtítulos</span>
              </button>

              {/* Settings hidden for now as only Spanish is used
              <div className={styles.settingsWrapper}>
                <button onClick={toggleSettings} className={styles.textIconButton} title="Ajustes">
                  <Settings size={18} />
                  <span className={styles.buttonLabel}>Ajustes</span>
                </button>
                {showSettings && (
                  <div className={styles.settingsMenu}>
                    <label className={styles.settingsLabel}>Idioma subtítulos:</label>
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
                  </div>
                )}
              </div>
              */}
            </div>

            <div className={styles.centerControls}>
              <div className={styles.topicsLabel}>
                <Filter size={14} className={styles.filterIcon} />
                <span>Filtrar:</span>
              </div>
              <div className={styles.jumpPointsScrollContainer}>
                {activeJumpLabel && (
                  <button
                    onClick={handleRemoveFilter}
                    className={`${styles.chip} ${styles.activeChip} ${styles.clearFilterChip}`}
                    title="Quitar filtro"
                  >
                    <XCircle size={14} className={styles.chipIcon} />
                    <span>{activeJumpLabel}</span>
                  </button>
                )}

                {Object.keys(groupedJumpPoints).filter(l => l !== activeJumpLabel).map((label) => (
                  <button
                    key={label}
                    onClick={() => handleJump(label)}
                    className={styles.chip}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rightControls}>
              <button onClick={toggleFullscreen} className={styles.iconButton} title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>

          <TimelineTabs
            stories={relatedStories}
            activeStory={activeStory}
            onStoryClick={handleStoryClick}
            groupName={groupName}
          />
          <StoryTitle
            stories={relatedStories}
            activeStory={activeStory}
            groupName={groupName}
          />
        </section>
      </div>
    </div>
  );
};

export default VideoPlayer;