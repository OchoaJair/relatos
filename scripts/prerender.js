/**
 * Script de prerendering para SEO
 * Genera HTML estático para todas las rutas de la aplicación
 * Esto permite que los motores de búsqueda indexen el contenido
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas a prerenderizar
const routes = [
  "/",
  "/About",
  "/Interactive",
  "/yovana",
  "/alamo",
  "/virgelina-chara",
  "/floramarillo",
  "/magnolia",
  "/araucaria",
  "/acacia",
  "/des-esperanza",
  "/gustavo",
  "/jazmin",
  "/natalia-puerto",
  "/olga",
  "/sauco",
  "/urapan",
  "/victor",
  "/zilbaro",
];

const baseUrl = "http://localhost:5173"; // Puerto por defecto de Vite dev server
const distPath = path.join(__dirname, "dist");

async function prerender() {
  console.log("🚀 Iniciando prerendering para SEO...\n");

  // Verificar que el build existe
  if (!fs.existsSync(distPath)) {
    console.error(
      "❌ Error: No se encontró la carpeta dist/. Ejecuta 'pnpm run build' primero."
    );
    process.exit(1);
  }

  // Iniciar navegador
  console.log("📱 Abriendo navegador...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      const url = `${baseUrl}${route}`;

      console.log(`🔄 Procesando: ${route}`);

      try {
        // Navegar a la página y esperar que cargue completamente
        await page.goto(url, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        // Esperar un poco más para que React renderice completamente
        await page.waitForTimeout(2000);

        // Obtener el HTML renderizado
        const html = await page.content();

        // Crear la ruta de destino
        const filePath =
          route === "/"
            ? path.join(distPath, "index.html")
            : path.join(distPath, route, "index.html");

        // Crear directorios si no existen
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Guardar el HTML
        fs.writeFileSync(filePath, html);
        console.log(`✅ Guardado: ${filePath}`);
      } catch (error) {
        console.error(`❌ Error en ${route}:`, error.message);
      } finally {
        await page.close();
      }
    }

    console.log("\n✨ Prerendering completado exitosamente!");
    console.log(`📄 Total de páginas generadas: ${routes.length}`);
  } catch (error) {
    console.error("❌ Error general:", error);
  } finally {
    await browser.close();
  }
}

// Ejecutar el script
prerender().catch(console.error);
