// Importamos las funciones para parsear SRT
import { parseSRT } from "./srtParser.js";

/**
 * Carga y parsea los subtítulos para un video específico en un idioma determinado
 * @param {string} videoId - ID del video (slug)
 * @param {string} language - Código del idioma (es, en, fr, pt)
 * @returns {Promise<Array>} - Promesa que resuelve a un array de subtítulos parseados
 */
export async function loadSubtitles(videoId, language) {
  try {
    // Importamos el archivo SRT correspondiente
    const srtModule = await import(
      `../assets/subtitles/${videoId}/${language}.srt?url`
    );
    const srtUrl = srtModule.default;

    // Cargamos el contenido del archivo
    const response = await fetch(srtUrl);
    const srtText = await response.text();

    // Parseamos el contenido SRT
    return parseSRT(srtText);
  } catch (error) {
    console.warn(
      `No se pudieron cargar los subtítulos para ${videoId} en ${language}:`,
      error
    );
    return [];
  }
}

/**
 * Lista de idiomas disponibles para subtítulos
 */
export const availableLanguages = [
  { code: "es", name: "Español" },
  { code: "zu", name: "Zulú" },
  { code: "nl", name: "Neerlandés" },
];

/**
 * Obtiene el nombre del idioma a partir del código
 * @param {string} code - Código del idioma
 * @returns {string} - Nombre del idioma
 */
export function getLanguageName(code) {
  const language = availableLanguages.find((lang) => lang.code === code);
  return language ? language.name : code;
}
