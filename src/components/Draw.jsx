import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import * as fabric from "fabric";
import styles from "../styles/components/Draw.module.css";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { saveAs } from "file-saver";

//imágenes
import papel from "../assets/Papel.webp";
import bird1 from "../assets/Pajaros/Pajaro_1.webp";
import bird2 from "../assets/Pajaros/Pajaro_2.webp";
import bird3 from "../assets/Pajaros/Pajaro_3.webp";
import bird4 from "../assets/Pajaros/Pajaro_4.webp";
import bird5 from "../assets/Pajaros/Pajaro_5.webp";
import bird6 from "../assets/Pajaros/Pajaro_6.webp";
import bird7 from "../assets/Pajaros/Pajaro_7.webp";
import bird8 from "../assets/Pajaros/Pajaro_8.webp";
import iconBrush from "../assets/Dibujo/iconBrush.svg";
import iconEraser from "../assets/Dibujo/iconErase.svg";
import iconClearAll from "../assets/Dibujo/iconEraseAll.svg";
import pencil1 from "../assets/Dibujo/Pencil_1.webp";
import pencil2 from "../assets/Dibujo/Pencil_2.webp";
import pencil3 from "../assets/Dibujo/Pencil_3.webp";
import slider1 from "../assets/Dibujo/Slider_1.webp";
import slider2 from "../assets/Dibujo/Slider_2.webp";
import iconPause from "../assets/Dibujo/simpleIconPause.svg";
import iconPlay from "../assets/Dibujo/simpleIconPlay.svg";

const frames = [bird1, bird2, bird3, bird4, bird5, bird6, bird7, bird8];

