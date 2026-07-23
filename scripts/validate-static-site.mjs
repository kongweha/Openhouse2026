import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public");
const errors = [];
const warnings = [];

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
  "public/generate-qr.html",
  "public/Stamp.html",
  "public/GenerateQR.html",
  "public/assets/css/stamp.css",
  "public/assets/css/admin.css",
  "public/assets/css/generate-qr.css",
  "public/assets/js/config/firebase-config.js",
  "public/assets/js/pages/stamp.js",
  "public/assets/js/pages/admin.js",
  "public/assets/js/pages/generate-qr.js",
  "docs/PROJECT_SSOT.md",
  "docs/HANDOFF.md",
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
      ["index.html", "admin.html", "generate-qr.html"].includes(
        path.basename(htmlFile),
      ) &&
      (/<style(?:\s|>)/i.test(html) || /<script(?![^>]*\bsrc=)[^>]*>/i.test(html))
    ) {
      errors.push(`${relativeHtml} contains inline CSS or JavaScript.`);
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

  const stampScriptPath = path.join(
    publicRoot,
    "assets",
    "js",
    "pages",
    "stamp.js",
  );
  if (await exists(stampScriptPath)) {
    const stampScript = await readFile(stampScriptPath, "utf8");
    const cardReferences = new Set(
      [...stampScript.matchAll(/["'](assets\/images\/cards\/[^"']+)["']/g)].map(
        (match) => match[1],
      ),
    );

    for (const reference of cardReferences) {
      if (!(await exists(path.join(publicRoot, reference)))) {
        warnings.push(`Missing optional card artwork: public/${reference}`);
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
