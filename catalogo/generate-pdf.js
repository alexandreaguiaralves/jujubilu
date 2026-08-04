const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

async function waitForAllImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      })
    );
  });
}

async function main() {
  const htmlPath = path.resolve(__dirname, "index.html");
  const outPath = path.resolve(__dirname, "catalogo-jujubilu-2026.pdf");
  const previewDir = path.resolve(__dirname, "preview");
  const fileUrl = "file:///" + htmlPath.replace(/\\/g, "/");

  fs.mkdirSync(previewDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--allow-file-access-from-files", "--no-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1 });
    await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 120000 });
    await page.evaluateHandle("document.fonts.ready");
    await waitForAllImages(page);

    const imageStats = await page.evaluate(() => {
      const images = Array.from(document.images);
      return {
        total: images.length,
        loaded: images.filter((img) => img.complete && img.naturalWidth > 0)
          .length,
        broken: images
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.src),
      };
    });

    console.log(
      `Imagens no HTML: ${imageStats.loaded}/${imageStats.total} carregadas`
    );
    if (imageStats.broken.length) {
      console.warn("Imagens com falha:", imageStats.broken);
    }

    const pages = await page.$$(".page");
    for (let i = 0; i < pages.length; i += 1) {
      const previewPath = path.join(
        previewDir,
        `pagina-${String(i + 1).padStart(2, "0")}.png`
      );
      await pages[i].screenshot({ path: previewPath });
      console.log(`Preview: ${previewPath}`);
    }

    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      preferCSSPageSize: true,
    });

    const stats = fs.statSync(outPath);
    console.log(`PDF gerado: ${outPath} (${Math.round(stats.size / 1024)} KB)`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
