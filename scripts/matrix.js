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

  const matrix = {
    image: [],
  };
  if (withPlatforms) {
    matrix.include = [];
  }

  for (const entry of imagesData.images) {
    if (withPlatforms) {
      if (!entry.platform) {
        matrix.image.push(entry.name);
      } else {
        matrix.include.push({
          image: entry.name,
          platforms: entry.platform,
        });
      }
    } else {
      matrix.image.push(entry.name);
    }
  }

  console.log("Matrix:", matrix);
  return matrix;
}

module.exports = () => {
  return determineMatrix();
};
