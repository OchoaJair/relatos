import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import * as fabric from "fabric";
import styles from "../styles/components/Draw.module.css";

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
  const [brushOpacity, setBrushOpacity] = useState(0.25);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 8;
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const getCurrentCanvas = () => fabricCanvasRef.current[currentFrame];

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
    if (canvas) canvas.clear();
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

  return (
    <>
      <div className={styles.draw}>
        <h1>Participa</h1>
        <aside className={styles.drawAside}>
          <p>
            <strong>Paso 1.</strong> Dibuja uno por uno los 8 fotogramas de la
            animación.
          </p>
          <p>
            <strong>Paso 2.</strong> Descarga y compártelo en las redes sociales
            con el <strong>#relatosdereconciliacion</strong>.
          </p>
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
              </div>
            ))}
          </div>
        </section>
        <section className={styles.drawOptions}>
          <aside className={styles.drawOptionsElements}>
            <p>Dibujar / Borrar</p>
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
          </aside>

          <aside className={styles.drawOptionsElements}>
            <p>Pincel</p>
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
          </aside>

          <aside className={styles.drawOptionsElements}>
            <p>Tamaño</p>
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
          </aside>

          <aside className={styles.drawOptionsElements}>
            <p>Opacidad</p>
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
          </aside>

          <aside className={styles.drawOptionsElements}>
            <p>Vista previa</p>
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
            </div>
          </aside>
        </section>
      </aside>
      <aside className={styles.frames}>
        {Array.from({ length: totalFrames }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentFrame(i)}
            className={clsx({ [styles.frameSelect]: currentFrame === i })}
          >
            <img src={frames[i]} alt="" />
          </button>
        ))}
      </aside>
    </>
  );
}
