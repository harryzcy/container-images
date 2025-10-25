const fs = require("fs");
const path = require("path");

function loadImages() {
  let imagesData;
  try {
    const imagesJson = fs.readFileSync(
      path.join(process.cwd(), "images.json"),
      "utf8"
    );
    imagesData = JSON.parse(imagesJson);
  } catch (error) {
    throw new Error(`Failed to load or parse images.json: ${err.message}`);
  }

  const images = imagesData.images.map((image) => image.name);

  return images;
}

module.exports = () => {
  return loadImages();
};