export default function Draw() {
  const canvasRef = useRef([]);
  const fabricCanvasRef = useRef([]);
  const [tool, setTool] = useState("pencil");
  const [brushType, setBrushType] = useState("spray");
  const [brushSize, setBrushSize] = useState(1);
  const [brushOpacity, setBrushOpacity] = useState(0.3);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 8;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [framesDrawn, setFramesDrawn] = useState(
    Array(totalFrames).fill(false)
  );
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const intervalRef = useRef(null);
  const ffmpegRef = useRef(null);

  const getCurrentCanvas = () => fabricCanvasRef.current[currentFrame];

  // Verificar si todos los frames tienen dibujos
  const areAllFramesDrawn = () => {
    // Verificar si hay contenido en cada canvas
    for (let i = 0; i < totalFrames; i++) {
      const canvas = fabricCanvasRef.current[i];
      if (!canvas || canvas.getObjects().length === 0) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const maxWidth = 700;
    const maxHeight = 450;

    const canvasEl = canvasRef.current[0]?.parentElement;
    const container = canvasEl?.parentElement?.parentElement;
    const width = Math.min(container?.clientWidth || maxWidth, maxWidth);
    const height = Math.min(
      container?.clientHeight || window.innerHeight * 0.6,
      maxHeight
    );

    const initCanvas = (index) => {
      const el = canvasRef.current[index];
      if (!el) return;

      const fabricCanvas = new fabric.Canvas(el, {
        width,
        height,
        isDrawingMode: true,
      });

      let brush;
      switch (brushType) {
        case "spray":
          brush = new fabric.SprayBrush(fabricCanvas);
          break;
        case "circle":
          brush = new fabric.CircleBrush(fabricCanvas);
          break;
        case "pattern":
          brush = new fabric.PatternBrush(fabricCanvas);
          break;
        case "pencil":
        default:
          brush = new fabric.PencilBrush(fabricCanvas);
          break;
      }

      brush.color = hexToRgba("#9e9e9e", brushOpacity);
      brush.width = brushSize;

      fabricCanvas.freeDrawingBrush = brush;

      // Agregar listeners para detectar cambios en el canvas
      const updateFrameStatus = () => {
        // Usar un timeout para asegurarnos de que los cambios se hayan aplicado
        setTimeout(() => {
          setFramesDrawn((prev) => {
            const newFramesDrawn = [...prev];
            newFramesDrawn[index] = fabricCanvas.getObjects().length > 0;
            return newFramesDrawn;
          });
          
          // Marcar que se ha comenzado a dibujar si aún no se ha hecho
          if (!hasStartedDrawing && fabricCanvas.getObjects().length > 0) {
            setHasStartedDrawing(true);
          }
        }, 0);
      };

      fabricCanvas.on("path:created", updateFrameStatus);
      fabricCanvas.on("object:removed", updateFrameStatus);
      fabricCanvas.on("canvas:cleared", updateFrameStatus);

      fabricCanvasRef.current[index] = fabricCanvas;
    };

    for (let i = 0; i < totalFrames; i++) {
      initCanvas(i);
    }

    return () => {
      fabricCanvasRef.current.forEach((canvas) => canvas?.dispose());
    };
  }, []);

  const clearCanvas = () => {
    const canvas = getCurrentCanvas();
    if (canvas) {
      canvas.clear();
      // Verificar si todos los frames están vacíos para reiniciar hasStartedDrawing
      const allFramesEmpty = fabricCanvasRef.current.every(
        (c) => !c || c.getObjects().length === 0
      );
      if (allFramesEmpty) {
        setHasStartedDrawing(false);
      }
    }
  };

  const selectTool = (selectedTool) => {
    const canvas = getCurrentCanvas();
    if (!canvas) return;

    let brush;
    if (selectedTool === "eraser") {
      brush = new fabric.PencilBrush(canvas);
      brush.color = "#fff";
    } else {
      brush = new fabric.PencilBrush(canvas);
      brush.color = hexToRgba("#9e9e9e", brushOpacity);
    }

    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;
    setTool(selectedTool);
  };

  const changeBrush = (type) => {
    const canvas = getCurrentCanvas();
    if (!canvas) return;

    let brush;
    switch (type) {
      case "spray":
        brush = new fabric.SprayBrush(canvas);
        break;
      case "circle":
        brush = new fabric.CircleBrush(canvas);
        break;
      case "pattern":
        brush = new fabric.PatternBrush(canvas);
        break;
      case "pencil":
      default:
        brush = new fabric.PencilBrush(canvas);
        break;
    }

    brush.color = hexToRgba("#9e9e9e", brushOpacity);
    brush.width = brushSize;

    canvas.freeDrawingBrush = brush;
    setBrushType(type);
    setTool("pencil");
  };

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const updateBrushOpacity = (opacity) => {
    const canvas = getCurrentCanvas();
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = hexToRgba("#9e9e9e", opacity);
    }
  };

  const handleBrushOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setBrushOpacity(newOpacity);
    updateBrushOpacity(newOpacity);
  };

  const handleBrushSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setBrushSize(newSize);

    const canvas = getCurrentCanvas();
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = newSize;
    }
  };

  const startPreview = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 300); // Cambia cada 300ms, puedes ajustar la velocidad
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Función para capturar los fotogramas
  const captureFrames = async () => {
    const framesData = [];

    try {
      // Iterar por cada fotograma
      for (let i = 0; i < totalFrames; i++) {
        // Obtener el canvas correspondiente
        const canvas = fabricCanvasRef.current[i];
        if (canvas) {
          // Convertir a imagen base64
          const dataUrl = canvas.toDataURL({
            format: "png",
            quality: 1,
          });
          framesData.push(dataUrl);
        }
      }

      return framesData;
    } catch (error) {
      console.error("Error capturando fotogramas:", error);
      throw error;
    }
  };

  // Función para convertir los fotogramas a video
  const convertFramesToVideo = async (framesData) => {
    try {
      // Inicializar FFmpeg si no está ya inicializado
      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
      }

      const ffmpeg = ffmpegRef.current;

      // Cargar FFmpeg (si no está ya cargado)
      if (!ffmpeg.loaded) {
        await ffmpeg.load();
      }

      // Escribir los fotogramas en el sistema de archivos virtual
      for (let i = 0; i < framesData.length; i++) {
        const data = framesData[i].split(",")[1]; // Remover el prefijo data:image/png;base64,
        const binary = atob(data);
        const array = new Uint8Array(binary.length);

        for (let j = 0; j < binary.length; j++) {
          array[j] = binary.charCodeAt(j);
        }

        await ffmpeg.writeFile(
          `frame_${i.toString().padStart(3, "0")}.png`,
          array
        );
      }

      // Ejecutar comando de FFmpeg para crear video
      // 8 fotogramas a 3.33 fps (8 fotogramas en 2.4 segundos, similar a la vista previa)
      const result = await ffmpeg.exec([
        "-r",
        "3.33",
        "-i",
        "frame_%03d.png",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-y",
        "output.mp4",
      ]);

      if (result !== 0) {
        throw new Error(`FFmpeg exec failed with code ${result}`);
      }

      // Verificar si el archivo de salida existe
      try {
        // Leer el archivo de video resultante
        const videoData = await ffmpeg.readFile("output.mp4");

        // Crear blob del video
        const videoBlob = new Blob([videoData], { type: "video/mp4" });

        return videoBlob;
      } catch (readError) {
        console.error("Error leyendo el archivo de video:", readError);
        throw new Error("No se pudo leer el archivo de video generado.");
      }
    } catch (error) {
      console.error("Error convirtiendo a video:", error);
      throw error;
    }
  };

  // Función para descargar el video
  const downloadVideo = async () => {
    try {
      // Mostrar mensaje de carga
      setIsProcessing(true);

      // Capturar fotogramas
      const framesData = await captureFrames();

      // Verificar que tengamos fotogramas
      if (framesData.length === 0) {
        throw new Error("No se encontraron fotogramas para convertir.");
      }

      // Convertir a video
      const videoBlob = await convertFramesToVideo(framesData);

      // Verificar que el blob sea válido
      if (!videoBlob || videoBlob.size === 0) {
        throw new Error(
          "No se pudo generar el video. El archivo resultante está vacío."
        );
      }

      // Descargar archivo
      saveAs(videoBlob, "animacion-relatos.mp4");

      // Ocultar mensaje de carga
      setIsProcessing(false);
    } catch (error) {
      console.error("Error en la descarga:", error);
      // Mostrar mensaje de error al usuario
      setIsProcessing(false);
      // Mostrar mensaje de error al usuario
      alert(
        `Error al descargar el video: ${error.message || "Error desconocido"}`
      );
    }
  };

  return (
    <>
      <div className={styles.draw}>
        <h1>Participa</h1>
        <aside className={styles.drawAside}>
          <div className={styles.instructionStep}>
            <span className={styles.stepNumber}>1️⃣</span>
            <p><strong>Dibuja</strong> sobre cada fotograma (uno por uno).</p>
          </div>
          <div className={styles.instructionStep}>
            <span className={styles.stepNumber}>2️⃣</span>
            <p><strong>Previsualiza</strong> tu animación.</p>
          </div>
          <div className={styles.instructionStep}>
            <span className={styles.stepNumber}>3️⃣</span>
            <p><strong>Descarga y comparte</strong> con el hashtag <strong>#relatosdereconciliacion</strong>.</p>
          </div>
        </aside>
      </div>
      <aside className={styles.drawSection}>
        <section className={styles.drawSectionCanvas}>
          <img src={papel} alt="Hoja de papel para poder dibujar" />
          <img
            src={frames[currentFrame]}
            alt="Pájaro 1"
            className={styles.birds}
          />
          <div className={styles.drawCanvas}>
            {Array.from({ length: totalFrames }).map((_, i) => (
              <div
                key={i}
                style={{ display: i === currentFrame ? "block" : "none" }}
              >
                <canvas
                  ref={(el) => (canvasRef.current[i] = el)}
                  style={{ display: "block" }}
                />
                {/* Feedback contextual en el lienzo */}
                {!hasStartedDrawing && i === currentFrame && (
                  <div className={styles.canvasOverlay}>
                    <p className={styles.canvasHint}>
                      Dibuja sobre la silueta para crear tu animación
                    </p>
                    {/* Ejemplo de trazo que desaparece al comenzar a dibujar */}
                    <div className={styles.exampleStroke}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className={styles.drawOptions}>
          {/* Herramientas de dibujo */}
          <aside className={styles.drawOptionsElements}>
            <div className={styles.toolGroup}>
              <h3 className={styles.toolGroupTitle}>Pincel / Goma</h3>
              <div className={styles.drawOptionsElementsButtons}>
                <button onClick={() => selectTool("pencil")}>
                  <img
                    src={iconBrush}
                    alt="Pincel"
                    className={clsx({ [styles.selected]: tool === "pencil" })}
                  />
                </button>
                <button onClick={() => selectTool("eraser")}>
                  <img
                    src={iconEraser}
                    alt="Borrador"
                    className={clsx({
                      [styles.selected]: tool === "eraser",
                    })}
                  />
                </button>
                <button onClick={clearCanvas}>
                  <img src={iconClearAll} alt="Borrar todo" />
                </button>
              </div>
            </div>
          </aside>

          {/* Tipos de pincel */}
          <aside className={styles.drawOptionsElements}>
            <div className={styles.toolGroup}>
              <h3 className={styles.toolGroupTitle}>Tipo de Pincel</h3>
              <div className={styles.drawOptionsElementsButtons_pencil}>
                <button onClick={() => changeBrush("pencil")}>
                  <img
                    src={pencil1}
                    alt="Pincel lápiz"
                    className={clsx({
                      [styles.selected]: brushType === "pencil",
                    })}
                  />
                </button>
                <button onClick={() => changeBrush("spray")}>
                  <img
                    src={pencil3}
                    alt="Pincel spray"
                    className={clsx({
                      [styles.selected]: brushType === "spray",
                    })}
                  />
                </button>
                <button onClick={() => changeBrush("circle")}>
                  <img
                    src={pencil2}
                    alt="Pincel círculo"
                    className={clsx({
                      [styles.selected]: brushType === "circle",
                    })}
                  />
                </button>
              </div>
            </div>
          </aside>

          {/* Tamaño del pincel */}
          <aside className={styles.drawOptionsElements}>
            <div className={styles.toolGroup}>
              <h3 className={styles.toolGroupTitle}>Tamaño</h3>
              <div
                className={styles.drawOptionsElementsButtons_slider}
                style={{
                  backgroundImage: `url(${slider2})`,
                }}
              >
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={handleBrushSizeChange}
                  className={styles.slider}
                />
              </div>
            </div>
          </aside>

          {/* Opacidad del pincel */}
          <aside className={styles.drawOptionsElements}>
            <div className={styles.toolGroup}>
              <h3 className={styles.toolGroupTitle}>Opacidad</h3>
              <div
                className={styles.drawOptionsElementsButtons_slider}
                style={{
                  backgroundImage: `url(${slider1})`,
                }}
              >
                <input
                  type="range"
                  min="0.1"
                  max="0.25"
                  step="0.01"
                  value={brushOpacity}
                  onChange={handleBrushOpacityChange}
                  className={styles.slider}
                />
              </div>
            </div>
          </aside>

          {/* Controles de animación */}
          <aside className={styles.drawOptionsElements}>
            <div className={styles.toolGroup}>
              <h3 className={styles.toolGroupTitle}>Animación</h3>
              <div className={styles.drawOptionsElementsButtons}>
                <button
                  className={styles.drawOptionsElementsButtons_play}
                  onClick={startPreview}
                >
                  <img
                    src={isPlaying ? iconPause : iconPlay}
                    alt="Play/Pause icon"
                  />
                </button>
                <button
                  onClick={downloadVideo}
                  disabled={isProcessing || !areAllFramesDrawn()}
                  className={clsx(styles.downloadButton, styles.ctaButton)}
                >
                  {isProcessing ? "Procesando..." : "Descargar MP4"}
                </button>
              </div>
            </div>
          </aside>
        </section>
      </aside>
      <aside className={styles.framesContainer}>
        {/* Barra de progreso */}
        <div className={styles.progressSection}>
          <p className={styles.progressText}>
            Fotograma {currentFrame + 1} de {totalFrames} completado
          </p>
          <div className={styles.progressBar}>
            {Array.from({ length: totalFrames }).map((_, i) => (
              <div
                key={i}
                className={clsx(styles.progressSegment, {
                  [styles.completed]: framesDrawn[i],
                  [styles.current]: i === currentFrame,
                })}
              >
                {framesDrawn[i] && (
                  <span className={styles.checkMark}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Fotogramas */}
        <div className={styles.frames}>
          {Array.from({ length: totalFrames }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentFrame(i)}
              className={clsx(styles.frameButton, {
                [styles.frameSelect]: currentFrame === i,
                [styles.frameCompleted]: framesDrawn[i],
              })}
            >
              <img src={frames[i]} alt={`Fotograma ${i + 1}`} />
              {framesDrawn[i] && (
                <div className={styles.frameCheck}>✓</div>
              )}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
