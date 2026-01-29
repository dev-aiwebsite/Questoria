import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your public folder
const publicDir = path.join(__dirname, "../public");

// Recursively get all image files
function getAllImages(dir, base = "") {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(base, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllImages(fullPath, relativePath));
    } else if (/\.(png|jpe?g|webp|gif|avif)$/.test(file)) {
      results.push("/" + relativePath.replace(/\\/g, "/"));
    }
  });
  return results;
}

const allImages = getAllImages(publicDir);

// Write to JSON in /public
fs.writeFileSync(
  path.join(publicDir, "imagesList.json"),
  JSON.stringify(allImages, null, 2)
);

console.log("Generated imagesList.json with", allImages.length, "images");
