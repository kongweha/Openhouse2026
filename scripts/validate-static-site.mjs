import { readFile, readdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public");
const errors = [];
const warnings = [];
const require = createRequire(import.meta.url);

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }),
  );

  return nested.flat();
}

function isLocalReference(reference) {
  return (
    reference &&
    !reference.startsWith("#") &&
    !reference.startsWith("data:") &&
    !reference.startsWith("mailto:") &&
    !reference.startsWith("tel:") &&
    !/^[a-z][a-z\d+.-]*:/i.test(reference) &&
    !reference.startsWith("//")
  );
}

function resolveReference(htmlFile, reference) {
  const cleanReference = reference.split(/[?#]/, 1)[0];
  const decodedReference = decodeURIComponent(cleanReference);
  return decodedReference.startsWith("/")
    ? path.join(publicRoot, decodedReference.slice(1))
    : path.resolve(path.dirname(htmlFile), decodedReference);
}

const requiredFiles = [
  "public/index.html",
  "public/admin.html",
  "public/registration.html",
  "public/generate-qr.html",
  "public/Stamp.html",
  "public/GenerateQR.html",
  "public/assets/css/stamp.css",
  "public/assets/css/admin.css",
  "public/assets/css/generate-qr.css",
  "public/assets/css/registration.css",
  "public/assets/js/config/app-config.js",
  "public/assets/js/shared/api-client.js",
  "public/assets/js/pages/stamp.js",
  "public/assets/js/pages/admin.js",
  "public/assets/js/pages/generate-qr.js",
  "public/assets/js/pages/registration.js",
  "public/assets/js/shared/legacy-redirect.js",
  "public/assets/images/README.md",
  "public/assets/images/cards/README.md",
  "docs/PROJECT_SSOT.md",
  "docs/HANDOFF.md",
  "functions/src/index.js",
  "functions/src/domain.js",
  "functions/src/event-config.js",
  "functions/test/domain.test.js",
  "firebase.json",
  ".firebaserc",
];

for (const relativeFile of requiredFiles) {
  if (!(await exists(path.join(projectRoot, relativeFile)))) {
    errors.push(`Missing required file: ${relativeFile}`);
  }
}

if (await exists(publicRoot)) {
  const files = await walk(publicRoot);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const jsFiles = files.filter((file) => file.endsWith(".js"));

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    const relativeHtml = path.relative(projectRoot, htmlFile);
    const references = [
      ...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi),
    ].map((match) => match[1]);

    for (const reference of references.filter(isLocalReference)) {
      const target = resolveReference(htmlFile, reference);
      if (!(await exists(target))) {
        errors.push(`${relativeHtml} references missing file: ${reference}`);
      }
    }

    if (
      /<style(?:\s|>)/i.test(html) ||
      /<script(?![^>]*\bsrc=)[^>]*>/i.test(html)
    ) {
      errors.push(`${relativeHtml} contains inline CSS or JavaScript.`);
    }

    if (
      ["index.html", "admin.html", "generate-qr.html", "registration.html"].includes(
        path.basename(htmlFile),
      )
    ) {
      const configPosition = html.indexOf("assets/js/config/app-config.js");
      const pageScriptPosition = html.indexOf("assets/js/pages/");
      if (
        configPosition === -1 ||
        pageScriptPosition === -1 ||
        configPosition > pageScriptPosition
      ) {
        errors.push(
          `${relativeHtml} must load app-config.js before its page script.`,
        );
      }
    }
  }

  for (const jsFile of jsFiles) {
    const source = await readFile(jsFile, "utf8");
    try {
      new vm.Script(source, { filename: path.relative(projectRoot, jsFile) });
    } catch (error) {
      errors.push(`JavaScript syntax error in ${path.relative(projectRoot, jsFile)}: ${error.message}`);
    }
  }

  for (const file of files) {
    if (!/\.(?:html|js)$/i.test(file)) continue;
    const source = await readFile(file, "utf8");
    if (
      /firebaseConfig|openHouseDb|firebase-database|firebasejs/i.test(source)
    ) {
      errors.push(
        `${path.relative(projectRoot, file)} exposes or directly uses Firebase.`,
      );
    }
  }

  const appConfigPath = path.join(
    publicRoot,
    "assets",
    "js",
    "config",
    "app-config.js",
  );
  if (await exists(appConfigPath)) {
    const appConfigSource = await readFile(appConfigPath, "utf8");
    const sandbox = { window: {} };
    new vm.Script(appConfigSource, {
      filename: path.relative(projectRoot, appConfigPath),
    }).runInNewContext(sandbox);
    const appConfig = sandbox.window.OpenHouseConfig;

    if (!appConfig || !Array.isArray(appConfig.stations)) {
      errors.push("app-config.js did not expose a valid station configuration.");
    } else {
      const stationIds = appConfig.stations.map((station) => station.id);
      const qrCodes = appConfig.stations.map((station) => station.qrCode);
      const expectedIds = appConfig.stations.map((_, index) => index);

      if (stationIds.join(",") !== expectedIds.join(",")) {
        errors.push("Station IDs in app-config.js must be contiguous from zero.");
      }
      if (new Set(qrCodes).size !== qrCodes.length) {
        errors.push("QR codes in app-config.js must be unique.");
      }

      const backendConfigPath = path.join(
        projectRoot,
        "functions",
        "src",
        "event-config.js",
      );
      if (await exists(backendConfigPath)) {
        delete require.cache[require.resolve(backendConfigPath)];
        const { EVENT_CONFIG } = require(backendConfigPath);
        const frontendStations = appConfig.stations.map(
          ({ id, name, qrCode }) => ({ id, name, qrCode }),
        );
        if (
          JSON.stringify(frontendStations) !==
          JSON.stringify(EVENT_CONFIG.stations)
        ) {
          errors.push(
            "Frontend and backend station configurations are out of sync.",
          );
        }
        if (
          appConfig.participants.codeLength !==
            EVENT_CONFIG.participantCodeLength ||
          appConfig.participants.generationCount !==
            EVENT_CONFIG.participantGenerationCount ||
          appConfig.destinyCards.length !==
            EVENT_CONFIG.destinyCardCount ||
          appConfig.qr.maxAgeMs !== EVENT_CONFIG.qrMaxAgeMs ||
          appConfig.qr.allowedFutureClockSkewMs !==
            EVENT_CONFIG.qrAllowedFutureClockSkewMs
        ) {
          errors.push(
            "Frontend and backend participant/QR settings are out of sync.",
          );
        }
      }
    }

    const configuredImageReferences = new Set(
      [
        ...(appConfig?.stations?.flatMap((station) =>
          Object.values(station.images),
        ) ?? []),
        ...(appConfig?.destinyCards?.map((card) => card.imagePath) ?? []),
      ].map((reference) => reference.replaceAll("\\", "/")),
    );
    for (const reference of configuredImageReferences) {
      const imagePath = path.join(publicRoot, reference);
      if (!(await exists(imagePath))) {
        errors.push(`Missing configured image: public/${reference}`);
        continue;
      }

      const content = await readFile(imagePath);
      const isPng =
        content.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
      const isWebp =
        content.subarray(0, 4).toString("ascii") === "RIFF" &&
        content.subarray(8, 12).toString("ascii") === "WEBP";
      if (
        (reference.endsWith(".png") && !isPng) ||
        (reference.endsWith(".webp") && !isWebp)
      ) {
        errors.push(`Image content does not match extension: public/${reference}`);
      }
    }

    const localImageAssets = files
      .filter((file) =>
        /assets[\\/]images[\\/](?:cards|stations)[\\/].*\.(?:png|webp)$/i.test(
          file,
        ),
      )
      .map((file) => path.relative(publicRoot, file).replaceAll("\\", "/"));
    for (const imageAsset of localImageAssets) {
      if (!configuredImageReferences.has(imageAsset)) {
        errors.push(`Unreferenced local image asset: public/${imageAsset}`);
      }
    }

    for (const file of files.filter((file) => file !== appConfigPath)) {
      if (!/\.(?:html|js)$/.test(file)) {
        continue;
      }
      const source = await readFile(file, "utf8");
      if (/QR_STN_\d+/i.test(source)) {
        errors.push(
          `${path.relative(projectRoot, file)} duplicates station QR configuration.`,
        );
      }
    }
  }
}

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`);
}

if (errors.length) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  console.error(`\nStatic-site validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(
  `Static-site validation passed with ${warnings.length} known warning(s).`,
);
