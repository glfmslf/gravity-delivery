export const IMAGE_ASSETS = {
  player: "assets/images/player.svg",
  obstacle: "assets/images/obstacle.svg",
  delivery: "assets/images/delivery.svg",
  pickup: "assets/images/pickup.svg",
};

export function loadImageAssets({ imageFactory = () => new Image() } = {}) {
  const entries = Object.entries(IMAGE_ASSETS);

  return Promise.all(
    entries.map(([name, src]) => loadImage(src, imageFactory).then((image) => [name, image], () => [name, null])),
  ).then((loadedEntries) =>
    loadedEntries.reduce((assets, [name, image]) => {
      if (image) {
        assets[name] = image;
      }

      return assets;
    }, {}),
  );
}

function loadImage(src, imageFactory) {
  return new Promise((resolve, reject) => {
    const image = imageFactory();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
