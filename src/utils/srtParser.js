/**
 * Parsea un archivo .srt y devuelve un array de subtítulos
 * @param {string} srtText - El contenido del archivo .srt
 * @returns {Array} - Array de objetos con información de los subtítulos
 */
export function parseSRT(srtText) {
  // Dividir el contenido en bloques (cada bloque es un subtítulo)
  const blocks = srtText.trim().split(/\n\s*\n/);

  const subtitles = [];

  for (const block of blocks) {
    // Saltar bloques vacíos
    if (!block.trim()) continue;

    const lines = block.split("\n");

    // El primer elemento siempre es el número del subtítulo
    // El segundo elemento contiene la información de tiempo
    // El resto son las líneas del subtítulo
    if (lines.length >= 3) {
      const timeLine = lines[1];
      const textLines = lines.slice(2);

      // Parsear la información de tiempo
      const timeMatch = timeLine.match(
        /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
      );

      if (timeMatch) {
        const [, startTime, endTime] = timeMatch;

        subtitles.push({
          start: timeToSeconds(startTime),
          end: timeToSeconds(endTime),
          text: textLines.join("\n"),
        });
      }
    }
  }

  return subtitles;
}

/**
 * Convierte un tiempo en formato SRT (HH:MM:SS,mmm) a segundos
 * @param {string} timeString - Tiempo en formato SRT
 * @returns {number} - Tiempo en segundos
 */
function timeToSeconds(timeString) {
  const [time, milliseconds] = timeString.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

/**
 * Busca el subtítulo correspondiente a un tiempo específico
 * @param {Array} subtitles - Array de subtítulos parseados
 * @param {number} currentTime - Tiempo actual en segundos
 * @returns {string|null} - Texto del subtítulo o null si no hay subtítulo
 */
export function getCurrentSubtitle(subtitles, currentTime) {
  for (const subtitle of subtitles) {
    if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
      return subtitle.text;
    }
  }

  return null;
}
