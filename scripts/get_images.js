const fs = require("fs");
const path = require("path");

function loadImages() {
  const imagesJson = fs.readFileSync(
    path.join(process.cwd(), "images.json"),
    "utf8"
  );
  const imagesData = JSON.parse(imagesJson);

  const images = imagesData.images.map((image) => image.name);

  return images;
}

module.exports = () => {
  return loadImages();
};
