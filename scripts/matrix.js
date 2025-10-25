const fs = require("fs");
const path = require("path");

function determineMatrix(withPlatforms = false) {
  let imagesData;
  try {
    const imagesJson = fs.readFileSync(
      path.join(process.cwd(), "images.json"),
      "utf8"
    );
    imagesData = JSON.parse(imagesJson);
  } catch (err) {
    throw new Error(`Failed to load or parse images.json: ${err.message}`);
  }

  const matrix = imagesData.images.map((image) => {
    if (withPlatforms && image.platform) {
      return {
        image: image.name,
        platforms: image.platforms,
      };
    }
    return image.name;
  });

  console.log("Matrix:", matrix);
  return matrix;
}

module.exports = () => {
  return determineMatrix();
};
